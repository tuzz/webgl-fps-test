const canvas = document.getElementById("canvas");
const fps = document.getElementById("fps");
const gl = canvas.getContext("webgl", {
  alpha: false,
  depth: false,
  stencil: false,
  antialias: false,
  powerPreference: "high-performance",
});

const vert = gl.createShader(gl.VERTEX_SHADER);
const frag = gl.createShader(gl.FRAGMENT_SHADER);
const program = gl.createProgram();

gl.shaderSource(vert, `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position;
  }
`);

gl.shaderSource(frag, `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`);

gl.compileShader(vert);
gl.compileShader(frag);
gl.attachShader(program, vert);
gl.attachShader(program, frag);
gl.linkProgram(program);

const a_position = gl.getAttribLocation(program, "a_position");
const buffer1 = gl.createBuffer();
let positions = [-1, -0.2, -0.6, 0.2, -0.6, -0.2];
let delta = [0.02, 0.02];

canvas.width = 1000;
canvas.height = 1000;
gl.viewport(0, 0, 1000, 1000);
gl.useProgram(program);

gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
gl.enableVertexAttribArray(a_position);
gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

let prev = performance.now();
let rates = [];
let cursor = 0;

const render = () => {
  const time = performance.now();
  const rate = 1000 / (time - prev);

  rates[cursor] = rate;
  cursor += 1;
  cursor %= 10;

  const mean = rates.reduce((sum, r) => sum + r) / 10;
  fps.innerText = `${Math.round(mean)} fps`;
  prev = time;

  let flip = [false, false];

  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 2; j += 1) {
      positions[2 * i + j] += delta[j];

      if (Math.abs(positions[2 * i + j]) >= 1) {
        flip[j] = true;
      }
    }
  }

  if (flip[0]) delta[0] *= -1;
  if (flip[1]) delta[1] *= -1;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  requestAnimationFrame(render);
};

requestAnimationFrame(render);
