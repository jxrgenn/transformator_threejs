import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
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
        toneMappingExposure: 1.2, // Slightly darker exposure
        stencil: false,
        depth: true
      }}
      camera={{ position: [0, 0, 15], fov: 35 }}
    >
      <color attach="background" args={['#020202']} />
      
      {/* Added snap for soft landing between pages */}
      <ScrollControls pages={3} damping={0.2}>
        <ProcessJourney />
      </ScrollControls>
      
      {/* Precision Lighting - Darker & Dramatic */}
      <ambientLight intensity={0.05} color="#ffffff" /> 
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      {/* Rim light for dark objects */}
      <directionalLight position={[-10, 5, -5]} intensity={2} color="#406080" />
      
      {/* Studio Environment map for realistic reflections on the crystal */}
      <Environment preset="city" background={false} blur={1} />

      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={1} // Only very bright things glow
          mipmapBlur 
          intensity={0.4} 
          radius={0.6}
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={0.9} />
        <ChromaticAberration offset={[0.001, 0.001]} />
      </EffectComposer>
    </Canvas>
  );
};