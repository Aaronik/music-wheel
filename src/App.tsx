import * as Tone from 'tone'
import { useState } from 'react'
import './App.css'
import './Colors.css'
import Footer from './Footer'
import Instructions from './Instructions'
import Wheel from './Wheel'
import WheelButtons from './WheelButtons'
import Legend from './Legend'

const NOTES = [
  'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'F#4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4',
  'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'F#5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5',
  'C6'
]

const MODES = [
  'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'
]

// Just stepping up, this will help us to build up our scale down the line
const CHROMATIC_SCALE: number[] = []
for (let i = 0; i < 100; i++) {
  CHROMATIC_SCALE.push(i)
}

function App() {

  const [noteIndex, setNoteIndex] = useState(0)
  const [modeIndex, setModeIndex] = useState(0)
  const [isInstructionsVisible, setInstructionsVisible] = useState(false)

  const incrementNoteRotation = () => setNoteIndex(noteIndex + 1)
  const decrementNoteRotation = () => setNoteIndex(noteIndex - 1)
  const incrementModeRotation = () => setModeIndex(modeIndex + 1)
  const decrementModeRotation = () => setModeIndex(modeIndex - 1)

  // See, if we just did mode index like note index, the modes would rotate by their 30 degrees
  // and look fine, but 5 times, the root note _would not be on a note_, and that's semantically
  // undefined. So by having this secondary index, we can skip indices that are undesirable.
  const ionianScaleDegrees = [0, 2, 4, 5, 7, 9, 11] // B/c this is our starting place, all rotations are relative to the ionian mode
  const boundedModeIndex = (modeIndex % 7) < 0 ? 7 + (modeIndex % 7) : (modeIndex % 7)
  const modeRotationIndex = ionianScaleDegrees[boundedModeIndex]

  // Create a mask we can apply to our notes to get the ones we want
  // Starts with Ionian because that's our wheel's starting position
  const modeMask = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]

  // Translate our mode mask so it's the right mode
  for (let i = 0; i < modeRotationIndex; i++) {
    modeMask.push(modeMask.shift() as number)
  }

  // We always want to play the root note at the end
  modeMask.push(1)

  // Get a bounded index so we don't run out of notes from our NOTES array
  const boundedNoteIndex = (noteIndex % 12) < 0 ? 12 + (noteIndex % 12) : (noteIndex % 12)

  // Get all of the notes starting at our root note
  const chromaticNotes = NOTES.slice(boundedNoteIndex, boundedNoteIndex + 13)
  const notes = chromaticNotes.reduce((notes, note, index) => {
    const bitMask = modeMask[index]
    if (bitMask) { notes.push(note) }
    return notes
  }, [] as string[])

  console.log('scale: ', notes)

  const playNotes = async (toPlay: string[], shouldPlayTogetherAfter = false) => {
    await Tone.start()
    const synth = new Tone.PolySynth(Tone.Synth).toDestination()
    toPlay.forEach((note, index) => {
      synth.triggerAttackRelease(note, "8n", Tone.now() + (index / 3))
    })
    if (shouldPlayTogetherAfter) {
      synth.triggerAttackRelease(toPlay, "2n", Tone.now() + ((toPlay.length + 0.5) / 3))
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

  return (
    <div className="App">
      <WheelButtons {...{
        incrementNoteRotation,
        incrementModeRotation,
        decrementNoteRotation,
        decrementModeRotation,
        root: NOTES[boundedNoteIndex].slice(0, -1),
        mode: MODES[boundedModeIndex]
      }} />
      <Legend />
      <div id='play-buttons'>
        <button onClick={playScale}>🎧 Scale</button>
        <button onClick={playTriad}>🎧 Triad</button>
        <button onClick={playSeventh}>🎧 Seventh</button>
      </div>
      <Wheel {...{noteIndex, modeRotationIndex}} />
      <Footer onHelpClick={() => setInstructionsVisible(!isInstructionsVisible)}/>
      <Instructions isOpen={isInstructionsVisible} close={() => setInstructionsVisible(false)} />
    </div>
  )
}

export default App
