import * as THREE from 'three';
import { ExperienceItem } from '../../models/portfolio.models';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export function createExperienceWorld(experience: ExperienceItem[]): WorldBuilderResult {
  const group = new THREE.Group();
  group.position.set(360, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];
  const beaconRings: THREE.Mesh[] = [];

  // Glowing Timeline Rail
  const railGeo = new THREE.BoxGeometry(16, 0.1, 0.4);
  const railMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });
  disposables.push(railGeo, railMat);
  const rail = new THREE.Mesh(railGeo, railMat);
  rail.position.set(0, 0, 0);
  group.add(rail);

  // Localized experience timeline lighting
  const expLight = new THREE.PointLight(0x00ffa3, 4, 30);
  expLight.position.set(0, 3, 5);
  group.add(expLight);
  const expViolet = new THREE.PointLight(0x7c3cff, 3, 30);
  expViolet.position.set(0, 2, -4);
  group.add(expViolet);

  // Timeline Milestones
  const spacing = 7;
  experience.forEach((exp, idx) => {
    const x = idx === 0 ? -spacing / 2 : spacing / 2;
    const expGroup = new THREE.Group();
    expGroup.position.set(x, 0, 0);
    group.add(expGroup);

    // Milestone Pylon
    const pylonGeo = new THREE.CylinderGeometry(0.3, 0.45, 2.2, 8);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x0e172a,
      metalness: 0.8,
      roughness: 0.2
    });
    disposables.push(pylonGeo, pylonMat);
    const pylon = new THREE.Mesh(pylonGeo, pylonMat);
    pylon.position.y = 1.1;
    expGroup.add(pylon);

    // Pulsing Beacon Crystal
    const beaconGeo = new THREE.OctahedronGeometry(0.4, 0);
    const beaconMat = new THREE.MeshBasicMaterial({ color: idx === 0 ? 0x00ffa3 : 0x7c3cff });
    disposables.push(beaconGeo, beaconMat);
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 2.4;
    expGroup.add(beacon);

    // Beacon Wave Ring
    const ringGeo = new THREE.RingGeometry(0.6, 0.68, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: idx === 0 ? 0x00ffa3 : 0x7c3cff, side: THREE.DoubleSide });
    disposables.push(ringGeo, ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 2.4;
    expGroup.add(ring);
    beaconRings.push(ring);

    // 3D Experience Information Card Plate
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 512;
    cardCanvas.height = 256;
    const cCtx = cardCanvas.getContext('2d')!;
    cCtx.fillStyle = 'rgba(6, 12, 28, 0.92)';
    cCtx.fillRect(0, 0, 512, 256);
    cCtx.strokeStyle = idx === 0 ? '#00ffa3' : '#7c3cff';
    cCtx.lineWidth = 4;
    cCtx.strokeRect(4, 4, 504, 248);

    cCtx.fillStyle = idx === 0 ? '#00ffa3' : '#7c3cff';
    cCtx.font = 'bold 24px monospace';
    cCtx.fillText(exp.period, 24, 44);

    cCtx.fillStyle = '#ffffff';
    cCtx.font = 'bold 24px sans-serif';
    cCtx.fillText(exp.role, 24, 86);

    cCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    cCtx.font = '16px monospace';
    cCtx.fillText(exp.companyOrContext, 24, 124);

    cCtx.fillStyle = '#a0aec0';
    cCtx.font = '15px sans-serif';
    cCtx.fillText(exp.summary.substring(0, 48) + '...', 24, 165);

    cCtx.fillStyle = '#38bdf8';
    cCtx.font = '14px monospace';
    cCtx.fillText(`Stack: ${exp.keyStack.slice(0, 5).join(' • ')}`, 24, 210);

    const cardTex = new THREE.CanvasTexture(cardCanvas);
    disposables.push(cardTex);
    const cardGeo = new THREE.PlaneGeometry(3.6, 1.8);
    const cardMat = new THREE.MeshBasicMaterial({ map: cardTex, transparent: true, side: THREE.DoubleSide });
    disposables.push(cardGeo, cardMat);
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    cardMesh.position.set(0, 3.8, 0);
    expGroup.add(cardMesh);

    // Interactive Hit
    const hitGeo = new THREE.BoxGeometry(3.8, 4.5, 1.2);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.position.set(0, 2.5, 0);
    const data: InteractiveObjectData = {
      type: 'project-item',
      id: `experience-${idx}`,
      label: `${exp.role} (${exp.period})`,
      description: exp.summary,
      accentColor: idx === 0 ? '#00ffa3' : '#7c3cff',
      payload: exp
    };
    hit.userData = data;
    expGroup.add(hit);
    interactiveMeshes.push(hit);
  });

  return {
    group,
    interactiveMeshes,
    update: (delta: number, elapsed: number) => {
      beaconRings.forEach((r, idx) => {
        r.rotation.z += 0.02;
        const scale = 1 + (Math.sin(elapsed * 3 + idx) + 1) * 0.2;
        r.scale.set(scale, scale, 1);
      });
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
