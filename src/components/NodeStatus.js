import React, { useState } from 'react';
import '../styles/NodeStatus.css'; // Import the CSS file

function NodeStatus() {
  const [nodes, setNodes] = useState([]);

  // Function to add a new node
  const addNode = () => {
    const newNode = {
      id: nodes.length + 1,
      name: `Node ${nodes.length + 1}`,
      state: Math.random() < 0.5 ? 'normal' : 'error' // Randomly assign state
    };
    setNodes([...nodes, newNode]);
  };

  // Function to remove a node by ID
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

  return (
    <section id="node-status">
      <h2>Node Status</h2>
      <div>
        <p>Total Nodes: {nodes.length}</p>
        <button onClick={addNode}>Add Node</button>
      </div>
      <div className="node-container">
        {nodes.map(node => (
          <div key={node.id} className="node">
            <div
              className={`node-box ${node.state}`}
              onClick={() => toggleNodeState(node.id)}
            >
              {node.name}
            </div>
            <button onClick={() => removeNode(node.id)}>Remove</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NodeStatus;
