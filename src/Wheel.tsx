import './Wheel.css'

type WheelProps = {
  noteIndex: number,
  modeRotationIndex: number
}

export default function Wheel({ noteIndex, modeRotationIndex }: WheelProps) {
  const noteWheelStyle = { transform: `rotate(${(0 - noteIndex) * 30}deg)` }
  const modeWheelStyle = { transform: `rotate(${(0 - modeRotationIndex) * 30}deg)` }

  return (
    <div id='wheel-container'>
      <img id='quality-wheel' className='wheel' src='quality-wheel.png' />
      <img style={noteWheelStyle} id='note-wheel' className='wheel rotatable' src='note-wheel.png' />
      <img style={modeWheelStyle} id='mode-wheel' className='wheel rotatable' src='mode-wheel.png' />
    </div>
  )
}
