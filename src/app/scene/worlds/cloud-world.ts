import * as THREE from 'three';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export function createCloudWorld(): WorldBuilderResult {
  const group = new THREE.Group();
  group.position.set(225, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];

  // Platform floor
  const platformGeo = new THREE.CylinderGeometry(8.5, 9.2, 0.4, 32);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x050a16,
    metalness: 0.9,
    roughness: 0.3
  });
  disposables.push(platformGeo, platformMat);
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -1.5;
  group.add(platform);

  // Localized cloud lighting
  const cldLight = new THREE.PointLight(0x0078d4, 4.5, 35);
  cldLight.position.set(0, 5, 5);
  group.add(cldLight);
  const cldCyan = new THREE.PointLight(0x38bdf8, 3, 25);
  cldCyan.position.set(-4, 3, -2);
  group.add(cldCyan);

  const ringGeo = new THREE.RingGeometry(8.2, 8.35, 48);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x0078d4, side: THREE.DoubleSide });
  disposables.push(ringGeo, ringMat);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.28;
  group.add(ring);

  // Pillar 1: GitHub Commit Obelisk
  const gitGeo = new THREE.BoxGeometry(1.6, 4.8, 1.6);
  const gitMat = new THREE.MeshStandardMaterial({
    color: 0x0d1117,
    metalness: 0.8,
    roughness: 0.2
  });
  disposables.push(gitGeo, gitMat);
  const gitMesh = new THREE.Mesh(gitGeo, gitMat);
  gitMesh.position.set(-5, 0.9, -2.5);
  group.add(gitMesh);

  // GitHub logo plate
  const gitLabelCanvas = document.createElement('canvas');
  gitLabelCanvas.width = 256;
  gitLabelCanvas.height = 128;
  const gCtx = gitLabelCanvas.getContext('2d')!;
  gCtx.fillStyle = '#0d1117';
  gCtx.fillRect(0, 0, 256, 128);
  gCtx.strokeStyle = '#2ea44f';
  gCtx.lineWidth = 4;
  gCtx.strokeRect(4, 4, 248, 120);
  gCtx.fillStyle = '#2ea44f';
  gCtx.font = 'bold 22px monospace';
  gCtx.fillText('GITHUB REPO', 20, 48);
  gCtx.fillStyle = '#ffffff';
  gCtx.font = '14px monospace';
  gCtx.fillText('Actions CI Pipeline', 20, 85);
  const gitTex = new THREE.CanvasTexture(gitLabelCanvas);
  disposables.push(gitTex);
  const gitLabel = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), new THREE.MeshBasicMaterial({ map: gitTex }));
  gitLabel.position.set(-5, 2.4, -1.69);
  group.add(gitLabel);

  // Pillar 2: Docker Containers Cluster
  const dockerGroup = new THREE.Group();
  dockerGroup.position.set(-1.8, 0, 2.5);
  group.add(dockerGroup);

  const containerColors = [0x2496ed, 0x0078d4, 0x0db7ed];
  const containerPositions = [
    [-0.7, -0.6, 0],
    [0.7, -0.6, 0],
    [0, 0.6, 0]
  ];

  containerPositions.forEach(([cx, cy, cz], idx) => {
    const cGeo = new THREE.BoxGeometry(1.5, 1.0, 2.4);
    const cMat = new THREE.MeshStandardMaterial({
      color: containerColors[idx],
      metalness: 0.7,
      roughness: 0.3
    });
    disposables.push(cGeo, cMat);
    const cMesh = new THREE.Mesh(cGeo, cMat);
    cMesh.position.set(cx, cy, cz);
    dockerGroup.add(cMesh);
  });

  // Pillar 3: Azure Cloud Citadel
  const azureGroup = new THREE.Group();
  azureGroup.position.set(3.8, 1.8, -0.8);
  group.add(azureGroup);

  const azGeo = new THREE.CylinderGeometry(1.6, 2.2, 4.6, 6);
  const azMat = new THREE.MeshStandardMaterial({
    color: 0x0078d4,
    emissive: 0x004578,
    emissiveIntensity: 0.5,
    metalness: 0.85,
    roughness: 0.2
  });
  disposables.push(azGeo, azMat);
  const azMesh = new THREE.Mesh(azGeo, azMat);
  azureGroup.add(azMesh);

  // Floating Azure Cloud Ring
  const azRingGeo = new THREE.TorusGeometry(2.5, 0.08, 8, 32);
  const azRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  disposables.push(azRingGeo, azRingMat);
  const azRing = new THREE.Mesh(azRingGeo, azRingMat);
  azRing.rotation.x = Math.PI / 2;
  azRing.position.y = 1.2;
  azureGroup.add(azRing);

  // Central DevOps Telemetry Hologram
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 512;
  cloudCanvas.height = 256;
  const cCtx = cloudCanvas.getContext('2d')!;
  cCtx.fillStyle = 'rgba(4, 12, 28, 0.92)';
  cCtx.fillRect(0, 0, 512, 256);
  cCtx.strokeStyle = '#0078d4';
  cCtx.lineWidth = 4;
  cCtx.strokeRect(4, 4, 504, 248);

  cCtx.fillStyle = '#38bdf8';
  cCtx.font = 'bold 24px monospace';
  cCtx.fillText('AZURE & CLOUD DEPLOYMENT', 24, 44);

  cCtx.fillStyle = '#ffffff';
  cCtx.font = '16px monospace';
  cCtx.fillText('• App Services: Production Auto-Scale', 24, 90);
  cCtx.fillText('• Azure SQL Database: Geo-Redundant Tier', 24, 125);
  cCtx.fillText('• Docker: Multi-stage Linux Builds', 24, 160);
  cCtx.fillStyle = '#ffd000';
  cCtx.fillText('• AWS: Core Storage & Compute Foundations', 24, 195);
  cCtx.fillStyle = '#00ffa3';
  cCtx.fillText('• GitHub Actions: Automated CI/CD CD', 24, 230);

  const cloudTex = new THREE.CanvasTexture(cloudCanvas);
  disposables.push(cloudTex);
  const cloudGeo = new THREE.PlaneGeometry(3.6, 1.8);
  const cloudMat = new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, side: THREE.DoubleSide });
  disposables.push(cloudGeo, cloudMat);
  const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  cloudMesh.position.set(0, 4.4, 0);
  group.add(cloudMesh);

  // Interactive Target
  const hitGeo = new THREE.CylinderGeometry(2.6, 2.6, 5.2, 8);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  disposables.push(hitGeo, hitMat);
  const hit = new THREE.Mesh(hitGeo, hitMat);
  hit.position.copy(azureGroup.position);
  const data: InteractiveObjectData = {
    type: 'project-item',
    id: 'cloud-devops',
    label: 'Cloud & DevOps Infrastructure',
    description: 'Docker containerization, GitHub Actions CI/CD pipelines, Microsoft Azure hosting & AWS foundations',
    accentColor: '#0078d4'
  };
  hit.userData = data;
  group.add(hit);
  interactiveMeshes.push(hit);

  return {
    group,
    interactiveMeshes,
    update: (delta: number, elapsed: number) => {
      azRing.rotation.z += 0.02;
      azRing.position.y = 1.2 + Math.sin(elapsed * 2) * 0.15;
      dockerGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.1;
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
