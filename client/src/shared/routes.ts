import { z } from "zod";
import { API_BASE_URL } from "@/api/backend";
import {
  uploadResponseSchema,
  edaResponseSchema,
  preprocessingResponseSchema,
  trainResponseSchema,
  reportResponseSchema,
  sessionResponseSchema,
} from "@shared/schema";

// API Routes Definition
export const api = {
  session: {
    get: {
      path: `${API_BASE_URL}/api/session`,
      responses: {
        200: sessionResponseSchema,
      },
    },
  },
  steps: {
    upload: {
      path: `${API_BASE_URL}/api/dataset/upload`,
      responses: {
        200: uploadResponseSchema,
        400: z.object({ message: z.string() }),
      },
    },
    eda: {
      path: `${API_BASE_URL}/api/eda/analyze`,
      responses: {
        200: edaResponseSchema,
      },
    },
    preprocess: {
      path: `${API_BASE_URL}/api/preprocess/preprocess`,
      responses: {
        200: preprocessingResponseSchema,
      },
    },
    train: {
      path: `${API_BASE_URL}/api/models/models`,
      responses: {
        200: trainResponseSchema,
      },
    },
    report: {
      path: `${API_BASE_URL}/api/report/preview`,
      responses: {
        200: reportResponseSchema,
      },
    },
  },
};

// Helper function to build URLs with query parameters
export function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean>
): string {
  if (!params || Object.keys(params).length === 0) return path;

  const url = new URL(path);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  return url.toString();
}
