import { TestCase, TestResult } from '../types';

/**
 * Safe code executor using Function constructor
 * Provides a sandboxed environment for running student code
 */
export class CodeExecutor {
  private sandbox: Record<string, unknown>;

  constructor() {
    // Create a minimal sandbox environment
    this.sandbox = {
      Math,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      String,
      Number,
      Boolean,
      Array,
      Object,
      JSON,
      console: {
        log: () => {}, // Silent console for sandbox
      },
    };
  }

  /**
   * Execute user code and return the exported function
   */
  executeCode(code: string, functionName: string): ((...args: unknown[]) => unknown) | null {
    try {
      // Wrap user code to extract the function
      const wrappedCode = `
        ${code}
        return typeof ${functionName} === 'function' ? ${functionName} : null;
      `;

      // Create function with sandbox
      const sandboxKeys = Object.keys(this.sandbox);
      const sandboxValues = Object.values(this.sandbox);
      
      const executor = new Function(...sandboxKeys, wrappedCode);
      const result = executor(...sandboxValues);
      
      return result as ((...args: unknown[]) => unknown) | null;
    } catch (error) {
      console.error('Code execution error:', error);
      return null;
    }
  }

  /**
   * Run a single test case against user code
   */
  runTest(userCode: string, test: TestCase): TestResult {
    try {
      // Extract function name from test code
      // Test format: assert(functionName(args) === expected)
      const fnMatch = test.code.match(/(\w+)\s*\(/);
      const functionName = fnMatch ? fnMatch[1] : 'unknown';

      // Get the user's function
      const userFunction = this.executeCode(userCode, functionName);
      
      if (!userFunction) {
        return {
          testId: test.id,
          passed: false,
          expected: test.expectedOutput,
          received: undefined,
          error: `Function '${functionName}' not found or invalid`,
        };
      }

      // Parse test to get arguments
      const argsMatch = test.code.match(/\w+\(([^)]*)\)/);
      const argsStr = argsMatch ? argsMatch[1] : '';
      
      // Safely evaluate arguments
      let args: unknown[] = [];
      if (argsStr.trim()) {
        try {
          args = new Function(`return [${argsStr}]`)();
        } catch {
          args = [];
        }
      }

      // Execute the function
      const received = userFunction(...args);

      // Compare results
      const passed = this.deepEqual(received, test.expectedOutput);

      return {
        testId: test.id,
        passed,
        expected: test.expectedOutput,
        received,
      };
    } catch (error) {
      return {
        testId: test.id,
        passed: false,
        expected: test.expectedOutput,
        received: undefined,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Deep equality check
   */
  private deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object' || a === null || b === null) return false;
    
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => 
      this.deepEqual(
        (a as Record<string, unknown>)[key], 
        (b as Record<string, unknown>)[key]
      )
    );
  }
}

export const codeExecutor = new CodeExecutor();
