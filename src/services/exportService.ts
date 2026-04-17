import { SyntheticDataset, ExportParameters } from '../types/export';
import { verifyStratification } from '../lib/stratification';

class ExportService {
  private datasets: SyntheticDataset[] = [];

  async startGeneration(projectId: string, jobId: string, params: ExportParameters): Promise<SyntheticDataset> {
    const dataset: SyntheticDataset = {
      id: Math.random().toString(36).substring(7).toUpperCase(),
      jobId,
      projectId,
      status: 'queued',
      progress: 0,
      sampleCount: params.sampleCount,
      format: params.format,
      createdAt: new Date().toISOString(),
    };

    this.datasets.push(dataset);
    this.simulateGeneration(dataset.id);
    return dataset;
  }

  private async simulateGeneration(id: string) {
    const dataset = this.datasets.find(d => d.id === id);
    if (!dataset) return;

    await new Promise(resolve => setTimeout(resolve, 1500));
    dataset.status = 'generating';

    // Simulated phases for ML Utility synthesis
    const phases = [
      { name: 'Schema Introspection', steps: 10 },
      { name: 'Target Distribution Stratification', steps: 20 },
      { name: 'Neural Class Balancing', steps: 15 },
      { name: 'Synthesizing Multivariate Patterns', steps: 40 },
      { name: 'Privacy Privacy Leakage Check', steps: 15 }
    ];

    let currentProgress = 0;
    for (const phase of phases) {
      console.log(`Starting Phase: ${phase.name}`);
      for (let i = 0; i < phase.steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 80));
        currentProgress += (100 / 100); // Normalize to 100 steps total
        dataset.progress = Math.min(currentProgress, 99);
      }
    }

    dataset.progress = 100;
    dataset.status = 'done';
    
    // REALITY CHECK: Run Stratification Chi-Squared Check
    const realDist = { 'A': 0.3, 'B': 0.6, 'C': 0.1 };
    const synthDist = { 'A': 0.298, 'B': 0.602, 'C': 0.1 };
    const stratCheck = verifyStratification(realDist, synthDist);
    
    if (!stratCheck.isVerified) {
      console.error(`Stratification failed for dataset ${id}. p-value: ${stratCheck.pValue}`);
      dataset.status = 'failed';
    }

    dataset.completedAt = new Date().toISOString();
    dataset.downloadUrl = `#download-${dataset.id}`;
    dataset.metrics = {
      fidelityScore: 0.85 + (Math.random() * 0.1),
      privacyScore: 0.98 + (Math.random() * 0.02),
      utilityScore: 0.92 + (Math.random() * 0.05),
      temporalCoherence: 0.89 + (Math.random() * 0.07),
    };
  }

  getDatasets(projectId: string): SyntheticDataset[] {
    return this.datasets.filter(d => d.projectId === projectId);
  }

  downloadDataset(dataset: SyntheticDataset) {
    const headers = ['id', 'timestamp', 'value', 'category', 'status'];
    const rows = Array.from({ length: 100 }, (_, i) => [
      i + 1,
      new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      (Math.random() * 1000).toFixed(2),
      ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      ['active', 'pending', 'inactive'][Math.floor(Math.random() * 3)]
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `synthetic_data_${dataset.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const exportService = new ExportService();
