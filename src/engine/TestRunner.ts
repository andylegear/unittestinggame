import { TestCase, TestResult } from '../types';
import { codeExecutor } from './CodeExecutor';

/**
 * TestRunner - Executes test suites against user code
 * Provides instant feedback with expected vs received diffs
 */
export class TestRunner {
  /**
   * Run all tests against user code
   */
  runAllTests(userCode: string, tests: TestCase[]): TestResult[] {
    return tests.map(test => codeExecutor.runTest(userCode, test));
  }

  /**
   * Check if all tests pass
   */
  allTestsPass(results: TestResult[]): boolean {
    return results.every(r => r.passed);
  }

  /**
   * Get failing tests
   */
  getFailingTests(results: TestResult[]): TestResult[] {
    return results.filter(r => !r.passed);
  }

  /**
   * Format test result for display
   */
  formatResult(result: TestResult, test: TestCase): string {
    if (result.passed) {
      return `✓ ${test.name}`;
    }
    
    const lines = [`✗ ${test.name}`];
    
    if (result.error) {
      lines.push(`  Error: ${result.error}`);
    } else {
      lines.push(`  Expected: ${JSON.stringify(result.expected)}`);
      lines.push(`  Received: ${JSON.stringify(result.received)}`);
    }
    
    return lines.join('\n');
  }

  /**
   * Generate a diff between expected and received
   */
  generateDiff(result: TestResult): { type: 'match' | 'mismatch' | 'error'; message: string } {
    if (result.passed) {
      return { type: 'match', message: 'Values match!' };
    }
    
    if (result.error) {
      return { type: 'error', message: result.error };
    }
    
    return {
      type: 'mismatch',
      message: `Expected: ${JSON.stringify(result.expected)}\nReceived: ${JSON.stringify(result.received)}`,
    };
  }

  /**
   * Simulate Chaos Bot attack - random edge case inputs
   */
  runChaosBotTest(userCode: string, functionName: string): TestResult {
    const chaosInputs = [
      null,
      undefined,
      '',
      -1,
      Infinity,
      NaN,
      [],
      {},
      0,
      -999999,
      999999,
    ];

    const randomInput = chaosInputs[Math.floor(Math.random() * chaosInputs.length)];
    
    // Test with random chaos input

    try {
      const userFunction = codeExecutor.executeCode(userCode, functionName);
      
      if (!userFunction) {
        return {
          testId: 'chaos-bot',
          passed: false,
          expected: 'no-crash',
          received: 'function-not-found',
          error: 'Function not found',
        };
      }

      // Try to run with chaos input - we just want it not to crash
      userFunction(randomInput);
      
      return {
        testId: 'chaos-bot',
        passed: true,
        expected: 'no-crash',
        received: 'survived',
      };
    } catch (error) {
      return {
        testId: 'chaos-bot',
        passed: false,
        expected: 'no-crash',
        received: 'crashed',
        error: `Chaos Bot crashed your code with input: ${JSON.stringify(randomInput)} - ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

export const testRunner = new TestRunner();
