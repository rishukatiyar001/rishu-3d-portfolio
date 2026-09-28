import * as THREE from 'three';
import { MobileFeatureItem } from '../../models/portfolio.models';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export function createMobileWorld(mobileFeatures: MobileFeatureItem[] = []): WorldBuilderResult {
  const group = new THREE.Group();
  group.position.set(180, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];

  // Giant 3D Smartphone Body
  const phoneGroup = new THREE.Group();
  phoneGroup.position.set(0, 1.2, 0);
  group.add(phoneGroup);

  // Localized mobile lighting
  const mobLight = new THREE.PointLight(0x00eaff, 4.5, 30);
  mobLight.position.set(0, 3, 5);
  group.add(mobLight);
  const mobEmerald = new THREE.PointLight(0x00ffa3, 3.5, 25);
  mobEmerald.position.set(3, 1, 2);
  group.add(mobEmerald);

  // Floor grid
  const grid = new THREE.GridHelper(24, 24, 0x00eaff, 0x0c1b30);
  grid.position.y = -1.45;
  group.add(grid);

  // Metallic phone chassis
  const chassisGeo = new THREE.BoxGeometry(4.2, 7.8, 0.4);
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x090d18,
    metalness: 0.95,
    roughness: 0.15
  });
  disposables.push(chassisGeo, chassisMat);
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  phoneGroup.add(chassis);

  // Phone bezel border
  const bezelGeo = new THREE.BoxGeometry(4.24, 7.84, 0.05);
  const bezelMat = new THREE.MeshBasicMaterial({ color: 0x00ffa3 });
  disposables.push(bezelGeo, bezelMat);
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.position.z = 0.18;
  phoneGroup.add(bezel);

  // High-Resolution Interactive Screen Texture
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 720;
  screenCanvas.height = 1280;
  const ctx = screenCanvas.getContext('2d')!;

  function drawMobileScreen(elapsed = 0): void {
    ctx.fillStyle = '#050a16';
    ctx.fillRect(0, 0, 720, 1280);

    // Top status bar
    ctx.fillStyle = '#0d192e';
    ctx.fillRect(0, 0, 720, 70);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('9:41', 40, 45);
    ctx.fillStyle = '#00ffa3';
    ctx.font = '20px monospace';
    ctx.fillText('IONIC // CAPACITOR 5G', 420, 45);

    // Camera scanner module card
    ctx.fillStyle = '#0a162b';
    ctx.strokeStyle = '#00eaff';
    ctx.lineWidth = 3;
    ctx.fillRect(36, 110, 648, 220);
    ctx.strokeRect(36, 110, 648, 220);

    ctx.fillStyle = '#00eaff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('[CAMERA BARCODE / METER SCANNER]', 64, 155);

    // Reticle animation
    const scanY = 190 + Math.sin(elapsed * 4) * 45;
    ctx.strokeStyle = 'rgba(0, 234, 255, 0.85)';
    ctx.lineWidth = 2;
    ctx.strokeRect(260, 170, 200, 100);
    ctx.strokeStyle = '#ff4d6d';
    ctx.beginPath();
    ctx.moveTo(260, scanY);
    ctx.lineTo(460, scanY);
    ctx.stroke();

    ctx.fillStyle = '#a0aec0';
    ctx.font = '18px monospace';
    ctx.fillText('Capacitor.Plugins.Camera -> High-res OCR', 64, 305);

    // Geolocation Radar Card
    ctx.fillStyle = '#0a162b';
    ctx.strokeStyle = '#7c3cff';
    ctx.lineWidth = 3;
    ctx.fillRect(36, 360, 648, 220);
    ctx.strokeRect(36, 360, 648, 220);

    ctx.fillStyle = '#7c3cff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('[GEOLOCATION GPS DISPATCH]', 64, 405);

    const radarRadius = (elapsed * 60) % 70;
    ctx.strokeStyle = 'rgba(124, 60, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(360, 470, radarRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#00ffa3';
    ctx.beginPath();
    ctx.arc(360, 470, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#a0aec0';
    ctx.font = '18px monospace';
    ctx.fillText('Precise Field Technician Lat/Long Coordinates', 64, 555);

    // SQLite Offline Store Card
    ctx.fillStyle = '#0a162b';
    ctx.strokeStyle = '#ffd000';
    ctx.lineWidth = 3;
    ctx.fillRect(36, 610, 648, 220);
    ctx.strokeRect(36, 610, 648, 220);

    ctx.fillStyle = '#ffd000';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('[SQLITE LOCAL ENCRYPTED VAULT]', 64, 655);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px monospace';
    ctx.fillText('Offline Meter Readings Cached: 1,420', 64, 710);
    ctx.fillStyle = '#00ffa3';
    ctx.fillText('Auto-Sync Status: SYNCING WITH CLOUD...', 64, 750);
    ctx.fillStyle = '#a0aec0';
    ctx.font = '18px monospace';
    ctx.fillText('Bi-directional SQLite-to-Azure SQL replication', 64, 805);

    // Push Notification Banner
    ctx.fillStyle = '#10223d';
    ctx.strokeStyle = '#00ffa3';
    ctx.lineWidth = 2;
    ctx.fillRect(36, 860, 648, 160);
    ctx.strokeRect(36, 860, 648, 160);

    ctx.fillStyle = '#00ffa3';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('🔔 FIREBASE CLOUD MESSAGING (FCM)', 64, 910);
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px sans-serif';
    ctx.fillText('"Payment Successful: Smart Meter recharged with 500 kWh"', 64, 955);
    ctx.fillStyle = '#8be9fd';
    ctx.font = '16px monospace';
    ctx.fillText('Deep Link Event triggered: myapp://recharge/status', 64, 990);

    // Native Platform Badges
    ctx.fillStyle = '#0e1b30';
    ctx.fillRect(36, 1050, 648, 170);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('NATIVE PLATFORM RUNTIMES:', 64, 1100);

    ctx.fillStyle = '#3ddc84';
    ctx.fillText('• Android (Kotlin / Gradle / Android Studio)', 64, 1145);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('• iOS (Swift / Xcode / CocoaPods)', 64, 1185);
  }

  drawMobileScreen(0);
  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  disposables.push(screenTexture);

  const screenGeo = new THREE.PlaneGeometry(3.9, 7.3);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
  disposables.push(screenGeo, screenMat);
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.z = 0.21;
  phoneGroup.add(screen);

  // ==============================================================
  // INTERACTIVE FEATURE SATELLITES AROUND PHONE
  // Camera, Geolocation, SQLite, Firebase, Android, iOS
  // ==============================================================
  const satelliteMeshes: Array<{ group: THREE.Group; baseAngle: number; radius: number; speed: number }> = [];
  const featureCount = mobileFeatures.length;

  mobileFeatures.forEach((feat, idx) => {
    const satGroup = new THREE.Group();
    const baseAngle = (idx / featureCount) * Math.PI * 2;
    const radius = 3.6;

    const hexColor = parseInt(feat.color.replace('#', '0x'), 16);

    // Sphere
    const sGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const sMat = new THREE.MeshStandardMaterial({
      color: hexColor,
      emissive: hexColor,
      emissiveIntensity: 0.7,
      metalness: 0.6,
      roughness: 0.2
    });
    disposables.push(sGeo, sMat);
    const sphere = new THREE.Mesh(sGeo, sMat);
    satGroup.add(sphere);

    // Ring
    const rGeo = new THREE.TorusGeometry(0.48, 0.02, 8, 20);
    const rMat = new THREE.MeshBasicMaterial({ color: hexColor });
    disposables.push(rGeo, rMat);
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = Math.PI / 2;
    satGroup.add(ring);

    // Label
    const lCanvas = document.createElement('canvas');
    lCanvas.width = 320;
    lCanvas.height = 96;
    const lCtx = lCanvas.getContext('2d')!;
    lCtx.fillStyle = 'rgba(5, 10, 22, 0.9)';
    lCtx.fillRect(0, 0, 320, 96);
    lCtx.strokeStyle = feat.color;
    lCtx.lineWidth = 3;
    lCtx.strokeRect(3, 3, 314, 90);

    lCtx.fillStyle = feat.color;
    lCtx.font = 'bold 16px monospace';
    lCtx.fillText(feat.category.toUpperCase(), 14, 28);

    lCtx.fillStyle = '#ffffff';
    lCtx.font = 'bold 18px sans-serif';
    lCtx.fillText(feat.name.length > 20 ? feat.name.substring(0, 18) + '...' : feat.name, 14, 62);

    const lTex = new THREE.CanvasTexture(lCanvas);
    disposables.push(lTex);
    const lGeo = new THREE.PlaneGeometry(1.2, 0.36);
    const lMat = new THREE.MeshBasicMaterial({ map: lTex, transparent: true, side: THREE.DoubleSide });
    disposables.push(lGeo, lMat);
    const labelMesh = new THREE.Mesh(lGeo, lMat);
    labelMesh.position.y = 0.6;
    satGroup.add(labelMesh);

    // Interactive Hit Target
    const hitGeo = new THREE.SphereGeometry(0.7, 10, 10);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);
    const hit = new THREE.Mesh(hitGeo, hitMat);
    const data: InteractiveObjectData = {
      type: 'mobile-feature',
      id: feat.id,
      label: feat.name,
      description: feat.description,
      accentColor: feat.color,
      payload: feat
    };
    hit.userData = data;
    satGroup.add(hit);
    interactiveMeshes.push(hit);

    phoneGroup.add(satGroup);
    satelliteMeshes.push({
      group: satGroup,
      baseAngle,
      radius,
      speed: 0.4
    });
  });

  // Interactive Phone Screen Click Target
  const phoneHitGeo = new THREE.BoxGeometry(4.0, 7.4, 0.6);
  const phoneHitMat = new THREE.MeshBasicMaterial({ visible: false });
  disposables.push(phoneHitGeo, phoneHitMat);
  const phoneHit = new THREE.Mesh(phoneHitGeo, phoneHitMat);
  phoneHit.position.z = 0.2;
  const phoneData: InteractiveObjectData = {
    type: 'project-item',
    id: 'erp-meter-billing',
    label: 'Cross-Platform Mobile Ecosystem',
    description: 'Ionic & Capacitor native mobile runtime with Camera, Geolocation, SQLite, FCM, Android & iOS',
    accentColor: '#00ffa3'
  };
  phoneHit.userData = phoneData;
  phoneGroup.add(phoneHit);
  interactiveMeshes.push(phoneHit);

  let lastScreenUpdate = 0;

  return {
    group,
    interactiveMeshes,
    update: (delta: number, elapsed: number) => {
      // Gentle phone float
      phoneGroup.rotation.y = Math.sin(elapsed * 0.7) * 0.12;
      phoneGroup.position.y = 1.2 + Math.sin(elapsed * 1.3) * 0.1;

      // Orbit satellites around phone
      satelliteMeshes.forEach((sat, idx) => {
        const theta = elapsed * sat.speed + sat.baseAngle;
        const x = Math.cos(theta) * sat.radius;
        const y = Math.sin(theta * 0.9) * 2.4;
        const z = Math.sin(theta) * (sat.radius * 0.5);
        sat.group.position.set(x, y, z);
      });

      // Update screen
      if (elapsed - lastScreenUpdate > 0.08) {
        lastScreenUpdate = elapsed;
        drawMobileScreen(elapsed);
        screenTexture.needsUpdate = true;
      }
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
