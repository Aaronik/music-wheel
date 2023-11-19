import * as Tone from 'tone'
import { useState } from 'react'
import './App.css'
import './Colors.css'
import Footer from './Footer'
import Instructions from './Instructions'
import Wheel from './Wheel'
import ImageWheel from './ImageWheel'
import WheelButtons from './WheelButtons'
import Legend from './Legend'
import { MODES, Note, NOTES } from './constants'
import { Bit } from './types'
import { shift } from './util'

// Just stepping up, this will help us to build up our scale down the line
const CHROMATIC_SCALE: number[] = []
for (let i = 0; i < 100; i++) {
  CHROMATIC_SCALE.push(i)
}

// These are the numerical scale degrees of each mode
// While these can probably be generated, the math is throwing me for a loop, so for
// simplicity's sake, I'm going to hard code these.
// If this needs to be algorithmically generated, It can be done by first
// shifting the ionian mode bitmask, then it's about putting a zero where there's a zero
// and the index number where there's a 1.
const modeScaleDegrees = [
  [0, 2, 4, 5, 7, 9, 11], // 0, ionian
  [0, 2, 3, 5, 7, 9, 10], // 1, dorian
  [0, 1, 3, 5, 7, 8, 10], // 2, phrygian
  [0, 2, 4, 6, 7, 9, 11], // 3, lydian
  [0, 2, 4, 5, 7, 9, 10], // 4, mixolydian
  [0, 2, 3, 5, 7, 8, 10], // 5, aeolian
  [0, 1, 3, 5, 6, 8, 10], // 6, locrian
]

/**
* @description Get a number with which you can index into the MODES array.
* This is only difficult because it can take negative numbers, otherwise it'd
* be as easy as a single %.
*/
const getBoundedModeIndex = (index: number, n: 7 | 15) => {
  return (index % n) < 0 ? n + (index % n) : (index % n)
}

let synth: Tone.PolySynth

