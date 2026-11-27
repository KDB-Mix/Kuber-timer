import { useEffect, useRef, useState } from "react";
import "./App.css";
import { randomScrambleForEvent } from "cubing/scramble";
import "cubing/twisty";
import { createPortal } from "react-dom";

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
let scrambles = {
  "333": [],
  "333oh": [],
  "333bf": [],
  "222": [],
  "444": [],
  "444bf": [],
  "555": [],
  "555bf": [],
  "666": [],
  "777": [],
  "clock": [],
  "minx": [],
  "pyram": [],
  "skewb": [],
  "sq1": []
};
const EVENT_TO_PUZZLE = {
  "222": "2x2x2",
  "333": "3x3x3",
  "333oh": "3x3x3",
  "333bf": "3x3x3",
  "333fm": "3x3x3",
  "444": "4x4x4",
  "444bf": "4x4x4",
  "555": "5x5x5",
  "555bf": "5x5x5",
  "666": "6x6x6",
  "777": "7x7x7",
  "pyram": "pyraminx",
  "minx": "megaminx",
  "skewb": "skewb",
  "sq1": "square1",
  "clock": "clock",
};
let times = {"333": []} // Dict > Array > Dict


for (let cube = 0; cube < Object.keys(EVENT_TO_PUZZLE).length; cube++){
    if(!times[Object.keys(EVENT_TO_PUZZLE)[cube]]){
      times[Object.keys(EVENT_TO_PUZZLE)[cube]] = []
    }
  }


function App() {
  const [timerColor, setTimerColor] = useState(timer_color)
  const [timerText, setTimerText] = useState(timer_text)
  const [selectedCube, setSelectedCube] = useState(selected_cube)
  const [scramble, setScramble] = useState("")
  const [scramblesArray, setScramblesArray] = useState(scrambles)
  const selectedCubeRef = useRef("333")
  const panelsDisplay = useRef(panel_diaplay)
  const playerRef = useRef(null)
  const [timeInfo, setTimeInfo] = useState(null)


  selectedCubeRef.current = selectedCube;

  async function generateScramble(event) {
    const randomScramble = await randomScrambleForEvent(event)
    scrambles[event].push(randomScramble.toString())
    setScramblesArray(structuredClone(scrambles))
  }

  // Changes the cube visualization settings
  useEffect(() => {
    if (playerRef.current){
      playerRef.current.puzzle = EVENT_TO_PUZZLE[selectedCubeRef.current]
      playerRef.current.alg = scramble
      playerRef.current.visualization = "2D"
    }
  }, [selectedCube, scramble])

  // Sets the current scramble
  useEffect(() => {
    setScramble(scrambles[selectedCubeRef.current][0])
    if(scramblesArray[selectedCubeRef.current].length < 10){
      generateScramble(selectedCubeRef.current)
    }
  }, [selectedCube, scramblesArray])

  // For later to add agv calcs
  function handleNewTimes(time, event){
    if (!times[event]){
      times[event] = [{
        "time": time,
        "scramble": scrambles[selectedCubeRef.current][0],
      }]
    }else{
      times[event].push({
        "time": time,
        "scramble": scrambles[selectedCubeRef.current][0],
      })
    }
  }

  // To generate the time table
  function generateTable(){
    let rows = []
    rows.push(
      <tr scope="row" key="header" id="table-head">
        <td>solve</td>
        <td>time</td>
      </tr>
    )
    for (let index=0; index < times[selectedCubeRef.current].length; index++){
      const time = times[selectedCubeRef.current][index].time

      const time_ms = Math.floor((time % 1000)/10)
      const time_secs = Math.floor((time/1000)%60)
      const time_mins = Math.floor(time/60000)
      const timer_text = (time_mins > 0? (time_mins + ":"): "")+ time_secs + "." + (time_ms < 10? ("0"+time_ms):time_ms)
      rows.push(
        <tr key={index} onClick={() => {
          showTimeInfo(selectedCubeRef.current, index)
        }}>
          <td>{index+1}</td>
          <td>{timer_text}</td>
        </tr>
      )
    }

    return rows
  }

  // To show the time info with the option to delete
  function showTimeInfo(event, index){
    const time = times[event][index].time 
    const scramble = times[event][index].scramble
    const time_ms = Math.floor((time % 1000)/10)
    const time_secs = Math.floor((time/1000)%60)
    const time_mins = Math.floor(time/60000)
    const timer_text = (time_mins > 0? (time_mins + ":"): "")+ time_secs + "." + (time_ms < 10? ("0"+time_ms):time_ms)

    setTimeInfo({"time": timer_text, "scramble": scramble, "index": index})
  }


  // Handles click down
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
    
    // handles click up
    function handleUp(event){
      if(!event) return
      const isKeyboard = event.key != null && event.type.startsWith('key') && event.key === " "
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
              handleNewTimes(time_on_timer, selectedCubeRef.current)
              generateScramble(selectedCubeRef.current)
              scrambles[selectedCubeRef.current].shift()
              setScramblesArray(structuredClone(scrambles))
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
        timer_text = (time_mins > 0? (time_mins + ":"): "")+ time_secs + "." + (time_ms < 10? ("0"+time_ms):time_ms)
        setTimerText(timer_text)
      }
    }, 10);
    const check_click = setInterval(() => {
      if (isKeyDown) handleDown(key_event)
      else handleUp(key_event)
    }, 1)
    for (let cube = 0; cube < 3; cube++){
      const keys = Object.keys(scrambles)
      Promise.all(keys.map(event => generateScramble(event)))
    }
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
  }, [])
  setScramble
  return (
    <main className="container" style={{ width: '100vw', height: '100vh', boxSizing: 'border-box' }}>
      <div id="scramble" style={{
        display: panelsDisplay.current === "block"? "flex" : "none"
      }}>
        <select tabIndex={-1} name="Cube" id="cube-selector" value={selectedCube} onChange={e => {
          selected_cube = e.target.value
          setSelectedCube(selected_cube)
        }}>
          <option value="333">3x3x3</option>
          <option value="222">2x2x2</option>
          <option value="444">4x4x4</option>
          <option value="555">5x5x5</option>
          <option value="666">6x6x6</option>
          <option value="777">7x7x7</option>
          <option value="clock">Clock</option>
          <option value="minx">Megaminx</option>
          <option value="pyram">Pyraminx</option>
          <option value="skewb">Skewb</option>
          <option value="sq1">Square-1</option>
        </select>
        <p>{scramble}</p>
        <p style={{
          fontSize:"12px"
        }}>Hold space or hold the screen to start the timer</p>
      </div>
      <div id="scramble-view" style={{
        display: panelsDisplay.current
      }}>
        <twisty-player id="twisty-player"
          ref={playerRef}
          visualization="2D"
          background="none"
          control-panel="none" 
        />  
      </div>
      <div id="times" style={{
        display: panelsDisplay.current
      }}>
        <table>
          {generateTable()}
        </table>
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
      {
        timeInfo &&
        createPortal(
          <div id="overlay">
            <button onClick={() => {setTimeInfo(null)}}>X</button>
            <h1>{timeInfo.time}</h1>
          </div>
          , document.body
        )
      }
    </main>
  );
}

export default App;
