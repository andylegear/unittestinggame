import { useGame } from '../../context/GameContext';
import './CodeEditor.css';

export function CodeEditor() {
  const { state, updateCode, runTests, advancePhase } = useGame();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCode(e.target.value);
  };

  const lineNumbers = state.userCode.split('\n').map((_, i) => i + 1);

  return (
    <div className="code-editor">
      <div className="editor-header">
        <span className="file-tab">
          <span className="file-icon">📄</span>
          ship_systems.js
        </span>
        <div className="editor-actions">
          {state.phase === 'red' && (
            <button className="action-btn observe-btn" onClick={advancePhase}>
              👁️ I Understand the Tests
            </button>
          )}
          <button className="action-btn run-btn" onClick={runTests}>
            ▶️ Run Tests
          </button>
        </div>
      </div>
      
      <div className="editor-body">
        <div className="line-numbers">
          {lineNumbers.map(num => (
            <div key={num} className="line-number">{num}</div>
          ))}
        </div>
        <textarea
          className="code-input"
          value={state.userCode}
          onChange={handleChange}
          spellCheck={false}
          disabled={state.phase === 'red'}
        />
      </div>
      
      {state.phase === 'red' && (
        <div className="editor-overlay">
          <div className="overlay-message">
            <span className="overlay-icon">🔍</span>
            <p>Read the failing tests to understand what the code should do</p>
            <p className="overlay-hint">Click "I Understand the Tests" when ready to fix</p>
          </div>
        </div>
      )}
      
      {state.phase === 'refactor' && (
        <div className="refactor-hint">
          <span>🔵</span> Refactor Challenge: Optimize your code without breaking tests!
        </div>
      )}
    </div>
  );
}
