import { cn } from "@/lib/utils";

export function DisclaimerBanner({ className }: { className?: string }) {
  return (
    <div
      role="note"
      aria-label="Important disclaimer"
      className={cn(
        "rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100",
        className,
      )}
    >
      <p className="font-medium">Important — read this first</p>
      <p className="mt-1">
        This is informational, not legal advice. Always verify with the official
        consulate before you book or apply.
      </p>
      <p className="mt-1">
        Your inputs and photos are not stored. Photos are discarded immediately
        after processing. Email addresses entered to share results are used only
        for that send and are not kept.
      </p>
    </div>
  );
}
