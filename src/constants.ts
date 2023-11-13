import { Mode, Root } from "./types"

export const MODES = [
  'ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian',
] as const

export const NOTES = [
  'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'F#4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4',
  'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'F#5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5',
  'C6', 'Db6', 'D6', 'Eb6', 'E6', 'F6', 'F#6', 'G6', 'Ab6', 'A6', 'Bb6', 'B6',
  'C7',
]

export const rootNoteByModeDisplayMap: { [root: string]: { [mode in Mode]: string } } = {
  'Db': {
    'ionian': 'Db',
    'dorian': 'C#',
    'phrygian': 'C#',
    'lydian': 'Db',
    'mixolydian': 'C#/Db',
    'aeolian': 'C#',
    'locrian': 'C#'
  },
  'Eb': {
    'ionian': 'Eb',
    'dorian': 'Eb',
    'phrygian': 'D#',
    'lydian': 'Eb',
    'mixolydian': 'Eb',
    'aeolian': 'D#/Eb',
    'locrian': 'D#'
  },
  'Gb': {
    'ionian': 'F#/Gb',
    'dorian': 'F#',
    'phrygian': 'F#',
    'lydian': 'Gb',
    'mixolydian': 'F#',
    'aeolian': 'F#',
    'locrian': 'F#'
  },
  'Ab': {
    'ionian': 'Ab',
    'dorian': 'G#/Ab',
    'phrygian': 'G#',
    'lydian': 'Ab',
    'mixolydian': 'Ab',
    'aeolian': 'G#',
    'locrian': 'G#'
  },
  'Bb': {
    'ionian': 'Bb',
    'dorian': 'Bb',
    'phrygian': 'A#/Bb',
    'lydian': 'Bb',
    'mixolydian': 'Bb',
    'aeolian': 'Bb',
    'locrian': 'A#'
  },
}
