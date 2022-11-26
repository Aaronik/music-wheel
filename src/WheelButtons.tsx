import "./WheelButtons.css"

type WheelButtonsProps = {
  incrementNoteRotation: () => void
  decrementNoteRotation: () => void
  incrementModeRotation: () => void
  decrementModeRotation: () => void
  root: string
  mode: string
}

export default function WheelButtons(props: WheelButtonsProps) {
  return (
    <div id="wheel-buttons">
      <div className="wheel-button-group" style={{ marginRight: "10px" }}>
        <h4>Root</h4>
        <div className="rotate-buttons-row">
          <button className="arrow" onClick={props.decrementNoteRotation}>⬅</button>
          <span className="rotate-buttons-indicator" style={{ minWidth: "2em" }}>{props.root}</span>
          <button className="arrow" onClick={props.incrementNoteRotation}>➡</button>
        </div>
      </div>
      <div className="wheel-button-group">
        <h4>Mode</h4>
        <div className="rotate-buttons-row">
          <button className="arrow" onClick={props.decrementModeRotation}>⬅</button>
          <span className="rotate-buttons-indicator" style={{ minWidth: "5em" }}>{props.mode}</span>
          <button className="arrow" onClick={props.incrementModeRotation}>➡</button>
        </div>
      </div>
    </div>
  )
}
