import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const features = [
  { id: 'research', label: { en: 'Research', vi: 'Nghiên cứu' }, detail: { en: 'Published research in multi-agent financial analysis.', vi: 'Nghiên cứu đã công bố về phân tích tài chính đa tác tử.' }, position: [0, 1.62, 0] as const },
  { id: 'data', label: { en: 'Data systems', vi: 'Hệ thống dữ liệu' }, detail: { en: 'Reliable ETL pipelines and production-minded cloud operations.', vi: 'Quy trình ETL tin cậy và vận hành đám mây hướng đến môi trường thực tế.' }, position: [1.62, 0, 0] as const },
  { id: 'ml', label: { en: 'Machine learning', vi: 'Học máy' }, detail: { en: 'Applied machine learning for computer vision and practical problems.', vi: 'Ứng dụng học máy vào thị giác máy tính và các bài toán thực tiễn.' }, position: [0, -1.62, 0] as const },
  { id: 'cloud', label: { en: 'Cloud', vi: 'Điện toán đám mây' }, detail: { en: 'AWS services, infrastructure as code and dependable workflows.', vi: 'Dịch vụ AWS, hạ tầng dưới dạng mã và quy trình vận hành ổn định.' }, position: [-1.62, 0, 0] as const },
];

type FeatureId = typeof features[number]['id'];

function createFeatureIcon(THREE: typeof import('three'), id: FeatureId, accent: string, shellColor: string) {
  const icon = new THREE.Group();
  icon.userData.feature = id;
  const makeMaterial = (color: string, metalness = 0.7) => new THREE.MeshStandardMaterial({ color, metalness, roughness: 0.25, emissive: color, emissiveIntensity: 0.12 });
  const addMesh = (geometry: import('three').BufferGeometry, material: import('three').Material, position: [number, number, number]) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.userData.feature = id;
    icon.add(mesh);
    return mesh;
  };

  if (id === 'research') {
    const atom = makeMaterial(accent, 0.82);
    addMesh(new THREE.SphereGeometry(0.115, 20, 16), makeMaterial('#e5f0f2', 0.76), [0, 0, 0]);
    const orbits = [
      [0, 0, 0],
      [Math.PI / 2, 0.42, 0],
      [0.74, -0.72, 0.34],
    ];
    for (const [x, y, z] of orbits) {
      const ring = addMesh(new THREE.TorusGeometry(0.32, 0.014, 8, 56), atom, [0, 0, 0]);
      ring.rotation.set(x, y, z);
    }
    addMesh(new THREE.SphereGeometry(0.065, 18, 14), makeMaterial('#dcebed'), [0.31, 0.05, 0]);
  } else if (id === 'data') {
    const body = makeMaterial(shellColor, 0.84);
    const rim = makeMaterial(accent, 0.78);
    for (let layer = 0; layer < 3; layer += 1) {
      const y = -0.2 + layer * 0.2;
      addMesh(new THREE.CylinderGeometry(0.25, 0.25, 0.12, 40), body, [0, y, 0]);
      const edge = addMesh(new THREE.TorusGeometry(0.247, 0.013, 8, 48), rim, [0, y + 0.06, 0]);
      edge.rotation.x = Math.PI / 2;
    }
  } else if (id === 'ml') {
    const layers = [[-0.29], [-0.23, 0, 0.23], [-0.29]];
    const nodes: import('three').Vector3[][] = [];
    for (let layer = 0; layer < layers.length; layer += 1) {
      const layerNodes: import('three').Vector3[] = [];
      for (const y of layers[layer]) {
        const point = new THREE.Vector3((layer - 1) * 0.28, y, 0);
        layerNodes.push(point);
        addMesh(new THREE.SphereGeometry(0.065, 18, 14), makeMaterial(layer === 1 ? accent : '#dcebed', 0.78), [point.x, point.y, point.z]);
      }
      nodes.push(layerNodes);
    }
    const synapse = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.7 });
    for (let layer = 0; layer < nodes.length - 1; layer += 1) {
      for (const from of nodes[layer]) for (const to of nodes[layer + 1]) {
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, to]), synapse);
        line.userData.feature = id;
        icon.add(line);
      }
    }
  } else {
    const cloud = makeMaterial('#dcebed', 0.5);
    const cloudParts: Array<[number, number, number, number]> = [
      [-0.18, -0.015, 0, 0.16], [0, 0.08, 0, 0.205], [0.19, -0.005, 0, 0.15], [-0.02, -0.115, 0, 0.14],
    ];
    for (const [x, y, z, radius] of cloudParts) {
      addMesh(new THREE.SphereGeometry(radius, 22, 18), cloud, [x, y, z]);
    }
    addMesh(new THREE.CylinderGeometry(0.29, 0.29, 0.075, 40), makeMaterial(accent, 0.8), [0, -0.17, 0]);
  }
  return icon;
}

