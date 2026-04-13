"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { countryName } from "@/lib/countries";
import { ExportBar } from "@/components/export-bar";
import {
  type VisaAdviceInput,
  type VisaAdviceResponse,
  type Verdict,
} from "@/lib/visa-advice/schema";

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: VisaAdviceResponse };

const VERDICT_LABEL: Record<Verdict, string> = {
  not_required: "No visa required",
  voa: "Visa on arrival",
  eta: "Electronic travel authorization",
  evisa: "eVisa required",
  required: "Visa required",
};

const VERDICT_TONE: Record<Verdict, "ok" | "warn" | "stop"> = {
  not_required: "ok",
  voa: "warn",
  eta: "warn",
  evisa: "warn",
  required: "stop",
};

const VERDICT_HEADLINE: Record<Verdict, string> = {
  not_required: "You're good to go.",
  voa: "You can get a visa at the border.",
  eta: "You need an electronic travel authorization.",
  evisa: "You need an eVisa before you travel.",
  required: "You need a visa before you travel.",
};

export function ResultsView({
  input,
  initialData,
}: {
  input: VisaAdviceInput;
  /** Pass pre-fetched data to skip the API call (used by shared result pages). */
  initialData?: VisaAdviceResponse;
}) {
  const [state, setState] = useState<LoadState>(
    initialData ? { status: "ready", data: initialData } : { status: "idle" },
  );

  useEffect(() => {
    // Skip fetch if we already have data (e.g. from a shared link).
    if (initialData) return;

    const controller = new AbortController();
    setState({ status: "loading" });

    (async () => {
      try {
        const res = await fetch("/api/visa-advice", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(input),
          signal: controller.signal,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setState({
            status: "error",
            message:
              typeof body?.error === "string"
                ? body.error
                : `Request failed (${res.status})`,
          });
          return;
        }
        const data = (await res.json()) as VisaAdviceResponse;
        setState({ status: "ready", data });
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        setState({
          status: "error",
          message:
            err instanceof Error ? err.message : "Unexpected error.",
        });
      }
    })();

    return () => controller.abort();
  }, [input, initialData]);

  return (
    <div className="flex flex-col gap-6">
      <TripSummary input={input} />

      {state.status === "loading" ? <LoadingCard /> : null}
      {state.status === "error" ? (
        <ErrorCard message={state.message} />
      ) : null}
      {state.status === "ready" ? (
        <ResultsBody input={input} data={state.data} />
      ) : null}
    </div>
  );
}

function TripSummary({ input }: { input: VisaAdviceInput }) {
  const chips = [
    { label: "From", value: countryName(input.residence) },
    {
      label: "Passport",
      value: input.passports.map((c) => countryName(c)).join(" / "),
    },
    { label: "To", value: countryName(input.destination) },
    {
      label: "Purpose",
      value: input.purpose === "tourist" ? "Tourism" : "Transit",
    },
    {
      label: "Length",
      value: `${input.days} day${input.days === 1 ? "" : "s"}`,
    },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <span
          key={c.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium"
        >
          <span className="text-muted-foreground">{c.label}</span>
          <span className="text-foreground">{c.value}</span>
        </span>
      ))}
      {input.heldVisas.trim() ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-900 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-100">
          <span className="text-brand-700 dark:text-brand-300">Holds</span>
          <span>{input.heldVisas}</span>
        </span>
      ) : null}
    </div>
  );
}

function LoadingCard() {
  return (
    <Card aria-busy="true">
      <CardContent className="flex items-center gap-3 py-10">
        <div className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
        <p className="text-muted-foreground">
          Checking official government sources…
        </p>
      </CardContent>
    </Card>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Something went wrong</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{message}</p>
        <div>
          <Button asChild variant="outline">
            <Link href="/">Try again</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultsBody({ input, data }: { input: VisaAdviceInput; data: VisaAdviceResponse }) {
  const tone = VERDICT_TONE[data.verdict];
  return (
    <div className="flex flex-col gap-6">
      <VerdictCard data={data} tone={tone} />

      {data.caveats.length > 0 ? <CaveatsList caveats={data.caveats} /> : null}

      {data.steps.length > 0 ? <StepsCard steps={data.steps} /> : null}

      {data.documents.length > 0 ? (
        <DocumentsCard documents={data.documents} />
      ) : null}

      <CitationsCard
        citations={data.citations}
        confidence={data.confidence}
      />

      <ExportBar input={input} data={data} />
    </div>
  );
}

function VerdictCard({
  data,
  tone,
}: {
  data: VisaAdviceResponse;
  tone: "ok" | "warn" | "stop";
}) {
  const toneClasses = useMemo(
    () =>
      ({
        ok: "border-verdict-ok/40 bg-verdict-ok/10",
        warn: "border-verdict-warn/40 bg-verdict-warn/10",
        stop: "border-verdict-stop/40 bg-verdict-stop/10",
      }) as const,
    [],
  );
  const dotClass = {
    ok: "bg-verdict-ok",
    warn: "bg-verdict-warn",
    stop: "bg-verdict-stop",
  }[tone];

  return (
    <Card className={cn("border-2", toneClasses[tone])}>
      <CardContent className="flex flex-col gap-4 py-8">
        <div className="flex items-center gap-2">
          <span
            className={cn("h-2.5 w-2.5 rounded-full", dotClass)}
            aria-hidden
          />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {VERDICT_LABEL[data.verdict]}
          </p>
        </div>
        <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
          {VERDICT_HEADLINE[data.verdict]}
        </h2>
        <p className="text-base leading-relaxed text-foreground/80">
          {data.oneLineReason}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5">
            Confidence: {data.confidence}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function CaveatsList({ caveats }: { caveats: string[] }) {
  return (
    <Card className="border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20">
      <CardContent className="flex flex-col gap-2 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-900 dark:text-amber-200">
          Important caveats
        </p>
        <ul className="flex flex-col gap-2 text-sm text-amber-950 dark:text-amber-100">
          {caveats.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function StepsCard({
  steps,
}: {
  steps: VisaAdviceResponse["steps"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What to do</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.detail}</p>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
                  >
                    {hostOf(s.url)} &rarr;
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function DocumentsCard({
  documents,
}: {
  documents: VisaAdviceResponse["documents"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents to prepare</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {documents.map((d, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[10px] font-bold uppercase",
                  d.required
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-border text-muted-foreground",
                )}
                aria-label={d.required ? "Required" : "Optional"}
              >
                {d.required ? "R" : "O"}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="font-medium">{d.name}</p>
                {d.note ? (
                  <p className="text-sm text-muted-foreground">{d.note}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CitationsCard({
  citations,
  confidence,
}: {
  citations: VisaAdviceResponse["citations"];
  confidence: VisaAdviceResponse["confidence"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sources</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {citations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No official sources were returned for this query. Please verify
            directly with the destination consulate.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {citations.map((c, i) => (
              <li key={i} className="text-sm">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
                >
                  {c.title}
                </a>
                <span className="ml-2 text-xs text-muted-foreground">
                  {hostOf(c.url)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {confidence === "low" ? (
          <p className="text-xs text-muted-foreground">
            Confidence is low — at least one consulate page should be reviewed
            manually before acting on this answer.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

