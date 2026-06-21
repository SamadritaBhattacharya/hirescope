import type {
  FullReport,
  ResearchInputForm,
  ResearchJobResponse,
} from "@/types/api";

// Full backend URL, including the /api/v1 prefix — set via VITE_API_BASE_URL
// in .env (local dev) or in the Vercel project's Environment Variables
// (production). No dev-server proxy or vercel.json rewrite involved; the
// frontend calls the backend directly and relies on the backend's CORS_ORIGINS
// setting to allow it.
const RAW_BASE = import.meta.env.VITE_API_BASE_URL;

if (!RAW_BASE) {
  // Fails loudly at build/dev-start time rather than producing confusing
  // "Failed to fetch" errors deep in a network tab later.
  throw new Error(
    "VITE_API_BASE_URL is not set. Add it to .env (local) or to the " +
      "Vercel project's Environment Variables (production), e.g. " +
      "VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1"
  );
}

// Strip any trailing slash so callers can safely do `${API_BASE}/report/...`
const API_BASE = RAW_BASE.replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/** Starts a new research job. Returns immediately with a job_id; the pipeline runs in the background. */
export async function startResearch(
  input: ResearchInputForm
): Promise<ResearchJobResponse> {
  const fd = new FormData();

  if (input.linkedin_url.trim()) fd.append("linkedin_url", input.linkedin_url.trim());
  if (input.linkedin_text.trim()) fd.append("linkedin_text", input.linkedin_text.trim());
  if (input.github_url.trim()) fd.append("github_url", input.github_url.trim());
  if (input.jd_text.trim()) fd.append("jd_text", input.jd_text.trim());
  if (input.culture_text.trim()) fd.append("culture_text", input.culture_text.trim());
  if (input.extra_context.trim()) fd.append("extra_context", input.extra_context.trim());
  if (input.resume_file) fd.append("resume_file", input.resume_file);
  if (input.jd_file) fd.append("jd_file", input.jd_file);
  if (input.culture_file) fd.append("culture_file", input.culture_file);

  const res = await fetch(`${API_BASE}/research/start`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const detail = await safeDetail(res);
    throw new ApiError(detail ?? "Could not start research job.", res.status);
  }

  return res.json();
}

export async function getReport(jobId: string): Promise<FullReport> {
  const res = await fetch(`${API_BASE}/report/${jobId}`);
  if (!res.ok) {
    const detail = await safeDetail(res);
    throw new ApiError(detail ?? "Could not load report.", res.status);
  }
  return res.json();
}

export function exportReportUrl(jobId: string): string {
  return `${API_BASE}/report/${jobId}/export`;
}

export async function downloadReportPdf(jobId: string, candidateName: string) {
  const res = await fetch(exportReportUrl(jobId), { method: "POST" });

  if (!res.ok) {
    const detail = await safeDetail(res);
    throw new ApiError(detail ?? `Could not export PDF (status ${res.status}).`, res.status);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/pdf")) {
    const detail = await safeDetail(res);
    throw new ApiError(
      detail ?? "The server did not return a PDF. The export may have failed silently.",
      res.status
    );
  }

  const blob = await res.blob();
  if (blob.size === 0) {
    throw new ApiError("The exported PDF was empty.", res.status);
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeName = candidateName.trim().replace(/\s+/g, "_") || "candidate";
  a.href = url;
  a.download = `HireScope_${safeName}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

async function safeDetail(res: Response): Promise<string | null> {
  try {
    const body = await res.json();
    return body?.detail ?? null;
  } catch {
    return null;
  }
}

export function streamProgress(
  jobId: string,
  handlers: {
    onEvent: (eventType: string, data: unknown) => void;
    onError?: (err: Error) => void;
  }
): () => void {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${API_BASE}/research/${jobId}/stream`, {
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error(`Stream failed with status ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          let eventType = "message";
          let data = "";
          for (const line of frame.split("\n")) {
            if (line.startsWith("event:")) eventType = line.slice(6).trim();
            else if (line.startsWith("data:")) data += line.slice(5).trim();
          }
          if (data) {
            try {
              handlers.onEvent(eventType, JSON.parse(data));
            } catch {
              // ignore malformed frame
            }
          }
        }
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      handlers.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  return () => controller.abort();
}