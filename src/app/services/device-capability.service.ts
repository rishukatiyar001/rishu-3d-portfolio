import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { QualityLevel } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class DeviceCapabilityService {
  private readonly isBrowser: boolean;

  readonly qualitySetting = signal<QualityLevel>('auto');
  readonly effectiveQuality = signal<'high' | 'medium' | 'low'>('high');
  readonly isMobile = signal<boolean>(false);
  readonly isTablet = signal<boolean>(false);
  readonly isTouchDevice = signal<boolean>(false);
  readonly prefersReducedMotion = signal<boolean>(false);
  readonly webglAvailable = signal<boolean>(true);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.initCapabilities();
    }
  }

  private initCapabilities(): void {
    try {
      this.webglAvailable.set(this.checkWebGLSupport());
    } catch {
      this.webglAvailable.set(false);
    }

    // Load stored quality
    try {
      const stored = localStorage.getItem('rishu_3d_quality') as QualityLevel | null;
      if (stored && ['auto', 'high', 'medium', 'low'].includes(stored)) {
        this.qualitySetting.set(stored);
      }
    } catch {
      // Storage access could be restricted
    }

    this.updateViewportProfile();
    this.checkReducedMotion();

    window.addEventListener('resize', () => {
      this.updateViewportProfile();
    }, { passive: true });

    if (window.matchMedia) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      motionQuery.addEventListener('change', (e) => {
        this.prefersReducedMotion.set(e.matches);
        this.recomputeEffectiveQuality();
      });
    }
  }

  private checkWebGLSupport(): boolean {
    if (!window.WebGLRenderingContext) return false;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(gl && gl instanceof WebGLRenderingContext);
  }

  private checkReducedMotion(): void {
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion.set(mq.matches);
    }
  }

  private updateViewportProfile(): void {
    const width = window.innerWidth;
    const mobile = width < 768;
    const tablet = width >= 768 && width <= 1024;
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    this.isMobile.set(mobile);
    this.isTablet.set(tablet);
    this.isTouchDevice.set(touch);

    this.recomputeEffectiveQuality();
  }

  setQuality(level: QualityLevel): void {
    this.qualitySetting.set(level);
    if (this.isBrowser) {
      try {
        localStorage.setItem('rishu_3d_quality', level);
      } catch {
        // Safe fallback
      }
    }
    this.recomputeEffectiveQuality();
  }

  private recomputeEffectiveQuality(): void {
    const setting = this.qualitySetting();

    if (setting !== 'auto') {
      this.effectiveQuality.set(setting);
      return;
    }

    // Auto detection
    if (this.prefersReducedMotion()) {
      this.effectiveQuality.set('low');
      return;
    }

    if (this.isMobile()) {
      this.effectiveQuality.set('low');
      return;
    }

    if (this.isTablet()) {
      this.effectiveQuality.set('medium');
      return;
    }

    // Check hardware concurrency if available
    const cores = navigator.hardwareConcurrency || 4;
    if (cores <= 4) {
      this.effectiveQuality.set('medium');
    } else {
      this.effectiveQuality.set('high');
    }
  }

  getPixelRatio(): number {
    if (!this.isBrowser) return 1;

    const quality = this.effectiveQuality();
    const dpr = window.devicePixelRatio || 1;

    if (this.isMobile() || quality === 'low') {
      return 1;
    }

    if (quality === 'medium') {
      return Math.min(dpr, 1.35);
    }

    return Math.min(dpr, 1.75);
  }

  getParticleBudget(baseCount = 1200): number {
    const quality = this.effectiveQuality();
    if (quality === 'low') return Math.floor(baseCount * 0.3);
    if (quality === 'medium') return Math.floor(baseCount * 0.65);
    return baseCount;
  }
}
