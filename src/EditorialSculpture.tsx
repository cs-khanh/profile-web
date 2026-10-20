import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export type SculptureKind = 'network' | 'publication' | 'profile';

const captions: Record<'vi' | 'en', Record<SculptureKind, string>> = {
  en: { network: 'Research · connected signals', publication: 'Publication · ideas in print', profile: 'Profile · a foundation in progress' },
  vi: { network: 'Nghiên cứu · các tín hiệu kết nối', publication: 'Công bố · ý tưởng thành ấn phẩm', profile: 'Hồ sơ · nền tảng đang phát triển' },
};

function createNetwork(THREE: typeof import('three'), accent: string, metal: string) {
  const group = new THREE.Group();
  const nodeGeometry = new THREE.SphereGeometry(0.075, 20, 16);
  const nodeMaterial = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.68, roughness: 0.24 });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 1), new THREE.MeshStandardMaterial({ color: metal, metalness: 0.8, roughness: 0.3, wireframe: true }));
  group.add(core);
  const positions: import('three').Vector3[] = [];
  for (let layer = 0; layer < 3; layer += 1) {
    const radius = 0.72 + layer * 0.22;
    const count = 7 + layer * 2;
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2 + layer * 0.32;
      const point = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.78, (layer - 1) * 0.22 + Math.sin(angle * 2) * 0.12);
      positions.push(point);
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(point);
      node.userData.revealOrder = layer * count + index;
      node.scale.setScalar(0.001);
      group.add(node);
      const next = new THREE.Vector3(Math.cos(angle + Math.PI * 2 / count) * radius, Math.sin(angle + Math.PI * 2 / count) * radius * 0.78, (layer - 1) * 0.22 + Math.sin((angle + Math.PI * 2 / count) * 2) * 0.12);
      const edge = new THREE.BufferGeometry().setFromPoints([point, next]);
      group.add(new THREE.Line(edge, new THREE.LineBasicMaterial({ color: metal, transparent: true, opacity: 0.44 })));
      if (layer > 0 && index % 2 === 0) {
        const previous = positions[positions.length - count - 1];
        if (previous) group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([point, previous]), new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.3 })));
      }
    }
  }
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.012, 8, 100), new THREE.MeshStandardMaterial({ color: accent, metalness: 0.5, roughness: 0.34, transparent: true, opacity: 0.72 }));
  orbit.rotation.x = Math.PI * 0.42;
  orbit.rotation.y = Math.PI * 0.15;
  group.add(orbit);
  return group;
}

function createPublication(THREE: typeof import('three'), accent: string, metal: string, light: boolean) {
  const book = new THREE.Group();
  const coverMaterial = new THREE.MeshStandardMaterial({ color: metal, metalness: 0.58, roughness: 0.34 });
  const pagesMaterial = new THREE.MeshStandardMaterial({ color: light ? '#e8eff0' : '#d9e2e3', metalness: 0.08, roughness: 0.7 });
  const cover = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.92, 0.14), coverMaterial);
  book.add(cover);
  const pages = new THREE.Mesh(new THREE.BoxGeometry(1.34, 1.8, 0.08), pagesMaterial);
  pages.position.z = 0.105;
  book.add(pages);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.92, 0.16), new THREE.MeshStandardMaterial({ color: accent, metalness: 0.75, roughness: 0.28 }));
  spine.position.x = -0.67;
  book.add(spine);
  const titleRuleMaterial = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.45, roughness: 0.36 });
  for (let line = 0; line < 4; line += 1) {
    const rule = new THREE.Mesh(new THREE.BoxGeometry(line === 0 ? 0.68 : 0.48 + (line % 2) * 0.18, 0.025, 0.012), titleRuleMaterial);
    rule.position.set(0.08, 0.42 - line * 0.11, 0.183);
    book.add(rule);
  }
  const seal = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.018, 10, 48), titleRuleMaterial);
  seal.position.set(0.08, -0.38, 0.19);
  book.add(seal);
  book.rotation.set(-0.12, -0.36, -0.12);
  return book;
}

