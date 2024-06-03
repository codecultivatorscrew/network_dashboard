import React, { useState } from 'react';
import '../styles/NodeStatus.css';

function ConnectionStatus({ socketStatus, uartStatus, toggleSocketStatus, toggleUartStatus }) {
  return (
    <div className="sub-box">
      <h3>Connection Status</h3>
      <div>
        <p>Socket: <input type="checkbox" checked={socketStatus} onChange={toggleSocketStatus} /></p>
        <p>UART: <input type="checkbox" checked={uartStatus} onChange={toggleUartStatus} /></p>
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

function NodeStatus({ nodes, addNode, removeNode, toggleNodeState }) {
  return (
    <div className="sub-box">
      <h3>Node Status (Count: {nodes.length})</h3>
      <div className="node-container">
        {nodes.map(node => (
          <div key={node.id} className="node">
            <div className={`node-box ${node.state}`} onClick={() => toggleNodeState(node.id)}>
              {node.name}
            </div>
            <button onClick={() => removeNode(node.id)}>Remove</button>
          </div>
        ))}
        <button onClick={addNode}>Add Node</button>
      </div>
    </div>
  );
}

function NetworkStatus() {
  // Sample data for Robot Status and Connection Status
  const [robotStatus, setRobotStatus] = useState([
    { id: 1, name: 'Robot Node 1', state: 'Active', node: 'Node-0' },
    { id: 2, name: 'Robot Node 2', state: 'Idle', node: 'N/A' }
  ]);
  const [socketStatus, setSocketStatus] = useState(true);
  const [uartStatus, setUartStatus] = useState(true);
  const [nodes, setNodes] = useState([]);

  //Add Node
  const addNode = () => {
    const newNode = {
      id: nodes.length + 1,
      name: `Node ${nodes.length + 1}`,
      state: Math.random() < 0.5 ? 'normal' : 'error'
    };
    setNodes([...nodes, newNode]);
  };

  //Remove Node
  const removeNode = (id) => {
    setNodes(nodes.filter(node => node.id !== id));
  };

  //Change node state function, we can modify it laters
  const toggleNodeState = (id) => {
    setNodes(nodes.map(node => {
      if (node.id === id) {
        return {
          ...node,
          state: node.state === 'normal' ? 'error' : 'normal'
        };
      }
      return node;
    }));
  };

  const toggleSocketStatus = () => {
    setSocketStatus(!socketStatus);
  };

  const toggleUartStatus = () => {
    setUartStatus(!uartStatus);
  };

  const updateRobotStatus = (id, newStatus) => {
    setRobotStatus(robotStatus.map(node => {
      if (node.id === id) {
        return { ...node, ...newStatus };
      }
      return node;
    }));
  };

  return (
    <section id="node-status">
      <h2>Network Status</h2>
      <div className="network-container">
        <div className="network-column column-1">
          <ConnectionStatus
            socketStatus={socketStatus}
            uartStatus={uartStatus}
            toggleSocketStatus={toggleSocketStatus}
            toggleUartStatus={toggleUartStatus}
          />
          <RobotStatus robotStatus={robotStatus} />
        </div>
        <div className="network-column column-2">
          <NodeStatus
            nodes={nodes}
            addNode={addNode}
            removeNode={removeNode}
            toggleNodeState={toggleNodeState}
          />
        </div>
      </div>    
    </section>
  );
}

export default NetworkStatus;
