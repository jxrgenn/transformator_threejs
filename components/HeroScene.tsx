import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration, ToneMapping } from '@react-three/postprocessing';
import { Environment, ScrollControls } from '@react-three/drei';
import * as THREE from 'three';
import { ProcessJourney } from './NeuralNetwork';

export const HeroScene: React.FC = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ 
        antialias: false, 
        toneMapping: THREE.ReinhardToneMapping, 
        toneMappingExposure: 1.5,
        stencil: false,
        depth: true
      }}
      camera={{ position: [0, 0, 15], fov: 35 }}
    >
      <color attach="background" args={['#030303']} />
      
      <ScrollControls pages={3} damping={0.15}>
        <ProcessJourney />
      </ScrollControls>
      
      {/* Precision Lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#00ccff" />
      
      {/* Studio Environment map for realistic glass reflections */}
      <Environment preset="studio" background={false} />

      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={1.1} 
          mipmapBlur 
          intensity={0.5} 
          radius={0.4}
        />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={0.9} />
        <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
        <ToneMapping adaptive={true} resolution={256} middleGrey={0.6} maxLuminance={16.0} averageLuminance={1.0} adaptationRate={1.0} />
      </EffectComposer>
    </Canvas>
  );
};