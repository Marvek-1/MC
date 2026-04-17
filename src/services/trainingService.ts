import { TrainingJob, TrainingParameters } from '../types/training';
import { vault } from '../lib/vault';
import { validationService } from './validationService';
import { privacyLedger } from './privacyLedger';

class TrainingService {
  private jobs: TrainingJob[] = [];

  async startTraining(projectId: string, params: TrainingParameters): Promise<TrainingJob> {
    const job: TrainingJob = {
      id: Math.random().toString(36).substring(7).toUpperCase(),
      projectId,
      status: 'queued',
      progress: 0,
      parameters: params,
      startTime: new Date().toISOString(),
    };

    this.jobs.push(job);

    // Delegate training to Python backend
    this.delegateTraining(job.id, params);

    return job;
  }

  private async delegateTraining(jobId: string, params: TrainingParameters) {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return;
    job.status = 'training';
    try {
      const response = await fetch('http://localhost:8000/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: job.projectId, parameters: params })
      });
      if (!response.ok) {
        job.status = 'error';
        job.error = `Python worker error: ${response.statusText}`;
        return;
      }
      const result = await response.json();
      // Expect result to contain metrics, progress, etc.
      job.status = result.status || 'done';
      job.progress = result.progress ?? 100;
      job.metrics = result.metrics;
      job.endTime = new Date().toISOString();
    } catch (err: any) {
      job.status = 'error';
      job.error = err.message || 'Unknown error communicating with Python worker';
    }
  }

  getJobs(projectId: string): TrainingJob[] {
    return this.jobs.filter(j => j.projectId === projectId);
  }

  getJob(jobId: string): TrainingJob | undefined {
    return this.jobs.find(j => j.id === jobId);
  }
}

export const trainingService = new TrainingService();
