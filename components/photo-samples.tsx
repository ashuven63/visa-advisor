"use client";

import { cn } from "@/lib/utils";

/**
 * Before/after photo showcase for the photo tool landing pages.
 *
 * Place sample images in public/samples/:
 * - before-1.jpg, after-1.jpg
 * - before-2.jpg, after-2.jpg
 * - before-3.jpg, after-3.jpg
 *
 * Once images exist, set `hasSamples` to true below.
 */

const hasSamples = false;

const SAMPLES = [
  {
    id: 1,
    beforeAlt: "Photo with busy background before AI fix",
    afterAlt: "Photo with clean white background after AI fix",
    issue: "Busy background",
    fix: "Clean white background",
  },
  {
    id: 2,
    beforeAlt: "Photo with shadows on face before AI fix",
    afterAlt: "Photo with even lighting after AI fix",
    issue: "Shadows on face",
    fix: "Even lighting",
  },
  {
    id: 3,
    beforeAlt: "Photo with wrong dimensions before AI fix",
    afterAlt: "Photo cropped to correct dimensions after AI fix",
    issue: "Wrong dimensions",
    fix: "Correct 2x2 crop",
  },
];

export function PhotoSamples({ className }: { className?: string }) {
  if (!hasSamples) {
    // Placeholder with illustrated examples until real samples exist
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <h2 className="font-display text-xl font-medium">
          See it in action
        </h2>
        <p className="text-sm text-muted-foreground">
          Our AI fixes common photo issues automatically:
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SAMPLES.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-2 rounded-xl border border-border p-4"
            >
              <div className="flex gap-2">
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-verdict-stop/10">
                    <span className="text-xs font-medium text-verdict-stop">
                      Before
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {s.issue}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  &rarr;
                </div>
                <div className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-verdict-ok/10">
                    <span className="text-xs font-medium text-verdict-ok">
                      After
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {s.fix}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <h2 className="font-display text-xl font-medium">
        See it in action
      </h2>
      <p className="text-sm text-muted-foreground">
        Real examples of our AI fixing common photo issues:
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SAMPLES.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-2 rounded-xl border border-border p-4"
          >
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col items-center gap-1">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-verdict-stop/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/samples/before-${s.id}.jpg`}
                    alt={s.beforeAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-[10px] text-verdict-stop">
                  {s.issue}
                </span>
              </div>
              <div className="flex items-center text-muted-foreground">
                &rarr;
              </div>
              <div className="flex flex-1 flex-col items-center gap-1">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-verdict-ok/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/samples/after-${s.id}.jpg`}
                    alt={s.afterAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-[10px] text-verdict-ok">{s.fix}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
