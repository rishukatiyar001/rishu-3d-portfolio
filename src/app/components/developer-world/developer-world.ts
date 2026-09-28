import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import {
  ArchitectureNode,
  ErpStageItem,
  ExperienceItem,
  MobileFeatureItem,
  PaymentStageItem,
  ProjectItem,
  QualityLevel,
  SkillCategoryGroup,
  TerminalCommandOutput,
  WorldId
} from '../../models/portfolio.models';
import { CameraController } from '../../scene/camera-controller';
import { PortfolioParticleSystem } from '../../scene/particle-system';
import { InteractiveObjectData, WorldBuilderResult } from '../../scene/scene-types';
import { createArchitectureWorld } from '../../scene/worlds/architecture-world';
import { createCloudWorld } from '../../scene/worlds/cloud-world';
import { createContactWorld } from '../../scene/worlds/contact-world';
import { createErpWorld } from '../../scene/worlds/erp-world';
import { createExperienceWorld } from '../../scene/worlds/experience-world';
import { createMobileWorld } from '../../scene/worlds/mobile-world';
import { createPaymentsWorld } from '../../scene/worlds/payments-world';
import { createProjectsWorld } from '../../scene/worlds/projects-world';
import { createSkillsWorld } from '../../scene/worlds/skills-world';
import { createWorkspaceWorld, WorkspaceWorldResult } from '../../scene/worlds/workspace-world';
import { AudioService } from '../../services/audio.service';
import { DeviceCapabilityService } from '../../services/device-capability.service';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import gsap from 'gsap';

