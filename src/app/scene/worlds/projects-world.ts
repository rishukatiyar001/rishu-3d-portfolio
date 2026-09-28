import * as THREE from 'three';
import { ProjectItem } from '../../models/portfolio.models';
import { InteractiveObjectData, WorldBuilderResult } from '../scene-types';

export function createProjectsWorld(projects: ProjectItem[]): WorldBuilderResult {
  const group = new THREE.Group();
  group.position.set(270, 0, 0);

  const interactiveMeshes: THREE.Mesh[] = [];
  const disposables: Array<{ dispose: () => void }> = [];
  const artifacts: Array<{ mesh: THREE.Object3D; baseY: number; rotSpeed: number }> = [];

  // Orbital Base Ring
  const baseRingGeo = new THREE.RingGeometry(8.5, 8.7, 64);
  const baseRingMat = new THREE.MeshBasicMaterial({ color: 0x00eaff, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
  disposables.push(baseRingGeo, baseRingMat);
  const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
  baseRing.rotation.x = -Math.PI / 2;
  baseRing.position.y = -1.45;
  group.add(baseRing);

  // Localized project universe lighting
  const prjLight = new THREE.PointLight(0x7c3cff, 4.5, 35);
  prjLight.position.set(0, 4, 6);
  group.add(prjLight);
  const prjCyan = new THREE.PointLight(0x00eaff, 3.5, 30);
  prjCyan.position.set(0, 2, -6);
  group.add(prjCyan);

  // Center Cosmic Core
  const centerGeo = new THREE.IcosahedronGeometry(1.2, 1);
  const centerMat = new THREE.MeshStandardMaterial({
    color: 0x7c3cff,
    emissive: 0x3d007a,
    emissiveIntensity: 0.8,
    wireframe: true
  });
  disposables.push(centerGeo, centerMat);
  const centerSphere = new THREE.Mesh(centerGeo, centerMat);
  centerSphere.position.set(0, 2.2, 0);
  group.add(centerSphere);

  // Position 9 Projects along a circular perimeter (radius = 7.5)
  const count = projects.length;
  const radius = 7.5;

  projects.forEach((proj, idx) => {
    const angle = (idx / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 1.6 + (idx % 2 === 0 ? 0.4 : -0.4);

    proj.worldCoordinate = [270 + x, y, z];

    const projGroup = new THREE.Group();
    projGroup.position.set(x, y, z);
    group.add(projGroup);

    const hexColor = parseInt(proj.color.replace('#', '0x'), 16);

    // Create unique geometry for each project
    let artifactMesh: THREE.Object3D;

    switch (proj.id) {
      case 'erp-meter-billing': {
        // Smart energy meter pillar
        const g = new THREE.CylinderGeometry(0.5, 0.7, 1.4, 6);
        const m = new THREE.MeshStandardMaterial({ color: hexColor, metalness: 0.8, roughness: 0.2 });
        disposables.push(g, m);
        artifactMesh = new THREE.Mesh(g, m);
        break;
      }
      case 'icici-payment-integration': {
        // Cryptographic vault prism
        const g = new THREE.OctahedronGeometry(0.7, 0);
        const m = new THREE.MeshStandardMaterial({ color: hexColor, metalness: 0.9, roughness: 0.1 });
        disposables.push(g, m);
        artifactMesh = new THREE.Mesh(g, m);
        break;
      }
      case 'online-course-platform': {
        // Digital cylinder / video reel
        const g = new THREE.CylinderGeometry(0.65, 0.65, 0.9, 16);
        const m = new THREE.MeshStandardMaterial({ color: hexColor, wireframe: true });
        disposables.push(g, m);
        artifactMesh = new THREE.Mesh(g, m);
        break;
      }
      case 'taskmanager-pro': {
        // Kanban board slab
        const g = new THREE.BoxGeometry(1.2, 0.8, 0.2);
        const m = new THREE.MeshStandardMaterial({ color: hexColor, roughness: 0.3 });
        disposables.push(g, m);
        artifactMesh = new THREE.Mesh(g, m);
        break;
      }
      case 'ecommerce-platform': {
        // Retail shopping cube
        const g = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const m = new THREE.MeshStandardMaterial({ color: hexColor, metalness: 0.7 });
        disposables.push(g, m);
        artifactMesh = new THREE.Mesh(g, m);
        break;
      }
      case 'portfolio-builder-3d': {
        // Three.js Gyroscope Sphere
        const g = new THREE.TorusGeometry(0.7, 0.1, 8, 24);
        const m = new THREE.MeshStandardMaterial({ color: hexColor, metalness: 0.9 });
        disposables.push(g, m);
        artifactMesh = new THREE.Mesh(g, m);
        break;
      }
      case 'fake-news-classification': {
        // NLP Analysis Prism
        const g = new THREE.TetrahedronGeometry(0.85);
        const m = new THREE.MeshStandardMaterial({ color: hexColor, wireframe: true });
        disposables.push(g, m);
        artifactMesh = new THREE.Mesh(g, m);
        break;
      }
      case 'credit-card-fraud-detection': {
        // Risk Radar Ring
        const g = new THREE.TorusGeometry(0.75, 0.08, 6, 24);
        const m = new THREE.MeshStandardMaterial({ color: hexColor });
        disposables.push(g, m);
        artifactMesh = new THREE.Mesh(g, m);
        break;
      }
      default: {
        // Movie Recommendation cinema wheel
        const g = new THREE.DodecahedronGeometry(0.75);
        const m = new THREE.MeshStandardMaterial({ color: hexColor, wireframe: true });
        disposables.push(g, m);
        artifactMesh = new THREE.Mesh(g, m);
        break;
      }
    }

    projGroup.add(artifactMesh);
    artifacts.push({ mesh: projGroup, baseY: y, rotSpeed: 0.01 + (idx % 3) * 0.005 });

    // Orbital ring around artifact
    const orbitRingGeo = new THREE.RingGeometry(1.1, 1.15, 24);
    const orbitRingMat = new THREE.MeshBasicMaterial({ color: hexColor, side: THREE.DoubleSide });
    disposables.push(orbitRingGeo, orbitRingMat);
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2;
    projGroup.add(orbitRing);

    // Title label plate
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 384;
    labelCanvas.height = 128;
    const ctx = labelCanvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(6, 11, 24, 0.9)';
    ctx.fillRect(0, 0, 384, 128);
    ctx.strokeStyle = proj.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 376, 120);

    ctx.fillStyle = proj.color;
    ctx.font = 'bold 18px monospace';
    ctx.fillText(proj.category.toUpperCase(), 16, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(proj.title.length > 20 ? proj.title.substring(0, 18) + '...' : proj.title, 16, 75);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px monospace';
    ctx.fillText(`STATUS: [${proj.status}]`, 16, 108);

    const labelTex = new THREE.CanvasTexture(labelCanvas);
    disposables.push(labelTex);
    const labelGeo = new THREE.PlaneGeometry(1.6, 0.55);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, side: THREE.DoubleSide });
    disposables.push(labelGeo, labelMat);
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = 1.35;
    projGroup.add(labelMesh);

    // Interactive Hit Box
    const hitGeo = new THREE.SphereGeometry(1.6, 12, 12);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    disposables.push(hitGeo, hitMat);
    const hit = new THREE.Mesh(hitGeo, hitMat);
    const data: InteractiveObjectData = {
      type: 'project-item',
      id: proj.id,
      label: proj.title,
      description: proj.description,
      accentColor: proj.color,
      payload: proj
    };
    hit.userData = data;
    projGroup.add(hit);
    interactiveMeshes.push(hit);
  });

  return {
    group,
    interactiveMeshes,
    update: (delta: number, elapsed: number) => {
      centerSphere.rotation.y += 0.01;
      centerSphere.rotation.x = Math.sin(elapsed * 0.5) * 0.2;

      artifacts.forEach((art, idx) => {
        art.mesh.rotation.y += art.rotSpeed;
        art.mesh.position.y = art.baseY + Math.sin(elapsed * 2 + idx) * 0.12;
      });
    },
    dispose: () => {
      disposables.forEach(d => d.dispose());
    }
  };
}
