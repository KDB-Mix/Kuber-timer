import { useState } from "react";
import "./App.css";

function App() {
  let time_on_timer = 0.0;
  let timer_text = "00.00"
  return (
    <main className="container" style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }}>
      <div id="timer-container">
        <h1 id="timer-time">{timer_text}</h1>
      </div>
    </main>
  );
}

export default App;
