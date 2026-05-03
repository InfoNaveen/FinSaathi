"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { LOADING_MESSAGES } from "@/data/mock";

type UploadState = "default" | "dragover" | "selected" | "loading" | "error";

interface SelectedFile {
  name: string;
  size: number;
  type: string;
  fileObj: File;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("default");
  const [file, setFile] = useState<SelectedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ACCEPTED = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB

  const validate = (f: File): string | null => {
    if (!ACCEPTED.includes(f.type))
      return "Unsupported file type. Please upload a PDF or image.";
    if (f.size > MAX_SIZE) return "File too large. Maximum size is 20 MB.";
    return null;
  };

  const handleFile = useCallback((f: File) => {
    const err = validate(f);
    if (err) {
      setErrorMsg(err);
      setState("error");
      setTimeout(() => setState("default"), 3000);
      return;
    }
    setFile({ name: f.name, size: f.size, type: f.type, fileObj: f });
    setState("selected");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!file) return;
    setState("loading");
    setProgress(10);
    setMessageIndex(0);

    // Setup fake progress while fetching
    const duration = 15000;
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 90, 90); // Cap at 90% until done
      setProgress(10 + pct);
      const msgIdx = Math.min(
        Math.floor((elapsed / duration) * LOADING_MESSAGES.length),
        LOADING_MESSAGES.length - 1
      );
      setMessageIndex(msgIdx);
    }, 200);

    try {
      // 1. Extract
      const formData = new FormData();
      formData.append("file", file.fileObj);
      const extractRes = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });
      const extractData = await extractRes.json();
      if (!extractRes.ok || !extractData.clauses) {
        throw new Error(extractData.error || "Extraction failed");
      }

      setProgress(60);

      // 2. Analyze
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clauses: extractData.clauses,
          language: "hi",
          suspicious: extractData.suspicious,
          suspicious_flags: extractData.suspicious_flags,
          fallback: extractData.fallback,
        }),
      });
      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok || analyzeData.error) {
        throw new Error(analyzeData.error || "Analysis failed");
      }

      setProgress(100);
      sessionStorage.setItem("finsaathi-document-text", extractData.documentText || "");
      sessionStorage.setItem("finsaathi-risk-card", JSON.stringify(analyzeData));

      if (timerRef.current) clearInterval(timerRef.current);
      router.push("/analyze");
    } catch (err) {
      if (timerRef.current) clearInterval(timerRef.current);
      setErrorMsg(err instanceof Error ? err.message : "Analysis failed");
      setState("error");
      setTimeout(() => setState("default"), 4000);
    }
  }, [file, router]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Drag handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setState("dragover");
  };
  const onDragLeave = () => setState("default");
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  if (state === "loading") {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-navy-mid border border-navy-light rounded-card p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full border-2 border-amber/30 border-t-amber animate-spin-slow" />
          </div>
          <p className="font-display text-xl text-off-white mb-2">Analysing Document</p>
          <p className="text-slate text-sm mb-6 transition-all duration-300 animate-crossfade-in">
            {LOADING_MESSAGES[messageIndex]}
          </p>
          <div className="h-1.5 bg-navy-light rounded-pill overflow-hidden">
            <div
              className="h-full bg-amber rounded-pill transition-none animate-progress"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-slate text-xs font-mono mt-3">{Math.round(progress)}%</p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-navy-mid border border-risk-critical/40 rounded-card p-8 text-center animate-fade-in-up">
          <AlertCircle className="w-10 h-10 text-risk-critical mx-auto mb-4" />
          <p className="text-risk-critical font-semibold mb-1">Upload Failed</p>
          <p className="text-slate text-sm">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (state === "selected" && file) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-navy-mid border border-amber/30 rounded-card p-8 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber/10 rounded-card flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber" />
            </div>
            <div className="text-left">
              <p className="text-off-white font-medium text-sm truncate max-w-[200px]">{file.name}</p>
              <p className="text-slate text-xs">{formatBytes(file.size)}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-risk-low ml-auto" />
          </div>
          <button
            onClick={startAnalysis}
            className="w-full py-3 bg-amber text-navy font-semibold rounded-card hover:bg-amber-dim transition-colors duration-200 text-sm"
          >
            Analyse This Document
          </button>
          <button
            onClick={() => { setState("default"); setFile(null); }}
            className="w-full mt-2 py-2 text-slate text-sm hover:text-off-white transition-colors duration-200"
          >
            Remove & Upload Different File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={`
          group cursor-pointer rounded-card border-2 border-dashed p-12 text-center
          transition-all duration-300 outline-none
          ${state === "dragover"
            ? "border-amber bg-amber/5 scale-[1.01]"
            : "border-navy-light hover:border-amber/50 bg-navy-mid hover:bg-navy-mid/80"
          }
        `}
      >
        <div
          className={`
            w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center
            transition-all duration-300
            ${state === "dragover" ? "bg-amber/20" : "bg-navy-light group-hover:bg-amber/10"}
          `}
        >
          <Upload
            className={`w-6 h-6 transition-colors duration-300 ${
              state === "dragover" ? "text-amber" : "text-slate group-hover:text-amber"
            }`}
          />
        </div>
        <p className="text-off-white font-medium mb-1">
          {state === "dragover" ? "Drop your document here" : "Upload your financial document"}
        </p>
        <p className="text-slate text-sm mb-5">
          Drag & drop or click to browse — PDF, PNG, JPG up to 20 MB
        </p>
        <span className="inline-block px-5 py-2 border border-amber/40 text-amber text-sm font-medium rounded-card group-hover:bg-amber/10 transition-colors duration-200">
          Choose File
        </span>
        <p className="text-slate/60 text-xs mt-5">
          Loan agreements · Credit card contracts · Insurance policies · Rental deeds
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={onInputChange}
      />

      {/* Demo button for presentations */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          import("@/data/mock").then(({ MOCK_ANALYSIS }) => {
            sessionStorage.setItem("finsaathi-risk-card", JSON.stringify(MOCK_ANALYSIS));
            sessionStorage.setItem("finsaathi-document-text", "DEMO: Sample Home Loan Agreement with critical clauses identified by FinSaathi AI engine.");
            router.push("/analyze");
          });
        }}
        className="mt-4 w-full text-center py-2.5 bg-navy-mid border border-amber/30 text-amber text-sm font-medium rounded-card hover:bg-amber/10 transition-colors duration-200"
      >
        ⚡ Try Demo — Sample Home Loan Analysis
      </button>
    </div>
  );
}
