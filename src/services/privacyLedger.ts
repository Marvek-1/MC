export interface PrivacyLog {
  timestamp: string;
  epsilon: number;
  delta: number;
  jobId: string;
  mechanism: 'DP-SGD' | 'PATE' | 'Gaussian';
}

/**
 * The Epsilon Ledger tracks cumulative privacy loss across the generator lifecycle.
 */
export class PrivacyLedger {
  private logs: PrivacyLog[] = [];
  private totalEpsilon: number = 0;

  recordTraining(jobId: string, epsilon: number, delta: number = 1e-5) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      epsilon,
      delta,
      jobId,
      mechanism: 'DP-SGD'
    });
    
    // Privacy accounting (simplified composition)
    this.totalEpsilon += epsilon;
  }

  getBudget() {
    return {
      totalEpsilon: this.totalEpsilon,
      numRuns: this.logs.length,
      history: this.logs
    };
  }
}

export const privacyLedger = new PrivacyLedger();
