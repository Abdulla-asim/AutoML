import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDataset, runEDA, runPreprocessing, trainModels, generateReport, API_BASE_URL } from "@/api/backend";

// Get session ID from localStorage (set after upload)
const getSessionId = () => {
  return localStorage.getItem("automl_session_id") || null;
};

// Set session ID in localStorage (called after upload)
export const setSessionId = (sessionId: string) => {
  localStorage.setItem("automl_session_id", sessionId);
};

// Get upload data from localStorage
export const getUploadData = () => {
  const data = localStorage.getItem("automl_upload_data");
  return data ? JSON.parse(data) : null;
};

// Set upload data in localStorage
export const setUploadData = (data: any) => {
  localStorage.setItem("automl_upload_data", JSON.stringify(data));
};

export const getStoredSessionId = getSessionId;

// --- Hooks ---

// GET /api/session - Get current state (optional, can be removed if backend doesn't have this)
export function useSession() {
  const sessionId = getStoredSessionId();
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      try {
        const res = await fetch(`${API_BASE_URL}/api/session/${sessionId}`);
        if (res.status === 404) return null; // New session
        if (!res.ok) throw new Error("Failed to fetch session");
        return res.json();
      } catch {
        // If session endpoint doesn't exist, return null
        return null;
      }
    },
    retry: false,
    enabled: !!sessionId,
  });
}

// POST /api/dataset/upload - Upload dataset
export function useUploadDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      // Don't pass session_id on upload - backend will create one
      return uploadDataset(file);
    },
    onSuccess: (data) => {
      // Store the session_id from backend response
      if (data.session_id) {
        setSessionId(data.session_id);
        // Also store upload data for access by other steps
        localStorage.setItem("automl_upload_data", JSON.stringify(data));
        queryClient.invalidateQueries({ queryKey: ["session", data.session_id] });
      }
    },
  });
}

// POST /api/eda/analyze - Run EDA
export function useRunEDA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const sessionId = getStoredSessionId();
      if (!sessionId) throw new Error("No session ID found. Please upload a dataset first.");
      return runEDA(sessionId);
    },
    onSuccess: () => {
      const sessionId = getStoredSessionId();
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      }
    },
  });
}

// POST /api/preprocess/preprocess - Run Preprocessing
export function usePreprocess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params?: Record<string, any>) => {
      const sessionId = getStoredSessionId();
      if (!sessionId) throw new Error("No session ID found. Please upload a dataset first.");
      return runPreprocessing(sessionId, params);
    },
    onSuccess: () => {
      const sessionId = getStoredSessionId();
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      }
    },
  });
}

// GET /api/models/models - Train Models
export function useTrainModels() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (options: { target?: string; params?: Record<string, any> }) => {
      const sessionId = getStoredSessionId();
      if (!sessionId) throw new Error("No session ID found. Please upload a dataset first.");
      return trainModels(sessionId, options.target, options.params);
    },
    onSuccess: () => {
      const sessionId = getStoredSessionId();
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      }
    },
  });
}

// GET /api/report/preview - Generate Report
export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (format: "markdown" | "html" = "markdown") => {
      const sessionId = getStoredSessionId();
      if (!sessionId) throw new Error("No session ID found. Please upload a dataset first.");
      return generateReport(sessionId, format);
    },
    onSuccess: () => {
      const sessionId = getStoredSessionId();
      if (sessionId) {
        queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      }
    },
  });
}
