import React from 'react';
import './styles/App.css';
import Header from './components/Header';
import NodeStatus from './components/NodeStatus';
import TrafficNetwork from './components/TrafficNetwork';
import MapVisualizer from './components/MapVisualizer';
import Footer from './components/Footer';

function App() {
  return (
    <div className="container">
      <Header />
      <main>
        <NodeStatus />
        <TrafficNetwork />
        <MapVisualizer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
