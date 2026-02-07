import { Vector3 } from 'three';

export interface NodeProps {
  position: [number, number, number];
  color?: string;
  scale?: number;
  type: 'input' | 'hidden' | 'output';
}

export interface ConnectionProps {
  start: Vector3;
  end: Vector3;
  speed?: number;
}

export interface ParticleProps {
  path: Vector3[];
  speed?: number;
  offset?: number;
}
