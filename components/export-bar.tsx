"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import type { VisaAdviceInput, VisaAdviceResponse } from "@/lib/visa-advice/schema";

export function ExportBar({
  input,
  data,
}: {
  input: VisaAdviceInput;
  data: VisaAdviceResponse;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-muted/30 p-3">
      <PdfButton input={input} data={data} />
      <EmailButton input={input} data={data} />
      <ShareButton input={input} data={data} />
    </div>
  );
}

function PdfButton({
  input,
  data,
}: {
  input: VisaAdviceInput;
  data: VisaAdviceResponse;
}) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      // Dynamic import to keep the main bundle small — @react-pdf/renderer
      // is heavy and only needed on-demand.
      const { pdf } = await import("@react-pdf/renderer");
      const { VisaAdvicePdf } = await import("@/lib/export/pdf-document");
      const blob = await pdf(<VisaAdvicePdf input={input} data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "visa-advisor-results.pdf";
      a.click();
      URL.revokeObjectURL(url);
      void trackEvent({ name: "export_pdf", destination: input.destination });
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={busy}>
      {busy ? "Generating…" : "Download PDF"}
    </Button>
  );
}

function EmailButton({
  input,
  data,
}: {
  input: VisaAdviceInput;
  data: VisaAdviceResponse;
}) {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!email) return;
    setBusy(true);
    try {
      const res = await fetch("/api/export/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, input, data }),
      });
      if (res.ok) {
        setSent(true);
        setOpen(false);
        void trackEvent({
          name: "export_email",
          destination: input.destination,
        });
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body?.error ?? "Failed to send email.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Button variant="outline" size="sm" disabled>
        Email sent
      </Button>
    );
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Email results
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-8 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button size="sm" onClick={handleSend} disabled={busy || !email}>
        {busy ? "Sending…" : "Send"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>
    </div>
  );
}

function ShareButton({
  input,
  data,
}: {
  input: VisaAdviceInput;
  data: VisaAdviceResponse;
}) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  async function handleShare() {
    setBusy(true);
    try {
      const res = await fetch("/api/export/share", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input, data }),
      });
      if (res.ok) {
        const { url } = await res.json();
        setUrl(url);
        await navigator.clipboard.writeText(url).catch(() => {});
        void trackEvent({
          name: "export_share_link",
          destination: input.destination,
        });
      } else {
        alert("Failed to create share link.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setBusy(false);
    }
  }

  if (url) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigator.clipboard.writeText(url)}
      >
        Link copied
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} disabled={busy}>
      {busy ? "Creating…" : "Share link"}
    </Button>
  );
}
