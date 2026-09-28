import * as THREE from 'three';
import { SkillCategoryGroup } from '../../models/portfolio.models';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export function createSkillsWorld(categories: SkillCategoryGroup[]): WorldBuilderResult {
  const group = new THREE.Group();
  group.position.set(315, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];
  const skillNodes: Array<{ mesh: THREE.Mesh; baseY: number; offset: number }> = [];

  // Constellation base ring
  const baseRingGeo = new THREE.RingGeometry(8, 8.2, 48);
  const baseRingMat = new THREE.MeshBasicMaterial({ color: 0x7c3cff, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
  disposables.push(baseRingGeo, baseRingMat);
  const ring = new THREE.Mesh(baseRingGeo, baseRingMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.45;
  group.add(ring);

  // Localized skills constellation lighting
  const sklLight = new THREE.PointLight(0x00eaff, 4.5, 35);
  sklLight.position.set(0, 4, 6);
  group.add(sklLight);
  const sklViolet = new THREE.PointLight(0x7c3cff, 3.5, 30);
  sklViolet.position.set(0, 2, -6);
  group.add(sklViolet);

  const clusterPositions: THREE.Vector3[] = [];

  // Group each category in space
  categories.forEach((cat, cIdx) => {
    const angle = (cIdx / categories.length) * Math.PI * 2;
    const catRadius = 6.2;
    const cx = Math.cos(angle) * catRadius;
    const cz = Math.sin(angle) * catRadius;
    const cy = 1.8 + (cIdx % 2 === 0 ? 0.6 : -0.6);

    const clusterCenter = new THREE.Vector3(cx, cy, cz);
    clusterPositions.push(clusterCenter);

    const hexColor = parseInt(cat.color.replace('#', '0x'), 16);

    // Category Hub Star
    const hubGeo = new THREE.OctahedronGeometry(0.5, 0);
    const hubMat = new THREE.MeshStandardMaterial({
      color: hexColor,
      emissive: hexColor,
      emissiveIntensity: 0.7,
      metalness: 0.8
    });
    disposables.push(hubGeo, hubMat);
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubMesh.position.copy(clusterCenter);
    group.add(hubMesh);

    // Category Title Plate
    const titleCanvas = document.createElement('canvas');
    titleCanvas.width = 384;
    titleCanvas.height = 110;
    const tCtx = titleCanvas.getContext('2d')!;
    tCtx.fillStyle = 'rgba(6, 12, 28, 0.9)';
    tCtx.fillRect(0, 0, 384, 110);
    tCtx.strokeStyle = cat.color;
    tCtx.lineWidth = 3;
    tCtx.strokeRect(4, 4, 376, 102);

    tCtx.fillStyle = cat.color;
    tCtx.font = 'bold 22px monospace';
    tCtx.fillText(cat.category.toUpperCase(), 16, 42);

    tCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    tCtx.font = '15px sans-serif';
    tCtx.fillText(cat.tagline, 16, 80);

    const titleTex = new THREE.CanvasTexture(titleCanvas);
    disposables.push(titleTex);
    const titleGeo = new THREE.PlaneGeometry(1.8, 0.55);
    const titleMat = new THREE.MeshBasicMaterial({ map: titleTex, transparent: true, side: THREE.DoubleSide });
    disposables.push(titleGeo, titleMat);
    const titleMesh = new THREE.Mesh(titleGeo, titleMat);
    titleMesh.position.set(cx, cy + 1.1, cz);
    group.add(titleMesh);

    // Interactive Category Hit
    const hitGeo = new THREE.SphereGeometry(2.2, 12, 12);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.position.copy(clusterCenter);
    const data: InteractiveObjectData = {
      type: 'skill-item',
      id: `category-${cIdx}`,
      label: cat.category,
      description: `${cat.tagline}. Includes: ${cat.skills.map(s => s.name).join(', ')}`,
      accentColor: cat.color,
      payload: cat
    };
    hit.userData = data;
    group.add(hit);
    interactiveMeshes.push(hit);

    // Child skill nodes around category hub
    cat.skills.forEach((skill, sIdx) => {
      const sAngle = (sIdx / cat.skills.length) * Math.PI * 2;
      const sDist = 1.4;
      const sx = cx + Math.cos(sAngle) * sDist;
      const sz = cz + Math.sin(sAngle) * sDist;
      const sy = cy + (sIdx % 2 === 0 ? 0.35 : -0.35);

      const sGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const sMat = new THREE.MeshBasicMaterial({ color: skill.highlight ? 0xffffff : hexColor });
      disposables.push(sGeo, sMat);
      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.position.set(sx, sy, sz);
      group.add(sMesh);
      skillNodes.push({ mesh: sMesh, baseY: sy, offset: sIdx * 0.4 });

      // Connecting filament to hub
      const filGeo = new THREE.BufferGeometry().setFromPoints([clusterCenter, new THREE.Vector3(sx, sy, sz)]);
      const filMat = new THREE.LineBasicMaterial({ color: hexColor, transparent: true, opacity: 0.4 });
      disposables.push(filGeo, filMat);
      const fil = new THREE.Line(filGeo, filMat);
      group.add(fil);
    });
  });

  // Neural synaptic connection lines across category clusters
  const synPoints: THREE.Vector3[] = [];
  for (let i = 0; i < clusterPositions.length; i++) {
    const next = (i + 1) % clusterPositions.length;
    synPoints.push(clusterPositions[i], clusterPositions[next]);
  }
  const synGeo = new THREE.BufferGeometry().setFromPoints(synPoints);
  const synMat = new THREE.LineBasicMaterial({ color: 0x00eaff, transparent: true, opacity: 0.35 });
  disposables.push(synGeo, synMat);
  const synLines = new THREE.LineSegments(synGeo, synMat);
  group.add(synLines);

  return {
    group,
    interactiveMeshes,
    update: (delta: number, elapsed: number) => {
      skillNodes.forEach(node => {
        node.mesh.position.y = node.baseY + Math.sin(elapsed * 2 + node.offset) * 0.08;
      });
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
