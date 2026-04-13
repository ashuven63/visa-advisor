"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PhotoReport, PhotoCheck } from "@/lib/photo/types";

type Phase =
  | { step: "idle" }
  | { step: "checking"; previewUrl: string }
  | { step: "report"; report: PhotoReport; file: File; previewUrl: string }
  | { step: "fixing"; previewUrl: string }
  | { step: "fixed"; fixedUrl: string; previewUrl: string };

export function PhotoTool({ country }: { country: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>({ step: "idle" });

  async function onFileSelected(file: File) {
    const previewUrl = URL.createObjectURL(file);
    setPhase({ step: "checking", previewUrl });
    const form = new FormData();
    form.set("photo", file);
    form.set("country", country);

    try {
      const res = await fetch("/api/photo/check", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body?.error ?? `Photo check failed (${res.status})`);
        setPhase({ step: "idle" });
        return;
      }
      const report = (await res.json()) as PhotoReport;
      setPhase({ step: "report", report, file, previewUrl });
    } catch {
      alert("Network error — could not check photo.");
      setPhase({ step: "idle" });
    }
  }

  async function onFix(file: File, failures: PhotoCheck[], previewUrl: string) {
    setPhase({ step: "fixing", previewUrl });
    const form = new FormData();
    form.set("photo", file);
    form.set("country", country);
    form.set("failures", JSON.stringify(failures));

    try {
      const res = await fetch("/api/photo/fix", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body?.error ?? `Photo fix failed (${res.status})`);
        setPhase({ step: "idle" });
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPhase({ step: "fixed", fixedUrl: url, previewUrl });
    } catch {
      alert("Network error — could not fix photo.");
      setPhase({ step: "idle" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo compliance check</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Upload your passport or visa photo and we&apos;ll check it against the
          official requirements.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png"
          capture="user"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileSelected(f);
          }}
        />

        {/* Image preview area */}
        {phase.step === "idle" ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-48 w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 text-sm text-muted-foreground transition-colors hover:border-brand-400 hover:bg-muted/40"
          >
            Click to upload a photo
          </button>
        ) : (
          <PhotoPreviewArea phase={phase} />
        )}

        {phase.step === "checking" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
            Analyzing photo…
          </div>
        )}

        {phase.step === "report" && (
          <PhotoReportView
            report={phase.report}
            onFix={() => {
              const failures = phase.report.checks.filter(
                (c) => c.status === "fail" && c.fixable,
              );
              onFix(phase.file, failures, phase.previewUrl);
            }}
            onRetry={() => {
              setPhase({ step: "idle" });
              fileRef.current?.click();
            }}
          />
        )}

        {phase.step === "fixing" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-3 w-3 animate-pulse rounded-full bg-accent" />
            Fixing photo — this may take a few seconds…
          </div>
        )}

        {phase.step === "fixed" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-verdict-ok">
              Photo has been fixed. Review and download below.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <a href={phase.fixedUrl} download="fixed-visa-photo.jpg">
                  Download fixed photo
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPhase({ step: "idle" });
                  fileRef.current?.click();
                }}
              >
                Start over
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PhotoPreviewArea({ phase }: { phase: Exclude<Phase, { step: "idle" }> }) {
  const previewUrl = phase.previewUrl;
  const fixedUrl = phase.step === "fixed" ? phase.fixedUrl : null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Original */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {fixedUrl ? "Original" : "Uploaded"}
        </p>
        <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Uploaded photo"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Fixed (only when available) */}
      {fixedUrl ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-verdict-ok">
            Fixed
          </p>
          <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border-2 border-verdict-ok/30 bg-verdict-ok/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fixedUrl}
              alt="Fixed photo"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      ) : phase.step === "fixing" ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Fixed
          </p>
          <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/10">
            <div className="h-4 w-4 animate-pulse rounded-full bg-brand-500" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PhotoReportView({
  report,
  onFix,
  onRetry,
}: {
  report: PhotoReport;
  onFix: () => void;
  onRetry: () => void;
}) {
  const hasFixable = report.checks.some(
    (c) => c.status === "fail" && c.fixable,
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "rounded-xl px-4 py-2 text-sm font-medium",
          report.overall === "pass"
            ? "bg-verdict-ok/10 text-verdict-ok"
            : "bg-verdict-stop/10 text-verdict-stop",
        )}
      >
        {report.overall === "pass"
          ? "Your photo meets the requirements."
          : "Your photo has issues that need attention."}
      </div>

      {report.mechanicalOnly && (
        <p className="text-xs text-muted-foreground">
          Fix the issues above and re-upload — we&apos;ll then run a full
          compliance check including face position, expression, and background.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {report.checks.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-sm">
            <StatusDot status={c.status} />
            <div>
              <span className="font-medium">{c.label}</span>
              <span className="text-muted-foreground"> — {c.detail}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        {hasFixable && (
          <Button variant="accent" onClick={onFix}>
            Fix it for me
          </Button>
        )}
        <Button variant="outline" onClick={onRetry}>
          Upload different photo
        </Button>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: PhotoCheck["status"] }) {
  const cls = {
    pass: "bg-verdict-ok",
    fail: "bg-verdict-stop",
    warn: "bg-verdict-warn",
  }[status];
  return (
    <span
      className={cn("mt-1 h-2 w-2 flex-none rounded-full", cls)}
      aria-label={status}
    />
  );
}
