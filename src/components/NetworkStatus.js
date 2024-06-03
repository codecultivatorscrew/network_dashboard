import React, { useState } from 'react';
import '../styles/NodeStatus.css';

function NetworkStatus() {
  // Sample data for Robot Status and Connection Status
  const [robotStatus, setRobotStatus] = useState([
    { id: 1, name: 'Robot Node 1', state: 'Active', node: 'Node-0' },
    { id: 2, name: 'Robot Node 2', state: 'Idle',  node: 'N/A'}
  ]);
  const [socketStatus, setSocketStatus] = useState(true);
  const [uartStatus, setUartStatus] = useState(true);

  const [nodes, setNodes] = useState([]);

  const addNode = () => {
    const newNode = {
      id: nodes.length + 1,
      name: `Node ${nodes.length + 1}`,
      state: Math.random() < 0.5 ? 'normal' : 'error'
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id) => {
    setNodes(nodes.filter(node => node.id !== id));
  };

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

  return (
    <section id="node-status">
      <h2>Network Status ({nodes.length})</h2>
      <div className="network-container">
        <div className="network-column">
          <div className="sub-box">
            <h3>Connection Status</h3>
            <div>
              <p>Socket: <input type="checkbox" checked={socketStatus} onChange={toggleSocketStatus} /></p>
              <p>UART: <input type="checkbox" checked={uartStatus} onChange={toggleUartStatus} /></p>
            </div>
          </div>
          <div className="sub-box">
            <h3>Robot Status ({robotStatus.length})</h3>
            <div className="node-container">
              {robotStatus.map(node => (
                <div key={node.id} className="node">
                  <div className={`node-box ${node.state}`}>
                    {node.state}
                  </div>
                <p>{node.node}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
        <div className="network-column">
          <div className="sub-box">
            <h3>Node Status (Count: {nodes.length}) </h3>
            <div className="node-container">
              {nodes.map(node => (
                <div key={node.id} className="node">
                  <div className={`node-box ${node.state}`}
                      onClick={() => toggleNodeState(node.id)}>
                    {node.name}
                  </div>
                  <button onClick={() => removeNode(node.id)}>Remove</button>
                </div>
              ))}
              <button onClick={addNode}>Add Node</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NetworkStatus;
