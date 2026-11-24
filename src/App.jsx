import { useEffect, useRef, useState } from "react";
import "./App.css";

let timer_held_down = false
let time_on_timer = 0;
let time_ms = 0
let time_secs = 0
let time_mins = 0
let start_time = 0
let held_down_start = 0
let timer_color = "black"
let timer_text = "0.00"
let start_timer = false
let is_timing = false
let isKeyDown = false
let key_event = null

function App() {
  const [timerColor, setTimerColor] = useState(timer_color)
  const [timerText, setTimerText] = useState(timer_text)


  function handleDown(event){
      if(event.cancalable) event.preventDefault()
      const isKeyboard = event.type.startsWith('key') && event.key === " "
      const isPointer = event.type.startsWith('pointer')
      if (isKeyboard || isPointer){
        if (timer_held_down === false){
          timer_held_down = true
          timer_color = "red"
          setTimerColor("red")
          held_down_start = Date.now()
          is_timing = false
          start_timer = false
        }
        else{
          if(Date.now()-held_down_start >= 500)
            if (timer_held_down){
              timer_color = "green"
              setTimerColor("green")
              start_timer = true
            }
          }
        }
      }
    
    function handleUp(event){
      const isKeyboard = event.type.startsWith('key') && event.key === " "
      const isPointer = event.type.startsWith('pointer')
      if (isKeyboard || isPointer){
        if (timer_held_down === true){
          timer_held_down = false
          timer_color = "black"
          setTimerColor("black")
          if (start_timer){
            is_timing = true
            start_timer = false
            start_time = Date.now()
          }
        }
      }
    }

  useEffect(() => {
    const timer_runner = setInterval(() => {
      if (is_timing === true){
        time_on_timer = Date.now() - start_time
        time_ms = Math.floor((time_on_timer % 1000)/10)
        time_secs = Math.floor((time_on_timer/1000)%60)
        time_mins = Math.floor(time_on_timer/60000)
        timer_text = (time_mins > 0? (time_mins + ":"): "")+ time_secs + "." + time_ms
        setTimerText(timer_text)
      }
    }, 10);
    const check_click = setInterval(() => {
      if (isKeyDown) handleDown(key_event)
      else handleUp(key_event)
    }, 1)
  })
  addEventListener("keydown", event => {
    isKeyDown = true
    key_event = event
  })
  addEventListener("pointerdown", event => {
    isKeyDown = true
    key_event = event
  })
  addEventListener("keyup", event => {
    isKeyDown = false
    key_event = event
  })
  addEventListener("pointerup", event => {
    isKeyDown = false
    key_event = event
  })
  
  return (
    <main className="container" style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }}>
      <div id="touch-area"></div>
      <div id="timer-container">
        <h1 id="timer-time" style={
          {color: timerColor}
        }>{timerText}</h1>
      </div>
    </main>
  );
}

export default App;
