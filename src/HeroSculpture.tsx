import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const VIEWS = Array.from({ length: 8 }, (_, index) => index);

function createFlutedBit(THREE: typeof import('three')) {
  const around = 128;
  const rows = 90;
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= rows; row += 1) {
    const u = row / rows;
    const y = 1.38 - u * 2.76;
    const taper = u < 0.7 ? 0.45 - u * 0.08 : Math.max(0.035, 0.394 * (1 - (u - 0.7) / 0.3));
    for (let step = 0; step <= around; step += 1) {
      const angle = (step / around) * Math.PI * 2;
      const flute = Math.cos(angle * 4 + u * 13) * (u > 0.24 ? 0.095 : 0.035);
      const radius = taper + flute;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      positions.push(x, y, z);
      const normal = new THREE.Vector3(Math.cos(angle), 0.12, Math.sin(angle)).normalize();
      normals.push(normal.x, normal.y, normal.z);
      if (row < rows && step < around) {
        const point = row * (around + 1) + step;
        indices.push(point, point + around + 1, point + 1, point + 1, point + around + 1, point + around + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setIndex(indices);
  return geometry;
}

export default function HeroSculpture({ theme, language }: { theme: 'light' | 'dark'; language: 'vi' | 'en' }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [activeView, setActiveView] = useState(0);
  const targetRotation = useRef(0);
  const targetTilt = useRef(-0.08);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setReady(false);
    let cancelled = false;
    let cleanupEngine = () => {};

    const initialise = async () => {
      const THREE = await import('three');
      if (cancelled) return;
      let renderer: import('three').WebGLRenderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
      catch { return; }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 30);
      camera.position.set(0, 0, 6.5);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      container.prepend(renderer.domElement);

      const group = new THREE.Group();
      const metal = new THREE.MeshStandardMaterial({ color: theme === 'light' ? '#77909a' : '#9bafb5', metalness: 0.82, roughness: 0.27 });
      const bit = new THREE.Mesh(createFlutedBit(THREE), metal);
      group.add(bit);
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.458, 0.458, 0.17, 64), new THREE.MeshStandardMaterial({ color: theme === 'light' ? '#263f48' : '#b5c8cd', metalness: 0.72, roughness: 0.32 }));
      collar.position.y = 1.12;
      group.add(collar);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.024, 12, 72), new THREE.MeshStandardMaterial({ color: theme === 'light' ? '#0c687c' : '#8fbac7', metalness: 0.65, roughness: 0.23 }));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.96;
      group.add(ring);
      group.rotation.z = Math.PI;
      scene.add(group);
      scene.add(new THREE.HemisphereLight('#e7f2f4', theme === 'light' ? '#263840' : '#111a1e', 2.0));
      const key = new THREE.DirectionalLight('#ffffff', 3.7);
      key.position.set(-3, 4, 5);
      const rim = new THREE.DirectionalLight(theme === 'light' ? '#2d8798' : '#8fbac7', 4.1);
      rim.position.set(3, -1, -2);
      scene.add(key, rim);

      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      resize();
      setReady(true);

      let frame = 0;
      let currentX = -0.08;
      let targetX = targetTilt.current;
      let currentY = 0.5;
      let pointerStart: { x: number; y: number } | null = null;
      const animate = () => {
        frame = 0;
        if (!reducedMotion && !pointerStart) targetRotation.current += 0.00066;
        currentY += (targetRotation.current - currentY) * 0.055;
        targetX += (targetTilt.current - targetX) * 0.055;
        currentX += (targetX - currentX) * 0.055;
        group.rotation.set(currentX, currentY, Math.PI);
        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(animate);
      };
      const queue = () => { if (!frame) frame = window.requestAnimationFrame(animate); };
      const onDown = (event: PointerEvent) => {
        pointerStart = { x: event.clientX, y: event.clientY };
        container.setPointerCapture(event.pointerId);
      };
      const onMove = (event: PointerEvent) => {
        if (!pointerStart) return;
        targetRotation.current += event.movementX * 0.009;
        targetX = Math.max(-1.6, Math.min(1.6, targetX + event.movementY * 0.006));
        targetTilt.current = targetX;
        queue();
      };
      const onUp = () => { pointerStart = null; };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') targetRotation.current -= 0.38;
        else if (event.key === 'ArrowRight') targetRotation.current += 0.38;
        else if (event.key === 'ArrowUp') targetTilt.current = Math.max(-1.6, targetX - 0.2);
        else if (event.key === 'ArrowDown') targetTilt.current = Math.min(1.6, targetX + 0.2);
        else return;
        event.preventDefault();
        queue();
      };
      container.addEventListener('pointerdown', onDown);
      container.addEventListener('pointermove', onMove);
      container.addEventListener('pointerup', onUp);
      container.addEventListener('pointercancel', onUp);
      container.addEventListener('keydown', onKeyDown);
      queue();
      cleanupEngine = () => {
        observer.disconnect();
        container.removeEventListener('pointerdown', onDown);
        container.removeEventListener('pointermove', onMove);
        container.removeEventListener('pointerup', onUp);
        container.removeEventListener('pointercancel', onUp);
        container.removeEventListener('keydown', onKeyDown);
        window.cancelAnimationFrame(frame);
        renderer.dispose();
        bit.geometry.dispose();
        metal.dispose();
        collar.geometry.dispose();
        (collar.material as import('three').Material).dispose();
        ring.geometry.dispose();
        (ring.material as import('three').Material).dispose();
        scene.clear();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      };
    };
    void initialise().catch(() => setReady(false));
    return () => { cancelled = true; cleanupEngine(); };
  }, [reducedMotion, theme]);

  const selectView = (view: number) => {
    setActiveView(view);
    targetRotation.current = view === 8 ? 0 : (view / 8) * Math.PI * 2;
    targetTilt.current = view === 8 ? Math.PI / 2 : -0.08;
  };

  return (
    <div className="specimen">
      <div className={`hero-object-wrap${ready ? ' is-ready' : ''}`} ref={containerRef} tabIndex={0} role="group" aria-label={language === 'vi' ? 'Mô hình mũi khoan 3D tương tác. Kéo để xoay hoặc chọn góc nhìn.' : 'Interactive 3D form study of an industrial drill bit. Drag to rotate or choose a model viewing angle.'}>
        <div className="sculpture-fallback" aria-hidden="true"><span>8</span><br />{language === 'vi' ? 'góc nhìn' : 'views'}<br /><i>{language === 'vi' ? '1 mô hình' : '1 model'}</i></div>
      </div>
      <div className="specimen-controls" role="group" aria-label={language === 'vi' ? 'Các góc nhìn mô hình' : 'Model viewing angles'}>
        {VIEWS.map((view) => <button key={view} type="button" aria-label={language === 'vi' ? `Chọn góc nhìn ${view + 1}` : `Select model angle ${view + 1}`} aria-pressed={activeView === view} onClick={() => selectView(view)}>{view + 1}</button>)}
        <button type="button" className="specimen-head-view" aria-label={language === 'vi' ? 'Nhìn thẳng vào đầu mũi khoan' : 'View drill head-on'} aria-pressed={activeView === 8} onClick={() => selectView(8)}>{language === 'vi' ? 'Đầu mũi' : 'Head'}</button>
      </div>
      <p className="object-caption">{language === 'vi' ? 'Mô hình 3D · Lấy cảm hứng từ quy trình kiểm tra tám góc nhìn' : '3D form study · Inspired by an eight-view inspection setup'}</p>
    </div>
  );
}
