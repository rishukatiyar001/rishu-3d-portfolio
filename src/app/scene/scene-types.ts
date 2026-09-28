import * as THREE from 'three';
import { WorldId } from '../models/portfolio.models';

export interface InteractiveObjectData {
  type: 'world-trigger' | 'architecture-node' | 'project-item' | 'skill-item' | 'erp-stage' | 'payment-stage' | 'mobile-feature' | 'easter-egg';
  id: string;
  worldId?: WorldId;
  label: string;
  description?: string;
  accentColor?: string;
  payload?: unknown;
}

export interface WorldBuilderResult {
  group: THREE.Group;
  interactiveMeshes: THREE.Mesh[];
  update: (delta: number, elapsed: number) => void;
  dispose: () => void;
}

export interface CameraWaypoint {
  position: THREE.Vector3;
  target: THREE.Vector3;
}
