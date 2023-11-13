import { useRef, useEffect } from 'react';
import "./Wheel.scss"

type WheelProps = {
  keyRotationIndex: number,
  modeRotationIndex: number
}

export default function Wheel({ keyRotationIndex, modeRotationIndex }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 : 550;
  const textSize = window.innerWidth < window.innerHeight ? 1.3 : 2;

  const _opts: Omit<Opts, 'canvas' | 'ctx'> = {
    radius, textSize, keyRotationIndex, modeRotationIndex,
    numSlices: 12,
    ringSpacings: [radius / 1.7, radius / 1.2, radius / 1.1],
  };

  const sliceAngle = 2 * Math.PI / _opts.numSlices;
  const halfSliceAngle = sliceAngle / 2;
  const sections: Section[] = [];

  for (let slice = 0; slice < _opts.numSlices; slice++) {
    for (let ring = 0; ring < _opts.ringSpacings.length; ring++) {
      const sectionType = ring % 3 === 0 ? 'in' : ring % 3 === 1 ? 'note' : 'quality';
      const text = ring == 2 ? QUALITIES[slice % _opts.numSlices] :
                   ring == 1 ? DISPLAY_NOTES[slice % _opts.numSlices] : '';

      sections.push({
        ring, text,
        startAngle: slice * sliceAngle - halfSliceAngle - Math.PI / 2,
        endAngle: (slice + 1) * sliceAngle - halfSliceAngle - Math.PI / 2,
        startRadius: ring === 0 ? 0 : _opts.ringSpacings[ring - 1],
        endRadius: _opts.ringSpacings[ring],
        type: sectionType
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
  }, [ keyRotationIndex, modeRotationIndex ]);

  return (
    <div id="new-wheel" className="wheel-container">
      <canvas ref={canvasRef} width={radius * 2} height={radius * 2}></canvas>
    </div>
  );
}

// Draw the wheel on the canvas
function drawWheel(sections: Section[], opts: Opts, mouseX?: number, mouseY?: number) {
  const { ctx, radius } = opts;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw each section based on its properties, with rotation offset applied only to 'note' sections
  sections.forEach((section) => {
    // Calculate the rotation offset based on the keyRotationIndex for 'note' sections and modeRotationIndex for 'in' sections
    const rotationOffset = section.type === 'note' ? 2 * Math.PI * opts.keyRotationIndex / opts.numSlices :
                           section.type === 'in' ? 2 * Math.PI * opts.modeRotationIndex / opts.numSlices : 0;

    // Adjust the start and end angles by the rotation offset if applicable
    const { startRadius, endRadius } = section;
    const startAngle = section.startAngle + rotationOffset;
    const endAngle = section.endAngle + rotationOffset;

    // Draw section outline
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(radius, radius, endRadius, startAngle, endAngle); // Draw the outer arc
    ctx.lineTo(radius + startRadius * Math.cos(endAngle), radius + startRadius * Math.sin(endAngle)); // Line to the inner arc
    ctx.arc(radius, radius, startRadius, endAngle, startAngle, true); // Draw the inner arc backwards
    ctx.lineTo(radius + endRadius * Math.cos(startAngle), radius + endRadius * Math.sin(startAngle)); // Line back to the start
    ctx.closePath();

    // Fill in the section
    ctx.fillStyle = 'black';
    ctx.fill();
    // Only draw the stroke for the outermost ring
    if (section.ring === opts.ringSpacings.length - 1) {
      ctx.strokeStyle = 'white'; // Set the stroke color to white
      ctx.lineWidth = 2; // Set the stroke thickness to 2 pixels
      ctx.stroke(); // Add a stroke to the section
    }

    // Check if the mouse is over the section and apply glow effect
    if (mouseX !== undefined && mouseY !== undefined && isMouseOverSection(section, opts, mouseX, mouseY)) {
      ctx.save(); // Save the current state
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'orange';
      ctx.fillStyle = 'orange';
      ctx.fill();
      ctx.restore(); // Restore the state
    }

    // Set the font size from opts
    // TODO Is it better with text size bigger for single char notes vs 4 char notes?
    const textSize = opts.textSize * (section.type === 'note' && section.text.length === 1 ? 2 : 1);
    ctx.font = `${textSize}rem Arial`;
    ctx.fillStyle = "white";

    // Calculate the midpoint angle and radius for the text position
    const textMidpointAngle = (startAngle + endAngle) / 2;
    const textMidpointRadius = (startRadius + endRadius) / 2;
    // Calculate the X and Y position of the text
    const textX = radius + textMidpointRadius * Math.cos(textMidpointAngle);
    const textY = radius + textMidpointRadius * Math.sin(textMidpointAngle);
    // Measure text width and adjust the position to center the text horizontally
    const textWidth = ctx.measureText(section.text).width;
    // Rotate the canvas context to align the text towards the center of the wheel
    ctx.save(); // Save the current context state
    ctx.translate(textX, textY); // Translate to the text position
    ctx.rotate(textMidpointAngle + Math.PI / 2); // Rotate the context to align the text
    // Draw the text on the canvas centered in the section with padding to the top
    // const paddingTop = 10; // Adjust this value for more or less padding
    const paddingTop = section.type === 'note' && section.text.length === 1 ? 20 : 10;
    ctx.fillText(section.text, -textWidth / 2, opts.textSize / 2 + paddingTop); // Adjust for centered text with padding

    // If the section is on ring 1, draw a circle around the text
    if (section.ring === 1) {
      const circleRadius = opts.textSize * 25; // Circle radius based on text size
      ctx.beginPath();
      ctx.arc(0, 0, circleRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    ctx.restore(); // Restore the context to its original state
  });
}

// Function to check if the mouse is over a section
const isMouseOverSection = (section: Section, opts: Opts, mouseX: number, mouseY: number): boolean => {
  const { radius } = opts;
  const x = mouseX - radius;
  const y = mouseY - radius;
  const angle = Math.atan2(y, x);
  const distance = Math.sqrt(x * x + y * y);

  // Calculate the rotation offset based on the section type and apply it to the section's start and end angles
  const keyRotationOffset = 2 * Math.PI * opts.keyRotationIndex / opts.numSlices;
  const modeRotationOffset = 2 * Math.PI * opts.modeRotationIndex / opts.numSlices;
  const sectionStartAngle = section.startAngle + (section.type === 'note' ? keyRotationOffset : (section.type === 'in' ? modeRotationOffset : 0));
  const sectionEndAngle = section.endAngle + (section.type === 'note' ? keyRotationOffset : (section.type === 'in' ? modeRotationOffset : 0));

  // Normalize the angle to be between 0 and 2*PI
  let normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
  // Normalize the section start and end angles to be between 0 and 2*PI
  let normalizedSectionStartAngle = (sectionStartAngle + 2 * Math.PI) % (2 * Math.PI);
  let normalizedSectionEndAngle = (sectionEndAngle + 2 * Math.PI) % (2 * Math.PI);
  // Check if the angle is within the section's start and end angles, considering the possibility of crossing the 0 radians line
  let isWithinAngles;
  if (normalizedSectionEndAngle < normalizedSectionStartAngle) {
    // The section crosses the 0 radians line
    isWithinAngles = normalizedAngle >= normalizedSectionStartAngle || normalizedAngle <= normalizedSectionEndAngle;
  } else {
    // The section does not cross the 0 radians line
    isWithinAngles = normalizedAngle >= normalizedSectionStartAngle && normalizedAngle <= normalizedSectionEndAngle;
  }

  // Check if the mouse is within the radius range of the section
  const isWithinRadius = distance >= section.startRadius && distance <= section.endRadius;

  return isWithinAngles && isWithinRadius;
};

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
};

type Section = {
  startAngle: number;
  endAngle: number;
  startRadius: number;
  endRadius: number;
  ring: number;
  type: 'quality' | 'note' | 'in';
  text: string;
}

