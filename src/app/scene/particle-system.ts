import * as THREE from 'three';

export class PortfolioParticleSystem {
  readonly points: THREE.Points;
  private readonly positions: Float32Array;
  private readonly velocities: Float32Array;
  private readonly count: number;

  constructor(count = 1000) {
    this.count = count;
    const geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);

    // Span particles across the world corridor (x: -20 to 450, y: -10 to 25, z: -25 to 25)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      this.positions[i3] = (Math.random() - 0.1) * 440;
      this.positions[i3 + 1] = (Math.random() - 0.5) * 30;
      this.positions[i3 + 2] = (Math.random() - 0.5) * 40;

      this.velocities[i3] = (Math.random() - 0.5) * 0.02;
      this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.015;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    // Create custom smooth circular particle texture programmatically
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(0, 234, 255, 0.8)');
      gradient.addColorStop(0.8, 'rgba(124, 60, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      color: 0x8be9fd,
      size: 0.12,
      map: texture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(geometry, material);
  }

  update(delta: number, reducedMotion = false): void {
    if (reducedMotion) return;

    const posAttr = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      array[i3 + 1] += this.velocities[i3 + 1];
      array[i3] += this.velocities[i3];

      // Subtle loop boundaries
      if (array[i3 + 1] > 20) array[i3 + 1] = -10;
      if (array[i3 + 1] < -10) array[i3 + 1] = 20;
    }

    posAttr.needsUpdate = true;
    this.points.rotation.y += 0.00015;
  }

  dispose(): void {
    this.points.geometry.dispose();
    if (this.points.material instanceof THREE.Material) {
      if ('map' in this.points.material && this.points.material.map) {
        (this.points.material.map as THREE.Texture).dispose();
      }
      this.points.material.dispose();
    }
  }
}
