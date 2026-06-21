/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Full base URL for the HireScope API, including the /api/v1 prefix.
   * e.g. "https://hirescope-backend.onrender.com/api/v1" in production,
   * "http://localhost:8000/api/v1" in local dev.
   */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}