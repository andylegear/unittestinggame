import { CoverageData } from '../types';

/**
 * CoverageTracker - Tracks code coverage for if/else branches
 * Provides visual feedback on which code paths are tested
 */
export class CoverageTracker {
  /**
   * Analyze code for branches and estimate coverage based on test results
   * This is a simplified coverage analysis for educational purposes
   */
  analyzeCoverage(code: string, testsPassed: number, totalTests: number): CoverageData {
    // Count if/else branches in the code
    const ifMatches = code.match(/\bif\s*\(/g) || [];
    const elseMatches = code.match(/\belse\b/g) || [];
    const ternaryMatches = code.match(/\?.*:/g) || [];
    
    const totalBranches = ifMatches.length + elseMatches.length + ternaryMatches.length;
    
    // Estimate coverage based on test pass rate
    // More tests passing = more branches likely covered
    const passRate = totalTests > 0 ? testsPassed / totalTests : 0;
    const estimatedCoveredBranches = Math.floor(totalBranches * passRate);
    
    const percentage = totalBranches > 0 
      ? Math.round((estimatedCoveredBranches / totalBranches) * 100)
      : (testsPassed > 0 ? 100 : 0);

    return {
      branches: {
        covered: estimatedCoveredBranches,
        total: totalBranches || 1, // Avoid division by zero in UI
      },
      percentage: Math.min(percentage, 100),
    };
  }

  /**
   * Get coverage color based on percentage
   */
  getCoverageColor(percentage: number): string {
    if (percentage >= 80) return '#4ade80'; // Green
    if (percentage >= 50) return '#fbbf24'; // Yellow
    return '#f87171'; // Red
  }

  /**
   * Get coverage label
   */
  getCoverageLabel(percentage: number): string {
    if (percentage >= 80) return 'Excellent Coverage';
    if (percentage >= 50) return 'Partial Coverage';
    return 'Low Coverage';
  }
}

export const coverageTracker = new CoverageTracker();
