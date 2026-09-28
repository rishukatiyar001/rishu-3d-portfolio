import * as THREE from 'three';
import { PaymentStageItem } from '../../models/portfolio.models';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export function createPaymentsWorld(paymentStages: PaymentStageItem[] = []): WorldBuilderResult {
  const group = new THREE.Group();
  group.position.set(135, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];

  // Localized cryptographic tunnel lighting
  const payLight = new THREE.PointLight(0x7c3cff, 5, 35);
  payLight.position.set(0, 3, 4);
  group.add(payLight);
  const payCyan = new THREE.PointLight(0x00eaff, 4, 30);
  payCyan.position.set(0, 2, -6);
  group.add(payCyan);

  // Ground grid
  const grid = new THREE.GridHelper(26, 26, 0x7c3cff, 0x141030);
  grid.position.y = -1.45;
  group.add(grid);

  // Transaction Tunnel Rings
  const ringCount = 18;
  const tunnelLength = 26;
  const tunnelRings: THREE.Mesh[] = [];

  for (let i = 0; i < ringCount; i++) {
    const z = (i / ringCount) * tunnelLength - tunnelLength / 2;
    const ringGeo = new THREE.TorusGeometry(3.6, 0.07, 8, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x7c3cff : 0x00eaff,
      transparent: true,
      opacity: 0.55
    });
    disposables.push(ringGeo, ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 1.8, z);
    group.add(ring);
    tunnelRings.push(ring);
  }

  // Central Cryptographic Core: Rotating HMAC SHA256 Chamber
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 1.8, 0);
  group.add(coreGroup);

  const hmacGeo = new THREE.IcosahedronGeometry(1.3, 0);
  const hmacMat = new THREE.MeshStandardMaterial({
    color: 0x7c3cff,
    emissive: 0x4a148c,
    emissiveIntensity: 0.8,
    metalness: 0.9,
    roughness: 0.15,
    wireframe: true
  });
  disposables.push(hmacGeo, hmacMat);
  const hmacMesh = new THREE.Mesh(hmacGeo, hmacMat);
  coreGroup.add(hmacMesh);

  // Inner glowing payload sphere
  const sphereGeo = new THREE.SphereGeometry(0.75, 24, 24);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x00eaff,
    emissive: 0x00eaff,
    emissiveIntensity: 0.7,
    metalness: 0.1,
    roughness: 0.2
  });
  disposables.push(sphereGeo, sphereMat);
  const payloadSphere = new THREE.Mesh(sphereGeo, sphereMat);
  coreGroup.add(payloadSphere);

  // Outer Hexagonal Security Shield
  const shieldGeo = new THREE.RingGeometry(2.1, 2.2, 6);
  const shieldMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3, side: THREE.DoubleSide });
  disposables.push(shieldGeo, shieldMat);
  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  coreGroup.add(shield);

  // Holographic Technical Overhead Display
  const payCanvas = document.createElement('canvas');
  payCanvas.width = 512;
  payCanvas.height = 280;
  const pCtx = payCanvas.getContext('2d')!;
  pCtx.fillStyle = 'rgba(7, 10, 24, 0.92)';
  pCtx.fillRect(0, 0, 512, 280);
  pCtx.strokeStyle = '#7c3cff';
  pCtx.lineWidth = 4;
  pCtx.strokeRect(4, 4, 504, 272);

  pCtx.fillStyle = '#7c3cff';
  pCtx.font = 'bold 22px monospace';
  pCtx.fillText('ICICI FINTECH // CRYPTO TUNNEL', 24, 40);

  pCtx.fillStyle = '#00eaff';
  pCtx.font = '14px monospace';
  pCtx.fillText('Alg: HMAC-SHA256 Payload Signing', 24, 80);
  pCtx.fillText('Flow: REQUEST > HASH > GATEWAY > TXN > CALLBACK > RESULT', 24, 114);
  pCtx.fillText('Validation: Idempotent Ledger Lock', 24, 148);

  pCtx.fillStyle = '#00ffa3';
  pCtx.fillText('Webhook: Async Status Callback Controller', 24, 188);
  pCtx.fillText('Deep Link: myapp://payment-result (Android/iOS)', 24, 220);
  pCtx.fillStyle = '#ffd000';
  pCtx.fillText('Zero-Trust: Merchant credentials isolated in Azure Key Vault', 24, 252);

  const payTex = new THREE.CanvasTexture(payCanvas);
  disposables.push(payTex);
  const payGeo = new THREE.PlaneGeometry(3.6, 2.0);
  const payMat = new THREE.MeshBasicMaterial({ map: payTex, transparent: true, side: THREE.DoubleSide });
  disposables.push(payGeo, payMat);
  const payMesh = new THREE.Mesh(payGeo, payMat);
  payMesh.position.set(0, 4.4, 0);
  group.add(payMesh);

  // ==============================================================
  // 6 INTERACTIVE TRANSACTION CHECKPOINTS ALONG THE TUNNEL
  // REQUEST → HASH → PAYMENT → TRANSACTION → CALLBACK → RESULT
  // ==============================================================
  const stageZPositions = [-10.5, -6.3, -2.1, 2.1, 6.3, 10.5];
  const checkpointMeshes: THREE.Mesh[] = [];

  paymentStages.forEach((stage, idx) => {
    const z = stageZPositions[idx] !== undefined ? stageZPositions[idx] : -10 + idx * 4;
    const hexColor = parseInt(stage.color.replace('#', '0x'), 16);

    // Gate marker ring
    const gGeo = new THREE.TorusGeometry(3.4, 0.05, 8, 32);
    const gMat = new THREE.MeshBasicMaterial({ color: hexColor, transparent: true, opacity: 0.85 });
    disposables.push(gGeo, gMat);
    const gate = new THREE.Mesh(gGeo, gMat);
    gate.position.set(0, 1.8, z);
    group.add(gate);
    checkpointMeshes.push(gate);

    // Floating 3D Checkpoint Label
    const cCanvas = document.createElement('canvas');
    cCanvas.width = 384;
    cCanvas.height = 136;
    const cCtx = cCanvas.getContext('2d')!;
    cCtx.fillStyle = 'rgba(5, 8, 20, 0.92)';
    cCtx.fillRect(0, 0, 384, 136);
    cCtx.strokeStyle = stage.color;
    cCtx.lineWidth = 3;
    cCtx.strokeRect(3, 3, 378, 130);

    cCtx.fillStyle = stage.color;
    cCtx.font = 'bold 18px monospace';
    cCtx.fillText(`[STAGE 0${stage.order}: ${stage.stage}]`, 18, 36);

    cCtx.fillStyle = '#ffffff';
    cCtx.font = 'bold 20px sans-serif';
    cCtx.fillText(stage.name.length > 22 ? stage.name.substring(0, 20) + '...' : stage.name, 18, 74);

    cCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    cCtx.font = '14px monospace';
    cCtx.fillText(stage.protocolOrAlgorithm.length > 26 ? stage.protocolOrAlgorithm.substring(0, 24) + '...' : stage.protocolOrAlgorithm, 18, 110);

    const cTex = new THREE.CanvasTexture(cCanvas);
    disposables.push(cTex);
    const cGeo = new THREE.PlaneGeometry(1.5, 0.55);
    const cMat = new THREE.MeshBasicMaterial({ map: cTex, transparent: true, side: THREE.DoubleSide });
    disposables.push(cGeo, cMat);
    const cMesh = new THREE.Mesh(cGeo, cMat);
    cMesh.position.set(idx % 2 === 0 ? -2.2 : 2.2, 0.6, z);
    group.add(cMesh);

    // Interactive Hit Target
    const hitGeo = new THREE.BoxGeometry(2.4, 2.4, 2.0);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);
    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.position.set(0, 1.8, z);
    const data: InteractiveObjectData = {
      type: 'payment-stage',
      id: stage.id,
      label: `${stage.stage}: ${stage.name}`,
      description: stage.technicalRole,
      accentColor: stage.color,
      payload: stage
    };
    hit.userData = data;
    group.add(hit);
    interactiveMeshes.push(hit);
  });

  // Animated Core Transaction Packet traveling along tunnel z-axis
  const activeTxnGeo = new THREE.SphereGeometry(0.24, 16, 16);
  const activeTxnMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
  disposables.push(activeTxnGeo, activeTxnMat);
  const activeTxn = new THREE.Mesh(activeTxnGeo, activeTxnMat);
  group.add(activeTxn);

  // Background Stream Sparks
  const sparkCount = 24;
  const sparkGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });
  disposables.push(sparkGeo, sparkMat);
  const sparks: THREE.Mesh[] = [];

  for (let i = 0; i < sparkCount; i++) {
    const s = new THREE.Mesh(sparkGeo, sparkMat);
    s.position.set(
      (Math.random() - 0.5) * 2.8,
      1.8 + (Math.random() - 0.5) * 2.8,
      (Math.random() - 0.5) * tunnelLength
    );
    group.add(s);
    sparks.push(s);
  }

  return {
    group,
    interactiveMeshes,
    update: (delta: number, elapsed: number) => {
      // Rotate crypto core
      hmacMesh.rotation.x = elapsed * 0.8;
      hmacMesh.rotation.y = elapsed * 1.1;
      shield.rotation.z = -elapsed * 0.5;
      payloadSphere.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.08);

      // Pulse tunnel rings
      tunnelRings.forEach((r, idx) => {
        r.rotation.z = Math.sin(elapsed + idx * 0.3) * 0.2;
      });

      // Animate active transaction moving sequentially through checkpoints (-12 to +12)
      const txnProgress = (elapsed * 0.28) % 1;
      const curZ = -12 + txnProgress * 24;
      activeTxn.position.set(
        Math.sin(elapsed * 4) * 0.3,
        1.8 + Math.cos(elapsed * 4) * 0.3,
        curZ
      );
      activeTxn.scale.setScalar(1 + Math.sin(elapsed * 8) * 0.3);

      // Shift sparks
      sparks.forEach(s => {
        s.position.z += 0.3;
        if (s.position.z > tunnelLength / 2) {
          s.position.z = -tunnelLength / 2;
        }
      });
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
