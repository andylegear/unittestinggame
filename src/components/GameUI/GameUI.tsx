import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { levels } from '../../levels';
import './GameUI.css';

export function GameUI() {
  const { 
    state, 
    showInstructions,
    chaosBotTestedThisLevel,
    nextLevel, 
    resetLevel, 
    resetGame,
    getCurrentLevel,
    dismissInstructions,
  } = useGame();
  const level = getCurrentLevel();
  const [securityCheckDismissed, setSecurityCheckDismissed] = useState(false);
  
  const allPassing = state.testResults.length > 0 && 
    state.testResults.every(r => r.passed);
  
  const isLevelComplete = state.completedLevels.includes(state.currentLevel);
  const hasNextLevel = state.currentLevel < levels.length;
  
  // Check if player has written shield tests and tested chaos bot
  const hasWrittenShieldTest = state.userTests.length > 0;
  const needsSecurityCheck = !hasWrittenShieldTest || !chaosBotTestedThisLevel;
  
  // Show the complete modal only if not dismissed (or if security checks are now complete)
  const showCompleteModal = isLevelComplete && allPassing && (!needsSecurityCheck || !securityCheckDismissed);
  
  const handleReturnToEditor = () => {
    setSecurityCheckDismissed(true);
  };
  
  const handleNextLevel = () => {
    setSecurityCheckDismissed(false);
    nextLevel();
  };

  return (
    <div className="game-ui">
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="modal-overlay">
          <div className="instructions-modal">
            <button className="modal-close-btn" onClick={dismissInstructions} aria-label="Close">
              ✕
            </button>
            <div className="modal-icon">🚀</div>
            <h2>Welcome, Code Medic!</h2>
            <p className="intro-text">
              The USS Debugger is in critical condition. Your mission: repair the ship's 
              systems using the power of <strong>unit testing</strong>.
            </p>
            
            <div className="instructions-list">
              <div className="instruction-item">
                <span className="instruction-phase red">🔴 RED</span>
                <span className="instruction-desc">Read the failing tests to understand what the code should do</span>
              </div>
              <div className="instruction-item">
                <span className="instruction-phase green">🟢 GREEN</span>
                <span className="instruction-desc">Fix the buggy code to make all tests pass</span>
              </div>
              <div className="instruction-item">
                <span className="instruction-phase refactor">🔵 REFACTOR</span>
                <span className="instruction-desc">Optimize your solution without breaking tests</span>
              </div>
            </div>
            
            <div className="pro-tips">
              <h4>🛡️ Pro Tips</h4>
              <ul>
                <li><strong>Shield Tests:</strong> Write your own tests for edge cases like null or negative values</li>
                <li><strong>Chaos Bot:</strong> Release it to test your code with random wild inputs</li>
                <li><strong>Coverage Meter:</strong> Aim for high coverage to catch all code paths</li>
              </ul>
            </div>
            
            <button className="modal-btn primary" onClick={dismissInstructions}>
              Begin Mission 🚀
            </button>
          </div>
        </div>
      )}

      {/* Score HUD */}
      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">LEVEL</span>
          <span className="hud-value">{state.currentLevel}/{levels.length}</span>
        </div>
        <div className="hud-item score">
          <span className="hud-label">SCORE</span>
          <span className="hud-value">{state.score}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">PHASE</span>
          <span className={`hud-value phase-${state.phase}`}>
            {state.phase.toUpperCase()}
          </span>
        </div>
      </div>
      
      {/* Level Complete Modal */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="level-complete-modal">
            {needsSecurityCheck ? (
              <>
                <div className="modal-icon">⚠️</div>
                <h2>Almost There!</h2>
                <p>Before proceeding, complete these security checks:</p>
                
                <div className="security-checklist">
                  <div className={`checklist-item ${hasWrittenShieldTest ? 'complete' : 'incomplete'}`}>
                    <span className="check-icon">{hasWrittenShieldTest ? '✅' : '❌'}</span>
                    <span>Write at least one Shield Test for edge cases</span>
                  </div>
                  <div className={`checklist-item ${chaosBotTestedThisLevel ? 'complete' : 'incomplete'}`}>
                    <span className="check-icon">{chaosBotTestedThisLevel ? '✅' : '❌'}</span>
                    <span>Release the Chaos Bot to test your defenses</span>
                  </div>
                </div>
                
                <p className="checklist-hint">
                  💡 Use the Test Suite panel on the right to complete these tasks
                </p>
                
                <button className="modal-btn primary" onClick={handleReturnToEditor}>
                  Return to Editor
                </button>
              </>
            ) : (
              <>
                <div className="modal-icon">🎉</div>
                <h2>Component Repaired!</h2>
                <p>{level?.name} is now fully operational.</p>
                
                <div className="modal-stats">
                  <div className="stat">
                    <span className="stat-label">Tests Passed</span>
                    <span className="stat-value">{state.testResults.length}/{state.testResults.length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Coverage</span>
                    <span className="stat-value">{state.codeCoverage}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Shield Tests</span>
                    <span className="stat-value">{state.userTests.length}</span>
                  </div>
                </div>
                
                <div className="modal-actions">
                  {hasNextLevel ? (
                    <button className="modal-btn primary" onClick={handleNextLevel}>
                      Next Component →
                    </button>
                  ) : (
                    <div className="victory-message">
                      🏆 Congratulations! You've repaired the entire ship!
                    </div>
                  )}
                  <button className="modal-btn secondary" onClick={resetLevel}>
                    Replay Level
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Control Buttons */}
      <div className="control-buttons">
        <button className="control-btn reset-btn" onClick={resetLevel} title="Reset Level">
          🔄
        </button>
        <button className="control-btn restart-btn" onClick={resetGame} title="Restart Game">
          🏠
        </button>
      </div>
    </div>
  );
}
