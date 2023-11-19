import { useRef, useEffect } from 'react';
import "./Wheel.scss"
import { Note, NOTES } from './constants'

type WheelProps = {
  keyRotationIndex: number
  modeRotationIndex: number
  activeNotes: Note[] // activeNote is now an array of Notes
}

export default function Wheel({ keyRotationIndex, modeRotationIndex, activeNotes }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 : 450;
  // const textSize = window.innerWidth < window.innerHeight ? 1.3 : 2;
  const textSize = radius / 225;
  const numSlices = 12;

  const _opts: Omit<Opts, 'canvas' | 'ctx'> = {
    radius, textSize, activeNotes, numSlices,
    keyRotationIndex: keyRotationIndex % numSlices,
    modeRotationIndex: modeRotationIndex % numSlices,
    ringSpacings: [radius / 1.7, radius / 1.2, radius / 1.1],
  };

  const sliceAngle = 2 * Math.PI / _opts.numSlices;
  const halfSliceAngle = sliceAngle / 2;
  const sections: Section[] = [];

  for (let slice = 0; slice < _opts.numSlices; slice++) {
    for (let ring = 0; ring < _opts.ringSpacings.length; ring++) {
      const sectionType = ring % 3 === 0 ? 'wedge' : ring % 3 === 1 ? 'note' : 'quality';
      const text = ring == 2 ? QUALITIES[slice % _opts.numSlices] :
        ring == 1 ? DISPLAY_NOTES[slice % _opts.numSlices] : '';

      let color: string;
      switch (slice) {
        case 0: color = 'red'; break;
        case 2: color = 'orange'; break;
        case 4: color = 'yellow'; break;
        case 5: color = 'green'; break;
        case 7: color = 'teal'; break;
        case 9: color = 'purple'; break;
        case 11: color = 'magenta'; break;
        default: color = 'black';
      }

      sections.push({
        ring, slice, text, color,
        startAngle: slice * sliceAngle - halfSliceAngle - Math.PI / 2,
        endAngle: (slice + 1) * sliceAngle - halfSliceAngle - Math.PI / 2,
        startRadius: ring === 0 ? 0 : _opts.ringSpacings[ring - 1],
        endRadius: _opts.ringSpacings[ring],
        type: sectionType,
        note: NOTES[slice]
      });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const opts: Opts = Object.assign(_opts, { canvas, ctx, });

    const boundMouseMoveHandler = (event: MouseEvent) => {
      mouseMoveHandler(sections, opts, drawWheel, event);
    };

    canvas.addEventListener('mousemove', boundMouseMoveHandler);

    drawWheel(sections, opts);

    // Cleanup event listener
    return () => {
      canvas.removeEventListener('mousemove', boundMouseMoveHandler);
    };
  }, [keyRotationIndex, modeRotationIndex, activeNotes]); // activeNote is now activeNotes

  return (
    <div id="new-wheel" className="wheel-container">
      <canvas ref={canvasRef} width={radius * 2} height={radius * 2}></canvas>
    </div>
  );
}

