import * as Tone from 'tone'
import { useState } from 'react'
import './App.css'

const NOTES = [
  'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'F#4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4',
  'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'F#5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5',
  'C6'
]

// TODO
// * modal background
// * Rotating notes down leaves undefinedes in scale

function App() {

  const [noteIndex, setNoteIndex] = useState(0)
  const [modeIndex, setModeIndex] = useState(0)
  const [isInstructionsVisible, setInstructionsVisible] = useState(false)

  const incrementNoteRotation = () => setNoteIndex(noteIndex + 1)
  const decrementNoteRotation = () => setNoteIndex(noteIndex - 1)
  const incrementModeRotation = () => setModeIndex(modeIndex + 1)
  const decrementModeRotation = () => setModeIndex(modeIndex - 1)

  // Basically whole step/half step
  const scaleSteps = [2, 2, 1, 2, 2, 2, 1, 2] // Starting on Ionian
  const chromaticScale = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  // Translate to the correct scaleSteps for the mode we're in
  for (let i = 0; i < modeIndex; i++) { // TODO Maybe change modeIndex to modeRotationIndex
    scaleSteps.push(scaleSteps.shift() as number)
  }

  // Generate the scale degrees we're concerned with by applying scaleSteps to chromaticScale
  const scaleDegrees: number[] = []
  let currentPosition = 0
  for (let step of scaleSteps) {
    scaleDegrees.push(chromaticScale[currentPosition])
    currentPosition += step
  }

  // See, if we just did mode index like note index, the modes would rotate by their 30 degrees
  // and look fine, but 5 times, the root note _would not be on a note_, and that's semantically
  // undefined. So by having this secondary index, we can skip indices that are undesirable.
  const ionianScaleDegrees = [0, 2, 4, 5, 7, 9, 11] // B/c this is our starting place, all rotations are relative to the ionian mode
  const modeRotationIndex = ionianScaleDegrees[modeIndex % ionianScaleDegrees.length]

  const noteRotationStyle = { transform: `rotate(${(0 - noteIndex) * 30}deg)` }
  const modeRotationStyle = { transform: `rotate(${(0 - modeRotationIndex) * 30}deg)` }

  // const rootNote = NOTES[noteIndex % 12]
  const notes: string[] = []
  for (const i of scaleDegrees) {
    notes.push(NOTES[i + noteIndex])
  }
  console.log('scale: ', notes)

  const playNotes = async (toPlay: string[], shouldPlayTogether = false) => {
    await Tone.start()

    const synth = new Tone.PolySynth(Tone.Synth).toDestination()

    toPlay.forEach((note, index) => {
      synth.triggerAttackRelease(note, "8n", Tone.now() + (index / 3))
    })

    if (shouldPlayTogether) {
      synth.triggerAttackRelease(toPlay, "4n", Tone.now() + ((toPlay.length + 0.5) / 3))
    }
  }

  const playScale = () => {
    playNotes(notes)
  }

  const playTriad = () => {
    const toPlay = [notes[0], notes[2], notes[4]]
    playNotes(toPlay, true)
  }

  const playSeventh = () => {
    const toPlay = [notes[0], notes[2], notes[4], notes[6]]
    playNotes(toPlay, true)
  }

  let instructionsClassName = 'modal'
  if (!isInstructionsVisible) instructionsClassName += ' hidden'


  return (
    <div className="App">
      <div id='legend-container'><img src='legend.png' width={'80%'} /></div>
      <div id='instructions' onClick={() => setInstructionsVisible(false)} className={instructionsClassName}><img src='instructions.png' /></div>
      <div id='help-buttons'>
        <h2 onClick={() => setInstructionsVisible(!isInstructionsVisible)}>?</h2>
      </div>
      <div id='wheel-buttons-container'>
        <div id='note-wheel-buttons' className='rotate-buttons'>
          <h2>Select Key</h2>
          <div>
            <button onClick={incrementNoteRotation}>⇧</button>
            <button onClick={decrementNoteRotation}>⇩</button>
          </div>
        </div>
        <div id='mode-wheel-buttons' className='rotate-buttons'>
          <h2>Select Mode</h2>
          <div>
            <button onClick={incrementModeRotation}>⇧</button>
            <button onClick={decrementModeRotation}>⇩</button>
          </div>
        </div>
      </div>
      <div id='play-buttons-container'>
        <button onClick={playScale}>🎧 Scale</button>
        <button onClick={playTriad}>🎧 Triad</button>
        <button onClick={playSeventh}>🎧 Seventh</button>
      </div>
      <div id='wheel-container'>
        <img id='quality-wheel' className='wheel' src='quality-wheel.png' />
        <img style={noteRotationStyle} id='note-wheel' className='wheel rotatable' src='note-wheel.png' />
        <img style={modeRotationStyle} id='mode-wheel' className='wheel rotatable' src='mode-wheel.png' />
      </div>
    </div>
  )
}

export default App
