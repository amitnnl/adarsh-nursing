"use client";

import { useEffect, useState } from "react";
import {
  FileCheck2,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

interface Step {
  stepNumber: number;
  title: string;
  text: string;
}

export default function AdminAdmissionsPage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [newDoc, setNewDoc] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function loadData() {
    try {
      const res = await adminFetch("/api/admin/admissions");
      if (res.ok) {
        const data = await res.json();
        if (data.steps) setSteps(data.steps);
        if (data.documents) {
          setDocuments(data.documents.map((d: { title?: string } | string) => typeof d === "string" ? d : (d.title || "")));
        }
      }
    } catch {
      setErrorMsg("Failed to load admissions data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleStepChange(index: number, field: "title" | "text", val: string) {
    const next = [...steps];
    next[index][field] = val;
    setSteps(next);
  }

  function addStep() {
    setSteps([
      ...steps,
      {
        stepNumber: steps.length + 1,
        title: "New Admission Step",
        text: "Explanation of this step in the process...",
      },
    ]);
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  function addDocument() {
    if (!newDoc.trim()) return;
    setDocuments([...documents, newDoc.trim()]);
    setNewDoc("");
  }

  function removeDocument(index: number) {
    setDocuments(documents.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await adminFetch("/api/admin/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps, documents }),
      });

      if (res.ok) {
        setStatusMsg("Admissions configuration saved successfully!");
        loadData();
        setTimeout(() => setStatusMsg(""), 4000);
      } else {
        setErrorMsg("Failed to save data to database");
      }
    } catch {
      setErrorMsg("Network error saving configuration");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17324D] tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="h-6 w-6 text-[#168C8C]" />
            Admission Steps & Documents Checklist
          </h1>
          <p className="text-xs text-[#667085] mt-1 font-medium">
            Customize the step-by-step admission guide and the checklist of mandatory student documents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            title="Refresh data"
            className="p-2 rounded-xl bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#17324D] hover:bg-[#F5F7FA] transition-colors shadow-xs"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Changes
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-[#EBF7EE] border border-[#B7E4C7] text-[#16803C] flex items-center gap-2.5 text-xs">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {statusMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#FDF2F2] border border-[#FAC5C5] text-[#C93636] flex items-center gap-2.5 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-[#667085] gap-2">
          <RefreshCw className="h-6 w-6 animate-spin text-[#168C8C]" />
          <p className="text-xs">Loading admissions configuration...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Admission Steps */}
          <div className="p-6 rounded-2xl bg-white border border-[#E4E7EC] space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <div>
                <h2 className="text-sm font-bold text-[#17324D]">Step-by-Step Admission Process</h2>
                <p className="text-[11px] text-[#667085] mt-0.5">Displays sequentially on public /admissions page</p>
              </div>
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#168C8C]/10 hover:bg-[#168C8C]/15 text-xs font-semibold text-[#168C8C] transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Step
              </button>
            </div>

            <div className="space-y-3.5">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#17324D] text-white font-bold text-xs">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(i, "title", e.target.value)}
                      placeholder="Step Title (e.g. Enquire)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-[#1F2937] text-xs font-semibold focus:outline-none focus:border-[#168C8C]"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="p-1.5 text-[#9CA3AF] hover:text-[#C93636] transition-colors"
                      title="Remove step"
                      aria-label="Remove step"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={step.text}
                    onChange={(e) => handleStepChange(i, "text", e.target.value)}
                    placeholder="Step details..."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#D1D5DB] text-[#4B5563] text-xs focus:outline-none focus:border-[#168C8C] leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Required Documents */}
          <div className="p-6 rounded-2xl bg-white border border-[#E4E7EC] space-y-5 shadow-xs">
            <div className="pb-3 border-b border-[#E4E7EC]">
              <h2 className="text-sm font-bold text-[#17324D]">Required Documents Checklist</h2>
              <p className="text-[11px] text-[#667085] mt-0.5">Certificates & proofs students must bring</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDoc}
                onChange={(e) => setNewDoc(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDocument();
                  }
                }}
                placeholder="e.g. Migration certificate (original)"
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-[#1F2937] placeholder-[#9CA3AF] text-xs focus:outline-none focus:border-[#168C8C]"
              />
              <button
                type="button"
                onClick={addDocument}
                className="px-4 py-2 rounded-xl bg-[#17324D] hover:bg-[#12273D] text-white text-xs font-medium transition-colors shrink-0 cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E4E7EC] text-xs text-[#374151]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 text-[#168C8C] shrink-0" />
                    <span className="truncate">{doc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(idx)}
                    className="p-1 text-[#9CA3AF] hover:text-[#C93636] transition-colors"
                    aria-label="Remove document"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

