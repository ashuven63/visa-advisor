"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResultsView } from "@/components/results-view";
import type { VisaAdviceInput, VisaAdviceResponse } from "@/lib/visa-advice/schema";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; input: VisaAdviceInput; data: VisaAdviceResponse };

export function SharedResultView({ code }: { code: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/export/share?code=${encodeURIComponent(code)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setState({
            status: "error",
            message: body?.error ?? `Not found (${res.status})`,
          });
          return;
        }
        const { input, data } = await res.json();
        setState({ status: "ready", input, data });
      } catch {
        setState({ status: "error", message: "Failed to load shared result." });
      }
    })();
  }, [code]);

  if (state.status === "loading") {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-10">
          <div className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
          <p className="text-muted-foreground">Loading shared result…</p>
        </CardContent>
      </Card>
    );
  }

  if (state.status === "error") {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-muted-foreground">{state.message}</p>
        </CardContent>
      </Card>
    );
  }

  return <ResultsView input={state.input} initialData={state.data} />;
}
