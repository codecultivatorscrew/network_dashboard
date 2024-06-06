import React, { useEffect, useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import TrafficNetwork from './components/TrafficNetwork';
import MapVisualizer from './components/MapVisualizer';
import Footer from './components/Footer';
import NetworkStatus from './components/NetworkStatus';

function App() {
  const [networkStatusData, setNetworkStatusData] = useState(null);
  const [trafficLogData, setTrafficLogData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080'); // Replace with your WebSocket server URL

    ws.onopen = () => {
      setConnectionStatus('Connected');
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log('Data received from WebSocket:', receivedData);
      if (receivedData.type === 'networkStatus') {
        setNetworkStatusData(receivedData);
      } else if (receivedData.type === 'trafficLog') {
        // Clear previous logs and add the new log
        setTrafficLogData([receivedData.message]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    };

    ws.onclose = () => {
      setConnectionStatus('Disconnected');
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="container">
      <Header />
      <main>
        <NetworkStatus webSocketStatus={connectionStatus} data={networkStatusData} />
        <TrafficNetwork data={trafficLogData} />
        <MapVisualizer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
