export interface TrainingParameters {
  modelType: 'classification' | 'regression' | 'clustering';
  epochs: number;
  learningRate: number;
  batchSize: number;
  validationSplit: number;
}

export interface TrainingJob {
  id: string;
  projectId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  parameters: TrainingParameters;
  startTime: string;
  endTime?: string;
  metrics?: {
    accuracy?: number;
    loss?: number;
  };
}
