import React, { useEffect, useState } from 'react';
import '../styles/TrafficNetwork.css';

function TrafficNetwork({ data }) {
  const [trafficLog, setTrafficLog] = useState([]);

  // Update traffic log when new data is received
  useEffect(() => {
    if (data) {
      setTrafficLog(prevLog => [...prevLog, ...data]);
    }
  }, [data]);

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
