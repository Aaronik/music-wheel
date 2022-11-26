import './Legend.css'
import { Mode } from './types'

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
}

type Quality = 'major' | 'minor' | 'diminished'

export default function Legend({ sortedModes }: LegendProps) {
  const modeData = sortedModes.map(mode => {
    const str = (mode.split('').shift() as string).toUpperCase() + mode.slice(1, mode.length)
    return <td key={mode} className={"mode-td " + modeClassNames[mode]}>{str}</td>
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

    return <td key={numeral} className="numeral-td">{str}</td>
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
