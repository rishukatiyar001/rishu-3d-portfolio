import * as THREE from 'three';
import { ArchitectureNode } from '../../models/portfolio.models';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export function createArchitectureWorld(nodes: ArchitectureNode[]): WorldBuilderResult {
  const group = new THREE.Group();
  group.position.set(45, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];

  // Floor grid
  const gridHelper = new THREE.GridHelper(26, 26, 0x00eaff, 0x111c38);
  gridHelper.position.y = -1.5;
  group.add(gridHelper);

  // Localized dramatic lighting
  const archLight = new THREE.PointLight(0x00eaff, 4, 30);
  archLight.position.set(0, 4, 6);
  group.add(archLight);
  const archViolet = new THREE.PointLight(0x7c3cff, 3, 30);
  archViolet.position.set(0, 2, -4);
  group.add(archViolet);

  // Pillar nodes for each tier
  const tierCores: Array<{ mesh: THREE.Mesh; color: string; baseY: number }> = [];
  const tierCount = nodes.length;

  // Connecting conduit curve
  const conduitPoints: THREE.Vector3[] = [];

  nodes.forEach((node, idx) => {
    // Stepped vertical pedestal with gentle spiral layout
    const angle = (idx / (tierCount - 1)) * Math.PI * 0.95 - Math.PI * 0.475;
    const radius = 6.2;
    const x = Math.sin(angle) * radius;
    const z = (Math.cos(angle) - 0.7) * 4.5;
    const y = -1.2 + idx * 0.85;

    conduitPoints.push(new THREE.Vector3(x, y + 0.35, z));

    // Base pedestal
    const pedGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.4, 16);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x0c1322,
      metalness: 0.8,
      roughness: 0.3
    });
    disposables.push(pedGeo, pedMat);
    const ped = new THREE.Mesh(pedGeo, pedMat);
    ped.position.set(x, y, z);
    group.add(ped);

    // Glowing core crystal
    const hexColor = parseInt(node.color.replace('#', '0x'), 16);
    const coreGeo = new THREE.OctahedronGeometry(0.48, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: hexColor,
      emissive: hexColor,
      emissiveIntensity: 0.6,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.95
    });
    disposables.push(coreGeo, coreMat);
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(x, y + 0.6, z);
    group.add(core);
    tierCores.push({ mesh: core, color: node.color, baseY: y + 0.6 });

    // Floating orbital ring
    const ringGeo = new THREE.TorusGeometry(0.75, 0.025, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: hexColor, transparent: true, opacity: 0.8 });
    disposables.push(ringGeo, ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(x, y + 0.6, z);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // Dynamic 3D Label plate
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 160;
    const lCtx = labelCanvas.getContext('2d')!;
    lCtx.fillStyle = 'rgba(6, 11, 24, 0.9)';
    lCtx.fillRect(0, 0, 512, 160);
    lCtx.strokeStyle = node.color;
    lCtx.lineWidth = 4;
    lCtx.strokeRect(4, 4, 504, 152);

    lCtx.fillStyle = node.color;
    lCtx.font = 'bold 26px monospace';
    lCtx.fillText(`TIER 0${node.tier} // ${node.category.toUpperCase()}`, 24, 44);

    lCtx.fillStyle = '#ffffff';
    lCtx.font = 'bold 30px sans-serif';
    lCtx.fillText(node.name, 24, 92);

    lCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    lCtx.font = '22px monospace';
    lCtx.fillText(node.technology, 24, 132);

    const labelTex = new THREE.CanvasTexture(labelCanvas);
    disposables.push(labelTex);
    const labelGeo = new THREE.PlaneGeometry(1.6, 0.5);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, side: THREE.DoubleSide });
    disposables.push(labelGeo, labelMat);
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.set(x, y + 1.45, z);
    group.add(labelMesh);

    // Interactive Hit Target
    const hitGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.position.set(x, y + 0.6, z);
    const data: InteractiveObjectData = {
      type: 'architecture-node',
      id: node.id,
      label: node.name,
      description: node.description,
      accentColor: node.color,
      payload: node
    };
    hit.userData = data;
    group.add(hit);
    interactiveMeshes.push(hit);
  });

  // Glowing Conduit Tube connecting all tiers
  const curve = new THREE.CatmullRomCurve3(conduitPoints);
  const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
  const tubeMat = new THREE.MeshBasicMaterial({
    color: 0x00eaff,
    transparent: true,
    opacity: 0.65
  });
  disposables.push(tubeGeo, tubeMat);
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  group.add(tube);

  // Animated Request Packets (Client -> Cloud) & Response Packets (Cloud -> Client)
  const reqCount = 5;
  const requestPackets: THREE.Mesh[] = [];
  const reqGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const reqMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });
  disposables.push(reqGeo, reqMat);

  for (let i = 0; i < reqCount; i++) {
    const packet = new THREE.Mesh(reqGeo, reqMat);
    group.add(packet);
    requestPackets.push(packet);
  }

  const resCount = 5;
  const responsePackets: THREE.Mesh[] = [];
  const resGeo = new THREE.SphereGeometry(0.13, 12, 12);
  const resMat = new THREE.MeshBasicMaterial({ color: 0x4dffb5 });
  disposables.push(resGeo, resMat);

  for (let i = 0; i < resCount; i++) {
    const packet = new THREE.Mesh(resGeo, resMat);
    group.add(packet);
    responsePackets.push(packet);
  }

  return {
    group,
    interactiveMeshes,
    update: (delta: number, elapsed: number) => {
      // Rotate cores
      tierCores.forEach((c, idx) => {
        c.mesh.rotation.y += 0.02 * (idx % 2 === 0 ? 1 : -1);
        c.mesh.rotation.x = Math.sin(elapsed * 2 + idx) * 0.2;
        c.mesh.position.y = c.baseY + Math.sin(elapsed * 2.5 + idx) * 0.08;
      });

      // Move REQUEST packets (Client -> Cloud, t from 0 to 1)
      requestPackets.forEach((pkt, i) => {
        const t = (elapsed * 0.22 + i / reqCount) % 1;
        const pt = curve.getPointAt(t);
        pkt.position.copy(pt);
        pkt.scale.setScalar(1 + Math.sin(elapsed * 6 + i) * 0.2);
      });

      // Move RESPONSE packets (Cloud -> Client, t from 1 to 0)
      responsePackets.forEach((pkt, i) => {
        const rawT = (elapsed * 0.22 + i / resCount) % 1;
        const t = 1 - rawT;
        const pt = curve.getPointAt(t);
        pkt.position.copy(pt);
        pkt.scale.setScalar(1 + Math.cos(elapsed * 6 + i) * 0.2);
      });
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