function createProfile(THREE: typeof import('three'), accent: string, metal: string, light: boolean) {
  const group = new THREE.Group();
  const baseMaterial = new THREE.MeshStandardMaterial({ color: metal, metalness: 0.76, roughness: 0.3 });
  const accentMaterial = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.72, roughness: 0.25 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.88, 0.18, 8), baseMaterial);
  base.position.y = -0.86;
  base.rotation.y = Math.PI / 8;
  base.userData.assemblyOrder = 0;
  base.userData.targetY = base.position.y;
  base.position.y -= 0.54;
  group.add(base);
  const lower = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.52, 0.72), baseMaterial);
  lower.position.y = -0.48;
  lower.rotation.y = -0.2;
  lower.userData.assemblyOrder = 1;
  lower.userData.targetY = lower.position.y;
  lower.position.y -= 0.54;
  group.add(lower);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.68, 0.62), accentMaterial);
  upper.position.set(0.04, 0.12, 0);
  upper.rotation.y = 0.28;
  upper.userData.assemblyOrder = 2;
  upper.userData.targetY = upper.position.y;
  upper.position.y -= 0.54;
  group.add(upper);
  const crown = new THREE.Mesh(new THREE.OctahedronGeometry(0.39, 1), new THREE.MeshStandardMaterial({ color: light ? '#f5fbfc' : '#d4e3e7', metalness: 0.62, roughness: 0.22 }));
  crown.position.set(-0.05, 0.85, 0);
  crown.userData.assemblyOrder = 3;
  crown.userData.targetY = crown.position.y;
  crown.position.y -= 0.54;
  group.add(crown);
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.018, 10, 96), accentMaterial);
  orbit.rotation.set(1.02, 0.2, -0.24);
  group.add(orbit);
  return group;
}

