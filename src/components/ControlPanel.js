import React from 'react';
import './ControlPanel.css';

const ControlPanel = ({ onStartTask, onExecuteMigration, onReset, systemState, config, setConfig }) => {
  return (
    <div className="control-panel">
      <h3>CONTROL_PANEL</h3>

      <div className="control-section">
        <h4>ACTIONS</h4>
        <div className="control-buttons">
          <button
            className="control-btn start-btn"
            onClick={onStartTask}
            disabled={systemState !== 'IDLE'}
          >
            <span className="btn-icon">▶</span>
            START_TASK
          </button>

          <button
            className="control-btn migrate-btn"
            onClick={onExecuteMigration}
            disabled={systemState !== 'A_RUNNING'}
          >
            <span className="btn-icon">⇄</span>
            MIGRATE
          </button>

          <button
            className="control-btn reset-btn"
            onClick={onReset}
          >
            <span className="btn-icon">↻</span>
            RESET
          </button>

          <button
            className="control-btn"
            disabled={true}
          >
            <span className="btn-icon">⏸</span>
            PAUSE
          </button>

          <button
            className="control-btn"
            disabled={true}
          >
            <span className="btn-icon">#</span>
            ANALYZE
          </button>
        </div>
      </div>

      <div className="config-section">
        <h4>CONFIGURATION</h4>
        <div className="config-grid">
          <div className="config-item">
            <label>MIGRATION_SPEED:</label>
            <select
              value={config.migrationSpeed}
              onChange={(e) => setConfig({...config, migrationSpeed: e.target.value})}
            >
              <option value="SLOW">SLOW</option>
              <option value="NORMAL">NORMAL</option>
              <option value="FAST">FAST</option>
            </select>
          </div>

          <div className="config-item">
            <label>COMPRESSION:</label>
            <select
              value={config.compressionLevel}
              onChange={(e) => setConfig({...config, compressionLevel: e.target.value})}
            >
              <option value="NONE">NONE</option>
              <option value="LOW">LOW</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div className="config-item">
            <label>ENCRYPTION:</label>
            <input
              type="checkbox"
              checked={config.encryptionEnabled}
              onChange={(e) => setConfig({...config, encryptionEnabled: e.target.checked})}
            />
            <span>{config.encryptionEnabled ? 'ON' : 'OFF'}</span>
          </div>

          <div className="config-item">
            <label>DEBUG_MODE:</label>
            <input
              type="checkbox"
              checked={config.debugMode}
              onChange={(e) => setConfig({...config, debugMode: e.target.checked})}
            />
            <span>{config.debugMode ? 'ON' : 'OFF'}</span>
          </div>

          <div className="config-item">
            <label>AUTO_RETRY:</label>
            <input
              type="checkbox"
              checked={config.autoRetry}
              onChange={(e) => setConfig({...config, autoRetry: e.target.checked})}
            />
            <span>{config.autoRetry ? 'ON' : 'OFF'}</span>
          </div>
        </div>
      </div>

      <div className="status-section">
        <h4>STATUS</h4>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">CURRENT_STATE:</span>
            <span className={`status-value status-${systemState.toLowerCase()}`}>
              {systemState}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">NETWORK_LAT:</span>
            <span className="status-value">8-12ms</span>
          </div>
          <div className="status-item">
            <span className="status-label">BANDWIDTH:</span>
            <span className="status-value">10.0 Gbps</span>
          </div>
          <div className="status-item">
            <span className="status-label">PROTOCOL:</span>
            <span className="status-value">V2X_MESH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
