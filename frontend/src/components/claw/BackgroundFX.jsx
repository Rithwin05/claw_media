import { useEffect, useRef } from "react";

const VS = `
attribute vec4 a_position;
varying vec2 v_texCoord;
void main() {
  gl_Position = a_position;
  v_texCoord = a_position.xy * 0.5 + 0.5;
}`;

const FS = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 centered_uv = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 grid_uv = fract(uv * 50.0 + u_time * 0.05);
    float grid = smoothstep(0.0, 0.05, grid_uv.x) * smoothstep(1.0, 0.95, grid_uv.x);
    grid *= smoothstep(0.0, 0.05, grid_uv.y) * smoothstep(1.0, 0.95, grid_uv.y);
    float n = hash(floor(uv * 20.0) + floor(u_time * 2.0));
    float pulse = step(0.98, n) * 0.1;
    float vignette = 1.0 - smoothstep(0.4, 1.2, length(centered_uv));
    vec3 color = vec3(0.03, 0.03, 0.03);
    vec3 neonBlue = vec3(0.0, 0.941, 1.0);
    color += neonBlue * grid * 0.05;
    color += neonBlue * pulse * vignette;
    float m_dist = length(centered_uv - (u_mouse / u_resolution - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0));
    color += neonBlue * (1.0 - smoothstep(0.0, 0.3, m_dist)) * 0.03;
    gl_FragColor = vec4(color * vignette, 1.0);
}`;

export default function BackgroundFX() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext("webgl");
    if (!gl) return undefined;

    const mk = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram();
    gl.attachShader(program, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let mx = 0;
    let my = 0;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const onMove = (e) => {
      mx = e.clientX;
      my = canvas.height - e.clientY;
    };
    const render = (t) => {
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-black"
        aria-hidden="true"
      />
      <div className="scanlines" aria-hidden="true" />
    </>
  );
}
