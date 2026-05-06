function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getBackendBaseUrl() {
  const explicitBase = String(import.meta.env.VITE_BACKEND_URL || "").trim();

  if (explicitBase) {
    return normalizeBaseUrl(explicitBase);
  }

  if (typeof window !== "undefined" && window.location.hostname === "localhost" && window.location.port === "5173") {
    return "http://localhost:3000";
  }

  return "";
}

export function buildBackendUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendBaseUrl()}${normalizedPath}`;
}

