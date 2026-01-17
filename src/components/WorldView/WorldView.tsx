import { useGame } from '../../context/GameContext';
import './WorldView.css';

const componentPositions: Record<string, { x: number; y: number }> = {
  Engine: { x: 70, y: 60 },
  OxygenScrubber: { x: 30, y: 40 },
  FuelSystem: { x: 50, y: 70 },
  Navigation: { x: 50, y: 25 },
  Shields: { x: 15, y: 50 },
};

export function WorldView() {
  const { state, getCurrentLevel } = useGame();
  const level = getCurrentLevel();
  
  const allPassing = state.testResults.length > 0 && 
    state.testResults.every(r => r.passed);
  
  const componentPos = componentPositions[level?.component || 'Engine'];
  
  const getStatusColor = () => {
    if (state.testResults.length === 0) return '#666';
    return allPassing ? '#4ade80' : '#f87171';
  };

  const getStatusText = () => {
    if (state.testResults.length === 0) return 'AWAITING DIAGNOSTICS';
    return allPassing ? 'SYSTEMS NOMINAL' : 'MALFUNCTION DETECTED';
  };

  return (
    <div className="world-view">
      <div className="world-header">
        <span className="location">🛸 USS DEBUGGER - {level?.component || 'Unknown'} Bay</span>
      </div>
      
      <div className="spaceship-container">
        {/* Spaceship SVG */}
        <svg viewBox="0 0 100 100" className="spaceship-svg">
          {/* Ship body */}
          <ellipse cx="50" cy="50" rx="35" ry="25" fill="#2a2a4a" stroke="#4a4a6a" strokeWidth="2" />
          
          {/* Cockpit */}
          <ellipse cx="50" cy="35" rx="12" ry="8" fill="#1a1a3a" stroke="#6366f1" strokeWidth="1" />
          <ellipse cx="50" cy="35" rx="8" ry="5" fill="#0f172a" opacity="0.8" />
          
          {/* Wings */}
          <polygon points="15,50 5,65 25,55" fill="#3a3a5a" stroke="#4a4a6a" strokeWidth="1" />
          <polygon points="85,50 95,65 75,55" fill="#3a3a5a" stroke="#4a4a6a" strokeWidth="1" />
          
          {/* Engine glow */}
          <ellipse cx="50" cy="75" rx="8" ry="4" fill={allPassing ? '#4ade80' : '#f87171'} opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />
          </ellipse>
          
          {/* Component highlight */}
          <circle 
            cx={componentPos.x} 
            cy={componentPos.y} 
            r="6" 
            fill="none" 
            stroke={getStatusColor()} 
            strokeWidth="2"
            className="component-highlight"
          >
            <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
          </circle>
          
          {/* Component icon */}
          <circle 
            cx={componentPos.x} 
            cy={componentPos.y} 
            r="3" 
            fill={getStatusColor()}
          />
        </svg>
        
        {/* Status overlay */}
        <div className="status-overlay" style={{ color: getStatusColor() }}>
          <div className="status-indicator">
            <span className="status-dot" style={{ backgroundColor: getStatusColor() }} />
            <span className="status-text">{getStatusText()}</span>
          </div>
        </div>
      </div>
      
      {/* Component info */}
      <div className="component-info">
        <h3>{level?.name || 'Loading...'}</h3>
        <p>{level?.description || ''}</p>
      </div>
      
      {/* Phase indicator */}
      <div className="phase-badges">
        <span className={`phase-badge ${state.phase === 'red' ? 'active' : ''}`}>
          🔴 RED
        </span>
        <span className={`phase-badge ${state.phase === 'green' ? 'active' : ''}`}>
          🟢 GREEN
        </span>
        <span className={`phase-badge ${state.phase === 'refactor' ? 'active' : ''}`}>
          🔵 REFACTOR
        </span>
      </div>
    </div>
  );
}
