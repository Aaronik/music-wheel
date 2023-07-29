import { useRef, useEffect } from 'react';
import "./Wheel.scss"

type WheelProps = {
  keyIndex: number,
  modeRotationIndex: number
}

export default function Wheel({ }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const radius = 350; // Adjust as needed
  const totalSlices = 12;
  const circles = 3;
  const spacingBetweenCircles = radius / 3; // Spacing between each additional circle

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const opts: Opts = {
      totalSlices,
      radius,
      canvas,
      ctx,
      circles,
      spacingBetweenCircles,
    };

    const boundMouseMoveHandler = (event: MouseEvent) => {
      mouseMoveHandler(opts, drawWheel, addGlowToSection, event);
    };

    canvas.addEventListener('mousemove', boundMouseMoveHandler);

    // Call the drawWheel function to draw the wheel on the canvas
    drawWheel(opts);

    // Cleanup event listener
    return () => {
      canvas.removeEventListener('mousemove', boundMouseMoveHandler);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div id="new-wheel" className="wheel-container">
      <canvas ref={canvasRef} width={radius * 2} height={radius * 2}></canvas>
    </div>
  );
}

// Draw the wheel on the canvas
function drawWheel(opts: Opts) {
  const { ctx, totalSlices, radius, circles, spacingBetweenCircles } = opts;
  const sliceAngle = 2 * Math.PI / totalSlices;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Now draw the slices on top of the rings
  for (let i = 0; i < totalSlices; i++) {
    const startAngle = i * sliceAngle;
    const endAngle = (i + 1) * sliceAngle;

    ctx.beginPath();
    ctx.strokeStyle = 'white'; // Color of the additional circles
    ctx.moveTo(radius, radius); // Move to the center
    ctx.arc(radius, radius, radius, startAngle, endAngle); // Draw the arc
    ctx.closePath();

    // Alternate the fill color for each slice for visibility
    ctx.fill();
    ctx.stroke(); // Optional: add a stroke to the slice
  }

  for (let i = 1; i <= circles; i++) {
    ctx.beginPath();
    ctx.strokeStyle = 'white'; // Color of the additional circles
    ctx.arc(radius, radius, radius - (i * spacingBetweenCircles), 0, 2 * Math.PI);
    ctx.stroke();
  }
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
  opts: Opts,
  drawWheel: Function,
  addGlowToSection: Function,
  event: MouseEvent,
) => {
  const { canvas, totalSlices } = opts;
  const sliceAngle = 2 * Math.PI / totalSlices;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  let hoveredSection = -1;

  let isHovered = false;

  for (let slice = 0; slice < totalSlices; slice++) {
    for (let circle = 0; circle < opts.circles; circle++) {
      const section: Section = {
        startAngle: slice * sliceAngle,
        endAngle: (slice + 1) * sliceAngle,
        startRadius: opts.spacingBetweenCircles * circle,
        endRadius: opts.spacingBetweenCircles * (circle + 1)
      }

      if (isMouseOverSection(section, opts, mouseX, mouseY)) {
        if (hoveredSection !== slice) {
          hoveredSection = slice;
          drawWheel(opts); // Redraw the wheel
          addGlowToSection(opts, section); // Add glow effect
        }
        isHovered = true;
        break;
      }
    }
  }

  if (!isHovered) {
    drawWheel(opts); // Redraw the wheel without glow
  }
};

type Opts = {
  totalSlices: number;
  radius: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  circles: number;
  spacingBetweenCircles: number;
};

type Section = {
  startAngle: number;
  endAngle: number;
  startRadius: number;
  endRadius: number;
}

