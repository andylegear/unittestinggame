// Game Types

export type GamePhase = 'red' | 'green' | 'refactor';

export interface TestCase {
  id: string;
  name: string;
  code: string;
  expectedOutput: unknown;
  description: string;
  isEdgeCaseTest?: boolean;
}

export interface TestResult {
  testId: string;
  passed: boolean;
  expected: unknown;
  received: unknown;
  error?: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  component: string; // e.g., "Engine", "OxygenScrubber", "Navigation"
  initialCode: string;
  solutionCode: string;
  tests: TestCase[];
  edgeCaseChallenge?: {
    description: string;
    hint: string;
  };
  refactorChallenge?: {
    maxLines: number;
    hint: string;
  };
}

export interface GameState {
  currentLevel: number;
  phase: GamePhase;
  userCode: string;
  testResults: TestResult[];
  codeCoverage: number;
  score: number;
  completedLevels: number[];
  userTests: TestCase[];
}

export interface CoverageData {
  branches: {
    covered: number;
    total: number;
  };
  percentage: number;
}

export interface ShipComponent {
  id: string;
  name: string;
  status: 'broken' | 'repairing' | 'fixed';
  x: number;
  y: number;
}
