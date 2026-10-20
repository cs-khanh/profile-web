import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

type Theme = 'light' | 'dark';
type WaterDrop = { x: number; y: number; strength: number; radius: number; pending: boolean; createdAt: number };

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const waveSimulationShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrevious;
  uniform sampler2D uCurrent;
  uniform vec2 uTexel;
  uniform float uAspect;
  uniform vec4 uImpulses[16];

  void main() {
    vec2 uv = vUv;
    float center = texture2D(uCurrent, uv).r;
    float previous = texture2D(uPrevious, uv).r;
    float neighbors = texture2D(uCurrent, uv + vec2(uTexel.x, 0.0)).r
      + texture2D(uCurrent, uv - vec2(uTexel.x, 0.0)).r
      + texture2D(uCurrent, uv + vec2(0.0, uTexel.y)).r
      + texture2D(uCurrent, uv - vec2(0.0, uTexel.y)).r;

    // Discrete 2D wave equation: neighboring heights carry each disturbance outward.
    float nextHeight = (2.0 * center - previous + 0.16 * (neighbors - 4.0 * center)) * 0.996;
    for (int i = 0; i < 16; i++) {
      vec4 impulse = uImpulses[i];
      vec2 delta = (uv - impulse.xy) * vec2(uAspect, 1.0);
      // Impacts are point-like signed height impulses; rings emerge from propagation,
      // and overlapping waves add algebraically in the shared height field.
      if (impulse.z > 0.0) nextHeight += exp(-dot(delta, delta) * impulse.w) * impulse.z;
    }

    // Absorb energy at the viewport edge so the simulation does not bounce off the frame.
    float edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    nextHeight *= mix(0.78, 1.0, smoothstep(0.0, 0.035, edge));
    gl_FragColor = vec4(nextHeight, 0.0, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uLight;
  uniform float uWaveLightGain;
  uniform sampler2D uWaveHeight;
  uniform vec2 uWaveTexel;

  void main() {
    vec2 uv = vUv;
    vec2 waveSlope = vec2(
      texture2D(uWaveHeight, uv + vec2(uWaveTexel.x, 0.0)).r - texture2D(uWaveHeight, uv - vec2(uWaveTexel.x, 0.0)).r,
      texture2D(uWaveHeight, uv + vec2(0.0, uWaveTexel.y)).r - texture2D(uWaveHeight, uv - vec2(0.0, uWaveTexel.y)).r
    ) / (2.0 * uWaveTexel);
    // Keep the simulated height field unchanged; strengthen its lighting response
    // so crests, troughs and interference remain legible on both themes.
    vec3 normal = normalize(vec3(-waveSlope * 6.0, 1.0));

    // A calm base flow carries finer, faster ripples near the bottom of the viewport.
    float lowerWater = 1.0 - smoothstep(0.08, 0.78, uv.y);
    vec2 slowFlow = vec2(
      sin(uv.x * 18.0 + uv.y * 11.0 + uTime * 0.29) * 0.0028
        + sin(uv.x * -9.0 + uv.y * 17.0 - uTime * 0.19) * 0.0012,
      sin(uv.x * 14.0 - uv.y * 8.0 - uTime * 0.24) * 0.0022
        + sin(uv.x * 6.0 + uv.y * 21.0 + uTime * 0.18) * 0.001
    );
    slowFlow += vec2(
      sin(uv.y * 31.0 + uv.x * 5.0 - uTime * 0.5),
      sin(uv.x * 24.0 - uv.y * 7.0 + uTime * 0.42)
    ) * lowerWater * 0.0025;
    vec2 refractedUv = clamp(uv + normal.xy * 0.042 + slowFlow, 0.0, 1.0);
    float depth = smoothstep(0.0, 1.0, refractedUv.y);
    vec3 water = mix(uDeep, uShallow, depth * 0.72);
    vec3 lightDirection = normalize(vec3(-0.38, 0.55, 0.74));
    float specular = pow(max(dot(normal, lightDirection), 0.0), 16.0);
    float sparkle = pow(max(dot(normal, lightDirection), 0.0), 40.0);
    water += uLight * (specular * 0.085 + sparkle * 0.09) * uWaveLightGain;
    gl_FragColor = vec4(water, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default function WaterRippleBackground({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};
    void import('three').then(({ Color, HalfFloatType, LinearFilter, Mesh, OrthographicCamera, PlaneGeometry, RGBAFormat, Scene, ShaderMaterial, Vector2, Vector4, WebGLRenderTarget, WebGLRenderer }) => {
      if (disposed) return;
      let renderer;
      try {
        renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
      } catch {
        // Leave the theme's plain background in place if WebGL is unavailable.
        return;
      }

    const drops: WaterDrop[] = [];
    const impulseUniforms = Array.from({ length: 16 }, () => new Vector4(0, 0, 0, 0));
    const makeTarget = () => new WebGLRenderTarget(512, 512, {
      type: HalfFloatType,
      format: RGBAFormat,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    const waveTargets = [makeTarget(), makeTarget(), makeTarget()];
    const waveMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader: waveSimulationShader,
      uniforms: {
        uPrevious: { value: waveTargets[0].texture },
        uCurrent: { value: waveTargets[1].texture },
        uTexel: { value: new Vector2(1 / 512, 1 / 512) },
        uAspect: { value: window.innerWidth / window.innerHeight },
        uImpulses: { value: impulseUniforms },
      },
    });
    const waveScene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const wavePlane = new Mesh(new PlaneGeometry(2, 2), waveMaterial);
    waveScene.add(wavePlane);

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new Vector2(1, 1) },
        uTime: { value: 0 },
        uDeep: { value: new Color(theme === 'dark' ? '#101c20' : '#6f9298') },
        uShallow: { value: new Color(theme === 'dark' ? '#1d3439' : '#b3ced0') },
        uLight: { value: new Color(theme === 'dark' ? '#8ba9a6' : '#efffff') },
        uWaveLightGain: { value: theme === 'dark' ? 1 : 1.9 },
        uWaveHeight: { value: waveTargets[1].texture },
        uWaveTexel: { value: new Vector2(1 / 512, 1 / 512) },
      },
    });
    const scene = new Scene();
    const plane = new Mesh(new PlaneGeometry(2, 2), material);
    scene.add(plane);

    let frame = 0;
    let lastPointerDrop = 0;
    let lastPointer: { x: number; y: number } | null = null;
    let elapsed = 0;
    const start = performance.now();
    let nextRainAt = start + 180;
    let previousFrame = start;
    let accumulator = 0;
    let previousTarget = 0;
    let currentTarget = 1;
    let nextTarget = 2;
    const fixedStep = 1 / 60;

    const clearWaveTargets = () => {
      const activeTarget = renderer.getRenderTarget();
      renderer.setClearColor(0x000000, 0);
      waveTargets.forEach((target) => {
        renderer.setRenderTarget(target);
        renderer.clear(true, true, true);
      });
      renderer.setRenderTarget(activeTarget);
    };

    const simulateStep = () => {
      impulseUniforms.forEach((uniform) => uniform.set(0, 0, 0, 0));
      let impulseIndex = 0;
      drops.forEach((drop) => {
        if (!drop.pending || impulseIndex >= impulseUniforms.length) return;
        impulseUniforms[impulseIndex].set(drop.x, drop.y, drop.strength * 0.0028, drop.radius);
        drop.pending = false;
        impulseIndex += 1;
      });
      waveMaterial.uniforms.uPrevious.value = waveTargets[previousTarget].texture;
      waveMaterial.uniforms.uCurrent.value = waveTargets[currentTarget].texture;
      renderer.setRenderTarget(waveTargets[nextTarget]);
      renderer.render(waveScene, camera);
      renderer.setRenderTarget(null);
      const recycled = previousTarget;
      previousTarget = currentTarget;
      currentTarget = nextTarget;
      nextTarget = recycled;
      material.uniforms.uWaveHeight.value = waveTargets[currentTarget].texture;
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      material.uniforms.uResolution.value.set(width, height);
      const aspect = width / height;
      const simWidth = Math.round(512 * Math.min(aspect, 1));
      const simHeight = Math.round(512 * Math.min(1 / aspect, 1));
      waveTargets.forEach((target) => target.setSize(simWidth, simHeight));
      const texel = new Vector2(1 / simWidth, 1 / simHeight);
      waveMaterial.uniforms.uTexel.value.copy(texel);
      waveMaterial.uniforms.uAspect.value = aspect;
      material.uniforms.uWaveTexel.value.copy(texel);
      previousTarget = 0;
      currentTarget = 1;
      nextTarget = 2;
      accumulator = 0;
      clearWaveTargets();
      renderer.render(scene, camera);
    };

    const addDrop = (x: number, y: number, strength: number, radius = 24000) => {
      drops.push({ x: x / window.innerWidth, y: 1 - y / window.innerHeight, strength, radius, pending: true, createdAt: elapsed });
      if (drops.length > 16) drops.shift();
    };

    const render = (now: number) => {
      frame = 0;
      elapsed = (now - start) / 1000;
      if (document.hidden) return;
      if (now >= nextRainAt) {
        const dropCount = Math.random() < 0.03 ? 2 : 1;
        for (let i = 0; i < dropCount; i += 1) {
          const x = window.innerWidth * (0.05 + Math.random() * 0.9);
          const y = window.innerHeight * (0.62 + Math.random() * 0.34);
          addDrop(x, y, 0.72 + Math.random() * 0.2, 20000 + Math.random() * 8000);
        }
        nextRainAt = now + 2600 + Math.random() * 2200;
      }
      const firstLiveDrop = drops.findIndex((drop) => elapsed - drop.createdAt < 3.5);
      if (firstLiveDrop > 0) drops.splice(0, firstLiveDrop);
      else if (firstLiveDrop === -1) drops.length = 0;
      accumulator += Math.min((now - previousFrame) / 1000, 0.05);
      previousFrame = now;
      let steps = 0;
      while (accumulator >= fixedStep && steps < 3) {
        simulateStep();
        accumulator -= fixedStep;
        steps += 1;
      }
      material.uniforms.uTime.value = elapsed;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const point = { x: event.clientX, y: event.clientY };
      const distance = lastPointer ? Math.hypot(point.x - lastPointer.x, point.y - lastPointer.y) : 80;
      if (distance < 58 || performance.now() - lastPointerDrop < 180) return;
      lastPointer = point;
      lastPointerDrop = performance.now();
      // Pointer disturbances are intentionally stronger than ambient rain so
      // cursor-made crests read as taller while sharing the same wave physics.
      addDrop(point.x, point.y, Math.min(1.35, 0.62 + distance * 0.004));
      if (!reducedMotion && !frame) frame = requestAnimationFrame(render);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      if (!reducedMotion && !frame) {
        previousFrame = performance.now();
        frame = requestAnimationFrame(render);
      }
    };
    const onWindowFocus = () => {
      if (!document.hidden && !reducedMotion && !frame) {
        previousFrame = performance.now();
        frame = requestAnimationFrame(render);
      }
    };

    resize();
    if (!reducedMotion) frame = requestAnimationFrame(render);
    window.addEventListener('resize', resize);
    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('pageshow', onWindowFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (!reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true });
    cleanup = () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('focus', onWindowFocus);
      window.removeEventListener('pageshow', onWindowFocus);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(frame);
      plane.geometry.dispose();
      material.dispose();
      wavePlane.geometry.dispose();
      waveMaterial.dispose();
      waveTargets.forEach((target) => target.dispose());
      renderer.dispose();
    };
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [reducedMotion, theme]);

  return <canvas ref={canvasRef} className="water-surface-background" aria-hidden="true" />;
}