export default function HomeDataCore({ theme, language }: { theme: 'light' | 'dark'; language: 'vi' | 'en' }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<FeatureId>('research');
  const selectedRef = useRef<FeatureId>('research');
  const requestRender = useRef<() => void>(() => {});
  const targetRotation = useRef(0);
  const targetTilt = useRef(-0.12);

  const selectFeature = (id: FeatureId) => {
    const feature = features.find((item) => item.id === id);
    if (!feature) return;
    const [x, , z] = feature.position;
    const desired = Math.atan2(-x, z);
    targetRotation.current += Math.atan2(Math.sin(desired - targetRotation.current), Math.cos(desired - targetRotation.current));
    selectedRef.current = id;
    setSelected(id);
    requestRender.current();
  };

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
      camera.position.set(0, 0, 7.3);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.prepend(renderer.domElement);

      const accent = theme === 'light' ? '#0c687c' : '#8fbac7';
      const shellColor = theme === 'light' ? '#42616b' : '#78929b';
      const core = new THREE.Group();
      const chipBody = new THREE.Group();
      const packageMaterial = new THREE.MeshStandardMaterial({ color: theme === 'light' ? '#213b44' : '#263f48', metalness: 0.78, roughness: 0.28, emissive: accent, emissiveIntensity: 0.045 });
      const lidMaterial = new THREE.MeshStandardMaterial({ color: shellColor, metalness: 0.82, roughness: 0.23 });
      const pinMaterial = new THREE.MeshStandardMaterial({ color: theme === 'light' ? '#77949a' : '#c2d2d4', metalness: 0.86, roughness: 0.2 });
      const dieMaterial = new THREE.MeshStandardMaterial({ color: '#0b1a1f', metalness: 0.55, roughness: 0.22, emissive: accent, emissiveIntensity: 0.35 });
      const processor = new THREE.Mesh(new THREE.BoxGeometry(1.08, 1.08, 0.25), packageMaterial);
      chipBody.add(processor);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.96, 0.08), lidMaterial);
      lid.position.z = 0.15;
      chipBody.add(lid);
      const die = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.055), dieMaterial);
      die.position.z = 0.215;
      chipBody.add(die);
      const coreCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.19, 1), new THREE.MeshStandardMaterial({ color: '#e4f4f5', metalness: 0.35, roughness: 0.16, emissive: accent, emissiveIntensity: 0.8 }));
      coreCrystal.position.z = 0.27;
      chipBody.add(coreCrystal);
      for (let index = 0; index < 8; index += 1) {
        const offset = -0.39 + index * 0.112;
        for (const side of [-1, 1]) {
          const verticalPin = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.055, 0.09), pinMaterial);
          verticalPin.position.set(side * 0.6, offset, 0);
          chipBody.add(verticalPin);
          const horizontalPin = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.16, 0.09), pinMaterial);
          horizontalPin.position.set(offset, side * 0.6, 0);
          chipBody.add(horizontalPin);
        }
      }
      const traceMaterial = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.82 });
      for (let index = 0; index < 4; index += 1) {
        const angle = (index / 4) * Math.PI * 2 + Math.PI / 4;
        const start = new THREE.Vector3(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0.252);
        const elbow = new THREE.Vector3(Math.cos(angle) * 0.43, Math.sin(angle) * 0.43, 0.252);
        const end = new THREE.Vector3(Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0.252);
        const trace = new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, elbow, end]), traceMaterial);
        chipBody.add(trace);
        const contact = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 10), new THREE.MeshBasicMaterial({ color: accent }));
        contact.position.copy(end);
        chipBody.add(contact);
      }
      core.add(chipBody);

      const orbitMaterial = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.7, roughness: 0.26, transparent: true, opacity: 0.68 });
      const orbitA = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.014, 10, 144), orbitMaterial);
      const orbitB = new THREE.Mesh(new THREE.TorusGeometry(2.02, 0.011, 8, 144), new THREE.MeshStandardMaterial({ color: shellColor, metalness: 0.58, roughness: 0.32, transparent: true, opacity: 0.52 }));
      orbitB.rotation.x = Math.PI / 2;
      core.add(orbitA, orbitB);
      if (!reducedMotion) {
        chipBody.scale.setScalar(0.68);
        orbitA.scale.setScalar(0.55);
        orbitB.scale.setScalar(0.55);
      }
      core.scale.setScalar(reducedMotion ? 0.82 : 0.74);
      core.position.y = reducedMotion ? 0 : -0.12;
      core.rotation.set(reducedMotion ? targetTilt.current : targetTilt.current + 0.18, targetRotation.current - (reducedMotion ? 0 : 0.36), 0);

      const hitTargets: import('three').Object3D[] = [];
      const featureGroups: import('three').Group[] = [];
      const linkMaterial = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.42 });
      for (const feature of features) {
        const position = new THREE.Vector3(...feature.position);
        const link = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), position]), linkMaterial);
        core.add(link);
        const icon = createFeatureIcon(THREE, feature.id, accent, shellColor);
        icon.position.copy(position);
        if (!reducedMotion) icon.scale.setScalar(0.001);
        core.add(icon);
        featureGroups.push(icon);
        icon.traverse((child) => {
          if (child instanceof THREE.Mesh) hitTargets.push(child);
        });
      }
      scene.add(core);
      scene.add(new THREE.HemisphereLight('#e7f2f4', theme === 'light' ? '#263840' : '#111a1e', 2.15));
      const key = new THREE.DirectionalLight('#ffffff', 3.6);
      key.position.set(-3, 4, 5);
      const rim = new THREE.DirectionalLight(accent, 3.7);
      rim.position.set(3, -1, -2);
      scene.add(key, rim);

      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = Math.max(7.8, 4.8 / (2 * Math.tan(THREE.MathUtils.degToRad(34 / 2)) * Math.min(camera.aspect, 1)));
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();
      setReady(true);

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      let frame = 0;
      let currentY = targetRotation.current;
      let currentX = targetTilt.current;
      let pointerStart: { x: number; y: number; moved: boolean } | null = null;
      const entranceStarted = performance.now();
      const animate = () => {
        frame = 0;
        if (!reducedMotion && !pointerStart) targetRotation.current += 0.0011;
        currentY += (targetRotation.current - currentY) * 0.045;
        currentX += (targetTilt.current - currentX) * 0.045;
        const elapsed = performance.now() - entranceStarted;
        const progress = reducedMotion ? 1 : Math.min(1, elapsed / 820);
        const ease = 1 - Math.pow(1 - progress, 3);
        core.scale.setScalar(0.74 + ease * 0.08);
        core.position.y = -0.12 * (1 - ease);
        core.rotation.set(currentX + (1 - ease) * 0.18, currentY - (1 - ease) * 0.36, 0);

        const bodyProgress = reducedMotion ? 1 : Math.max(0, Math.min(1, elapsed / 620));
        const bodyEase = 1 - Math.pow(1 - bodyProgress, 3);
        chipBody.scale.setScalar(0.68 + bodyEase * 0.32);
        const orbitProgress = reducedMotion ? 1 : Math.max(0, Math.min(1, (elapsed - 80) / 780));
        const orbitEase = 1 - Math.pow(1 - orbitProgress, 3);
        orbitA.scale.setScalar(0.55 + orbitEase * 0.45);
        orbitB.scale.setScalar(0.55 + orbitEase * 0.45);

        featureGroups.forEach((icon, index) => {
          const active = icon.userData.feature === selectedRef.current;
          const nodeProgress = reducedMotion ? 1 : Math.max(0, Math.min(1, (elapsed - 170 - index * 145) / 430));
          const nodeEase = 1 + 2.7 * Math.pow(nodeProgress - 1, 3) + 1.7 * Math.pow(nodeProgress - 1, 2);
          const pulse = active ? 1.12 + Math.sin(performance.now() * 0.003) * 0.035 : 1;
          icon.scale.setScalar(nodeEase * pulse);
        });
        renderer.render(scene, camera);
        if (!reducedMotion) frame = window.requestAnimationFrame(animate);
      };
      const queue = () => { if (!frame) frame = window.requestAnimationFrame(animate); };
      requestRender.current = queue;
      const updatePointer = (event: PointerEvent) => {
        const bounds = host.getBoundingClientRect();
        pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        core.updateMatrixWorld(true);
      };
      const onDown = (event: PointerEvent) => {
        pointerStart = { x: event.clientX, y: event.clientY, moved: false };
        host.setPointerCapture(event.pointerId);
      };
      const onMove = (event: PointerEvent) => {
        if (pointerStart) {
          const dx = event.clientX - pointerStart.x;
          const dy = event.clientY - pointerStart.y;
          if (Math.abs(dx) + Math.abs(dy) > 5) pointerStart.moved = true;
          targetRotation.current += event.movementX * 0.009;
          targetTilt.current = Math.max(-0.48, Math.min(0.48, targetTilt.current + event.movementY * 0.006));
          queue();
        } else {
          updatePointer(event);
          host.style.cursor = raycaster.intersectObjects(hitTargets, false).length ? 'pointer' : 'grab';
        }
      };
      const onUp = (event: PointerEvent) => {
        if (pointerStart && !pointerStart.moved) {
          updatePointer(event);
          const hit = raycaster.intersectObjects(hitTargets, false)[0]?.object;
          let featureObject: import('three').Object3D | undefined = hit;
          while (featureObject && !featureObject.userData.feature) {
            const parentNode: import('three').Object3D | null = featureObject.parent;
            if (!parentNode) break;
            featureObject = parentNode;
          }
          const id = featureObject?.userData.feature as FeatureId | undefined;
          if (id) selectFeature(id);
        }
        pointerStart = null;
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') targetRotation.current -= 0.35;
        else if (event.key === 'ArrowRight') targetRotation.current += 0.35;
        else if (event.key === 'ArrowUp') targetTilt.current = Math.max(-0.48, targetTilt.current - 0.15);
        else if (event.key === 'ArrowDown') targetTilt.current = Math.min(0.48, targetTilt.current + 0.15);
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
        requestRender.current = () => {};
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
  }, [reducedMotion, theme]);

  const activeFeature = features.find((feature) => feature.id === selected) ?? features[0];

  return (
    <figure className="home-data-core">
      <div className={`data-core-stage${ready ? ' is-ready' : ''}`} ref={hostRef} tabIndex={0} role="group" aria-label={language === 'vi' ? 'Mô hình dữ liệu 3D tương tác. Kéo để xoay, chọn một nút hoặc dùng phím mũi tên.' : 'Interactive 3D data core. Drag to rotate, select a node, or use the arrow keys.'}>
        <div className="data-core-fallback" aria-hidden="true"><span>DATA</span><i>{language === 'vi' ? 'Kéo để khám phá' : 'Drag to explore'}</i></div>
      </div>
      <div className="data-core-readout" aria-live="polite" aria-atomic="true">
        <div><span>{activeFeature.label[language]}</span><p>{activeFeature.detail[language]}</p></div>
        <span className="data-core-hint">{language === 'vi' ? 'Kéo để xoay · Chọn một nút' : 'Drag to rotate · Select a node'}</span>
      </div>
      <div className="data-core-controls" role="group" aria-label={language === 'vi' ? 'Khám phá các lĩnh vực trọng tâm' : 'Explore focus areas'}>
        {features.map((feature, index) => (
          <button key={feature.id} type="button" aria-pressed={selected === feature.id} onClick={() => selectFeature(feature.id)}>
            <span>0{index + 1}</span>{feature.label[language]}
          </button>
        ))}
      </div>
      <figcaption>{language === 'vi' ? 'Bốn lĩnh vực kết nối · Khanh Pham Gia' : 'Four connected focus areas · Khanh Pham Gia'}</figcaption>
    </figure>
  );
}
