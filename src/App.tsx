import { GameProvider } from './context/GameContext';
import { WorldView, CodeEditor, TestSuite, GameUI } from './components';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="app">
        <GameUI />
        <main className="game-layout">
          <div className="panel world-panel">
            <WorldView />
          </div>
          <div className="panel editor-panel">
            <CodeEditor />
          </div>
          <div className="panel test-panel">
            <TestSuite />
          </div>
        </main>
      </div>
    </GameProvider>
  );
}

export default App;
