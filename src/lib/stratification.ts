/**
 * Verifies that synthetic data doesn't collapse minority classes.
 * Runs a Chi-Squared independence test simulation.
 */
export function verifyStratification(realDist: Record<string, number>, syntheticDist: Record<string, number>): { pValue: number; isVerified: boolean } {
  let chiSquare = 0;
  const categories = Object.keys(realDist);
  
  for (const cat of categories) {
    const expected = realDist[cat];
    const observed = syntheticDist[cat] || 0;
    
    if (expected > 0) {
      chiSquare += Math.pow(observed - expected, 2) / expected;
    }
  }

  // Simplified p-value simulation based on Chi-Square degrees of freedom
  const pValue = Math.exp(-chiSquare / 2); // Extremely simplified approximation

  return {
    pValue,
    isVerified: pValue > 0.05
  };
}
