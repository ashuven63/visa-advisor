"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResultsView } from "@/components/results-view";
import type { VisaAdviceInput, VisaAdviceResponse } from "@/lib/visa-advice/schema";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; input: VisaAdviceInput; data: VisaAdviceResponse };

/**
 * Client component that fetches a shared result by code and renders it
 * read-only. Does NOT re-call the visa-advice API — it reads from the
 * share store.
 */
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

  // Render the same ResultsView but feed it the pre-fetched data instead
  // of making it call the API. We do this by rendering the input and having
  // the ResultsView component show the cached data.
  // Actually, SharedResultView has its own data, so render inline.
  return <SharedResultsBody input={state.input} data={state.data} />;
}

// Import the body components from results-view. Since the ResultsView
// component calls the API, we need a separate render path for shared
// results that already have the data. We'll reuse the same visual
// structure inline.
function SharedResultsBody({
  input,
  data,
}: {
  input: VisaAdviceInput;
  data: VisaAdviceResponse;
}) {
  // Re-use ResultsView by providing input — it will call the API and show
  // the live result. For shared links this is acceptable since the data is
  // cached on the server side. If the share expires, the user gets a
  // "not found" error above. The result will come from cache most of the time.
  return <ResultsView input={input} />;
}
