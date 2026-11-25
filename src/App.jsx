import { useEffect, useRef, useState } from "react";
import "./App.css";
import { randomScrambleForEvent } from "cubing/scramble";

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
let was_timing = false
let selected_cube = "333"
let panel_diaplay = "block"

function App() {
  const [timerColor, setTimerColor] = useState(timer_color)
  const [timerText, setTimerText] = useState(timer_text)
  const [selectedCube, setSelectedCube] = useState(selected_cube)
  const [scramble, setScramble] = useState("")
  const selectedCubeRef = useRef("333")
  const panelsDisplay = useRef(panel_diaplay)


  selectedCubeRef.current = selectedCube;

  async function generateScramble(event) {
    const randomScramble = await randomScrambleForEvent(event)
    setScramble(randomScramble.toString())
  }
  useEffect(() => {
    generateScramble(selectedCube)
  }, [selectedCube])



  function handleDown(event){
      if(event.cancalable) event.preventDefault()
      const isKeyboard = event.type.startsWith('key') && event.key === " "
      const isPointer = event.type.startsWith('pointer')
      if (isKeyboard || (isPointer && event.button != 2)){
        if (was_timing){
          timer_held_down = true
          is_timing = false
          start_timer = false
          timer_color = "black"
          setTimerColor("black")
          panel_diaplay = "block"
          panelsDisplay.current = panel_diaplay
        }
        else if (timer_held_down === false){
          timer_held_down = true
          timer_color = "red"
          setTimerColor("red")
          held_down_start = Date.now()
          is_timing = false
          start_timer = false
          panel_diaplay = "block"
          panelsDisplay.current = panel_diaplay
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
      if (isKeyboard || (isPointer && event.button != 2)){
        if (timer_held_down === true){
          timer_held_down = false
          timer_color = "black"
          setTimerColor("black")
          if (start_timer){
            is_timing = true
            start_timer = false
            start_time = Date.now()
            was_timing = true
            panel_diaplay = "none"
            panelsDisplay.current = panel_diaplay
          }
          else{
            if (was_timing){
              generateScramble(selectedCubeRef.current)
              was_timing = false
            }
            timer_held_down = false
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
  }, [])
  addEventListener("keydown", event => {
    event.preventDefault()
    isKeyDown = true
    key_event = event
  })
  addEventListener("keyup", event => {
    event.preventDefault()
    isKeyDown = false
    key_event = event
  })
  setScramble
  return (
    <main className="container" style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }}>
      <div id="scramble" style={{
        display: panelsDisplay.current
      }}>
        <select tabIndex={-1} name="Cube" id="cube-selector" value={selectedCube} onChange={e => {
          selected_cube = e.target.value
          setSelectedCube(selected_cube)
        }}>
          <option value="333">3x3x3</option>
          <option value="333oh">3x3x3 oh</option>
          <option value="333bf">3x3x3 bld</option>
          <option value="222">2x2x2</option>
          <option value="444">4x4x4</option>
          <option value="444bf">4x4x4 bld</option>
          <option value="555">5x5x5</option>
          <option value="555bf">5x5x5 bld</option>
          <option value="666">6x6x6</option>
          <option value="777">7x7x7</option>
          <option value="clock">Clock</option>
          <option value="minx">Megaminx</option>
          <option value="pyram">Pyraminx</option>
          <option value="skewb">Skewb</option>
          <option value="sq1">Square-1</option>
        </select>
        <p>{scramble}</p>
      </div>
      <div id="timer-container" onPointerUp={event => {
        isKeyDown = false
        key_event = event
      }}
      onPointerDown={event => {
        isKeyDown = true
        key_event = event
      }}>
        <h1 id="timer-time" style={
          {color: timerColor}
        }>{timerText}</h1>
      </div>
    </main>
  );
}

export default App;