@Component({
  selector: 'app-developer-world',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './developer-world.html',
  styleUrl: './developer-world.scss'
})
export class DeveloperWorld implements AfterViewInit, OnDestroy {
  @ViewChild('sceneCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('terminalBody') private terminalBodyRef?: ElementRef<HTMLDivElement>;

  private readonly platformId = inject(PLATFORM_ID);
  readonly portfolioData = inject(PortfolioDataService);
  readonly deviceService = inject(DeviceCapabilityService);
  readonly audioService = inject(AudioService);

  readonly isBrowser: boolean;

  // State Signals
  readonly introPhase = signal<'booting' | 'ready' | 'entered'>('booting');
  readonly introStep = signal<'black' | 'init' | 'particles' | 'status' | 'reveal' | 'monitor' | 'stack' | 'name' | 'role' | 'quote' | 'ready'>('black');
  readonly currentWorldId = signal<WorldId>('workspace');
  readonly hoveredObject = signal<InteractiveObjectData | null>(null);

  // Modals & Drawers
  readonly recruiterModeOpen = signal<boolean>(false);
  readonly terminalOpen = signal<boolean>(false);
  readonly contactModalOpen = signal<boolean>(false);
  readonly qualityMenuOpen = signal<boolean>(false);
  readonly selectedProject = signal<ProjectItem | null>(null);
  readonly selectedArchitectureNode = signal<ArchitectureNode | null>(null);
  readonly selectedErpStage = signal<ErpStageItem | null>(null);
  readonly selectedPaymentStage = signal<PaymentStageItem | null>(null);
  readonly selectedMobileFeature = signal<MobileFeatureItem | null>(null);
  readonly selectedCategoryGroup = signal<SkillCategoryGroup | null>(null);
  readonly selectedExperience = signal<ExperienceItem | null>(null);
  readonly toastMessage = signal<string | null>(null);
  readonly mobileWorldDrawerOpen = signal<boolean>(false);
  readonly isMobileView = signal<boolean>(false);

  // Terminal state
  terminalInput = '';
  readonly terminalHistory = signal<TerminalCommandOutput[]>([
    {
      command: 'system.init()',
      lines: [
        'RISHU.OS v2.4 (x86_64-pc-linux-gnu)',
        'Identity: Rishu Katiyar // Full Stack Developer (2+ yrs)',
        'Kernel modules: Angular, ASP.NET Core, SQL Server, Azure, Ionic',
        'Type "help" to list available commands.'
      ],
      type: 'system'
    }
  ]);

  // Contact form state
  contactForm = {
    name: '',
    email: '',
    message: ''
  };
  contactFormSubmitted = false;

  // Three.js Engine
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cameraController!: CameraController;
  private particleSystem!: PortfolioParticleSystem;
  private worldBuilders: WorldBuilderResult[] = [];
  private interactiveMeshes: THREE.Mesh[] = [];

  private workspaceWorld!: WorkspaceWorldResult;
  private ambientLight!: THREE.AmbientLight;
  private dirLight!: THREE.DirectionalLight;
  private cyanLight!: THREE.PointLight;
  private violetLight!: THREE.PointLight;
  private introTimeline: gsap.core.Timeline | null = null;

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(-999, -999);
  private animationId = 0;
  private lastTime = 0;
  private clock = {
    startTime: 0,
    getElapsedTime: () => (performance.now() - this.clock.startTime) / 1000
  };

  // Scroll throttling
  private lastScrollTime = 0;
  private touchStartY = 0;
  private touchStartX = 0;

  // Computed properties
  readonly worlds = this.portfolioData.worlds;
  readonly projects = this.portfolioData.projects;
  readonly architectureNodes = this.portfolioData.architectureNodes;
  readonly skillCategories = this.portfolioData.skillCategories;
  readonly experience = this.portfolioData.experience;
  readonly profile = this.portfolioData.profile;

  readonly isMuted = computed(() => this.audioService.isMuted());
  readonly currentQuality = computed(() => this.deviceService.qualitySetting());
  readonly isWebGLAvailable = computed(() => this.deviceService.webglAvailable());

  readonly currentWorldMeta = computed(() => {
    const id = this.currentWorldId();
    return this.worlds.find(w => w.id === id) || this.worlds[0];
  });

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    if (!this.deviceService.webglAvailable()) {
      this.introPhase.set('entered');
      this.introStep.set('ready');
      return;
    }

    // Check if user already completed/skipped intro in this session
    let isIntroCompleted = false;
    try {
      if (sessionStorage.getItem('rishu_intro_completed') === 'true') {
        isIntroCompleted = true;
        this.introPhase.set('entered');
        this.introStep.set('ready');
      }
    } catch {
      // Safe
    }

    this.initThreeScene(isIntroCompleted);
    this.initWorlds(isIntroCompleted);
    this.setupEvents();

    this.clock.startTime = performance.now();
    this.lastTime = performance.now();
    this.animate();

    if (!isIntroCompleted) {
      if (this.deviceService.prefersReducedMotion()) {
        this.skipIntro();
      } else {
        this.runCinematicIntro();
      }
    }
  }

