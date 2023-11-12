import { useRef, useEffect } from 'react';
import "./Wheel.scss"

type WheelProps = {
  keyIndex: number,
  modeRotationIndex: number
}

export default function Wheel({ keyIndex, modeRotationIndex }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radius = 350;

  const _opts: Omit<Opts, 'canvas' | 'ctx'> = {
    numSlices: 12,
    radius: radius,
    numRings: 3,
    spacingBetweenRings: radius / 3,
    keyIndex,
    modeRotationIndex,
  };

  const sliceAngle = 2 * Math.PI / _opts.numSlices;
  const halfSliceAngle = sliceAngle / 2;
  const sections: Section[] = [];

  for (let slice = 0; slice < _opts.numSlices; slice++) {
    for (let ring = 0; ring < _opts.numRings; ring++) {
      const sectionType = ring % 3 === 0 ? 'in' : ring % 3 === 1 ? 'note' : 'quality';

      sections.push({
        startAngle: slice * sliceAngle + halfSliceAngle,
        endAngle: (slice + 1) * sliceAngle + halfSliceAngle,
        startRadius: _opts.spacingBetweenRings * ring,
        endRadius: _opts.spacingBetweenRings * (ring + 1),
        type: sectionType // Add the section type to the section object
      });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const opts: Opts = Object.assign(_opts, { canvas, ctx, });

    const boundMouseMoveHandler = (event: MouseEvent) => {
      mouseMoveHandler(sections, opts, drawWheel, addGlowToSection, event);
    };

    canvas.addEventListener('mousemove', boundMouseMoveHandler);

    // Call the drawWheel function to draw the wheel on the canvas
    drawWheel(sections, opts);

    // Cleanup event listener
    return () => {
      canvas.removeEventListener('mousemove', boundMouseMoveHandler);
    };
  }, [ keyIndex, modeRotationIndex ]);

  return (
    <div id="new-wheel" className="wheel-container">
      <canvas ref={canvasRef} width={radius * 2} height={radius * 2}></canvas>
    </div>
  );
}

// Draw the wheel on the canvas
function drawWheel(sections: Section[], opts: Opts) {
  const { ctx, radius } = opts;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw each section based on its properties, with rotation offset applied only to 'note' sections
  sections.forEach((section, index) => {
    // Calculate the rotation offset based on the keyIndex for 'note' sections and modeRotationIndex for 'in' sections
    const rotationOffset = section.type === 'note' ? 2 * Math.PI * opts.keyIndex / opts.numSlices :
                           section.type === 'in' ? 2 * Math.PI * opts.modeRotationIndex / opts.numSlices : 0;

    // Adjust the start and end angles by the rotation offset if applicable
    const { startRadius, endRadius } = section;
    const startAngle = section.startAngle + rotationOffset;
    const endAngle = section.endAngle + rotationOffset;

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
    ctx.stroke(); // Optional: add a stroke to the section

    // Add index numbers to the sections. This is temporary.
    const text = section.type + " " + index;
    ctx.font = "10px Arial"; // Set the font size and family
    ctx.fillStyle = "white"; // Set the text color
    // Calculate the midpoint angle and radius for the text position
    const textMidpointAngle = (startAngle + endAngle) / 2;
    const textMidpointRadius = (startRadius + endRadius) / 2;
    // Calculate the X and Y position of the text
    const textX = radius + textMidpointRadius * Math.cos(textMidpointAngle);
    const textY = radius + textMidpointRadius * Math.sin(textMidpointAngle);
    // Measure text width and adjust the position to center the text horizontally
    const textWidth = ctx.measureText(text).width;
    // Rotate the canvas context to align the text towards the center of the wheel
    ctx.save(); // Save the current context state
    ctx.translate(textX, textY); // Translate to the text position
    ctx.rotate(textMidpointAngle + Math.PI / 2); // Rotate the context to align the text
    // Draw the text on the canvas centered in the section
    ctx.fillText(text, -textWidth / 2, parseInt(ctx.font) / 2); // Adjust for centered text
    ctx.restore(); // Restore the context to its original state
  });
}

// Function to add glow effect to a section
const addGlowToSection = (opts: Opts, section: Section) => {
  const { ctx, radius } = opts;
  const { startAngle, endAngle, startRadius, endRadius } = section;

  ctx.save(); // Save the current state
  ctx.shadowBlur = 20;
  ctx.shadowColor = 'orange';
  ctx.beginPath();
  ctx.arc(radius, radius, endRadius, startAngle, endAngle); // Draw the outer arc
  ctx.arc(radius, radius, startRadius, endAngle, startAngle, true); // Draw the inner arc backwards
  ctx.closePath();
  ctx.fillStyle = 'orange';
  ctx.fill();
  ctx.restore(); // Restore the state
};

// Function to check if the mouse is over a section
const isMouseOverSection = (section: Section, opts: Opts, mouseX: number, mouseY: number): boolean => {
  const { radius } = opts;
  const x = mouseX - radius;
  const y = mouseY - radius;
  const angle = Math.atan2(y, x);
  const distance = Math.sqrt(x * x + y * y);

  // Normalize the angle to be between 0 and 2*PI
  const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;

  // Check if the mouse is within the angle range of the section
  const isWithinAngles = normalizedAngle >= section.startAngle && normalizedAngle <= section.endAngle;

  // Check if the mouse is within the radius range of the section
  const isWithinRadius = distance >= section.startRadius && distance <= section.endRadius;

  return isWithinAngles && isWithinRadius;
};

// Event listener for mouse move
const mouseMoveHandler = (
  sections: Section[],
  opts: Opts,
  drawWheel: Function,
  addGlowToSection: Function,
  event: MouseEvent,
) => {
  const { canvas } = opts;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  let isHovered = false;

  // Main draw loop
  for (let section of sections) {
    if (isMouseOverSection(section, opts, mouseX, mouseY)) {
      isHovered = true;
      drawWheel(sections, opts); // Redraw the wheel
      addGlowToSection(opts, section); // Add glow effect
      break;
    }
  }

  if (!isHovered) {
    drawWheel(sections, opts); // Redraw the wheel without glow
  }
};

type Opts = {
  numSlices: number;
  radius: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  numRings: number;
  spacingBetweenRings: number;
  keyIndex: number;
  modeRotationIndex: number;
};

type Section = {
  startAngle: number;
  endAngle: number;
  startRadius: number;
  endRadius: number;
  type: 'quality' | 'note' | 'in'
}

