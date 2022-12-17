// number of pixels per complex plane unit.
const PIXELS_PER_UNIT = 500;

const CENTER_X = -0.5;
const CENTER_Y = 0;

// draw canvas width.
const WIDTH = 1500;

// draw canvas height.
const HEIGHT = 1500;

// max iterations for determining bound.
const MAX_ITERATIONS = 30;

// under which limit we consider the iteration to be bounded.
const BOUND_LIMIT = 2;

function drawPixel(ctx, x, y, r, g, b, a) {
  ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
  ctx.fillRect(x, y, 1, 1);
}

// Returns the distance to the center of the complex plane of a complex number.
function distanceToCenter(complex) {
  return Math.sqrt(complex.r * complex.r + complex.i * complex.i);
}

// converts a pixel position to a positon of the complex plane.
function pixelToPlane(x, y) {
  const realPart = (x - WIDTH / 2) / PIXELS_PER_UNIT + CENTER_X;
  const imaginaryPart = (HEIGHT / 2 - y) / PIXELS_PER_UNIT + CENTER_Y;

  return { r: realPart, i: imaginaryPart };
}

// returns the square of a complex number
function squareComplex(complex) {
  const realPart = complex.r * complex.r - complex.i * complex.i;
  const imaginaryPart = 2 * complex.r * complex.i;

  return { r: realPart, i: imaginaryPart };
}

function sumComplex(a, b) {
  const realPart = a.r + b.r;
  const imaginaryPart = a.i + b.i;

  return { r: realPart, i: imaginaryPart };
}

function mandelbrotFunction(complex, z) {
  return sumComplex(squareComplex(z), complex);
}

// returns a tuple [isbounded, iterations] where the first element
// is a boolean indicating where it's bounded or not, and the second
// argument is a number indicating after how many iterations it escaped
// the bound limit.
function getBounded(complex) {
  // make a copy just in case.
  let z = { r: 0, i: 0 };
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    z = mandelbrotFunction(complex, z);
    const distance = distanceToCenter(z);
    const isBounded = distance <= BOUND_LIMIT;
    if (!isBounded) {
      return [false, i];
    }
  }

  return [true, MAX_ITERATIONS];
}

function getAlpha(numIterations) {
  return numIterations / MAX_ITERATIONS;
}

function drawShit() {
  const canvas = document.getElementById("gorlami");
  const ctx = canvas.getContext("2d");

  // const imageData = ctx.createImageData(WIDTH, HEIGHT);

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const complex = pixelToPlane(x, y);
      const [isBounded, numIterations] = getBounded(complex);

      if (isBounded) {
        drawPixel(ctx, x, y, 0, 0, 0, 255);
      } else {
        const intensity = getAlpha(numIterations);
        drawPixel(ctx, x, y, 0, 0, 0, Math.round(255 * intensity));
      }
    }
  }
}
