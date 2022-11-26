import './Legend.css'
import { Mode } from './types'
import { capitalize } from './util'

const modeQualities: { [mode in Mode]: Quality } = {
  'ionian': 'major',
  'dorian': 'minor',
  'phrygian': 'minor',
  'lydian': 'major',
  'mixolydian': 'major',
  'aeolian': 'minor',
  'locrian': 'diminished'
}

const modeClassNames: { [mode in Mode]: string } = {
  'ionian': 'red-underline',
  'dorian': 'orange-underline',
  'phrygian': 'yellow-underline',
  'lydian': 'green-underline',
  'mixolydian': 'blue-underline',
  'aeolian': 'indigo-underline',
  'locrian': 'violet-underline'
}

type LegendProps = {
  /**
  * @description These are what are displayed
  */
  sortedModes: Mode[]

  /**
  * @description Play the scale starting at {index} _relative to the first mode given in selectedModes_
  */
  playScale: (index: number) => void

  /**
  * @description Play the triad starting at {index} _relative to the first mode given in selectedModes_
  */
  playTriad: (index: number) => void
}

type Quality = 'major' | 'minor' | 'diminished'

export default function Legend({ playScale, playTriad, sortedModes }: LegendProps) {
  const modeData = sortedModes.map((mode, index) => {
    const str = capitalize(mode)
    return <td key={mode} className={"mode-td " + modeClassNames[mode]} onClick={() => playScale(index)}>{str}</td>
  })

  const numerals: string[] = ["i", "ii", "iii", "iv", "v", "vi", "vii"]

  const numeralData = numerals.map((numeral, index) => {
    const mode = sortedModes[index]
    let str: string

    switch (modeQualities[mode]) {
      case 'major': str = numeral.toUpperCase(); break;
      case 'minor': str = numeral; break;
      case 'diminished': str = numeral + '°'; break;
    }

    return <td key={numeral} className="numeral-td" onClick={() => playTriad(index)}>{str}</td>
  })

  const isWideScreen = window.innerWidth > window.innerHeight

  return (
    <div id="legend">
      <table className={isWideScreen ? 'large-font fixed-width' : 'small-font'}>
        <tbody>
          <tr>{numeralData}</tr>
          <tr>{modeData}</tr>
        </tbody>
      </table>
    </div>
  )
}
