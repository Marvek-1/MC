import { TrainingJob, TrainingParameters } from '../types/training';

class TrainingService {
  private jobs: TrainingJob[] = [];

  async startTraining(projectId: string, params: TrainingParameters): Promise<TrainingJob> {
    const job: TrainingJob = {
      id: Math.random().toString(36).substring(7),
      projectId,
      status: 'queued',
      progress: 0,
      parameters: params,
      startTime: new Date().toISOString(),
    };

    this.jobs.push(job);

    // Simulate training process
    this.simulateTraining(job.id);

    return job;
  }

  private async simulateTraining(jobId: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return;

    job.status = 'running';

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      job.progress = i;
      
      // Add some random metrics
      if (i > 0) {
        job.metrics = {
          accuracy: 0.5 + (i / 200) + (Math.random() * 0.1),
          loss: 1.0 - (i / 100) + (Math.random() * 0.05),
        };
      }
    }

    job.status = 'completed';
    job.endTime = new Date().toISOString();
  }

  getJobs(projectId: string): TrainingJob[] {
    return this.jobs.filter(j => j.projectId === projectId);
  }

  getJob(jobId: string): TrainingJob | undefined {
    return this.jobs.find(j => j.id === jobId);
  }
}

export const trainingService = new TrainingService();
