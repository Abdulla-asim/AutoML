export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// API Client functions for AutoML backend
export async function uploadDataset(file: File, sessionId?: string) {
  const formData = new FormData();
  formData.append("file", file);
  if (sessionId) {
    formData.append("session_id", sessionId);
  }

  const response = await fetch(`${API_BASE_URL}/api/dataset/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Upload failed");
  }

  return response.json();
}

export async function runEDA(sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/api/eda/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "EDA analysis failed");
  }

  return response.json();
}

export async function runPreprocessing(sessionId: string, params?: Record<string, any>) {
  const url = new URL(`${API_BASE_URL}/api/preprocess/preprocess`);
  url.searchParams.append("session_id", sessionId);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Preprocessing failed");
  }

  return response.json();
}

export async function trainModels(
  sessionId: string,
  target?: string,
  params?: Record<string, any>
) {
  const url = new URL(`${API_BASE_URL}/api/models/models`);
  url.searchParams.append("session_id", sessionId);

  if (target) {
    url.searchParams.append("target", target);
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Model training failed");
  }

  return response.json();
}

export async function generateReport(
  sessionId: string,
  format: "markdown" | "html" | "pdf" = "markdown"
) {
  const url = new URL(`${API_BASE_URL}/api/report/preview`);
  url.searchParams.append("session_id", sessionId);
  url.searchParams.append("format", format);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Report generation failed");
  }

  return response.json();
}