  private initThreeScene(isIntroCompleted: boolean): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02030a);
    this.scene.fog = new THREE.FogExp2(0x02030a, 0.012);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    const isMobile = width < 768 || aspect < 0.85;
    this.isMobileView.set(isMobile);

    const initialFov = aspect < 1 ? Math.min(56, 45 + (1 - aspect) * 16) : 45;
    this.camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 300);
    this.cameraController = new CameraController(this.camera);
    this.cameraController.setMobileMode(isMobile);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });

    const dpr = this.deviceService.getPixelRatio();
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Master Lighting: start dimmed for intro, or full if returning
    this.ambientLight = new THREE.AmbientLight(0xffffff, isIntroCompleted ? 0.65 : 0.05);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xdff4ff, isIntroCompleted ? 1.2 : 0);
    this.dirLight.position.set(10, 20, 15);
    this.scene.add(this.dirLight);

    // Accent Cyber Lights spanning corridor
    this.cyanLight = new THREE.PointLight(0x00eaff, isIntroCompleted ? 4 : 0, 35);
    this.cyanLight.position.set(0, 4, 5);
    this.scene.add(this.cyanLight);

    this.violetLight = new THREE.PointLight(0x7c3cff, isIntroCompleted ? 3.5 : 0, 35);
    this.violetLight.position.set(50, 5, 5);
    this.scene.add(this.violetLight);

    // Particles System
    const particleBudget = this.deviceService.getParticleBudget(1100);
    this.particleSystem = new PortfolioParticleSystem(particleBudget);
    if (!isIntroCompleted) {
      (this.particleSystem.points.material as THREE.PointsMaterial).opacity = 0;
    }
    this.scene.add(this.particleSystem.points);

    // Camera initial position for cinematic intro reveal
    if (!isIntroCompleted) {
      const introZ = isMobile ? 19.5 : 15.5;
      this.cameraController.currentBasePos.set(0, 4.4, introZ);
      this.cameraController.currentTarget.set(0, 0.6, 0);
      this.camera.position.set(0, 4.4, introZ);
      this.camera.lookAt(0, 0.6, 0);
    } else {
      const initialWp = this.cameraController.getWaypoint('workspace');
      this.cameraController.currentBasePos.copy(initialWp.position);
      this.cameraController.currentTarget.copy(initialWp.target);
      this.camera.position.copy(initialWp.position);
      this.camera.lookAt(initialWp.target);
    }
  }

  private initWorlds(isIntroCompleted: boolean): void {
    // 1. Workspace World (x = 0) with monitor powered according to intro status
    this.workspaceWorld = createWorkspaceWorld(isIntroCompleted);
    this.addWorldBuilder(this.workspaceWorld);

    // 2. Full Stack Architecture World (x = 45)
    const arch = createArchitectureWorld(this.architectureNodes);
    this.addWorldBuilder(arch);

    // 3. ERP & Smart Meter Billing City (x = 90)
    const erp = createErpWorld(this.portfolioData.erpStages);
    this.addWorldBuilder(erp);

    // 4. ICICI Payments Cryptographic Tunnel (x = 135)
    const pay = createPaymentsWorld(this.portfolioData.paymentStages);
    this.addWorldBuilder(pay);

    // 5. Cross-Platform Mobile Engineering Smartphone (x = 180)
    const mob = createMobileWorld(this.portfolioData.mobileFeatures);
    this.addWorldBuilder(mob);

    // 6. Cloud & DevOps Infrastructure Citadel (x = 225)
    const cld = createCloudWorld();
    this.addWorldBuilder(cld);

    // 7. 3D Project Universe Constellation (x = 270)
    const prj = createProjectsWorld(this.projects);
    this.addWorldBuilder(prj);

    // 8. Skills Constellation (x = 315)
    const skl = createSkillsWorld(this.skillCategories);
    this.addWorldBuilder(skl);

    // 9. Experience Timeline Rail (x = 360)
    const exp = createExperienceWorld(this.experience);
    this.addWorldBuilder(exp);

    // 10. Communications Gateway (x = 405)
    const con = createContactWorld();
    this.addWorldBuilder(con);
  }

  private addWorldBuilder(builder: WorldBuilderResult): void {
    this.worldBuilders.push(builder);
    this.scene.add(builder.group);
    this.interactiveMeshes.push(...builder.interactiveMeshes);
  }

  private setupEvents(): void {
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('click', this.onCanvasClick);
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  private onResize = (): void => {
    if (!this.camera || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    const isMobile = width < 768 || aspect < 0.85;

    const prevMobile = this.cameraController.getIsMobile();
    this.isMobileView.set(isMobile);
    this.cameraController.setMobileMode(isMobile);

    this.camera.aspect = aspect;
    // Responsive FOV: dynamically adapt vertical FOV in portrait mode so objects don't appear zoomed-in/cropped
    if (aspect < 1) {
      this.camera.fov = Math.min(56, 45 + (1 - aspect) * 16);
    } else {
      this.camera.fov = 45;
    }
    this.camera.updateProjectionMatrix();

    const dpr = this.deviceService.getPixelRatio();
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height);

    if (prevMobile !== isMobile && !this.cameraController.isTransitioning) {
      this.cameraController.transitionTo(this.currentWorldId(), 0.5);
    }
  };

  private onPointerMove = (event: PointerEvent): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.pointer.x = (event.clientX / width) * 2 - 1;
    this.pointer.y = -(event.clientY / height) * 2 + 1;

    // Send parallax offset to camera controller
    this.cameraController.setMouseOffset(this.pointer.x, this.pointer.y);

    // Raycast only if inside canvas and not in modal
    if (!this.isAnyModalOpen()) {
      this.checkIntersection();
    }
  };

  private checkIntersection(): void {
    if (!this.camera || this.interactiveMeshes.length === 0) return;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const data = hit.userData as InteractiveObjectData | undefined;
      if (data) {
        this.hoveredObject.set(data);
        if (this.canvasRef?.nativeElement) {
          this.canvasRef.nativeElement.style.cursor = 'pointer';
        }
        return;
      }
    }

    this.hoveredObject.set(null);
    if (this.canvasRef?.nativeElement) {
      this.canvasRef.nativeElement.style.cursor = 'default';
    }
  }

  private onCanvasClick = (event: MouseEvent): void => {
    if (this.isAnyModalOpen()) return;

    // Raycast on click
    if (this.hoveredObject()) {
      const data = this.hoveredObject()!;
      this.handleInteractiveClick(data);
    }
  };

  handleInteractiveClick(data: InteractiveObjectData): void {
    this.audioService.playClick();

    switch (data.type) {
      case 'world-trigger':
        if (data.worldId) {
          this.navigateToWorld(data.worldId);
        }
        break;
      case 'architecture-node':
        if (data.payload) {
          this.selectedArchitectureNode.set(data.payload as ArchitectureNode);
        }
        break;
      case 'erp-stage':
        if (data.payload) {
          this.selectedErpStage.set(data.payload as ErpStageItem);
        }
        break;
      case 'payment-stage':
        if (data.payload) {
          this.selectedPaymentStage.set(data.payload as PaymentStageItem);
        }
        break;
      case 'mobile-feature':
        if (data.payload) {
          this.selectedMobileFeature.set(data.payload as MobileFeatureItem);
        }
        break;
      case 'project-item': {
        const proj = (data.payload as ProjectItem) || this.portfolioData.getProjectById(data.id);
        if (proj) {
          if (proj.worldCoordinate) {
            const [px, py, pz] = proj.worldCoordinate;
            const reducedMotion = this.deviceService.prefersReducedMotion();
            this.cameraController.transitionToCoordinates(
              { x: px, y: py + 0.6, z: pz + 4.2 },
              { x: px, y: py, z: pz },
              1.2,
              reducedMotion,
              () => {
                this.selectedProject.set(proj);
              }
            );
          } else {
            this.selectedProject.set(proj);
          }
        }
        break;
      }
      case 'skill-item':
        if (data.payload) {
          this.selectedCategoryGroup.set(data.payload as SkillCategoryGroup);
        }
        break;
      case 'easter-egg':
        this.openTerminal();
        this.runCommand('whoami');
        break;
    }
  }

  private onWheel = (event: WheelEvent): void => {
    // If modal or terminal is open, do not hijack world scroll
    if (this.isAnyModalOpen()) return;

    const now = performance.now();
    if (now - this.lastScrollTime < 450) return;

    if (Math.abs(event.deltaY) > 28) {
      this.lastScrollTime = now;
      if (event.deltaY > 0) {
        this.nextWorld();
      } else {
        this.prevWorld();
      }
    }
  };

  private onTouchStart = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  };

  private onTouchMove = (event: TouchEvent): void => {
    if (this.isAnyModalOpen() || event.touches.length !== 1) return;

    const dx = event.touches[0].clientX - this.touchStartX;
    const dy = event.touches[0].clientY - this.touchStartY;

    this.cameraController.setTouchDelta(dx, dy);
  };

  private onTouchEnd = (event: TouchEvent): void => {
    if (this.isAnyModalOpen()) return;

    if (event.changedTouches.length === 1) {
      const deltaX = event.changedTouches[0].clientX - this.touchStartX;
      const deltaY = event.changedTouches[0].clientY - this.touchStartY;

      if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 50) {
        if (deltaX < 0) {
          this.nextWorld();
        } else {
          this.prevWorld();
        }
      }
    }
  };

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.terminalOpen()) {
      if (event.key === 'Escape') this.closeTerminal();
      return;
    }

    if (this.isAnyModalOpen()) {
      if (event.key === 'Escape') this.closeAllModals();
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        this.nextWorld();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        this.prevWorld();
        break;
      case 'r':
      case 'R':
        this.openRecruiterMode();
        break;
      case 't':
      case 'T':
      case '`':
        this.openTerminal();
        break;
      case 'm':
      case 'M':
        this.toggleAudio();
        break;
    }
  }

  // Animation Loop
  private animate = (): void => {
    this.animationId = window.requestAnimationFrame(this.animate);

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    const elapsed = this.clock.getElapsedTime();

    const isMobile = this.deviceService.isMobile();
    const reducedMotion = this.deviceService.prefersReducedMotion();

    // Update Camera
    if (this.cameraController) {
      this.cameraController.update(delta, isMobile);
    }

    // Update Particles
    if (this.particleSystem) {
      this.particleSystem.update(delta, reducedMotion);
    }

    // Update Worlds
    this.worldBuilders.forEach(builder => {
      builder.update(delta, elapsed);
    });

    // Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  // World Navigation
  navigateToWorld(worldId: WorldId): void {
    if (this.currentWorldId() === worldId && !this.cameraController?.isTransitioning) return;

    this.currentWorldId.set(worldId);
    this.audioService.playTransition();

    const reducedMotion = this.deviceService.prefersReducedMotion();
    this.cameraController?.transitionTo(worldId, 1.6, reducedMotion);
  }

  nextWorld(): void {
    const list = this.worlds;
    const curIdx = list.findIndex(w => w.id === this.currentWorldId());
    const nextIdx = (curIdx + 1) % list.length;
    this.navigateToWorld(list[nextIdx].id);
  }

  prevWorld(): void {
    const list = this.worlds;
    const curIdx = list.findIndex(w => w.id === this.currentWorldId());
    const prevIdx = (curIdx - 1 + list.length) % list.length;
    this.navigateToWorld(list[prevIdx].id);
  }

  openWorldPicker(): void {
    this.audioService.playClick();
    this.mobileWorldDrawerOpen.set(true);
  }

  closeWorldPicker(): void {
    this.mobileWorldDrawerOpen.set(false);
  }

  // Intro Sequence
  private runCinematicIntro(): void {
    this.introStep.set('black');
    this.introTimeline = gsap.timeline();

    // 1. BLACK SCREEN -> INITIALIZING...
    this.introTimeline.call(() => {
      this.introStep.set('init');
    }, undefined, 0.4);

    // 2. particles slowly appear
    this.introTimeline.call(() => {
      this.introStep.set('particles');
    }, undefined, 1.2);

    this.introTimeline.to(
      (this.particleSystem.points.material as THREE.PointsMaterial),
      { opacity: 0.75, duration: 1.4, ease: 'power2.inOut' },
      1.2
    );

    // 3. system status activates
    this.introTimeline.call(() => {
      this.introStep.set('status');
      this.audioService.playClick();
    }, undefined, 2.4);

    // 4. camera reveals the developer workspace: desk & developer character become visible
    this.introTimeline.call(() => {
      this.introStep.set('reveal');
    }, undefined, 3.2);

    this.introTimeline.to(this.ambientLight, { intensity: 0.65, duration: 2.2, ease: 'power2.out' }, 3.2);
    this.introTimeline.to(this.dirLight, { intensity: 1.2, duration: 2.2, ease: 'power2.out' }, 3.2);
    this.introTimeline.to(this.cyanLight, { intensity: 4, duration: 2.2, ease: 'power2.out' }, 3.2);
    this.introTimeline.to(this.violetLight, { intensity: 3.5, duration: 2.2, ease: 'power2.out' }, 3.2);

    const wp = this.cameraController.getWaypoint('workspace');
    this.introTimeline.to(
      this.cameraController.currentBasePos,
      { x: wp.position.x, y: wp.position.y, z: wp.position.z, duration: 2.4, ease: 'power2.inOut' },
      3.2
    );

    this.introTimeline.to(
      this.cameraController.currentTarget,
      { x: wp.target.x, y: wp.target.y, z: wp.target.z, duration: 2.4, ease: 'power2.inOut' },
      3.2
    );

    // 5. monitor powers on
    this.introTimeline.call(() => {
      if (this.workspaceWorld) {
        this.workspaceWorld.setMonitorPower(true);
      }
      this.audioService.playBoot();
      this.introStep.set('monitor');
    }, undefined, 5.0);

    // 6. Angular / ASP.NET Core / SQL Server / Azure visual appears
    this.introTimeline.call(() => {
      this.introStep.set('stack');
    }, undefined, 5.8);

    // 7. RISHU KATIYAR appears
    this.introTimeline.call(() => {
      this.introStep.set('name');
    }, undefined, 6.6);

    // 8. FULL STACK DEVELOPER
    this.introTimeline.call(() => {
      this.introStep.set('role');
    }, undefined, 7.3);

    // 9. "I BUILD DIGITAL SYSTEMS."
    this.introTimeline.call(() => {
      this.introStep.set('quote');
    }, undefined, 8.0);

    // 10. ENTER WORKSPACE
    this.introTimeline.call(() => {
      this.introStep.set('ready');
      this.introPhase.set('ready');
    }, undefined, 8.8);
  }

  enterWorkspace(): void {
    if (this.introTimeline) {
      this.introTimeline.kill();
      this.introTimeline = null;
    }

    if (this.ambientLight) this.ambientLight.intensity = 0.65;
    if (this.dirLight) this.dirLight.intensity = 1.2;
    if (this.cyanLight) this.cyanLight.intensity = 4;
    if (this.violetLight) this.violetLight.intensity = 3.5;
    if (this.particleSystem) {
      (this.particleSystem.points.material as THREE.PointsMaterial).opacity = 0.75;
    }
    if (this.workspaceWorld) {
      this.workspaceWorld.setMonitorPower(true);
    }
    if (this.cameraController) {
      const wp = this.cameraController.getWaypoint('workspace');
      this.cameraController.currentBasePos.copy(wp.position);
      this.cameraController.currentTarget.copy(wp.target);
    }

    this.introStep.set('ready');
    this.introPhase.set('entered');
    this.audioService.playBoot();

    try {
      sessionStorage.setItem('rishu_intro_completed', 'true');
    } catch {
      // safe
    }

    this.navigateToWorld('workspace');
  }

  skipIntro(): void {
    this.enterWorkspace();
  }

  // Recruiter Mode
  openRecruiterMode(): void {
    this.audioService.playClick();
    this.recruiterModeOpen.set(true);
  }

  closeRecruiterMode(): void {
    this.audioService.playClick();
    this.recruiterModeOpen.set(false);
  }

  // Terminal Easter Egg
  openTerminal(): void {
    this.audioService.playClick();
    this.terminalOpen.set(true);
  }

  closeTerminal(): void {
    this.audioService.playClick();
    this.terminalOpen.set(false);
  }

  handleTerminalSubmit(): void {
    const cmd = this.terminalInput.trim();
    if (!cmd) return;
    this.terminalInput = '';
    this.runCommand(cmd);
  }

  runCommand(cmd: string): void {
    const lower = cmd.toLowerCase().trim();
    let lines: string[] = [];
    let type: TerminalCommandOutput['type'] = 'info';

    switch (lower) {
      case 'help':
        lines = [
          'AVAILABLE COMMANDS:',
          '  whoami          - Executive developer profile & summary',
          '  stack           - Core engineering technologies and proficiencies',
          '  projects        - List 9 featured enterprise and software systems',
          '  architecture    - Display 7-tier full stack architectural model',
          '  contact         - Verified communications channels and social links',
          '  recruiter       - Launch instant 30-second Recruiter Mode',
          '  goto <world>    - Fly 3D camera to world (e.g. goto erp, goto payments)',
          '  sudo rishu --deploy - Trigger continuous delivery deployment protocol',
          '  clear           - Clear terminal window buffer',
          '  exit            - Close terminal'
        ];
        break;

      case 'whoami':
        lines = [
          'Rishu Katiyar — Full Stack Developer (2+ Years)',
          'Specialization: Enterprise Web APIs, Smart Grid ERP Billing, Cross-Platform Mobile Apps.',
          'Location: India | Open for High-Impact Software Engineering Roles',
          'Website: rishukatiyar.pp.ua'
        ];
        type = 'success';
        break;

      case 'stack':
        lines = [
          'PRIMARY CORE: Angular 21, TypeScript, ASP.NET Core, C#, SQL Server, Azure',
          'MOBILE: Ionic Framework, Capacitor, Android Builds, SQLite Local Vault',
          'BACKEND: REST Web APIs, Dapper Micro-ORM, Entity Framework, HMAC SHA256',
          'DEVOPS & CLOUD: Docker, GitHub Actions CI/CD, Azure App Services, AWS Foundations',
          'CREATIVE & 3D: Three.js WebGL, GSAP Motion, Canvas Shader Textures'
        ];
        type = 'info';
        break;

      case 'projects':
        lines = this.projects.map((p, i) => `[0${i + 1}] ${p.title} (${p.category}) - ${p.status}`);
        break;

      case 'architecture':
        lines = [
          '7-TIER ARCHITECTURE FLOW:',
          '  Tier 1: CLIENT      - Angular 21 & Ionic Mobile Wrapper',
          '  Tier 2: API GATEWAY - ASP.NET Core Web API (JWT Auth & Routing)',
          '  Tier 3: LOGIC       - Clean Architecture Business Services',
          '  Tier 4: DATA ACCESS - Dapper Micro-ORM (Microsecond Query Hydration)',
          '  Tier 5: DATABASE    - Microsoft SQL Server (Normalized Schemas & SPs)',
          '  Tier 6: CLOUD       - Microsoft Azure App Service & SQL Database',
          '  Tier 7: DEVOPS      - GitHub Actions CI/CD & Docker Containers'
        ];
        break;

      case 'contact':
        lines = [
          `Email:    ${this.profile.email}`,
          `GitHub:   ${this.profile.github}`,
          `LinkedIn: ${this.profile.linkedin}`,
          `Website:  ${this.profile.website}`
        ];
        type = 'success';
        break;

      case 'recruiter':
        this.closeTerminal();
        this.openRecruiterMode();
        return;

      case 'sudo rishu --deploy':
        lines = [
          '⚡ INITIATING PRODUCTION DEPLOYMENT PROTOCOL...',
          '✓ Linting Angular 21 standalone workspace: 0 errors',
          '✓ Compiling ASP.NET Core C# Release assemblies: SUCCESS',
          '✓ Generating HMAC SHA256 cryptographic hashes: VERIFIED',
          '✓ Building Docker Linux container: sha256:8f2a1b9',
          '✓ Pushing artifacts to Azure Container Registry...',
          '🚀 SYSTEM LIVE ON AZURE APP SERVICE: ALL 10 WORLDS HEALTHY!'
        ];
        type = 'success';
        this.audioService.playSuccess();
        break;

      case 'clear':
        this.terminalHistory.set([]);
        return;

      case 'exit':
        this.closeTerminal();
        return;

      default:
        if (lower.startsWith('goto ')) {
          const target = lower.replace('goto ', '').trim() as WorldId;
          const match = this.worlds.find(w => w.id === target || w.label.toLowerCase().includes(target));
          if (match) {
            lines = [`Navigating 3D camera to ${match.label}...`];
            this.navigateToWorld(match.id);
            type = 'system';
          } else {
            lines = [`World "${target}" not recognized. Try: workspace, architecture, erp, payments, mobile, cloud, projects, skills, experience, contact`];
            type = 'error';
          }
        } else {
          lines = [`Command not found: "${cmd}". Type "help" for a list of valid commands.`];
          type = 'error';
        }
        break;
    }

    const current = this.terminalHistory();
    this.terminalHistory.set([...current, { command: cmd, lines, type }]);

    setTimeout(() => {
      if (this.terminalBodyRef?.nativeElement) {
        this.terminalBodyRef.nativeElement.scrollTop = this.terminalBodyRef.nativeElement.scrollHeight;
      }
    }, 50);
  }

  // Modals & Navigation helpers
  copyEmail(): void {
    if (!this.isBrowser) return;

    try {
      navigator.clipboard.writeText(this.profile.email);
      this.showToast('Email copied to clipboard: ' + this.profile.email);
      this.audioService.playSuccess();
    } catch {
      this.showToast('Email: ' + this.profile.email);
    }
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3200);
  }

  openContactModal(): void {
    this.audioService.playClick();
    this.contactModalOpen.set(true);
  }

  closeContactModal(): void {
    this.contactModalOpen.set(false);
  }

  submitContactForm(): void {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.showToast('Please fill out all required fields.');
      return;
    }

    this.contactFormSubmitted = true;
    this.audioService.playSuccess();
    this.showToast('Thank you! Message logged for Rishu Katiyar.');

    setTimeout(() => {
      this.contactModalOpen.set(false);
      this.contactFormSubmitted = false;
      this.contactForm = { name: '', email: '', message: '' };
    }, 2200);
  }

  toggleAudio(): void {
    const isMuted = this.audioService.toggleMute();
    this.showToast(isMuted ? 'Audio Muted' : 'Audio Enabled');
  }

  toggleQualityMenu(): void {
    this.qualityMenuOpen.update(v => !v);
  }

  setQuality(level: QualityLevel): void {
    this.deviceService.setQuality(level);
    this.qualityMenuOpen.set(false);
    this.showToast(`Quality set to: ${level.toUpperCase()}`);

    if (this.renderer) {
      const dpr = this.deviceService.getPixelRatio();
      this.renderer.setPixelRatio(dpr);
    }
  }

  closeAllModals(): void {
    this.recruiterModeOpen.set(false);
    this.terminalOpen.set(false);
    this.contactModalOpen.set(false);
    this.selectedProject.set(null);
    this.selectedArchitectureNode.set(null);
    this.selectedErpStage.set(null);
    this.selectedPaymentStage.set(null);
    this.selectedMobileFeature.set(null);
    this.selectedCategoryGroup.set(null);
    this.selectedExperience.set(null);
    this.qualityMenuOpen.set(false);
  }

  isAnyModalOpen(): boolean {
    return (
      this.recruiterModeOpen() ||
      this.terminalOpen() ||
      this.contactModalOpen() ||
      !!this.selectedProject() ||
      !!this.selectedArchitectureNode() ||
      !!this.selectedErpStage() ||
      !!this.selectedPaymentStage() ||
      !!this.selectedMobileFeature() ||
      !!this.selectedCategoryGroup() ||
      !!this.selectedExperience()
    );
  }

  backToWorkspace(): void {
    this.navigateToWorld('workspace');
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    if (this.introTimeline) {
      this.introTimeline.kill();
      this.introTimeline = null;
    }

    if (this.animationId) {
      window.cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('click', this.onCanvasClick);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    // Dispose all worlds
    this.worldBuilders.forEach(builder => builder.dispose());
    this.worldBuilders = [];

    // Dispose particles
    if (this.particleSystem) {
      this.particleSystem.dispose();
    }

    // Traverse and dispose any remaining materials/geometries
    if (this.scene) {
      this.scene.traverse(object => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}