export default function EditorialSculpture({ kind, theme, language }: { kind: SculptureKind; theme: 'light' | 'dark'; language: 'vi' | 'en' }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    setReady(false);
    let cancelled = false;
    let dispose = () => {};

    const initialise = async () => {
      const THREE = await import('three');
      if (cancelled) return;
      let renderer: import('three').WebGLRenderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
      catch { return; }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
      camera.position.set(0, 0, 5.6);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.prepend(renderer.domElement);

      const accent = theme === 'light' ? '#0c687c' : '#8fbac7';
      const metal = theme === 'light' ? '#395762' : '#77909a';
      const object = kind === 'network'
        ? createNetwork(THREE, accent, metal)
        : kind === 'publication'
          ? createPublication(THREE, accent, metal, theme === 'light')
          : createProfile(THREE, accent, metal, theme === 'light');
      const restingX = kind === 'publication' ? -0.12 : 0;
      const restingY = kind === 'publication' ? -0.36 : 0;
      const entry = kind === 'network'
        ? { scale: 0.72, rotationX: -0.28, rotationY: -0.78, offsetY: 0.2, duration: 880 }
        : kind === 'publication'
          ? { scale: 0.78, rotationX: 0.46, rotationY: -1.4, offsetY: -0.08, duration: 1050 }
          : { scale: 0.62, rotationX: -0.46, rotationY: 1.12, offsetY: -0.34, duration: 1180 };
      object.scale.setScalar(reducedMotion ? 1 : entry.scale);
      object.position.y = reducedMotion ? 0 : entry.offsetY;
      object.rotation.set(restingX + (reducedMotion ? 0 : entry.rotationX), restingY + (reducedMotion ? 0 : entry.rotationY), kind === 'publication' ? -0.12 : 0);
      scene.add(object);
      scene.add(new THREE.HemisphereLight('#e7f2f4', theme === 'light' ? '#263840' : '#111a1e', 2.1));
      const key = new THREE.DirectionalLight('#ffffff', 3.2);
      key.position.set(-3, 4, 5);
      const rim = new THREE.DirectionalLight(accent, 3.1);
      rim.position.set(3, -1, -2);
      scene.add(key, rim);

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();
      setReady(true);

      let frame = 0;
      let rotation = restingY + (reducedMotion ? 0 : entry.rotationY);
      let targetRotation = restingY;
      let currentX = restingX + (reducedMotion ? 0 : entry.rotationX);
      let targetX = restingX;
      let pointerStart: { x: number; y: number; moved: boolean } | null = null;
      const entranceStarted = performance.now();
      const animate = () => {
        frame = 0;
        if (!reducedMotion && !pointerStart) targetRotation += 0.0029;
        currentX += (targetX - currentX) * 0.075;
        rotation += (targetRotation - rotation) * 0.075;
        const elapsed = performance.now() - entranceStarted;
        const progress = reducedMotion ? 1 : Math.min(1, elapsed / entry.duration);
        const cubicEase = 1 - Math.pow(1 - progress, 3);
        const bookEase = 1 + 2.2 * Math.pow(progress - 1, 3) + 1.2 * Math.pow(progress - 1, 2);
        const ease = kind === 'publication' ? bookEase : cubicEase;
        object.scale.setScalar(entry.scale + ease * (1 - entry.scale));
        object.position.y = entry.offsetY * (1 - ease);
        if (kind === 'network') {
          object.traverse((child) => {
            if (child.userData.revealOrder === undefined) return;
            const nodeProgress = reducedMotion ? 1 : Math.max(0, Math.min(1, (elapsed - child.userData.revealOrder * 14) / 360));
            const nodeEase = 1 - Math.pow(1 - nodeProgress, 3);
            child.scale.setScalar(nodeEase);
          });
        } else if (kind === 'profile') {
          object.traverse((child) => {
            if (child.userData.assemblyOrder === undefined) return;
            const blockProgress = reducedMotion ? 1 : Math.max(0, Math.min(1, (elapsed - child.userData.assemblyOrder * 155) / 420));
            const blockEase = 1 - Math.pow(1 - blockProgress, 3);
            child.position.y = child.userData.targetY - 0.54 * (1 - blockEase);
          });
        }
        object.rotation.set(currentX + (kind !== 'publication' && !pointerStart ? Math.sin(rotation * 0.7) * 0.055 : 0), rotation, kind === 'publication' ? -0.12 : 0);
        renderer.render(scene, camera);
        const detailsSettled = kind === 'network' ? elapsed > 700 : kind === 'profile' ? elapsed > 900 : true;
        const settling = progress < 1 || !detailsSettled || Math.abs(targetRotation - rotation) > 0.001 || Math.abs(targetX - currentX) > 0.001;
        if (!reducedMotion || pointerStart || settling) frame = window.requestAnimationFrame(animate);
      };
      const queue = () => { if (!frame) frame = window.requestAnimationFrame(animate); };
      const onDown = (event: PointerEvent) => {
        pointerStart = { x: event.clientX, y: event.clientY, moved: false };
        host.setPointerCapture(event.pointerId);
      };
      const onMove = (event: PointerEvent) => {
        if (!pointerStart) return;
        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;
        if (Math.abs(dx) + Math.abs(dy) > 4) pointerStart.moved = true;
        targetRotation += event.movementX * 0.009;
        targetX = Math.max(-0.55, Math.min(0.55, targetX + event.movementY * 0.007));
        queue();
      };
      const onUp = () => { pointerStart = null; queue(); };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') targetRotation -= 0.35;
        else if (event.key === 'ArrowRight') targetRotation += 0.35;
        else if (event.key === 'ArrowUp') targetX = Math.max(-0.55, targetX - 0.18);
        else if (event.key === 'ArrowDown') targetX = Math.min(0.55, targetX + 0.18);
        else return;
        event.preventDefault();
        queue();
      };
      host.addEventListener('pointerdown', onDown);
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerup', onUp);
      host.addEventListener('pointercancel', onUp);
      host.addEventListener('keydown', onKeyDown);
      queue();
      dispose = () => {
        observer.disconnect();
        host.removeEventListener('pointerdown', onDown);
        host.removeEventListener('pointermove', onMove);
        host.removeEventListener('pointerup', onUp);
        host.removeEventListener('pointercancel', onUp);
        host.removeEventListener('keydown', onKeyDown);
        window.cancelAnimationFrame(frame);
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
            child.geometry.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
        scene.clear();
        if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
      };
    };
    void initialise().catch(() => setReady(false));
    return () => { cancelled = true; dispose(); };
  }, [kind, reducedMotion, theme]);

  return (
    <figure className={`editorial-sculpture editorial-sculpture-${kind}`}>
      <div className={`editorial-sculpture-stage${ready ? ' is-ready' : ''}`} ref={hostRef} tabIndex={0} role="group" aria-label={language === 'vi' ? `Mô hình 3D ${kind === 'network' ? 'nghiên cứu' : kind === 'publication' ? 'ấn phẩm' : 'hồ sơ'} tương tác. Kéo để xoay hoặc dùng phím mũi tên.` : `Interactive 3D ${kind} sculpture. Drag to rotate or use the arrow keys.`}>
        <span className="editorial-sculpture-fallback" aria-hidden="true">{kind === 'network' ? '◎' : kind === 'publication' ? '▤' : '◇'}</span>
      </div>
      <figcaption>{captions[language][kind]}</figcaption>
    </figure>
  );
}
