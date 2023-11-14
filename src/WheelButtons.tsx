import { rootNoteByModeDisplayMap } from "./constants"
import { Mode } from "./types"
import { capitalize } from "./util"
import "./WheelButtons.css"

type WheelButtonsProps = {
  incrementNoteRotation: () => void
  decrementNoteRotation: () => void
  incrementModeRotation: () => void
  decrementModeRotation: () => void
  root: string
  mode: Mode
}

/**
* @description So the root that's supplied is always one of either a flat or a sharp, however
* I originally wrote it into the constants. But with some scales you don't want
* to start them on one or the other because there'd be a whole bunch of double flats
* or double sharps. So this switches em all up.
*/
const getRootDisplay = (root: string, mode: Mode): string => {
  const predefinedDisplay = rootNoteByModeDisplayMap[root]?.[mode]

  if (predefinedDisplay) {
    return predefinedDisplay
  } else {
    return root
  }
}

export default function WheelButtons(props: WheelButtonsProps) {
  const rootDisplay = getRootDisplay(props.root, props.mode)

  return (
    <div id="wheel-buttons">
      <div className="wheel-button-group">
        <h4>Root</h4>
        <div className="rotate-buttons-row">
          <button className="arrow left" onClick={props.decrementNoteRotation}></button>
          <span className="rotate-buttons-indicator" style={{ minWidth: "2em" }}>{rootDisplay}</span>
          <button className="arrow right" onClick={props.incrementNoteRotation}></button>
        </div>
      </div>
      <div className="wheel-button-group">
        <h4>Mode</h4>
        <div className="rotate-buttons-row">
          <button className="arrow left" onClick={props.decrementModeRotation}></button>
          <span className="rotate-buttons-indicator" style={{ minWidth: "5em" }}>{capitalize(props.mode)}</span>
          <button className="arrow right" onClick={props.incrementModeRotation}></button>
        </div>
      </div>
    </div>
  )
}
