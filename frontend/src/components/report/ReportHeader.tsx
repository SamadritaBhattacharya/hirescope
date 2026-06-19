import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/report/ScoreRing";
import { initials } from "@/lib/format";
import type { FullReport, HireVerdict } from "@/types/api";

const VERDICT_VISUAL: Record<
  HireVerdict,
  { tone: "strong" | "outline" | "default" | "muted"; arrow: string }
> = {
  "Strong Yes": { tone: "strong", arrow: "↑↑" },
  Yes: { tone: "outline", arrow: "↑" },
  Maybe: { tone: "default", arrow: "→" },
  No: { tone: "muted", arrow: "↓" },
  "Strong No": { tone: "muted", arrow: "↓↓" },
};

interface Props {
  report: FullReport;
  onExport: () => void;
  exporting: boolean;
  exportError?: string | null;
  onReset: () => void;
}

export function ReportHeader({ report, onExport, exporting, exportError, onReset }: Props) {
  const visual = VERDICT_VISUAL[report.hire_verdict];
  const name = report.candidate_name || "Unnamed candidate";

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Identity block */}
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-surface-2)] font-mono text-[13px] sm:text-[14px] font-medium text-[var(--color-ink)]">
            {initials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base sm:text-lg font-semibold text-[var(--color-ink)]">
                {name}
              </h1>
              <Badge tone={visual.tone}>
                {visual.arrow} {report.hire_verdict}
              </Badge>
            </div>
            <p className="mt-0.5 truncate text-[13px] sm:text-[13.5px] text-[var(--color-ink-dim)]">
              {report.candidate_headline || report.candidate_current_role || "No headline available"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {report.candidate_location && (
                <Badge tone="muted">{report.candidate_location}</Badge>
              )}
              {report.role_fit && <Badge tone="muted">{report.role_fit}</Badge>}
              {report.best_fit_archetype !== "Unknown" && (
                <Badge tone="muted">{report.best_fit_archetype}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Divider — horizontal on mobile/tablet, vertical on desktop */}
        <div className="h-px w-full bg-[var(--color-line)] lg:h-12 lg:w-px" />

        {/* Score + actions block */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          {/* Smaller ring on narrow screens, full size from sm: up */}
          <div className="sm:hidden">
            <ScoreRing value={report.hire_score} size={88} strokeWidth={6} label="Hire score" />
          </div>
          <div className="hidden sm:block">
            <ScoreRing value={report.hire_score} label="Hire score" />
          </div>

          <div className="flex flex-1 flex-col gap-2 sm:flex-initial">
            <Button
              variant="secondary"
              size="sm"
              onClick={onExport}
              loading={exporting}
              className="w-full sm:w-auto"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path
                  d="M12 16V4m0 12l-4-4m4 4l4-4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Export PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={onReset} className="w-full sm:w-auto">
              New research
            </Button>
            {exportError && (
              <p className="max-w-[220px] text-[11.5px] leading-snug text-[var(--color-ink-dim)]">
                <span className="text-[var(--color-ink)]">Export failed:</span> {exportError}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}