import * as THREE from 'three';
import { ErpStageItem } from '../../models/portfolio.models';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export function createErpWorld(erpStages: ErpStageItem[] = []): WorldBuilderResult {
  const group = new THREE.Group();
  group.position.set(90, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];

  // City ground base
  const groundGeo = new THREE.BoxGeometry(24, 0.4, 24);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x060914,
    metalness: 0.9,
    roughness: 0.3
  });
  disposables.push(groundGeo, groundMat);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -1.5;
  group.add(ground);

  // Grid lines
  const grid = new THREE.GridHelper(24, 24, 0x00ffa3, 0x14203d);
  grid.position.y = -1.29;
  group.add(grid);

  // Localized smart grid lighting
  const erpLight = new THREE.PointLight(0x00ffa3, 4, 35);
  erpLight.position.set(0, 6, 6);
  group.add(erpLight);
  const erpCyan = new THREE.PointLight(0x00eaff, 3, 30);
  erpCyan.position.set(-6, 4, -4);
  group.add(erpCyan);

  // Digital Buildings with window glow textures (Smart City)
  const buildingMat = new THREE.MeshStandardMaterial({
    color: 0x0c162d,
    metalness: 0.7,
    roughness: 0.4
  });
  disposables.push(buildingMat);

  const meterBeacons: THREE.Mesh[] = [];

  const buildings = [
    { x: -7.5, z: -6.5, w: 2.2, h: 4.8, d: 2.2 },
    { x: -3.5, z: -7.5, w: 2.6, h: 6.2, d: 2.4 },
    { x: 3.5, z: -7.5, w: 2.4, h: 5.4, d: 2.4 },
    { x: 7.5, z: -6.0, w: 2.2, h: 4.2, d: 2.2 },

    { x: -8.5, z: -1.0, w: 2.4, h: 3.8, d: 2.4 },
    { x: 8.5, z: 0.5, w: 2.6, h: 5.0, d: 2.6 },

    { x: -7.0, z: 5.5, w: 2.2, h: 3.5, d: 2.2 },
    { x: 7.0, z: 5.5, w: 2.2, h: 3.2, d: 2.2 }
  ];

  buildings.forEach(b => {
    const bGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
    disposables.push(bGeo);
    const bMesh = new THREE.Mesh(bGeo, buildingMat);
    bMesh.position.set(b.x, -1.3 + b.h / 2, b.z);
    group.add(bMesh);

    // Smart Meter box attached to building
    const meterGeo = new THREE.BoxGeometry(0.35, 0.5, 0.2);
    const meterMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8 });
    disposables.push(meterGeo, meterMat);
    const meter = new THREE.Mesh(meterGeo, meterMat);
    meter.position.set(b.x, 0.2, b.z + b.d / 2 + 0.11);
    group.add(meter);

    // Smart Meter Pulsing LED Beacon
    const ledGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
    disposables.push(ledGeo, ledMat);
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(b.x, 0.32, b.z + b.d / 2 + 0.22);
    group.add(led);
    meterBeacons.push(led);
  });

  // Central Smart Grid Substation & Automated Billing Terminal Tower
  const towerGroup = new THREE.Group();
  towerGroup.position.set(0, 0, 0);
  group.add(towerGroup);

  const towerGeo = new THREE.CylinderGeometry(1.6, 2.2, 5.5, 8);
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0x071120,
    metalness: 0.9,
    roughness: 0.2
  });
  disposables.push(towerGeo, towerMat);
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.y = 1.45;
  towerGroup.add(tower);

  // Glowing energy ring on tower
  const energyRingGeo = new THREE.TorusGeometry(1.9, 0.08, 8, 32);
  const energyRingMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });
  disposables.push(energyRingGeo, energyRingMat);
  const energyRing = new THREE.Mesh(energyRingGeo, energyRingMat);
  energyRing.position.y = 3.6;
  energyRing.rotation.x = Math.PI / 2;
  towerGroup.add(energyRing);

  // Floating Holographic Billing Dashboard
  const dashCanvas = document.createElement('canvas');
  dashCanvas.width = 512;
  dashCanvas.height = 256;
  const dCtx = dashCanvas.getContext('2d')!;
  dCtx.fillStyle = 'rgba(5, 12, 26, 0.92)';
  dCtx.fillRect(0, 0, 512, 256);
  dCtx.strokeStyle = '#00ffa3';
  dCtx.lineWidth = 4;
  dCtx.strokeRect(4, 4, 504, 248);

  dCtx.fillStyle = '#00ffa3';
  dCtx.font = 'bold 24px monospace';
  dCtx.fillText('SMART GRID // ERP TELEMETRY', 24, 44);

  dCtx.fillStyle = '#ffffff';
  dCtx.font = '16px monospace';
  dCtx.fillText('Flow: METER > DATA > API > DB > BILLING > PAY', 24, 88);
  dCtx.fillText('Tariff Pipeline: Dapper SP @ 1.8ms', 24, 125);
  dCtx.fillText('Billing Cycle: Automated Realtime', 24, 160);
  dCtx.fillStyle = '#00eaff';
  dCtx.fillText('Consumer Recharge: Ready (Web + Ionic)', 24, 195);
  dCtx.fillStyle = '#ffd000';
  dCtx.fillText('Ledger Sync: SQL Server ACID OK', 24, 230);

  const dashTex = new THREE.CanvasTexture(dashCanvas);
  disposables.push(dashTex);
  const dashGeo = new THREE.PlaneGeometry(3.6, 1.8);
  const dashMat = new THREE.MeshBasicMaterial({ map: dashTex, transparent: true, side: THREE.DoubleSide });
  disposables.push(dashGeo, dashMat);
  const dashMesh = new THREE.Mesh(dashGeo, dashMat);
  dashMesh.position.set(0, 5.2, 0);
  towerGroup.add(dashMesh);

  // Transmission line data pulses connecting meters to substation
  const streamPoints: THREE.Vector3[] = [];
  meterBeacons.forEach(mb => {
    streamPoints.push(mb.position.clone(), new THREE.Vector3(0, 3.6, 0));
  });

  const lineGeo = new THREE.BufferGeometry().setFromPoints(streamPoints);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffa3, transparent: true, opacity: 0.35 });
  disposables.push(lineGeo, lineMat);
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  // ==============================================================
  // VISUAL FLOW: METER → DATA → API → DATABASE → BILLING → RECHARGE/PAYMENT
  // ==============================================================
  const flowConduitPoints: THREE.Vector3[] = [];
  const stageCount = erpStages.length > 0 ? erpStages.length : 6;
  const stageRadius = 6.2;
  const stageMeshes: Array<{ mesh: THREE.Mesh; baseY: number; color: string }> = [];

  erpStages.forEach((stage, idx) => {
    // Arc spanning the foreground
    const angle = (idx / (stageCount - 1)) * Math.PI * 0.85 - Math.PI * 0.425;
    const x = Math.sin(angle) * stageRadius;
    const z = Math.cos(angle) * (stageRadius * 0.65) + 1.2;
    const y = 0.2;

    flowConduitPoints.push(new THREE.Vector3(x, y + 0.3, z));

    // Base pedestal
    const pedGeo = new THREE.CylinderGeometry(0.7, 0.85, 0.3, 16);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x0a1426,
      metalness: 0.8,
      roughness: 0.25
    });
    disposables.push(pedGeo, pedMat);
    const ped = new THREE.Mesh(pedGeo, pedMat);
    ped.position.set(x, y - 0.15, z);
    group.add(ped);

    // Stage core crystal
    const hexColor = parseInt(stage.color.replace('#', '0x'), 16);
    const coreGeo = new THREE.OctahedronGeometry(0.38, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: hexColor,
      emissive: hexColor,
      emissiveIntensity: 0.65,
      metalness: 0.3,
      roughness: 0.2
    });
    disposables.push(coreGeo, coreMat);
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(x, y + 0.35, z);
    group.add(core);
    stageMeshes.push({ mesh: core, baseY: y + 0.35, color: stage.color });

    // Orbital Ring
    const rGeo = new THREE.TorusGeometry(0.55, 0.02, 8, 20);
    const rMat = new THREE.MeshBasicMaterial({ color: hexColor });
    disposables.push(rGeo, rMat);
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.position.set(x, y + 0.35, z);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // 3D Stage Label
    const lCanvas = document.createElement('canvas');
    lCanvas.width = 384;
    lCanvas.height = 128;
    const lCtx = lCanvas.getContext('2d')!;
    lCtx.fillStyle = 'rgba(4, 9, 20, 0.9)';
    lCtx.fillRect(0, 0, 384, 128);
    lCtx.strokeStyle = stage.color;
    lCtx.lineWidth = 3;
    lCtx.strokeRect(3, 3, 378, 122);

    lCtx.fillStyle = stage.color;
    lCtx.font = 'bold 18px monospace';
    lCtx.fillText(`STAGE 0${stage.step} // FLOW`, 18, 36);

    lCtx.fillStyle = '#ffffff';
    lCtx.font = 'bold 22px sans-serif';
    lCtx.fillText(stage.name.length > 22 ? stage.name.substring(0, 20) + '...' : stage.name, 18, 75);

    lCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    lCtx.font = '14px monospace';
    lCtx.fillText(stage.technology.length > 25 ? stage.technology.substring(0, 23) + '...' : stage.technology, 18, 108);

    const lTex = new THREE.CanvasTexture(lCanvas);
    disposables.push(lTex);
    const lGeo = new THREE.PlaneGeometry(1.4, 0.48);
    const lMat = new THREE.MeshBasicMaterial({ map: lTex, transparent: true, side: THREE.DoubleSide });
    disposables.push(lGeo, lMat);
    const labelMesh = new THREE.Mesh(lGeo, lMat);
    labelMesh.position.set(x, y + 1.05, z);
    group.add(labelMesh);

    // Interactive Hit Target
    const hitGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.8, 12);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.position.set(x, y + 0.4, z);
    const data: InteractiveObjectData = {
      type: 'erp-stage',
      id: stage.id,
      label: stage.name,
      description: stage.flowRole,
      accentColor: stage.color,
      payload: stage
    };
    hit.userData = data;
    group.add(hit);
    interactiveMeshes.push(hit);
  });

  // Glowing Flow Conduit Tube
  let flowCurve: THREE.CatmullRomCurve3 | null = null;
  const flowPackets: THREE.Mesh[] = [];
  const flowPacketCount = 6;

  if (flowConduitPoints.length >= 2) {
    flowCurve = new THREE.CatmullRomCurve3(flowConduitPoints);
    const tubeGeo = new THREE.TubeGeometry(flowCurve, 48, 0.04, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3, transparent: true, opacity: 0.6 });
    disposables.push(tubeGeo, tubeMat);
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(tube);

    // Animated Data Flow Packets
    const pGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const pMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
    disposables.push(pGeo, pMat);

    for (let i = 0; i < flowPacketCount; i++) {
      const pkt = new THREE.Mesh(pGeo, pMat);
      group.add(pkt);
      flowPackets.push(pkt);
    }
  }

  // Central Substation Interactive Hit
  const towerHitGeo = new THREE.CylinderGeometry(2.2, 2.2, 5.5, 8);
  const towerHitMat = new THREE.MeshBasicMaterial({ visible: false });
  disposables.push(towerHitGeo, towerHitMat);
  const towerHit = new THREE.Mesh(towerHitGeo, towerHitMat);
  towerHit.position.y = 2.5;
  const towerData: InteractiveObjectData = {
    type: 'project-item',
    id: 'erp-meter-billing',
    label: 'ERP & Smart Meter Billing System',
    description: 'Enterprise smart grid energy meter telemetry, dynamic tariff calculations & consumer mobile recharge engine',
    accentColor: '#00ffa3'
  };
  towerHit.userData = towerData;
  towerGroup.add(towerHit);
  interactiveMeshes.push(towerHit);

  return {
    group,
    interactiveMeshes,
    update: (delta: number, elapsed: number) => {
      // Pulse beacons
      const pulse = (Math.sin(elapsed * 4) + 1) * 0.5;
      meterBeacons.forEach((mb, idx) => {
        (mb.material as THREE.MeshBasicMaterial).opacity = 0.4 + 0.6 * ((pulse + idx * 0.1) % 1);
      });

      // Spin energy ring
      energyRing.rotation.z += 0.015;
      energyRing.position.y = 3.6 + Math.sin(elapsed * 2) * 0.15;

      // Animate stage crystals
      stageMeshes.forEach((sm, idx) => {
        sm.mesh.rotation.y += 0.02 * (idx % 2 === 0 ? 1 : -1);
        sm.mesh.position.y = sm.baseY + Math.sin(elapsed * 2.5 + idx) * 0.06;
      });

      // Move data flow packets along visual pipeline
      if (flowCurve && flowPackets.length > 0) {
        flowPackets.forEach((pkt, i) => {
          const t = (elapsed * 0.2 + i / flowPacketCount) % 1;
          const pt = flowCurve!.getPointAt(t);
          pkt.position.copy(pt);
          pkt.scale.setScalar(1 + Math.sin(elapsed * 5 + i) * 0.25);
        });
      }
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
