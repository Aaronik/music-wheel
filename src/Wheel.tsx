import "./Wheel.scss"

type WheelProps = {
  keyIndex: number,
  modeRotationIndex: number
}

export default function Wheel({ keyIndex, modeRotationIndex }: WheelProps) {
  const noteWheelStyle = { transform: `rotate(${(0 - keyIndex) * 30}deg)` }
  const modeWheelStyle = { transform: `rotate(${(0 - modeRotationIndex) * 30}deg)` }

  return (
    <div id="wheel">
      <img id="quality-wheel" className="wheel" src="quality-wheel.png" />
      <img style={noteWheelStyle} id="note-wheel" className="wheel rotatable" src="note-wheel.png" />
      <img style={modeWheelStyle} id="mode-wheel" className="wheel rotatable" src="mode-wheel.png" />
    </div>
  )
}
