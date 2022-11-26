import * as Tone from 'tone'
import { useState } from 'react'
import './App.css'
import './Colors.css'
import Footer from './Footer'
import Instructions from './Instructions'
import Wheel from './Wheel'
import WheelButtons from './WheelButtons'
import Legend from './Legend'
import { MODES, NOTES } from './constants'
import { Bit } from './types'
import { shift } from './util'

// Just stepping up, this will help us to build up our scale down the line
const CHROMATIC_SCALE: number[] = []
for (let i = 0; i < 100; i++) {
  CHROMATIC_SCALE.push(i)
}

// <div id='play-buttons'>
//   <button onClick={playScale}>🎧 Scale</button>
//   <button onClick={playTriad}>🎧 Triad</button>
//   <button onClick={playSeventh}>🎧 Seventh</button>
// </div>

const ionianScaleDegrees = [
  0, 2, 4, 5, 7, 9, 11, // first octave
  12, 14, 16, 17, 19, 21, 23 // second octave
] // B/c this is our starting place, all rotations are relative to the ionian mode

const getBoundedModeIndex = (index: number) => {
  const n = ionianScaleDegrees.length
  return (index % n) < 0 ? n + (index % n) : (index % n)
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
  const boundedModeIndex = getBoundedModeIndex(modeIndex)
  const modeRotationIndex = ionianScaleDegrees[boundedModeIndex]

  // Get a bounded index so we don't run out of notes from our NOTES array
  const boundedNoteIndex = (noteIndex % 12) < 0 ? 12 + (noteIndex % 12) : (noteIndex % 12)

  const applyBitmaskToChromaticNoteList = (noteList: string[], bitMask: Bit[]) => {
    return noteList.reduce((notes, note, index) => {
      if (bitMask[index]) { notes.push(note) }
      return notes
    }, [] as string[])
  }

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

  const generateNotesForModeIndex = (index: number) => {
    // Create a mask we can apply to our chromatic notes to get the ones we want
    // Starts with Ionian because that's our wheel's starting position
    let bitMask: Bit[] = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]

    // We shifted it once to get to the mode that's selected on the wheel,
    // now we shift again to get to the mode that's clicked on, which is at {index}
    // location _relative to the mode selected on the wheel_.
    const secondaryBoundedModeIndex = getBoundedModeIndex(modeIndex + index)
    const secondaryModeRotationIndex = ionianScaleDegrees[secondaryBoundedModeIndex]

    // Get our list of chromatic notes we want to work with, starting at the ROOT selected
    // on the wheel
    const chromaticStartIndex = (secondaryModeRotationIndex + boundedNoteIndex) % 24
    const chromaticNotes = NOTES.slice(chromaticStartIndex, chromaticStartIndex + 13)

    // Shift the bitMask for the second rotation
    shift(bitMask, secondaryModeRotationIndex)

    // We always want to end on the octave
    bitMask.push(1)

    // Apply the bitmask to the chromatic notes
    const notes = applyBitmaskToChromaticNoteList(chromaticNotes, bitMask)

    return notes
  }

  const playScale = (index: number) => {
    const notes = generateNotesForModeIndex(index)
    playNotes(notes)
  }

  const playTriad = (index: number) => {
    const notes = generateNotesForModeIndex(index)
    const toPlay = [notes[0], notes[2], notes[4]]
    playNotes(toPlay, true)
  }

  // all the modes starting on the selected one
  const sortedModes = Array.from(MODES)
  shift(sortedModes, boundedModeIndex)

  return (
    <div className="App">
      <WheelButtons {...{
        incrementNoteRotation,
        incrementModeRotation,
        decrementNoteRotation,
        decrementModeRotation,
        root: NOTES[boundedNoteIndex].slice(0, -1), // The note without the octave number
        mode: MODES[boundedModeIndex % 7]
      }} />
      <br />
      <Legend {...{ sortedModes, playScale, playTriad }} />
      <br />
      <Wheel {...{ noteIndex, modeRotationIndex }} />
      <br />
      <Footer onHelpClick={() => setInstructionsVisible(!isInstructionsVisible)} />
      <Instructions isOpen={isInstructionsVisible} close={() => setInstructionsVisible(false)} />
    </div>
  )
}

export default App
