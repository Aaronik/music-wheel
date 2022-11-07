import { useState } from 'react'
import './App.css'

function App() {

  const [noteRotation, setNoteRotation] = useState(0)
  const [lineRotation, setLineRotation] = useState(0)

  const noteRotationStyle = { transform: `rotate(${noteRotation}deg)` }
  const lineRotationStyle = { transform: `rotate(${lineRotation}deg)` }

  console.log(noteRotationStyle, lineRotationStyle)

  const incrementNoteRotation = () => setNoteRotation(noteRotation + 30)
  const decrementNoteRotation = () => setNoteRotation(noteRotation - 30)
  const incrementLineRotation = () => setLineRotation(lineRotation + 30)
  const decrementLineRotation = () => setLineRotation(lineRotation - 30)

  return (
    <div className="App">
      <div className='hidden'><img src='legend.png' /></div>
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
      <div className='hidden'><img src='instructions.png' /></div>
    </div>
  )
}

export default App
