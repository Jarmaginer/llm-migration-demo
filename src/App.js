import { useState } from 'react';
import './App.css';
import VehiclePanel from './components/VehiclePanel';
import ControlPanel from './components/ControlPanel';

function App() {
  const [systemState, setSystemState] = useState('IDLE');
  const [vehicleAState, setVehicleAState] = useState({
    status: '待命中',
    llmOutput: '',
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 12,
    progress: 0,
    temperature: 45,
    powerLevel: 85
  });
  const [vehicleBState, setVehicleBState] = useState({
    status: '待命中',
    llmOutput: '',
    cpuUsage: 0,
    memoryUsage: 0,
    networkLatency: 8,
    progress: 0,
    temperature: 42,
    powerLevel: 92
  });
  const [config, setConfig] = useState({
    migrationSpeed: 'NORMAL',
    compressionLevel: 'HIGH',
    encryptionEnabled: true,
    debugMode: false,
    autoRetry: true
  });

  // 模拟LLM推理文本
  const sampleText = "在未来的智能交通网络中，车辆之间的协作将变得前所未有的重要。通过先进的V2X技术，每一辆车都能成为整个网络的一个智能节点，实时共享计算资源和推理能力。当一辆车即将离开网络覆盖范围时，它可以无缝地将正在执行的AI任务迁移到附近的其他车辆上，确保服务的连续性和可靠性。这种分布式计算模式不仅提高了系统的鲁棒性，还能充分利用每辆车的计算能力，创造出一个真正智能的移动计算生态系统。";

  // 启动任务
  const startTask = () => {
    setSystemState('A_RUNNING');
    setVehicleAState(prev => ({ ...prev, status: '运行中' }));

    // 模拟流式输出和系统指标
    let index = 0;
    const interval = setInterval(() => {
      if (index < sampleText.length) {
        setVehicleAState(prev => ({
          ...prev,
          llmOutput: sampleText.substring(0, index + 1),
          cpuUsage: 30 + Math.sin(Date.now() / 1000) * 20 + Math.random() * 10,
          memoryUsage: 45 + Math.sin(Date.now() / 1200) * 15 + Math.random() * 8,
          temperature: 45 + Math.sin(Date.now() / 2000) * 5 + Math.random() * 3,
          networkLatency: 12 + Math.random() * 8
        }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return interval;
  };

  // 执行迁移
  const executeMigration = () => {
    if (systemState !== 'A_RUNNING') return;

    setSystemState('A_PACKAGING');
    setVehicleAState(prev => ({ ...prev, status: '打包中' }));

    // 打包进度
    let progress = 0;
    const packingInterval = setInterval(() => {
      progress += 5;
      setVehicleAState(prev => ({ ...prev, progress }));

      if (progress >= 100) {
        clearInterval(packingInterval);
        setVehicleAState(prev => ({
          ...prev,
          status: '已停止',
          cpuUsage: 0
        }));

        // 开始迁移到车辆B
        setSystemState('MIGRATING');
        setVehicleBState(prev => ({ ...prev, status: '接收中' }));

        let migrateProgress = 0;
        const migrateInterval = setInterval(() => {
          migrateProgress += 5;
          setVehicleBState(prev => ({ ...prev, progress: migrateProgress }));

          if (migrateProgress >= 100) {
            clearInterval(migrateInterval);

            // 车辆B开始运行
            setSystemState('B_RUNNING');
            setVehicleBState(prev => ({
              ...prev,
              status: '运行中',
              llmOutput: vehicleAState.llmOutput,
              progress: 0
            }));

            // 继续流式输出
            let index = vehicleAState.llmOutput.length;
            const continueInterval = setInterval(() => {
              if (index < sampleText.length) {
                setVehicleBState(prev => ({
                  ...prev,
                  llmOutput: sampleText.substring(0, index + 1),
                  cpuUsage: 30 + Math.sin(Date.now() / 1000) * 20 + Math.random() * 10
                }));
                index++;
              } else {
                clearInterval(continueInterval);
              }
            }, 100);
          }
        }, 50);
      }
    }, 50);
  };

  // 重置系统
  const resetSystem = () => {
    setSystemState('IDLE');
    setVehicleAState({
      status: '待命中',
      llmOutput: '',
      cpuUsage: 0,
      progress: 0
    });
    setVehicleBState({
      status: '待命中',
      llmOutput: '',
      cpuUsage: 0,
      progress: 0
    });
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1>$ ./llm-migration-demo --mode=v2x --debug</h1>
        <div className="system-status">
          [STATUS] <span className={`status-${systemState.toLowerCase()}`}>{systemState}</span>
        </div>
      </div>

      <div className="main-content">
        <div className="top-section">
          <div className="vehicles-container">
            <VehiclePanel
              title="VEHICLE_A [192.168.1.101]"
              vehicleId="A"
              state={vehicleAState}
              isActive={systemState === 'A_RUNNING' || systemState === 'A_PACKAGING'}
            />

            <div className="migration-arrow">
              <div className={`arrow ${systemState === 'MIGRATING' ? 'active' : ''}`}>
                {'====>'}
              </div>
              <div className="transfer-info">
                {systemState === 'MIGRATING' && (
                  <div>
                    <div>TRANSFER_RATE: 1.2GB/s</div>
                    <div>PROTOCOL: V2X_MESH</div>
                  </div>
                )}
              </div>
            </div>

            <VehiclePanel
              title="VEHICLE_B [192.168.1.102]"
              vehicleId="B"
              state={vehicleBState}
              isActive={systemState === 'B_RUNNING' || systemState === 'MIGRATING'}
            />
          </div>
        </div>

        <div className="bottom-section">
          <div className="left-panel">
            <ControlPanel
              onStartTask={startTask}
              onExecuteMigration={executeMigration}
              onReset={resetSystem}
              systemState={systemState}
              config={config}
              setConfig={setConfig}
            />
          </div>

          <div className="right-panel">
            <div className="system-monitor">
              <h3>SYSTEM_MONITOR</h3>
              <div className="monitor-grid">
                <div className="monitor-item">
                  <span>NETWORK_TOPOLOGY:</span>
                  <span>MESH_ACTIVE</span>
                </div>
                <div className="monitor-item">
                  <span>TOTAL_VEHICLES:</span>
                  <span>2/8</span>
                </div>
                <div className="monitor-item">
                  <span>BANDWIDTH_USAGE:</span>
                  <span>1.2/10.0 Gbps</span>
                </div>
                <div className="monitor-item">
                  <span>MIGRATION_QUEUE:</span>
                  <span>0 pending</span>
                </div>
                <div className="monitor-item">
                  <span>UPTIME:</span>
                  <span>02:34:12</span>
                </div>
                <div className="monitor-item">
                  <span>LAST_MIGRATION:</span>
                  <span>--:--:--</span>
                </div>
              </div>
            </div>

            <div className="logs-panel">
              <h3>SYSTEM_LOGS</h3>
              <div className="logs-content">
                <div className="log-entry">[INFO] System initialized</div>
                <div className="log-entry">[INFO] Vehicle A connected</div>
                <div className="log-entry">[INFO] Vehicle B connected</div>
                <div className="log-entry">[DEBUG] Network mesh established</div>
                {systemState !== 'IDLE' && (
                  <>
                    <div className="log-entry">[INFO] Task started on Vehicle A</div>
                    {systemState === 'A_PACKAGING' && (
                      <div className="log-entry">[INFO] Packaging task state...</div>
                    )}
                    {systemState === 'MIGRATING' && (
                      <div className="log-entry">[INFO] Migrating to Vehicle B...</div>
                    )}
                    {systemState === 'B_RUNNING' && (
                      <div className="log-entry">[INFO] Task resumed on Vehicle B</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
