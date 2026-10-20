import { PrismaClient } from "@prisma/client";
import net from "node:net";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbReachable: boolean | null;
  dbLastCheck: number;
  dbCheckPromise: Promise<boolean> | null;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [], // Prevent Prisma from dumping noisy connection errors to console
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Check if the MySQL database server is actively accepting connections.
 * Caches result: 30s when available, 5s when down.
 * Deduplicates concurrent socket checks to avoid contention and latency.
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const now = Date.now();
  const ttl = globalForPrisma.dbReachable ? 30000 : 5000;
  if (
    globalForPrisma.dbReachable !== undefined &&
    globalForPrisma.dbReachable !== null &&
    now - (globalForPrisma.dbLastCheck || 0) < ttl
  ) {
    return globalForPrisma.dbReachable;
  }

  if (globalForPrisma.dbCheckPromise) {
    return globalForPrisma.dbCheckPromise;
  }

  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl || !dbUrl.startsWith("mysql://")) {
    globalForPrisma.dbReachable = false;
    globalForPrisma.dbLastCheck = now;
    return false;
  }

  globalForPrisma.dbCheckPromise = new Promise<boolean>((resolve) => {
    try {
      const match = dbUrl.match(/@([^:/]+)(?::(\d+))?/);
      const host = match?.[1] || "127.0.0.1";
      const port = Number(match?.[2]) || 3306;

      const socket = net.createConnection({ host, port, timeout: 350 });
      let settled = false;

      const finish = (result: boolean) => {
        if (!settled) {
          settled = true;
          globalForPrisma.dbReachable = result;
          globalForPrisma.dbLastCheck = Date.now();
          globalForPrisma.dbCheckPromise = null;
          socket.destroy();
          resolve(result);
        }
      };

      socket.on("connect", () => finish(true));
      socket.on("timeout", () => finish(false));
      socket.on("error", () => finish(false));
    } catch {
      globalForPrisma.dbReachable = false;
      globalForPrisma.dbLastCheck = now;
      globalForPrisma.dbCheckPromise = null;
      resolve(false);
    }
  });

  return globalForPrisma.dbCheckPromise;
}

export function markDatabaseReachable(status = true) {
  globalForPrisma.dbReachable = status;
  globalForPrisma.dbLastCheck = Date.now();
}
