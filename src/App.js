import React from 'react';
import './styles/App.css';
import Header from './components/Header';
import TrafficNetwork from './components/TrafficNetwork';
import MapVisualizer from './components/MapVisualizer';
import Footer from './components/Footer';
import NetworkStatus from './components/NetworkStatus';

function App() {
  return (
    <div className="container">
      <Header />
      <main>
        <NetworkStatus />
        <TrafficNetwork />
        <MapVisualizer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
