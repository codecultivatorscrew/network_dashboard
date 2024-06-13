import React, { useEffect, useState } from 'react';
import '../styles/NodeStatus.css';

function ConnectionStatus({ socketStatus, uartStatus, webSocketStatus }) {
  return (
    <div className="sub-box">
      <h3>Connection Status</h3>
      <div>
        <p>Web Socket: <input type="checkbox" readOnly checked={webSocketStatus} /></p>
        <p>Socket: <input type="checkbox" readOnly checked={socketStatus} /></p>
        <p>UART: <input type="checkbox" readOnly checked={uartStatus} /></p>
      </div>
    </div>
  );
}

function RobotStatus({ robotStatus }) {
  return (
    <div className="sub-box">
      <h3>Robot Status ({robotStatus.length})</h3>
      <div className="node-container">
        {robotStatus.map(node => (
          <div key={node.id} className="node">
            <div className={`node-box ${node.state.toLowerCase()}`}>
              {node.state}
            </div>
            <p className="node-connection">Connected to: {node.node}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NodeStatus({ nodes }) {
  return (
    <div className="sub-box">
      <h3>Node Status (Count: {nodes.length})</h3>
      <div className="node-container">
        {nodes.map(node => (
          <div key={node.id} className="node">
            <div className={`node-box ${node.state}`}>
              {node.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkStatus({ webSocketStatus, data }) {
  // Sample data for Robot Status and Connection Status
  const [robotStatus, setRobotStatus] = useState([
    { id: 1, name: 'Robot Node 1', state: 'Active', node: 'Node-0' },
    { id: 2, name: 'Robot Node 2', state: 'Idle', node: 'N/A' }
  ]);
  const [socketStatus, setSocketStatus] = useState(false);
  const [uartStatus, setUartStatus] = useState(false);
  const [nodesStatus, setNodesStatus] = useState([]);

  // Update node status when new data is received
  useEffect(() => {
    if (data && data.status === 'nodeStatus') {
      // Generate unique IDs for new nodes based on current length
      const newNodes = data.nodes.map((node, index) => ({
        name: node.name,
        state: node.status,
        id: nodesStatus.length + index + 1 // Generate unique ID
      }));
      setNodesStatus(newNodes);
    }
    else if (data && data.status === 'connectionStatus') {
      setSocketStatus(data.socket);
      setUartStatus(data.uart);
    }
    else if (data && data.status === 'robotStatus') {
      const newRobots = data.robots.map((robot) => ({
        ...robot
      }));
      setRobotStatus(newRobots);
    }
  }, [data, nodesStatus.length]);

  return (
    <section id="node-status">
      <h2>Network Status</h2>
      <div className="network-container">
        <div className="network-column column-1">
          <ConnectionStatus
            socketStatus={socketStatus}
            uartStatus={uartStatus}
            webSocketStatus={webSocketStatus}
          />
          <RobotStatus robotStatus={robotStatus} />
        </div>
        <div className="network-column column-2">
          <NodeStatus
            nodes={nodesStatus}
          />
        </div>
      </div>    
    </section>
  );
}

export default NetworkStatus;
