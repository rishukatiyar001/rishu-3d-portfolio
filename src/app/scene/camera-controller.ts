import * as THREE from 'three';
import gsap from 'gsap';
import { WorldId } from '../models/portfolio.models';
import { CameraWaypoint } from './scene-types';

export class CameraController {
  private readonly desktopWaypoints: Record<WorldId, CameraWaypoint> = {
    workspace: {
      position: new THREE.Vector3(0.4, 2.35, 7.8),
      target: new THREE.Vector3(0, 0.55, 0)
    },
    architecture: {
      position: new THREE.Vector3(45, 3.8, 12),
      target: new THREE.Vector3(45, 1.2, 0)
    },
    erp: {
      position: new THREE.Vector3(90, 6.2, 14),
      target: new THREE.Vector3(90, 0.8, 0)
    },
    payments: {
      position: new THREE.Vector3(135, 3.2, 11),
      target: new THREE.Vector3(135, 0.8, 0)
    },
    mobile: {
      position: new THREE.Vector3(180, 2.8, 9.5),
      target: new THREE.Vector3(180, 0.8, 0)
    },
    cloud: {
      position: new THREE.Vector3(225, 4.2, 12.5),
      target: new THREE.Vector3(225, 1.2, 0)
    },
    projects: {
      position: new THREE.Vector3(270, 3.8, 14.5),
      target: new THREE.Vector3(270, 1.0, 0)
    },
    skills: {
      position: new THREE.Vector3(315, 3.4, 12.5),
      target: new THREE.Vector3(315, 1.0, 0)
    },
    experience: {
      position: new THREE.Vector3(360, 3.2, 11.5),
      target: new THREE.Vector3(360, 0.8, 0)
    },
    contact: {
      position: new THREE.Vector3(405, 2.4, 9.2),
      target: new THREE.Vector3(405, 0.5, 0)
    }
  };

  private readonly mobileWaypoints: Record<WorldId, CameraWaypoint> = {
    workspace: {
      position: new THREE.Vector3(0.2, 2.4, 9.8),
      target: new THREE.Vector3(0, 0.5, 0)
    },
    architecture: {
      position: new THREE.Vector3(45, 3.6, 21),
      target: new THREE.Vector3(45, 0.6, 0)
    },
    erp: {
      position: new THREE.Vector3(90, 6.5, 20),
      target: new THREE.Vector3(90, 0.3, 0)
    },
    payments: {
      position: new THREE.Vector3(135, 3.2, 16.5),
      target: new THREE.Vector3(135, 0.3, 0)
    },
    mobile: {
      position: new THREE.Vector3(180, 2.8, 14),
      target: new THREE.Vector3(180, 0.5, 0)
    },
    cloud: {
      position: new THREE.Vector3(225, 4.2, 18),
      target: new THREE.Vector3(225, 0.6, 0)
    },
    projects: {
      position: new THREE.Vector3(270, 3.8, 19),
      target: new THREE.Vector3(270, 0.6, 0)
    },
    skills: {
      position: new THREE.Vector3(315, 3.4, 18),
      target: new THREE.Vector3(315, 0.6, 0)
    },
    experience: {
      position: new THREE.Vector3(360, 3.2, 17),
      target: new THREE.Vector3(360, 0.5, 0)
    },
    contact: {
      position: new THREE.Vector3(405, 2.4, 13.5),
      target: new THREE.Vector3(405, 0.3, 0)
    }
  };

  readonly currentTarget = new THREE.Vector3(0, 0.4, 0);
  readonly currentBasePos = new THREE.Vector3(0, 2.3, 8.2);
  currentWorld: WorldId = 'workspace';
  isTransitioning = false;
  private isMobileMode = false;

  private mouseOffset = { x: 0, y: 0 };
  private touchOffset = { x: 0, y: 0 };
  private currentParallax = { x: 0, y: 0 };

  constructor(private camera: THREE.PerspectiveCamera) {
    this.camera.position.copy(this.currentBasePos);
    this.camera.lookAt(this.currentTarget);
  }

