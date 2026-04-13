"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/countries";
import { ExitIntentOverlay } from "@/components/exit-intent-overlay";
import type { VisaAdviceInput } from "@/lib/visa-advice/schema";

type FormState = {
  destination: string;
  residence: string;
  passport: string;
  purpose: "tourist" | "transit";
  days: string;
  heldVisas: string;
};

const DEFAULT_STATE: FormState = {
  destination: "",
  residence: "",
  passport: "",
  purpose: "tourist",
  days: "7",
  heldVisas: "",
};

export function VisaForm({ initial }: { initial?: Partial<FormState> }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ ...DEFAULT_STATE, ...initial });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filledCount = [
    state.destination,
    state.residence,
    state.passport,
    state.days !== "7" ? state.days : "",
    state.heldVisas,
  ].filter(Boolean).length;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!state.destination || !state.residence || !state.passport) {
      setError("Destination, residence, and passport country are all required.");
      return;
    }
    const daysNum = Number.parseInt(state.days, 10);
    if (!Number.isFinite(daysNum) || daysNum < 1 || daysNum > 365) {
      setError("Number of days must be between 1 and 365.");
      return;
    }

    const input: VisaAdviceInput = {
      destination: state.destination,
      residence: state.residence,
      passports: [state.passport],
      purpose: state.purpose,
      days: daysNum,
      heldVisas: state.heldVisas,
    };

    const params = new URLSearchParams({
      destination: input.destination,
      residence: input.residence,
      passports: input.passports.join(","),
      purpose: input.purpose,
      days: String(input.days),
      heldVisas: input.heldVisas,
    });

    startTransition(() => {
      router.push(`/results?${params.toString()}`);
    });
  }

  return (
    <>
    <ExitIntentOverlay filledCount={filledCount} />
    <Card className="w-full">
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <CountrySelect
              id="destination"
              label="Destination country"
              value={state.destination}
              onChange={(v) => setState((s) => ({ ...s, destination: v }))}
              placeholder="Where are you going?"
            />
            <CountrySelect
              id="residence"
              label="Country of residence"
              value={state.residence}
              onChange={(v) => setState((s) => ({ ...s, residence: v }))}
              placeholder="Where do you live?"
            />
            <CountrySelect
              id="passport"
              label="Passport country"
              value={state.passport}
              onChange={(v) => setState((s) => ({ ...s, passport: v }))}
              placeholder="Which passport will you travel on?"
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="days">Number of days</Label>
              <input
                id="days"
                type="number"
                inputMode="numeric"
                min={1}
                max={365}
                value={state.days}
                onChange={(e) => setState((s) => ({ ...s, days: e.target.value }))}
                className="h-11 rounded-xl border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Trip purpose</Label>
            <div className="flex gap-2">
              {(["tourist", "transit"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, purpose: p }))}
                  className={cn(
                    "h-11 flex-1 rounded-xl border font-medium transition-colors",
                    state.purpose === p
                      ? "border-brand-500 bg-brand-50 text-brand-900 dark:border-brand-400 dark:bg-brand-950 dark:text-brand-100"
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                  aria-pressed={state.purpose === p}
                >
                  {p === "tourist" ? "Tourism" : "Airport transit"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="heldVisas">Other visas you currently hold (optional)</Label>
            <input
              id="heldVisas"
              type="text"
              value={state.heldVisas}
              onChange={(e) => setState((s) => ({ ...s, heldVisas: e.target.value }))}
              placeholder="e.g. US B1/B2, Schengen, UK visitor"
              className="h-11 rounded-xl border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-sm text-muted-foreground">
              Some destinations waive their visa if you hold another valid visa.
              List any you have.
            </p>
          </div>

          {error ? (
            <p role="alert" className="text-sm text-verdict-stop">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Checking…" : "Check my visa"}
          </Button>
        </form>
      </CardContent>
    </Card>
    </>
  );
}

function CountrySelect({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">{placeholder}</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
