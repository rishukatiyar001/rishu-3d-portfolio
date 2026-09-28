import * as THREE from 'three';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export interface WorkspaceWorldResult extends WorldBuilderResult {
  setMonitorPower: (powered: boolean) => void;
}

export function createWorkspaceWorld(initialMonitorPower = true): WorkspaceWorldResult {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];

  // Floor
  const floorGeo = new THREE.CircleGeometry(9, 48);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x04060e,
    metalness: 0.8,
    roughness: 0.35
  });
  disposables.push(floorGeo, floorMat);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.5;
  group.add(floor);

  // Concentric neon rings
  [5.2, 7.8].forEach((radius, idx) => {
    const ringGeo = new THREE.RingGeometry(radius, radius + 0.05, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: idx === 0 ? 0x00eaff : 0x7c3cff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    disposables.push(ringGeo, ringMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.48;
    group.add(ring);
  });

  // Futuristic desk
  const deskMat = new THREE.MeshStandardMaterial({
    color: 0x0c111e,
    metalness: 0.85,
    roughness: 0.25
  });
  disposables.push(deskMat);

  const topGeo = new THREE.BoxGeometry(5.6, 0.2, 2.2);
  disposables.push(topGeo);
  const desktop = new THREE.Mesh(topGeo, deskMat);
  desktop.position.set(0, -0.3, 0);
  group.add(desktop);

  // Desk cyan neon edge
  const edgeGeo = new THREE.BoxGeometry(5.62, 0.03, 0.04);
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });
  disposables.push(edgeGeo, edgeMat);
  const edge = new THREE.Mesh(edgeGeo, edgeMat);
  edge.position.set(0, -0.28, 1.11);
  group.add(edge);

  // Desk legs
  const legGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
  disposables.push(legGeo);
  [[-2.4, -0.9, -0.8], [2.4, -0.9, -0.8], [-2.4, -0.9, 0.8], [2.4, -0.9, 0.8]].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, deskMat);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  // Central Monitor: High-Tech Curved Monitor with dynamic architecture canvas
  const centralMonitorGroup = new THREE.Group();
  centralMonitorGroup.position.set(0, 1.45, -0.4);
  group.add(centralMonitorGroup);

  const monitorFrameGeo = new THREE.BoxGeometry(4.4, 2.2, 0.16);
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x060912,
    metalness: 0.9,
    roughness: 0.2
  });
  disposables.push(monitorFrameGeo, frameMat);
  const centralFrame = new THREE.Mesh(monitorFrameGeo, frameMat);
  centralMonitorGroup.add(centralFrame);

  // Screen canvas texture with real stack architecture
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024;
  screenCanvas.height = 512;
  const sCtx = screenCanvas.getContext('2d')!;

  function drawCentralScreen(time = 0): void {
    sCtx.fillStyle = '#030814';
    sCtx.fillRect(0, 0, 1024, 512);

    // Grid lines
    sCtx.strokeStyle = 'rgba(0, 234, 255, 0.08)';
    sCtx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 40) {
      sCtx.beginPath();
      sCtx.moveTo(x, 0);
      sCtx.lineTo(x, 512);
      sCtx.stroke();
    }
    for (let y = 0; y < 512; y += 40) {
      sCtx.beginPath();
      sCtx.moveTo(0, y);
      sCtx.lineTo(1024, y);
      sCtx.stroke();
    }

    // Header bar
    sCtx.fillStyle = '#0a1728';
    sCtx.fillRect(0, 0, 1024, 48);
    sCtx.fillStyle = '#00eaff';
    sCtx.font = 'bold 18px monospace';
    sCtx.fillText('RISHU.OS // FULL STACK CORE ARCHITECTURE', 24, 30);

    sCtx.fillStyle = '#4dffb5';
    sCtx.font = '14px monospace';
    sCtx.fillText('SYSTEM STATUS: ONLINE | 2+ YRS PROD', 680, 30);

    // Architecture flow nodes
    const nodes = [
      { label: 'CLIENT (Angular 21)', color: '#dd0031', sub: 'Reactive SPA & Ionic UI' },
      { label: 'API (ASP.NET Core)', color: '#512bd4', sub: 'REST Web API & Auth' },
      { label: 'LOGIC (C# Services)', color: '#00d9ff', sub: 'Clean Domain Rules' },
      { label: 'DATA (Dapper ORM)', color: '#ffd000', sub: 'High-Speed SQL Queries' },
      { label: 'DB (SQL Server)', color: '#cc292b', sub: 'Normalized Schemas & SPs' },
      { label: 'CLOUD (Azure Host)', color: '#0078d4', sub: 'App Services & Storage' }
    ];

    const startX = 60;
    const boxW = 135;
    const boxH = 90;
    const boxY = 160;

    nodes.forEach((n, idx) => {
      const curX = startX + idx * 155;
      sCtx.fillStyle = 'rgba(10, 25, 45, 0.85)';
      sCtx.strokeStyle = n.color;
      sCtx.lineWidth = 2;
      sCtx.strokeRect(curX, boxY, boxW, boxH);
      sCtx.fillRect(curX, boxY, boxW, boxH);

      sCtx.fillStyle = '#ffffff';
      sCtx.font = 'bold 13px sans-serif';
      sCtx.fillText(n.label, curX + 8, boxY + 32);

      sCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      sCtx.font = '10px monospace';
      sCtx.fillText(n.sub, curX + 8, boxY + 58);

      // Connecting arrow
      if (idx < nodes.length - 1) {
        sCtx.strokeStyle = 'rgba(0, 234, 255, 0.6)';
        sCtx.lineWidth = 2;
        sCtx.beginPath();
        sCtx.moveTo(curX + boxW, boxY + boxH / 2);
        sCtx.lineTo(curX + 155, boxY + boxH / 2);
        sCtx.stroke();
      }
    });

    // Animated data pulse on monitor
    const pulseOffset = (time * 120) % 800;
    sCtx.fillStyle = '#00eaff';
    sCtx.beginPath();
    sCtx.arc(startX + pulseOffset, boxY + boxH / 2, 4, 0, Math.PI * 2);
    sCtx.fill();

    // Terminal log line at bottom
    sCtx.fillStyle = '#040b15';
    sCtx.fillRect(0, 380, 1024, 132);
    sCtx.fillStyle = '#00ffa3';
    sCtx.font = '13px monospace';
    sCtx.fillText('> git commit -m "feat: smart grid meter billing & ICICI HMAC SHA256 integration"', 24, 415);
    sCtx.fillStyle = '#8be9fd';
    sCtx.fillText('> docker build -t rishu/meter-billing-core:latest . --platform linux/amd64', 24, 445);
    sCtx.fillStyle = '#bd93f9';
    sCtx.fillText('> az webapp deployment slot swap -g smartgrid-rg -n smartgrid-api', 24, 475);
  }

  drawCentralScreen(0);
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  disposables.push(screenTexture);

  const screenGeo = new THREE.PlaneGeometry(4.0, 1.9);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
  disposables.push(screenGeo, screenMat);
  const centralScreen = new THREE.Mesh(screenGeo, screenMat);
  centralScreen.position.z = 0.09;
  centralMonitorGroup.add(centralScreen);

  // Monitor stand
  const standGeo = new THREE.BoxGeometry(0.24, 1.1, 0.2);
  disposables.push(standGeo);
  const stand = new THREE.Mesh(standGeo, frameMat);
  stand.position.y = -1.3;
  centralMonitorGroup.add(stand);

  // Make central screen interactive
  const monitorHitGeo = new THREE.BoxGeometry(4.2, 2.0, 0.2);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  disposables.push(monitorHitGeo, hitMat);
  const monitorHit = new THREE.Mesh(monitorHitGeo, hitMat);
  monitorHit.position.copy(centralScreen.position);
  const monData: InteractiveObjectData = {
    type: 'world-trigger',
    id: 'architecture-monitor',
    worldId: 'architecture',
    label: 'Architecture Monitor',
    description: 'Explore full stack tier architecture'
  };
  monitorHit.userData = monData;
  centralMonitorGroup.add(monitorHit);
  interactiveMeshes.push(monitorHit);

  // Dual Side Monitors
  // Left: GitHub / CI/CD
  const leftMonitor = new THREE.Group();
  leftMonitor.position.set(-2.8, 1.35, -0.15);
  leftMonitor.rotation.y = 0.45;
  group.add(leftMonitor);

  const sideFrameGeo = new THREE.BoxGeometry(1.9, 1.4, 0.12);
  disposables.push(sideFrameGeo);
  const leftFrame = new THREE.Mesh(sideFrameGeo, frameMat);
  leftMonitor.add(leftFrame);

  const leftCanvas = document.createElement('canvas');
  leftCanvas.width = 512;
  leftCanvas.height = 384;
  const lCtx = leftCanvas.getContext('2d')!;
  lCtx.fillStyle = '#060a14';
  lCtx.fillRect(0, 0, 512, 384);
  lCtx.fillStyle = '#7c3cff';
  lCtx.font = 'bold 22px monospace';
  lCtx.fillText('GITHUB // CI/CD PIPELINE', 20, 45);
  lCtx.fillStyle = '#4dffb5';
  lCtx.font = '16px monospace';
  lCtx.fillText('Status: [PASSING] 42/42 tests', 20, 95);
  lCtx.fillStyle = '#8be9fd';
  lCtx.font = '14px monospace';
  lCtx.fillText('Branch: production -> Azure West US', 20, 140);
  lCtx.fillText('Docker Container: ID #8f2a1b9', 20, 175);
  lCtx.fillText('Dapper queries: 2.4ms p99', 20, 210);
  lCtx.fillText('SQL Server: 100% ACID compliant', 20, 245);
  lCtx.fillStyle = '#ffd000';
  lCtx.fillText('Recharge Gateway: ICICI Verified', 20, 290);
  const leftTexture = new THREE.CanvasTexture(leftCanvas);
  disposables.push(leftTexture);

  const sideScreenGeo = new THREE.PlaneGeometry(1.75, 1.25);
  disposables.push(sideScreenGeo);
  const leftScreenMat = new THREE.MeshBasicMaterial({ map: leftTexture });
  disposables.push(leftScreenMat);
  const leftScreen = new THREE.Mesh(sideScreenGeo, leftScreenMat);
  leftScreen.position.z = 0.07;
  leftMonitor.add(leftScreen);

  // Right Side Monitor: Mobile & Cloud
  const rightMonitor = new THREE.Group();
  rightMonitor.position.set(2.8, 1.35, -0.15);
  rightMonitor.rotation.y = -0.45;
  group.add(rightMonitor);

  const rightFrame = new THREE.Mesh(sideFrameGeo, frameMat);
  rightMonitor.add(rightFrame);

  const rightCanvas = document.createElement('canvas');
  rightCanvas.width = 512;
  rightCanvas.height = 384;
  const rCtx = rightCanvas.getContext('2d')!;
  rCtx.fillStyle = '#060a14';
  rCtx.fillRect(0, 0, 512, 384);
  rCtx.fillStyle = '#00ffa3';
  rCtx.font = 'bold 22px monospace';
  rCtx.fillText('MOBILE & CLOUD TELEMETRY', 20, 45);
  rCtx.fillStyle = '#00eaff';
  rCtx.font = '16px monospace';
  rCtx.fillText('Ionic / Capacitor: Android & iOS', 20, 95);
  rCtx.fillStyle = '#f1fa8c';
  rCtx.font = '14px monospace';
  rCtx.fillText('Camera scanner: ACTIVE', 20, 140);
  rCtx.fillText('SQLite local store: SYNCED', 20, 175);
  rCtx.fillText('Firebase Cloud Messaging: READY', 20, 210);
  rCtx.fillText('Azure App Service: SCALED 2x', 20, 245);
  rCtx.fillStyle = '#ff79c6';
  rCtx.fillText('Deep Link: myapp://recharge/success', 20, 290);
  const rightTexture = new THREE.CanvasTexture(rightCanvas);
  disposables.push(rightTexture);

  const rightScreenMat = new THREE.MeshBasicMaterial({ map: rightTexture });
  disposables.push(rightScreenMat);
  const rightScreen = new THREE.Mesh(sideScreenGeo, rightScreenMat);
  rightScreen.position.z = 0.07;
  rightMonitor.add(rightScreen);

  // Keyboard & Mouse on desk
  const kbGeo = new THREE.BoxGeometry(1.6, 0.05, 0.6);
  const kbMat = new THREE.MeshStandardMaterial({ color: 0x141a28, roughness: 0.3 });
  disposables.push(kbGeo, kbMat);
  const keyboard = new THREE.Mesh(kbGeo, kbMat);
  keyboard.position.set(0, -0.17, 0.45);
  group.add(keyboard);

  // RGB Keyboard Underglow
  const kbGlowGeo = new THREE.PlaneGeometry(1.64, 0.64);
  const kbGlowMat = new THREE.MeshBasicMaterial({ color: 0x00eaff, transparent: true, opacity: 0.35 });
  disposables.push(kbGlowGeo, kbGlowMat);
  const kbGlow = new THREE.Mesh(kbGlowGeo, kbGlowMat);
  kbGlow.rotation.x = -Math.PI / 2;
  kbGlow.position.set(0, -0.19, 0.45);
  group.add(kbGlow);

  const mouseGeo = new THREE.BoxGeometry(0.18, 0.04, 0.28);
  const mouseMat = new THREE.MeshStandardMaterial({ color: 0x00eaff, metalness: 0.8 });
  disposables.push(mouseGeo, mouseMat);
  const mouse = new THREE.Mesh(mouseGeo, mouseMat);
  mouse.position.set(1.1, -0.18, 0.45);
  group.add(mouse);

  // Developer Coffee Tumbler
  const mugGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.28, 16);
  const mugMat = new THREE.MeshStandardMaterial({ color: 0x1a2234, metalness: 0.8, roughness: 0.2 });
  disposables.push(mugGeo, mugMat);
  const mug = new THREE.Mesh(mugGeo, mugMat);
  mug.position.set(-1.25, -0.06, 0.4);
  group.add(mug);

  // ==============================================================
  // 1. HIGH-END ERGONOMIC CYBER GAMING CHAIR
  // ==============================================================
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0, -0.28, 1.45);
  group.add(chairGroup);

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x222a3d,
    metalness: 0.95,
    roughness: 0.15
  });
  const chairLeatherMat = new THREE.MeshStandardMaterial({
    color: 0x0a0e18,
    roughness: 0.45,
    metalness: 0.1
  });
  const chairAccentMat = new THREE.MeshStandardMaterial({
    color: 0x131d33,
    roughness: 0.35
  });
  const cyanPipingMat = new THREE.MeshBasicMaterial({ color: 0x00eaff });
  disposables.push(metalMat, chairLeatherMat, chairAccentMat, cyanPipingMat);

  // Hydraulic Piston Center
  const pistonGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.65, 16);
  disposables.push(pistonGeo);
  const piston = new THREE.Mesh(pistonGeo, metalMat);
  piston.position.y = -0.65;
  chairGroup.add(piston);

  // 5-Star Spider Base
  const baseLegCount = 5;
  for (let i = 0; i < baseLegCount; i++) {
    const angle = (i / baseLegCount) * Math.PI * 2;
    const legGeo = new THREE.BoxGeometry(0.08, 0.06, 0.75);
    disposables.push(legGeo);
    const leg = new THREE.Mesh(legGeo, metalMat);
    leg.position.set(Math.sin(angle) * 0.38, -0.92, Math.cos(angle) * 0.38);
    leg.rotation.y = angle;
    chairGroup.add(leg);

    // Caster wheel
    const wheelGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 12);
    disposables.push(wheelGeo);
    const wheel = new THREE.Mesh(wheelGeo, metalMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(Math.sin(angle) * 0.75, -0.98, Math.cos(angle) * 0.75);
    chairGroup.add(wheel);
  }

  // Seat Cushion with Side Bolsters
  const seatBaseGeo = new THREE.BoxGeometry(0.96, 0.16, 0.9);
  disposables.push(seatBaseGeo);
  const seatBase = new THREE.Mesh(seatBaseGeo, chairLeatherMat);
  seatBase.position.y = -0.3;
  chairGroup.add(seatBase);

  // Seat Side Bolsters (Racing Bucket style)
  [-0.45, 0.45].forEach(x => {
    const bGeo = new THREE.BoxGeometry(0.12, 0.18, 0.88);
    disposables.push(bGeo);
    const bMesh = new THREE.Mesh(bGeo, chairAccentMat);
    bMesh.position.set(x, -0.22, 0);
    chairGroup.add(bMesh);

    // Cyan Neon Piping along seat edge
    const pipeGeo = new THREE.BoxGeometry(0.02, 0.02, 0.88);
    disposables.push(pipeGeo);
    const pipe = new THREE.Mesh(pipeGeo, cyanPipingMat);
    pipe.position.set(x + (x > 0 ? 0.06 : -0.06), -0.14, 0);
    chairGroup.add(pipe);
  });

  // Ergonomic High Backrest
  const backGroup = new THREE.Group();
  backGroup.position.set(0, 0.45, 0.42);
  backGroup.rotation.x = -0.08; // natural 5-degree recline
  chairGroup.add(backGroup);

  const backGeo = new THREE.BoxGeometry(0.88, 1.25, 0.12);
  disposables.push(backGeo);
  const backrest = new THREE.Mesh(backGeo, chairLeatherMat);
  backGroup.add(backrest);

  // Shoulder Wings
  [-0.44, 0.44].forEach(x => {
    const wingGeo = new THREE.BoxGeometry(0.16, 0.65, 0.1);
    disposables.push(wingGeo);
    const wing = new THREE.Mesh(wingGeo, chairAccentMat);
    wing.position.set(x, 0.15, -0.06);
    wing.rotation.y = x > 0 ? -0.28 : 0.28;
    backGroup.add(wing);
  });

  // Dual Harness Airflow Vents (Iconic Gaming Cockpit Cutouts)
  [-0.18, 0.18].forEach(x => {
    const ventBorderGeo = new THREE.RingGeometry(0.07, 0.09, 16);
    disposables.push(ventBorderGeo);
    const vent = new THREE.Mesh(ventBorderGeo, cyanPipingMat);
    vent.position.set(x, 0.38, -0.07);
    backGroup.add(vent);
  });

  // Integrated Lumbar Pillow & Headrest Cushion
  const lumbarGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.65, 16);
  disposables.push(lumbarGeo);
  const lumbar = new THREE.Mesh(lumbarGeo, chairAccentMat);
  lumbar.rotation.z = Math.PI / 2;
  lumbar.position.set(0, -0.32, -0.08);
  backGroup.add(lumbar);

  const headrestGeo = new THREE.BoxGeometry(0.48, 0.22, 0.14);
  disposables.push(headrestGeo);
  const headrest = new THREE.Mesh(headrestGeo, chairAccentMat);
  headrest.position.set(0, 0.58, -0.08);
  backGroup.add(headrest);

  // Carbon Fiber Rear Backplate with Cyber Circuit Traces
  const rearPlateGeo = new THREE.PlaneGeometry(0.86, 1.22);
  const rearPlateMat = new THREE.MeshStandardMaterial({
    color: 0x050912,
    metalness: 0.9,
    roughness: 0.25
  });
  disposables.push(rearPlateGeo, rearPlateMat);
  const rearPlate = new THREE.Mesh(rearPlateGeo, rearPlateMat);
  rearPlate.position.set(0, 0, 0.07);
  backGroup.add(rearPlate);

  // Chair Armrests
  [-0.48, 0.48].forEach(x => {
    const postGeo = new THREE.BoxGeometry(0.05, 0.45, 0.06);
    disposables.push(postGeo);
    const post = new THREE.Mesh(postGeo, metalMat);
    post.position.set(x, -0.05, 0);
    chairGroup.add(post);

    const padGeo = new THREE.BoxGeometry(0.12, 0.04, 0.48);
    disposables.push(padGeo);
    const pad = new THREE.Mesh(padGeo, chairLeatherMat);
    pad.position.set(x, 0.18, -0.05);
    chairGroup.add(pad);
  });

  // ==============================================================
  // 2. STYLIZED CYBERPUNK TECHWEAR DEVELOPER (RISHU KATIYAR)
  // ==============================================================
  const devGroup = new THREE.Group();
  devGroup.position.set(0, 0.08, 1.4);
  group.add(devGroup);

  // Dynamic High-Res Hoodie Back Graphic Canvas Texture
  const hoodieCanvas = document.createElement('canvas');
  hoodieCanvas.width = 512;
  hoodieCanvas.height = 512;
  const hCtx = hoodieCanvas.getContext('2d')!;

  hCtx.fillStyle = '#0f1422';
  hCtx.fillRect(0, 0, 512, 512);

  // Tech grid background
  hCtx.strokeStyle = 'rgba(0, 234, 255, 0.06)';
  hCtx.lineWidth = 1;
  for (let i = 0; i < 512; i += 28) {
    hCtx.beginPath();
    hCtx.moveTo(i, 0);
    hCtx.lineTo(i, 512);
    hCtx.stroke();
    hCtx.beginPath();
    hCtx.moveTo(0, i);
    hCtx.lineTo(512, i);
    hCtx.stroke();
  }

  // Glowing Hexagon Insignia
  hCtx.strokeStyle = '#00eaff';
  hCtx.lineWidth = 5;
  hCtx.shadowColor = '#00eaff';
  hCtx.shadowBlur = 18;
  hCtx.beginPath();
  const hexRadius = 110;
  const hexX = 256;
  const hexY = 225;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 6;
    const x = hexX + hexRadius * Math.cos(a);
    const y = hexY + hexRadius * Math.sin(a);
    if (i === 0) hCtx.moveTo(x, y);
    else hCtx.lineTo(x, y);
  }
  hCtx.closePath();
  hCtx.stroke();

  // Core </> Code Symbol
  hCtx.fillStyle = '#ffffff';
  hCtx.font = '900 72px monospace';
  hCtx.textAlign = 'center';
  hCtx.textBaseline = 'middle';
  hCtx.shadowColor = '#00eaff';
  hCtx.shadowBlur = 24;
  hCtx.fillText('</>', 256, 222);

  // Typography
  hCtx.shadowBlur = 0;
  hCtx.fillStyle = '#00eaff';
  hCtx.font = 'bold 26px monospace';
  hCtx.fillText('RISHU KATIYAR', 256, 380);

  hCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  hCtx.font = 'bold 16px monospace';
  hCtx.fillText('FULL STACK // ARCHITECT', 256, 418);

  // Digital Circuit Line Accents
  hCtx.strokeStyle = '#7c3cff';
  hCtx.lineWidth = 3;
  hCtx.beginPath();
  hCtx.moveTo(70, 225); hCtx.lineTo(142, 225);
  hCtx.moveTo(370, 225); hCtx.lineTo(442, 225);
  hCtx.moveTo(256, 60); hCtx.lineTo(256, 112);
  hCtx.stroke();

  const hoodieTexture = new THREE.CanvasTexture(hoodieCanvas);
  disposables.push(hoodieTexture);

  // Materials
  const hoodieFabricMat = new THREE.MeshStandardMaterial({
    color: 0x111624,
    roughness: 0.7,
    metalness: 0.15
  });
  const hoodieGraphicMat = new THREE.MeshBasicMaterial({
    map: hoodieTexture
  });
  const skinToneMat = new THREE.MeshStandardMaterial({
    color: 0xd49b7d,
    roughness: 0.65,
    metalness: 0.05
  });
  const hairMeshMat = new THREE.MeshStandardMaterial({
    color: 0x111115,
    roughness: 0.45,
    metalness: 0.2
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x0c101c,
    roughness: 0.85
  });
  const headsetPlasticMat = new THREE.MeshStandardMaterial({
    color: 0x070b14,
    metalness: 0.8,
    roughness: 0.2
  });
  const headsetRgbMat = new THREE.MeshBasicMaterial({
    color: 0x00eaff
  });
  disposables.push(
    hoodieFabricMat,
    hoodieGraphicMat,
    skinToneMat,
    hairMeshMat,
    pantsMat,
    headsetPlasticMat,
    headsetRgbMat
  );

  // 1. Cargo Joggers / Seated Thighs
  [-0.22, 0.22].forEach(x => {
    const thighGeo = new THREE.CylinderGeometry(0.18, 0.15, 0.75, 14);
    disposables.push(thighGeo);
    const thigh = new THREE.Mesh(thighGeo, pantsMat);
    thigh.rotation.x = Math.PI / 2;
    thigh.position.set(x, -0.15, -0.4);
    devGroup.add(thigh);

    // Shin / Shoe going down
    const shinGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.6, 14);
    disposables.push(shinGeo);
    const shin = new THREE.Mesh(shinGeo, pantsMat);
    shin.position.set(x, -0.5, -0.65);
    devGroup.add(shin);

    // Cyber Sneaker
    const shoeGeo = new THREE.BoxGeometry(0.2, 0.14, 0.35);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x05070e, roughness: 0.3 });
    disposables.push(shoeGeo, shoeMat);
    const shoe = new THREE.Mesh(shoeGeo, shoeMat);
    shoe.position.set(x, -0.78, -0.6);
    devGroup.add(shoe);

    // Glowing Sneaker Sole
    const soleGeo = new THREE.BoxGeometry(0.21, 0.03, 0.36);
    disposables.push(soleGeo);
    const sole = new THREE.Mesh(soleGeo, cyanPipingMat);
    sole.position.set(x, -0.84, -0.6);
    devGroup.add(sole);
  });

  // 2. Athletic V-Taper Torso & Hoodie
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.25, -0.05);
  devGroup.add(torsoGroup);

  // Lower waist
  const lowerTorsoGeo = new THREE.CylinderGeometry(0.38, 0.34, 0.45, 16);
  disposables.push(lowerTorsoGeo);
  const lowerTorso = new THREE.Mesh(lowerTorsoGeo, hoodieFabricMat);
  lowerTorso.position.y = -0.08;
  torsoGroup.add(lowerTorso);

  // Broad Chest & Shoulders
  const upperChestGeo = new THREE.BoxGeometry(0.86, 0.48, 0.46);
  disposables.push(upperChestGeo);
  const upperChest = new THREE.Mesh(upperChestGeo, hoodieFabricMat);
  upperChest.position.y = 0.3;
  torsoGroup.add(upperChest);

  // Glowing Cyber Insignia Plate on Back of Hoodie (Directly facing the user camera!)
  const backGraphicGeo = new THREE.PlaneGeometry(0.68, 0.68);
  disposables.push(backGraphicGeo);
  const backGraphicMesh = new THREE.Mesh(backGraphicGeo, hoodieGraphicMat);
  backGraphicMesh.position.set(0, 0.22, 0.24);
  torsoGroup.add(backGraphicMesh);

  // Folded Fabric Hood Ring around Collar
  const hoodCollarGeo = new THREE.TorusGeometry(0.32, 0.08, 10, 24);
  disposables.push(hoodCollarGeo);
  const hoodCollar = new THREE.Mesh(hoodCollarGeo, hoodieFabricMat);
  hoodCollar.rotation.x = Math.PI / 2;
  hoodCollar.position.set(0, 0.52, 0.04);
  torsoGroup.add(hoodCollar);

  // 3. Neck & Stylized Chiseled Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.92, -0.02);
  devGroup.add(headGroup);

  const neckGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.22, 14);
  disposables.push(neckGeo);
  const neck = new THREE.Mesh(neckGeo, skinToneMat);
  neck.position.y = -0.15;
  headGroup.add(neck);

  // Head base
  const headGeo = new THREE.SphereGeometry(0.32, 24, 20);
  disposables.push(headGeo);
  const head = new THREE.Mesh(headGeo, skinToneMat);
  headGroup.add(head);

  // Volumetric Textured Modern Hair (Not a plain sphere)
  const hairGroup = new THREE.Group();
  hairGroup.position.set(0, 0.1, 0);
  headGroup.add(hairGroup);

  const mainHairGeo = new THREE.SphereGeometry(0.34, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.58);
  disposables.push(mainHairGeo);
  const mainHair = new THREE.Mesh(mainHairGeo, hairMeshMat);
  hairGroup.add(mainHair);

  // Faceted stylized textured hair tufts on top/front
  const tuftGeo = new THREE.DodecahedronGeometry(0.18, 0);
  disposables.push(tuftGeo);
  [
    [-0.1, 0.28, -0.12],
    [0.12, 0.29, -0.08],
    [0.0, 0.32, 0.06],
    [-0.12, 0.25, 0.15],
    [0.14, 0.24, 0.12]
  ].forEach(([tx, ty, tz]) => {
    const tuft = new THREE.Mesh(tuftGeo, hairMeshMat);
    tuft.position.set(tx, ty, tz);
    tuft.scale.set(1.1, 0.6, 1.2);
    hairGroup.add(tuft);
  });

  // 4. Pro Studio RGB Developer Headset
  const headsetGroup = new THREE.Group();
  headGroup.add(headsetGroup);

  // Steel Headband Arch spanning over hair
  const bandGeo = new THREE.TorusGeometry(0.35, 0.035, 8, 28, Math.PI);
  disposables.push(bandGeo);
  const band = new THREE.Mesh(bandGeo, headsetPlasticMat);
  band.rotation.z = Math.PI;
  band.rotation.y = Math.PI / 2;
  band.position.set(0, 0.12, 0);
  headsetGroup.add(band);

  // Padded Earcups with Glowing RGB Rings
  const earcupRings: THREE.Mesh[] = [];
  [-0.34, 0.34].forEach(x => {
    // Earcup Body
    const cupGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.1, 16);
    disposables.push(cupGeo);
    const cup = new THREE.Mesh(cupGeo, headsetPlasticMat);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(x, 0, 0);
    headsetGroup.add(cup);

    // Glowing RGB outer neon ring
    const rgbRingGeo = new THREE.RingGeometry(0.08, 0.12, 16);
    disposables.push(rgbRingGeo);
    const rgbRing = new THREE.Mesh(rgbRingGeo, headsetRgbMat);
    rgbRing.rotation.y = x > 0 ? -Math.PI / 2 : Math.PI / 2;
    rgbRing.position.set(x + (x > 0 ? 0.055 : -0.055), 0, 0);
    headsetGroup.add(rgbRing);
    earcupRings.push(rgbRing);
  });

  // Headset Boom Mic with glowing tip
  const micArmGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8);
  disposables.push(micArmGeo);
  const micArm = new THREE.Mesh(micArmGeo, headsetPlasticMat);
  micArm.position.set(0.3, -0.12, -0.22);
  micArm.rotation.set(-0.6, 0.4, 0.5);
  headsetGroup.add(micArm);

  const micTipGeo = new THREE.SphereGeometry(0.03, 8, 8);
  const micTipMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
  disposables.push(micTipGeo, micTipMat);
  const micTip = new THREE.Mesh(micTipGeo, micTipMat);
  micTip.position.set(0.24, -0.22, -0.34);
  headsetGroup.add(micTip);

  // 5. Stylized AR Smart Glasses / Cyber Eyewear
  const visorGeo = new THREE.BoxGeometry(0.48, 0.08, 0.12);
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x00eaff,
    emissive: 0x00eaff,
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85
  });
  disposables.push(visorGeo, visorMat);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.position.set(0, 0.02, -0.29);
  headGroup.add(visor);

  // 6. Arms & Typing Hands poising on Keyboard
  const armMat = hoodieFabricMat;
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.46, 0.48, -0.05);
  devGroup.add(leftArmGroup);

  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.46, 0.48, -0.05);
  devGroup.add(rightArmGroup);

  // Upper Arms
  const upperArmGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.48, 12);
  disposables.push(upperArmGeo);

  const leftUpperArm = new THREE.Mesh(upperArmGeo, armMat);
  leftUpperArm.position.set(-0.06, -0.2, -0.12);
  leftUpperArm.rotation.set(-0.55, 0.25, -0.3);
  leftArmGroup.add(leftUpperArm);

  const rightUpperArm = new THREE.Mesh(upperArmGeo, armMat);
  rightUpperArm.position.set(0.06, -0.2, -0.12);
  rightUpperArm.rotation.set(-0.55, -0.25, 0.3);
  rightArmGroup.add(rightUpperArm);

  // Forearms extending to keyboard
  const forearmGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.52, 12);
  disposables.push(forearmGeo);

  const leftForearm = new THREE.Mesh(forearmGeo, armMat);
  leftForearm.position.set(0.08, -0.44, -0.42);
  leftForearm.rotation.set(-1.1, 0.45, -0.5);
  leftArmGroup.add(leftForearm);

  const rightForearm = new THREE.Mesh(forearmGeo, armMat);
  rightForearm.position.set(-0.08, -0.44, -0.42);
  rightForearm.rotation.set(-1.1, -0.45, 0.5);
  rightArmGroup.add(rightForearm);

  // Smart Watch on Left Wrist
  const watchGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.04, 16);
  const watchMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
  disposables.push(watchGeo, watchMat);
  const watch = new THREE.Mesh(watchGeo, watchMat);
  watch.position.set(0.14, -0.58, -0.66);
  leftArmGroup.add(watch);

  // Hands & Articulated Typing Fingers over Keys
  const handGeo = new THREE.BoxGeometry(0.12, 0.045, 0.16);
  disposables.push(handGeo);

  const leftHand = new THREE.Mesh(handGeo, skinToneMat);
  leftHand.position.set(0.16, -0.62, -0.76);
  leftHand.rotation.set(-0.25, 0.2, -0.1);
  leftArmGroup.add(leftHand);

  const rightHand = new THREE.Mesh(handGeo, skinToneMat);
  rightHand.position.set(-0.16, -0.62, -0.76);
  rightHand.rotation.set(-0.25, -0.2, 0.1);
  rightArmGroup.add(rightHand);

  // Interactive Easter Egg: Developer character & workstation hit target
  const devHitGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.4, 14);
  const devHitMat = new THREE.MeshBasicMaterial({ visible: false });
  disposables.push(devHitGeo, devHitMat);
  const devHit = new THREE.Mesh(devHitGeo, devHitMat);
  devHit.position.y = 0.8;
  const devData: InteractiveObjectData = {
    type: 'easter-egg',
    id: 'developer-avatar',
    label: 'Rishu Katiyar',
    description: 'Full Stack Engineer with 2+ years experience building web, mobile, and cloud software systems.'
  };
  devHit.userData = devData;
  devGroup.add(devHit);
  interactiveMeshes.push(devHit);

  let lastScreenUpdate = 0;
  let isMonitorPowered = initialMonitorPower;
  centralScreen.visible = isMonitorPowered;
  leftScreen.visible = isMonitorPowered;
  rightScreen.visible = isMonitorPowered;

  function setMonitorPower(powered: boolean): void {
    isMonitorPowered = powered;
    centralScreen.visible = powered;
    leftScreen.visible = powered;
    rightScreen.visible = powered;
    if (powered) {
      drawCentralScreen(0);
      screenTexture.needsUpdate = true;
    }
  }

  return {
    group,
    interactiveMeshes,
    setMonitorPower,
    update: (delta: number, elapsed: number) => {
      // Breathing & subtle posture motion
      devGroup.position.y = 0.08 + Math.sin(elapsed * 1.8) * 0.01;
      torsoGroup.rotation.x = Math.sin(elapsed * 1.8) * 0.012;
      headGroup.rotation.x = Math.sin(elapsed * 1.2) * 0.035;
      headGroup.rotation.y = Math.sin(elapsed * 0.7) * 0.055;

      // Realistic typing finger flutter
      leftHand.position.y = -0.62 + Math.sin(elapsed * 16) * 0.01;
      rightHand.position.y = -0.62 + Math.cos(elapsed * 14) * 0.01;
      leftHand.rotation.x = -0.25 + Math.sin(elapsed * 18) * 0.04;
      rightHand.rotation.x = -0.25 + Math.cos(elapsed * 15) * 0.04;

      // Headset RGB neon ring color glow cycle (cyan <-> electric violet)
      const rgbPulse = (Math.sin(elapsed * 2.5) + 1) * 0.5;
      headsetRgbMat.color.setRGB(
        0.1 + rgbPulse * 0.38,
        0.75 + (1 - rgbPulse) * 0.25,
        1.0
      );

      // Update screen packet flow only when powered on
      if (isMonitorPowered && elapsed - lastScreenUpdate > 0.06) {
        lastScreenUpdate = elapsed;
        drawCentralScreen(elapsed);
        screenTexture.needsUpdate = true;
      }
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