  setMobileMode(isMobile: boolean): void {
    if (this.isMobileMode === isMobile) return;
    this.isMobileMode = isMobile;
  }

  getIsMobile(): boolean {
    return this.isMobileMode;
  }

  setMouseOffset(x: number, y: number): void {
    this.mouseOffset.x = x;
    this.mouseOffset.y = y;
  }

  setTouchDelta(dx: number, dy: number): void {
    this.touchOffset.x += dx * 0.005;
    this.touchOffset.y += dy * 0.005;
    this.touchOffset.x = Math.max(-1.5, Math.min(1.5, this.touchOffset.x));
    this.touchOffset.y = Math.max(-1.0, Math.min(1.0, this.touchOffset.y));
  }

  transitionTo(
    worldId: WorldId,
    duration = 1.2,
    reducedMotion = false,
    onComplete?: () => void
  ): void {
    const waypoint = this.getWaypoint(worldId);
    if (!waypoint) return;

    this.currentWorld = worldId;
    this.touchOffset = { x: 0, y: 0 };

    if (reducedMotion) {
      this.currentBasePos.copy(waypoint.position);
      this.currentTarget.copy(waypoint.target);
      this.camera.position.copy(waypoint.position);
      this.camera.lookAt(waypoint.target);
      if (onComplete) onComplete();
      return;
    }

    this.isTransitioning = true;
    gsap.killTweensOf(this.currentBasePos);
    gsap.killTweensOf(this.currentTarget);

    gsap.to(this.currentBasePos, {
      x: waypoint.position.x,
      y: waypoint.position.y,
      z: waypoint.position.z,
      duration,
      ease: 'power2.inOut'
    });

    gsap.to(this.currentTarget, {
      x: waypoint.target.x,
      y: waypoint.target.y,
      z: waypoint.target.z,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        this.isTransitioning = false;
        if (onComplete) onComplete();
      }
    });
  }

  transitionToCoordinates(
    pos: { x: number; y: number; z: number },
    target: { x: number; y: number; z: number },
    duration = 1.2,
    reducedMotion = false,
    onComplete?: () => void
  ): void {
    this.touchOffset = { x: 0, y: 0 };

    if (reducedMotion) {
      this.currentBasePos.set(pos.x, pos.y, pos.z);
      this.currentTarget.set(target.x, target.y, target.z);
      this.camera.position.set(pos.x, pos.y, pos.z);
      this.camera.lookAt(target.x, target.y, target.z);
      if (onComplete) onComplete();
      return;
    }

    this.isTransitioning = true;
    gsap.killTweensOf(this.currentBasePos);
    gsap.killTweensOf(this.currentTarget);

    gsap.to(this.currentBasePos, {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      duration,
      ease: 'power2.inOut'
    });

    gsap.to(this.currentTarget, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration,
      ease: 'power2.inOut',
      onComplete: () => {
        this.isTransitioning = false;
        if (onComplete) onComplete();
      }
    });
  }

  update(delta: number, isMobile = false): void {
    const parallaxIntensity = isMobile ? 0.3 : 0.8;
    const targetParallaxX = (this.mouseOffset.x * parallaxIntensity) + this.touchOffset.x;
    const targetParallaxY = (this.mouseOffset.y * (parallaxIntensity * 0.5)) + this.touchOffset.y;

    this.currentParallax.x += (targetParallaxX - this.currentParallax.x) * 0.1;
    this.currentParallax.y += (targetParallaxY - this.currentParallax.y) * 0.1;

    this.camera.position.x = this.currentBasePos.x + this.currentParallax.x;
    this.camera.position.y = this.currentBasePos.y + this.currentParallax.y;
    this.camera.position.z = this.currentBasePos.z;

    this.camera.lookAt(
      this.currentTarget.x + this.currentParallax.x * 0.3,
      this.currentTarget.y + this.currentParallax.y * 0.3,
      this.currentTarget.z
    );
  }

  getWaypoint(worldId: WorldId): CameraWaypoint {
    const waypoints = this.isMobileMode ? this.mobileWaypoints : this.desktopWaypoints;
    return waypoints[worldId] || waypoints.workspace;
  }
}
