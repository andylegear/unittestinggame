import { createContext, useContext, useReducer, useState, ReactNode } from 'react';
import { GameState, GamePhase, TestResult, TestCase } from '../types';
import { levels } from '../levels';
import { testRunner, coverageTracker } from '../engine';

interface GameContextType {
  state: GameState;
  showInstructions: boolean;
  chaosBotTestedThisLevel: boolean;
  runTests: () => void;
  updateCode: (code: string) => void;
  advancePhase: () => void;
  nextLevel: () => void;
  resetLevel: () => void;
  resetGame: () => void;
  addUserTest: (test: TestCase) => void;
  runChaosBotAttack: () => TestResult | null;
  getCurrentLevel: () => typeof levels[0] | undefined;
  dismissInstructions: () => void;
  markChaosBotTested: () => void;
}

const initialState: GameState = {
  currentLevel: 1,
  phase: 'red',
  userCode: levels[0]?.initialCode || '',
  testResults: [],
  codeCoverage: 0,
  score: 0,
  completedLevels: [],
  userTests: [],
};

type GameAction =
  | { type: 'RUN_TESTS'; results: TestResult[]; coverage: number }
  | { type: 'UPDATE_CODE'; code: string }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESET_LEVEL' }
  | { type: 'RESET_GAME' }
  | { type: 'ADD_SCORE'; points: number }
  | { type: 'ADD_USER_TEST'; test: TestCase }
  | { type: 'COMPLETE_LEVEL'; levelId: number };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'RUN_TESTS':
      return {
        ...state,
        testResults: action.results,
        codeCoverage: action.coverage,
      };
    case 'UPDATE_CODE':
      return {
        ...state,
        userCode: action.code,
      };
    case 'SET_PHASE':
      return {
        ...state,
        phase: action.phase,
      };
    case 'NEXT_LEVEL': {
      const nextLevelIndex = state.currentLevel;
      const nextLevel = levels[nextLevelIndex];
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        phase: 'red',
        userCode: nextLevel?.initialCode || '',
        testResults: [],
        codeCoverage: 0,
        userTests: [],
      };
    }
    case 'RESET_LEVEL': {
      const currentLevel = levels[state.currentLevel - 1];
      return {
        ...state,
        phase: 'red',
        userCode: currentLevel?.initialCode || '',
        testResults: [],
        codeCoverage: 0,
        userTests: [],
      };
    }
    case 'RESET_GAME':
      return {
        ...initialState,
        userCode: levels[0]?.initialCode || '',
      };
    case 'ADD_SCORE':
      return {
        ...state,
        score: state.score + action.points,
      };
    case 'ADD_USER_TEST':
      return {
        ...state,
        userTests: [...state.userTests, action.test],
      };
    case 'COMPLETE_LEVEL':
      return {
        ...state,
        completedLevels: [...new Set([...state.completedLevels, action.levelId])],
      };
    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [showInstructions, setShowInstructions] = useState(true);
  const [chaosBotTestedThisLevel, setChaosBotTestedThisLevel] = useState(false);

  const getCurrentLevel = () => levels[state.currentLevel - 1];

  const runTests = () => {
    const level = getCurrentLevel();
    if (!level) return;

    const allTests = [...level.tests, ...state.userTests];
    const results = testRunner.runAllTests(state.userCode, allTests);
    
    const passedCount = results.filter(r => r.passed).length;
    const coverage = coverageTracker.analyzeCoverage(
      state.userCode,
      passedCount,
      allTests.length
    );

    dispatch({ type: 'RUN_TESTS', results, coverage: coverage.percentage });

    // Check phase progression
    if (state.phase === 'red' && results.length > 0) {
      // Player has seen the failing tests, allow them to move to green
    }

    if (state.phase === 'green' && testRunner.allTestsPass(results)) {
      dispatch({ type: 'ADD_SCORE', points: 100 });
      if (level.refactorChallenge) {
        dispatch({ type: 'SET_PHASE', phase: 'refactor' });
      } else {
        dispatch({ type: 'COMPLETE_LEVEL', levelId: level.id });
      }
    }

    if (state.phase === 'refactor' && testRunner.allTestsPass(results)) {
      const lines = state.userCode.split('\n').filter(l => l.trim()).length;
      if (level.refactorChallenge && lines <= level.refactorChallenge.maxLines) {
        dispatch({ type: 'ADD_SCORE', points: 50 });
      }
      dispatch({ type: 'COMPLETE_LEVEL', levelId: level.id });
    }
  };

  const updateCode = (code: string) => {
    dispatch({ type: 'UPDATE_CODE', code });
  };

  const advancePhase = () => {
    if (state.phase === 'red') {
      dispatch({ type: 'SET_PHASE', phase: 'green' });
    } else if (state.phase === 'green') {
      const level = getCurrentLevel();
      if (level?.refactorChallenge) {
        dispatch({ type: 'SET_PHASE', phase: 'refactor' });
      }
    }
  };

  const nextLevel = () => {
    if (state.currentLevel < levels.length) {
      dispatch({ type: 'NEXT_LEVEL' });
      setChaosBotTestedThisLevel(false);
    }
  };

  const resetLevel = () => {
    dispatch({ type: 'RESET_LEVEL' });
    setChaosBotTestedThisLevel(false);
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
    setChaosBotTestedThisLevel(false);
  };

  const addUserTest = (test: TestCase) => {
    dispatch({ type: 'ADD_USER_TEST', test });
  };

  const runChaosBotAttack = (): TestResult | null => {
    const level = getCurrentLevel();
    if (!level) return null;

    // Extract function name from first test
    const fnMatch = level.tests[0]?.code.match(/(\w+)\s*\(/);
    const functionName = fnMatch ? fnMatch[1] : 'unknown';

    return testRunner.runChaosBotTest(state.userCode, functionName);
  };

  const dismissInstructions = () => {
    setShowInstructions(false);
  };

  const markChaosBotTested = () => {
    setChaosBotTestedThisLevel(true);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        showInstructions,
        chaosBotTestedThisLevel,
        runTests,
        updateCode,
        advancePhase,
        nextLevel,
        resetLevel,
        resetGame,
        addUserTest,
        runChaosBotAttack,
        getCurrentLevel,
        dismissInstructions,
        markChaosBotTested,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
