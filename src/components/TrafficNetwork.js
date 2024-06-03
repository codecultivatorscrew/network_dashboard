import React, { useState } from 'react';
import '../styles/TrafficNetwork.css';

function TrafficNetwork() {
  const [trafficLog, setTrafficLog] = useState([]);

  // Function to add a new log entry
  const addLog = (log) => {
    setTrafficLog(prevLog => [...prevLog, log]);
  };

  // Simulate receiving logs from another program
  // You can replace this with your actual logic for receiving logs
  const receiveLogs = () => {
    const newLogs = ['Received request from Node 1', 'Sent data to Node 2', 'Node 3 disconnected'];
    newLogs.forEach(log => addLog(log));
  };

  // Initially, let's simulate receiving logs after component mounts
  // You can remove this and implement your actual logic
  useState(() => {
    receiveLogs();
  }, []);

  return (
    <section id="traffic-network">
      <h2>Traffic Network</h2>
      <div id="traffic-log">
        {trafficLog.map((log, index) => (
          <div key={index} className="log-entry">{log}</div>
        ))}
      </div>
    </section>
  );
}

export default TrafficNetwork;