// Draw the wheel on the canvas
function drawWheel(sections: Section[], opts: Opts) {
  const { ctx, radius, activeNotes } = opts; // activeNote is now activeNotes

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw each section based on its properties, with rotation offset applied only to 'note' sections
  sections.forEach((section, index) => {
    // Calculate the rotation offset based on the keyRotationIndex for 'note' sections and modeRotationIndex for 'wedge' sections
    const rotationOffset = section.type === 'note' ? -2 * Math.PI * opts.keyRotationIndex / opts.numSlices :
      section.type === 'wedge' ? -2 * Math.PI * opts.modeRotationIndex / opts.numSlices : 0;

    // Adjust the start and end angles by the rotation offset if applicable
    const { startRadius, endRadius } = section;
    const startAngle = section.startAngle + rotationOffset;
    const endAngle = section.endAngle + rotationOffset;

    // Section outline
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(radius, radius, endRadius, startAngle, endAngle); // Draw the outer arc
    ctx.lineTo(radius + startRadius * Math.cos(endAngle), radius + startRadius * Math.sin(endAngle)); // Line to the inner arc
    ctx.arc(radius, radius, startRadius, endAngle, startAngle, true); // Draw the inner arc backwards
    ctx.lineTo(radius + endRadius * Math.cos(startAngle), radius + endRadius * Math.sin(startAngle)); // Line back to the start
    ctx.closePath();
    ctx.restore();

    // Section fill
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fill();

    // Quality outline
    if (section.ring === opts.ringSpacings.length - 1) {
      ctx.strokeStyle = 'white'; // Set the stroke color to white
      ctx.lineWidth = 2; // Set the stroke thickness to 2 pixels
      ctx.stroke(); // Add a stroke to the section
    }
    ctx.restore();

    // Glow
    const isActiveNote = section.type === 'note' && activeNotes.some(activeNote => activeNote.replace(/\d/g, '') === section.note.replace(/\d/g, ''));
    if (isActiveNote) {
      const wedgeIndex = (((section.slice - opts.keyRotationIndex) + opts.modeRotationIndex) % opts.numSlices + opts.numSlices) % opts.numSlices;
      const wedge = sections.filter(s => s.type === 'wedge')[wedgeIndex];
      const wedgeColor = wedge?.color || '';
      ctx.save(); // Save the current state
      ctx.shadowBlur = 30;
      ctx.shadowColor = wedgeColor;
      ctx.fillStyle = wedgeColor;
      ctx.fill();
      ctx.restore(); // Restore the state
    }

    // Text ----- BEGIN -------
    ctx.save();
    // TODO Is it better with text size bigger for single char notes vs 4 char notes?
    const textSize = opts.textSize * (section.type === 'note' && section.text.length === 1 ? 2 : 1);
    const textMidpointAngle = (startAngle + endAngle) / 2;
    const textMidpointRadius = (startRadius + endRadius) / 2;
    const textX = radius + textMidpointRadius * Math.cos(textMidpointAngle);
    const textY = radius + textMidpointRadius * Math.sin(textMidpointAngle);
    const paddingTop = section.type === 'note' && section.text.length === 1 ? radius / 23 : radius / 45;

    ctx.font = `${textSize}rem Arial`;
    ctx.fillStyle = "white";
    const textWidth = ctx.measureText(section.text).width; // Must be below font declaration

    ctx.translate(textX, textY); // Translate to the text position
    ctx.rotate(textMidpointAngle + Math.PI / 2); // Rotate the context to align the text
    ctx.fillText(section.text, -textWidth / 2, opts.textSize / 2 + paddingTop); // Adjust for centered text with padding

    // Draw the white circle around note names
    if (section.type === 'note') {
      const circleRadius = opts.textSize * 25; // Circle radius based on text size
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, circleRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'white'; // Set the circle color to white
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
    // Text ----- END -------

    // Colored Lines
    if (section.type === 'wedge') {
      if (section.color) {
        const startAngle = section.startAngle - (2 * Math.PI * opts.modeRotationIndex / opts.numSlices);
        const endRadius = section.endRadius;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(radius, radius); // Move to the center of the wheel
        ctx.lineTo(radius + endRadius * Math.cos(startAngle + Math.PI / opts.numSlices), radius + endRadius * Math.sin(startAngle + Math.PI / opts.numSlices)); // Line to the 'wedge' section
        ctx.strokeStyle = section.color;
        ctx.lineWidth = 5; // Set the line thickness
        ctx.stroke(); // Draw the line
        ctx.restore();
      }
    }
  });
}

// Event listener for mouse move
const mouseMoveHandler = (
  sections: Section[],
  opts: Opts,
  drawWheel: Function,
  event: MouseEvent,
) => {
  const { canvas } = opts;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Redraw the wheel with the current mouse position
  drawWheel(sections, opts, mouseX, mouseY);
};

const QUALITIES = [
  'Root', 'm2', 'M2', 'm3', 'M3', '4', 'Tritone', '5', 'm6', 'M6', 'm7', 'M7',
]

const DISPLAY_NOTES = [
  'C', 'C#Db', 'D', 'D#Eb', 'E', 'F', 'F#Gb', 'G', 'G#Ab', 'A', 'A#Bb', 'B'
]

type Opts = {
  numSlices: number;
  radius: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ringSpacings: number[];
  keyRotationIndex: number;
  modeRotationIndex: number;
  textSize: number;
  activeNotes: Note[];
};

type Section = {
  startAngle: number;
  endAngle: number;
  startRadius: number;
  endRadius: number;
  ring: number;
  slice: number;
  type: 'quality' | 'note' | 'wedge';
  text: string;
  note: Note;
  color: string;
}

