import { z } from "zod";

// Upload Response Schema
export const uploadResponseSchema = z.object({
  message: z.string(),
  session_id: z.string().uuid(),
  fileName: z.string(),
  columns: z.array(z.string()),
  rows: z.number(),
  dtypes: z.record(z.string()),
  targetCol: z.string().nullable(),
  classDistribution: z.record(z.number()),
  preview: z.array(z.record(z.any())),
});

// EDA Response Schema
export const edaResponseSchema = z.object({
  status: z.string(),
  session_id: z.string().uuid(),
  eda_report: z.object({
    missing_values: z.record(z.any()),
    numerical_summary: z.record(z.any()),
    categorical_summary: z.record(z.any()),
    outliers: z.object({
      iqr_method: z.record(z.any()),
      zscore_method: z.record(z.any()),
    }).optional(),
    correlations: z.record(z.any()).optional(),
    visualizations: z.object({
      correlation_heatmap: z.string().optional(),
      distributions: z.record(z.string()).optional(),
      class_distribution: z.string().optional(),
    }).optional(),
  }),
});

// Preprocessing Response Schema
export const preprocessingResponseSchema = z.object({
  status: z.string(),
  session_id: z.string().uuid(),
  preprocessing_params: z.record(z.any()),
  original_shape: z.array(z.number()),
  cleaned_shape: z.array(z.number()),
  metadata: z.object({
    timestamp: z.string(),
    parameters: z.record(z.any()),
    data_quality_before: z.object({
      total_rows: z.number(),
      total_columns: z.number(),
      missing_values: z.number(),
      missing_percent: z.number(),
      duplicate_rows: z.number(),
      columns: z.array(z.string()),
    }),
    data_quality_after: z.object({
      total_rows: z.number(),
      total_columns: z.number(),
      missing_values: z.number(),
      missing_percent: z.number(),
      duplicate_rows: z.number(),
      columns: z.array(z.string()),
    }),
    rows_removed: z.number(),
    issues_detected: z.array(z.any()),
  }),
});

// Training Response Schema
export const trainResponseSchema = z.object({
  status: z.string(),
  session_id: z.string().uuid(),
  model_results: z.object({
    timestamp: z.string(),
    hyperparameters: z.record(z.any()),
    models: z.array(
      z.object({
        name: z.string(),
        metrics: z.record(z.any()),
      })
    ),
    best_model: z.object({
      name: z.string(),
      reason: z.string(),
      f1_score: z.number(),
    }),
  }),
});

// Report Response Schema
export const reportResponseSchema = z.object({
  status: z.string(),
  session_id: z.string().uuid(),
  format: z.string(),
  generated_at: z.string(),
  content: z.string(),
});

// Session Response Schema
export const sessionResponseSchema = z.object({
  session_id: z.string().uuid(),
  currentStep: z.number(),
  uploadData: uploadResponseSchema.optional(),
  edaData: edaResponseSchema.optional(),
  preprocessingData: preprocessingResponseSchema.optional(),
  trainingData: trainResponseSchema.optional(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
export type EdaResponse = z.infer<typeof edaResponseSchema>;
export type PreprocessingResponse = z.infer<typeof preprocessingResponseSchema>;
export type TrainingResponse = z.infer<typeof trainResponseSchema>;
export type ReportResponse = z.infer<typeof reportResponseSchema>;
export type SessionData = z.infer<typeof sessionResponseSchema>;
