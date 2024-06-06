import React, { useEffect, useState } from 'react';
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

function NodeStatus({ nodes, toggleNodeState }) {
  return (
    <div className="sub-box">
      <h3>Node Status (Count: {nodes.length})</h3>
      <div className="node-container">
        {nodes.map(node => (
          <div key={node.id} className="node">
            <div className={`node-box ${node.state}`} onClick={() => toggleNodeState(node.id)}>
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
  const [socketStatus, setSocketStatus] = useState(true);
  const [uartStatus, setUartStatus] = useState(true);
  const [nodesStatus, setNodesStatus] = useState([]);

  // //Remove Node
  // const removeNode = (id) => {
  //   setNodes(nodes.filter(node => node.id !== id));
  // };

  //Change node state function, we can modify it laters
  const toggleNodeState = (id) => {
    setNodesStatus(nodesStatus.map(node => {
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

  // Update node status when new data is received
  useEffect(() => {
    console.log("useEffect is running!"); // Log a message
    console.log(data)
    if (data && data.type === 'networkStatus' && data.status === 'nodeStatus') {
      console.log("I'm in")
      // Generate unique IDs for new nodes based on current length
      const newNodes = data.nodes.map((node, index) => ({
        ...node,
        id: nodesStatus.length + index + 1 // Generate unique ID
      }));
      setNodesStatus(newNodes);
    }
  }, [data]);

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
            nodes={nodesStatus}
            toggleNodeState={toggleNodeState}
          />
        </div>
      </div>    
    </section>
  );
}

export default NetworkStatus;
