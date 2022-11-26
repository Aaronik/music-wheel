import { MODES, NOTES } from './constants'

export type Bit = 0 | 1

export type Mode = typeof MODES[number]
export type Root = typeof NOTES[number]

