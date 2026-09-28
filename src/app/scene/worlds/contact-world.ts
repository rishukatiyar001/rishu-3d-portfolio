import * as THREE from 'three';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export function createContactWorld(): WorldBuilderResult {
  const group = new THREE.Group();
  group.position.set(405, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];

  // Platform
  const platGeo = new THREE.CylinderGeometry(7, 7.8, 0.4, 32);
  const platMat = new THREE.MeshStandardMaterial({
    color: 0x060914,
    metalness: 0.9,
    roughness: 0.3
  });
  disposables.push(platGeo, platMat);
  const plat = new THREE.Mesh(platGeo, platMat);
  plat.position.y = -1.5;
  group.add(plat);

  // Localized communications portal lighting
  const conLight = new THREE.PointLight(0x00eaff, 4.5, 30);
  conLight.position.set(0, 3, 4);
  group.add(conLight);
  const conViolet = new THREE.PointLight(0x7c3cff, 3, 25);
  conViolet.position.set(0, 2, -4);
  group.add(conViolet);

  // Majestic Communications Cyber Portal Arch
  const portalGroup = new THREE.Group();
  portalGroup.position.set(0, 1.8, -2);
  group.add(portalGroup);

  const archGeo = new THREE.TorusGeometry(3.6, 0.22, 16, 48);
  const archMat = new THREE.MeshStandardMaterial({
    color: 0x0e172a,
    metalness: 0.95,
    roughness: 0.15
  });
  disposables.push(archGeo, archMat);
  const arch = new THREE.Mesh(archGeo, archMat);
  portalGroup.add(arch);

  // Swirling Portal Energy Disc
  const vortexGeo = new THREE.CircleGeometry(3.4, 32);
  const vortexMat = new THREE.MeshBasicMaterial({
    color: 0x00eaff,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide
  });
  disposables.push(vortexGeo, vortexMat);
  const vortex = new THREE.Mesh(vortexGeo, vortexMat);
  portalGroup.add(vortex);

  // Portal Neon Rings
  const pRingGeo = new THREE.TorusGeometry(3.8, 0.05, 8, 32);
  const pRingMat = new THREE.MeshBasicMaterial({ color: 0x7c3cff });
  disposables.push(pRingGeo, pRingMat);
  const pRing = new THREE.Mesh(pRingGeo, pRingMat);
  portalGroup.add(pRing);

  // Central Hologram Terminal Display
  const termCanvas = document.createElement('canvas');
  termCanvas.width = 512;
  termCanvas.height = 256;
  const tCtx = termCanvas.getContext('2d')!;
  tCtx.fillStyle = 'rgba(5, 12, 28, 0.94)';
  tCtx.fillRect(0, 0, 512, 256);
  tCtx.strokeStyle = '#00eaff';
  tCtx.lineWidth = 4;
  tCtx.strokeRect(4, 4, 504, 248);

  tCtx.fillStyle = '#00eaff';
  tCtx.font = 'bold 24px monospace';
  tCtx.fillText('COMMUNICATIONS GATEWAY', 24, 44);

  tCtx.fillStyle = '#ffffff';
  tCtx.font = '16px monospace';
  tCtx.fillText('• Email: rishukatiyar001@gmail.com', 24, 90);
  tCtx.fillText('• Web: rishukatiyar.pp.ua', 24, 125);
  tCtx.fillText('• GitHub: github.com/rishukatiyar001', 24, 160);
  tCtx.fillText('• LinkedIn: in/rishu-katiyar-086757233', 24, 195);
  tCtx.fillStyle = '#00ffa3';
  tCtx.fillText('STATUS: OPEN FOR HIGH-IMPACT ROLES', 24, 230);

  const termTex = new THREE.CanvasTexture(termCanvas);
  disposables.push(termTex);
  const termGeo = new THREE.PlaneGeometry(3.6, 1.8);
  const termMat = new THREE.MeshBasicMaterial({ map: termTex, transparent: true, side: THREE.DoubleSide });
  disposables.push(termGeo, termMat);
  const termMesh = new THREE.Mesh(termGeo, termMat);
  termMesh.position.set(0, 1.6, 1.5);
  group.add(termMesh);

  // Interactive Portal Hit
  const hitGeo = new THREE.CylinderGeometry(3.6, 3.6, 6, 16);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  disposables.push(hitGeo, hitMat);
  const hit = new THREE.Mesh(hitGeo, hitMat);
  hit.position.set(0, 1.8, 0);
  const data: InteractiveObjectData = {
    type: 'world-trigger',
    id: 'contact-gateway',
    worldId: 'contact',
    label: 'Contact Gateway',
    description: 'Connect with Rishu Katiyar for full stack engineering opportunities'
  };
  hit.userData = data;
  group.add(hit);
  interactiveMeshes.push(hit);

  return {
    group,
    interactiveMeshes,
    update: (delta: number, elapsed: number) => {
      pRing.rotation.z += 0.015;
      vortex.rotation.z -= 0.008;
      termMesh.position.y = 1.6 + Math.sin(elapsed * 2) * 0.08;
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