function App() {

  const [keyRotationIndex, setKeyRotationIndex] = useState(0)
  const [modeIndex, setModeIndex] = useState(0)
  const [isInstructionsVisible, setInstructionsVisible] = useState(false)
  const [activeNotes, setActiveNotes] = useState<{ [note: string]: number }>({})

  const incrementNoteRotation = () => setKeyRotationIndex(keyRotationIndex + 1)
  const decrementNoteRotation = () => setKeyRotationIndex(keyRotationIndex - 1)
  const incrementModeRotation = () => setModeIndex(modeIndex + 1)
  const decrementModeRotation = () => setModeIndex(modeIndex - 1)

  // See, if we just did mode index like note index, the modes would rotate by their 30 degrees
  // and look fine, but 5 times, the root note _would not be on a note_, and that's semantically
  // undefined. So by having this secondary index, we can skip indices that are undesirable.
  const boundedWheelModeIndex = getBoundedModeIndex(modeIndex, 7)
  const wheelModeRotationIndex = modeScaleDegrees[0][boundedWheelModeIndex]

  // Get a bounded index so we don't run out of notes from our NOTES array
  const boundedKeyIndex = (keyRotationIndex % 12) < 0 ? 12 + (keyRotationIndex % 12) : (keyRotationIndex % 12)

  const applyBitmaskToChromaticNoteList = (noteList: Note[], bitMask: Bit[]): Note[] => {
    return noteList.reduce((notes, note, index) => {
      if (bitMask[index]) { notes.push(note) }
      return notes
    }, [] as Note[])
  }

  console.log("(from App) activeNotes:", activeNotes)

  const addToActiveNotes = (notes: Note[]) => {
    setActiveNotes(prevNotes => {
      const newNotes = { ...prevNotes };
      notes.forEach(note => {
        newNotes[note] = (newNotes[note] || 0) + 1;
      });
      return newNotes;
    })
  };

  const removeFromAciveNotes = (notes: Note[]) => {
    setActiveNotes(prevNotes => {
      const newNotes = { ...prevNotes };
      notes.forEach(note => {
        if (newNotes[note] > 1) {
          newNotes[note] -= 1;
        } else {
          delete newNotes[note];
        }
      });
      return newNotes;
    })
  }

  const playNotes = async (toPlay: Note[], shouldPlayTogether = false) => {
      if (!synth) {
        await Tone.start()
        synth = new Tone.PolySynth(Tone.Synth).toDestination()
      }

      if (shouldPlayTogether) {
        synth.triggerAttackRelease(toPlay, "2n", Tone.now())
        addToActiveNotes(toPlay);
        setTimeout(() => removeFromAciveNotes(toPlay), 1000);
      } else {
        toPlay.forEach((note, index) => {
          synth.triggerAttackRelease(note, "8n", Tone.now() + (index / 3))
          setTimeout(() => addToActiveNotes([note]), (index / 3) * 1000);
          setTimeout(() => removeFromAciveNotes([note]), ((index + 1) / 3) * 1000);
        })
      }
    }

    /**
    * @description
    *
    * @param {number} legendModeIndex This is the index within the legend row. So if you play the 2nd
    * one from the left, this will be 1. It's decoupled from the mode that's selected on
    * the mode wheel.
    */
    const generateNotesToPlay = (legendModeIndex: number): Note[] => {

      // Create a mask we can apply to our chromatic notes to get the ones we want
      // Starts with Ionian because that's our wheel's starting position
      let bitMask: Bit[] = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]

      // How many hops down the routation indices are we going to go
      const totalModeIndex = legendModeIndex + boundedWheelModeIndex

      // The scale degrees for the mode the wheel currently has selected
      const wheelModeScaleDegrees = modeScaleDegrees[boundedWheelModeIndex]

      const legendRotationIndex = wheelModeScaleDegrees[legendModeIndex]
      const boundedTotalModeIndex = getBoundedModeIndex(totalModeIndex, 7)
      const totalRotationIndex = modeScaleDegrees[0][boundedTotalModeIndex]

      // Get our list of chromatic notes we want to work with, starting at the ROOT selected
      // on the wheel.
      const chromaticStartIndex = (legendRotationIndex + boundedKeyIndex) % 24
      const chromaticNotes = NOTES.slice(chromaticStartIndex, chromaticStartIndex + 13)

      // Shift the bitMask for the second rotation
      shift(bitMask, totalRotationIndex)

      // We always want to end on the octave
      bitMask.push(1)

      // Apply the bitmask to the chromatic notes
      const notes = applyBitmaskToChromaticNoteList(chromaticNotes, bitMask)

      return notes
    }

    const playScale = (index: number) => {
      const notes = generateNotesToPlay(index)
      playNotes(notes)
    }

    const playTriad = (index: number) => {
      const notes = generateNotesToPlay(index)
      const toPlay = [notes[0], notes[2], notes[4]]
      playNotes(toPlay, true)
    }

    // all the modes starting on the selected one
    const sortedModes = Array.from(MODES)
    shift(sortedModes, boundedWheelModeIndex)

    const onNewWheelPage = window.location.search.includes('new-wheel');

    return (
      <div className="App">
        <WheelButtons {...{
          incrementNoteRotation,
          incrementModeRotation,
          decrementNoteRotation,
          decrementModeRotation,
          root: NOTES[boundedKeyIndex].slice(0, -1), // The note without the octave number
          mode: MODES[boundedWheelModeIndex % 7]
        }} />
        <br />
        <Legend {...{ sortedModes, playScale, playTriad }} />
        <br />
        {
          onNewWheelPage
            ? <Wheel {...{ keyRotationIndex, modeRotationIndex: wheelModeRotationIndex, activeNotes: Object.keys(activeNotes) as Note[] }} />
            : <ImageWheel {...{ keyIndex: keyRotationIndex, modeRotationIndex: wheelModeRotationIndex }} />
        }
        <br />
        <Footer onHelpClick={() => setInstructionsVisible(!isInstructionsVisible)} />
        <Instructions isOpen={isInstructionsVisible} close={() => setInstructionsVisible(false)} />
      </div>
    )
  }

  export default App

