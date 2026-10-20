"use client";

/**
 * Adarsh College of Nursing - Unified Admin Fetch Client
 * Handles Authorization headers, credentials: "include", and token persistence
 * across all administrative API calls.
 */

export function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("adarsh_admin_token") || "";
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("adarsh_admin_token", token);
  }
}

export function removeAdminToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("adarsh_admin_token");
}

export async function adminFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init.headers || {});

  if (token) {
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.has("X-Admin-Token")) {
      headers.set("X-Admin-Token", token);
    }
  }

  let finalUrl = input;
  // If we have a token and the input is a string URL without token in query, append token parameter as ultimate fallback
  if (token && typeof input === "string" && !input.includes("token=")) {
    const separator = input.includes("?") ? "&" : "?";
    finalUrl = `${input}${separator}token=${encodeURIComponent(token)}`;
  }

  const modifiedInit: RequestInit = {
    ...init,
    credentials: "include",
    headers,
  };

  return fetch(finalUrl, modifiedInit);
}
