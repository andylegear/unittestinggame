import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { coverageTracker } from '../../engine';
import './TestSuite.css';

export function TestSuite() {
  const { state, getCurrentLevel, runChaosBotAttack, addUserTest, markChaosBotTested } = useGame();
  const [chaosBotResult, setChaosBotResult] = useState<{
    passed: boolean;
    error?: string;
  } | null>(null);
  const [showAddTest, setShowAddTest] = useState(false);
  const [newTestInput, setNewTestInput] = useState('');
  const [newTestExpected, setNewTestExpected] = useState('');
  
  const level = getCurrentLevel();
  const allTests = level ? [...level.tests, ...state.userTests] : [];
  
  const passedCount = state.testResults.filter(r => r.passed).length;
  const totalCount = allTests.length;
  
  const coverage = coverageTracker.analyzeCoverage(
    state.userCode,
    passedCount,
    totalCount
  );
  
  const handleChaosBotAttack = () => {
    const result = runChaosBotAttack();
    if (result) {
      setChaosBotResult({
        passed: result.passed,
        error: result.error,
      });
      markChaosBotTested();
    }
  };
  
  const handleAddTest = () => {
    if (!newTestInput.trim() || !newTestExpected.trim()) return;
    
    const fnMatch = level?.tests[0]?.code.match(/(\w+)\s*\(/);
    const functionName = fnMatch ? fnMatch[1] : 'fn';
    
    let expectedValue: unknown;
    try {
      expectedValue = JSON.parse(newTestExpected);
    } catch {
      expectedValue = newTestExpected;
    }
    
    addUserTest({
      id: `user-${Date.now()}`,
      name: `Shield Test: ${newTestInput}`,
      code: `${functionName}(${newTestInput})`,
      expectedOutput: expectedValue,
      description: `User test: ${functionName}(${newTestInput}) should return ${newTestExpected}`,
      isEdgeCaseTest: true,
    });
    
    setShowAddTest(false);
    setNewTestInput('');
    setNewTestExpected('');
  };

  return (
    <div className="test-suite">
      <div className="suite-header">
        <h3>🧪 Test Suite</h3>
        <div className="test-count">
          <span className={passedCount === totalCount && totalCount > 0 ? 'all-pass' : ''}>
            {passedCount}/{totalCount} Passing
          </span>
        </div>
      </div>
      
      {/* Coverage Meter */}
      <div className="coverage-section">
        <div className="coverage-header">
          <span>📊 Code Coverage</span>
          <span style={{ color: coverageTracker.getCoverageColor(coverage.percentage) }}>
            {coverage.percentage}%
          </span>
        </div>
        <div className="coverage-bar">
          <div 
            className="coverage-fill"
            style={{ 
              width: `${coverage.percentage}%`,
              backgroundColor: coverageTracker.getCoverageColor(coverage.percentage),
            }}
          />
        </div>
        <div className="coverage-label">
          {coverageTracker.getCoverageLabel(coverage.percentage)}
        </div>
      </div>
      
      {/* Test List */}
      <div className="test-list">
        {allTests.map((test) => {
          const result = state.testResults.find(r => r.testId === test.id);
          const status = !result ? 'pending' : result.passed ? 'passed' : 'failed';
          
          return (
            <div key={test.id} className={`test-item ${status}`}>
              <div className="test-header">
                <span className="test-light">
                  {status === 'pending' && '⚪'}
                  {status === 'passed' && '🟢'}
                  {status === 'failed' && '🔴'}
                </span>
                <span className="test-name">{test.name}</span>
                {test.isEdgeCaseTest && <span className="edge-badge">🛡️</span>}
              </div>
              
              <div className="test-code">
                <code>{test.description}</code>
              </div>
              
              {result && !result.passed && (
                <div className="test-diff">
                  <div className="diff-line expected">
                    Expected: <code>{JSON.stringify(result.expected)}</code>
                  </div>
                  <div className="diff-line received">
                    Received: <code>{JSON.stringify(result.received)}</code>
                  </div>
                  {result.error && (
                    <div className="diff-line error">
                      Error: <code>{result.error}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Edge Case Challenge */}
      {level?.edgeCaseChallenge && (
        <div className="edge-case-section">
          <div className="edge-header">
            <span>🛡️ Shield Test Challenge</span>
          </div>
          <p className="edge-description">{level.edgeCaseChallenge.description}</p>
          <p className="edge-hint">💡 {level.edgeCaseChallenge.hint}</p>
          
          {!showAddTest ? (
            <button className="add-test-btn" onClick={() => setShowAddTest(true)}>
              ✍️ Write Shield Test
            </button>
          ) : (
            <div className="add-test-form">
              <input
                type="text"
                placeholder="Input (e.g., null, -5, [])"
                value={newTestInput}
                onChange={e => setNewTestInput(e.target.value)}
              />
              <input
                type="text"
                placeholder="Expected output"
                value={newTestExpected}
                onChange={e => setNewTestExpected(e.target.value)}
              />
              <div className="form-actions">
                <button onClick={handleAddTest}>Add Test</button>
                <button onClick={() => setShowAddTest(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Chaos Bot */}
      <div className="chaos-bot-section">
        <button className="chaos-btn" onClick={handleChaosBotAttack}>
          🤖 Release Chaos Bot
        </button>
        
        {chaosBotResult && (
          <div className={`chaos-result ${chaosBotResult.passed ? 'survived' : 'crashed'}`}>
            {chaosBotResult.passed ? (
              <span>✅ Your code survived the Chaos Bot!</span>
            ) : (
              <span>💥 {chaosBotResult.error}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
