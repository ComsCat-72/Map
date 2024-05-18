import './App.css';
import Map from "./Components/Map";
import React from 'react';

 function App() {
  return (
    <div className="App">
      <Map />
    </div>
  );
}

export default React.memo(App);
