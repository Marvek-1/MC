export type ExportStatus = 'queued' | 'generating' | 'done' | 'failed';

export interface SyntheticDataset {
  id: string;
  jobId: string; // The training job ID this was generated from
  projectId: string;
  status: ExportStatus;
  progress: number;
  sampleCount: number;
  format: 'csv' | 'parquet' | 'sql' | 'tfrecord';
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  metrics?: {
    fidelityScore: number;
    privacyScore: number;
    utilityScore: number; // TSTR based utility
    temporalCoherence?: number;
  };
}

export interface ExportParameters {
  sampleCount: number;
  format: 'csv' | 'parquet' | 'sql' | 'tfrecord';
  stratifyBy?: string; // Column to preserve ratio for
  preserveRareEvents?: boolean;
}
