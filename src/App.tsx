import * as Tone from 'tone'
import { useState } from 'react'
import './App.css'

const NOTES = [
  'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'F#5', 'G5', 'Ab5',
  'A5', 'Bb5', 'B5', 'C6', 'Db6', 'D6', 'Eb6', 'E6', 'F6', 'F#6', 'G6', 'Ab6',
  'A6'
]

const synth = new Tone.Synth().toDestination()

function App() {

  const [noteRotation, setNoteRotation] = useState(0)
  const [lineRotation, setLineRotation] = useState(0)
  const [isLegendVisible, setLegendVisible] = useState(false)
  const [isInstructionsVisible, setInstructionsVisible] = useState(false)

  const noteRotationStyle = { transform: `rotate(${noteRotation}deg)` }
  const lineRotationStyle = { transform: `rotate(${lineRotation}deg)` }

  const incrementNoteRotation = () => setNoteRotation(noteRotation + 30)
  const decrementNoteRotation = () => setNoteRotation(noteRotation - 30)
  const incrementLineRotation = () => setLineRotation(lineRotation + 30)
  const decrementLineRotation = () => setLineRotation(lineRotation - 30)

  // const play = () => {
  //   const notes =
  //   notes.forEach((note, index) => {
  //     synth.triggerAttackRelease(note, "8n", Tone.now() + (index / 3))
  //   })
  // }

  let legendClassName = 'modal'
  if (!isLegendVisible) legendClassName += ' hidden'
  let instructionsClassName = 'modal'
  if (!isInstructionsVisible) instructionsClassName += ' hidden'


  return (
    <div className="App">
      <div id='legend' onClick={() => setLegendVisible(false)} className={legendClassName}><img src='legend.png' /></div>
      <div id='instructions' onClick={() => setInstructionsVisible(false)} className={instructionsClassName}><img src='instructions.png' /></div>
      <div id='help-buttons'>
        <h2 onClick={() => setLegendVisible(!isLegendVisible)}>Show Legend</h2>
        <h2 onClick={() => setInstructionsVisible(!isInstructionsVisible)}>Show Instructions</h2>
      </div>
      <div id='note-wheel-buttons' className='rotate-buttons'>
        <h2>Note Rotation</h2>
        <div>
          <div onClick={incrementNoteRotation}>⇧</div>
          <div onClick={decrementNoteRotation}>⇩</div>
        </div>
      </div>
      <div id='line-wheel-buttons' className='rotate-buttons'>
        <h2>Color Rotation</h2>
        <div>
          <div onClick={incrementLineRotation}>⇧</div>
          <div onClick={decrementLineRotation}>⇩</div>
        </div>
      </div>
      <div id='wheel-container'>
        <img id='quality-wheel' className='overlapped' src='quality-wheel.png' />
        <img style={noteRotationStyle} id='note-wheel' className='overlapped rotatable' src='note-wheel.png' />
        <img style={lineRotationStyle} id='line-wheel' className='overlapped rotatable' src='line-wheel.png' />
      </div>
    </div>
  )
}

export default App
