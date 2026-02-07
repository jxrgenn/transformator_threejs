import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Float, Instances, Instance, Text, Sparkles } from '@react-three/drei';

// --- THEME COLORS ---
const THEME = {
    primary: "#1a2e4d", // Dark Slate
    secondary: "#0b1019", // Deep Void
    highlight: "#406080", // Steel Blue
    accent: "#3b82f6", // Electric Royal Blue
    energy: "#ffffff", // Pure white for tiny hot spots
    text: "#e2e8f0",    // Slate-200
    subtext: "#94a3b8"  // Slate-400
}

// --- SHARED TEXT COMPONENT ---
const SceneText = ({ 
  text, 
  subtext, 
  position,
  isMobile
}: { 
  text: string; 
  subtext: string; 
  position: [number, number, number];
  isMobile: boolean;
}) => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    
    const worldPos = new THREE.Vector3();
    group.current.getWorldPosition(worldPos);
    const dist = Math.abs(worldPos.x);
    
    // Visibility fade
    const opacity = Math.max(0, 1 - (dist / 9));
    
    group.current.children.forEach((child: any) => {
        if (child.material) {
            child.material.opacity = opacity;
            child.material.transparent = true;
        }
    });

    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
  });

  // Mobile-specific sizing
  const titleSize = isMobile ? 0.5 : 0.8;
  const subSize = isMobile ? 0.18 : 0.25;
  const maxWidth = isMobile ? 3 : 6;

  return (
    <group ref={group} position={position}>
      <Text
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={titleSize}
        letterSpacing={-0.05}
        color={THEME.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={maxWidth}
        textAlign="center"
      >
        {text.toUpperCase()}
      </Text>
      <Text
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={subSize}
        letterSpacing={0.05}
        color={THEME.accent}
        anchorX="center"
        anchorY="top"
        position={[0, -0.6, 0]} 
        maxWidth={maxWidth}
        textAlign="center"
        lineHeight={1.4}
      >
        {subtext}
      </Text>
    </group>
  );
};

// --- STAGE 1: IDEATION (Chaos Cloud) ---
const ChaosCloud = () => {
  const group = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: 120 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.2 + 0.05
    }));
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={group} position={[-15, 0, 0]}>
       <Instances range={120}>
         <tetrahedronGeometry args={[0.2, 0]} />
         <meshStandardMaterial color={THEME.highlight} roughness={0.6} metalness={0.5} />
         {particles.map((p, i) => <FloatingVoxel key={i} {...p} />)}
       </Instances>
       <pointLight color={THEME.primary} intensity={0.5} distance={8} />
    </group>
  );
};

const FloatingVoxel = ({ position, rotation, scale, speed }: any) => {
    const ref = useRef<THREE.Object3D>(null);
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.position.y = position[1] + Math.sin(t * speed + position[0]) * 0.2;
        ref.current.rotation.x = rotation[0] + t * speed;
        ref.current.rotation.y = rotation[1] + t * speed * 0.5;
    });
    return <Instance ref={ref} position={position} scale={scale} />;
}


// --- STAGE 2: CREATION (The Neural Engine) ---
// A sophisticated crystalline processor/brain with many inputs.
const TheNeuralEngine = () => {
  const group = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
      if(!group.current) return;
      const t = state.clock.elapsedTime;
      
      // Floating motion
      group.current.position.y = Math.sin(t * 0.5) * 0.1;
      // Gentle compound rotation
      group.current.rotation.y = t * 0.1; // Slow constant rotation
      group.current.rotation.z = Math.sin(t * 0.2) * 0.05;

      // Pulse the core
      if (coreRef.current) {
        coreRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.02);
      }
  });

  return (
    <group position={[0, 0, 0]}>
      <group ref={group}>
        {/* Central Cortex (Denser, darker core) */}
        <mesh ref={coreRef}>
            <dodecahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial 
                color="#050a14" 
                roughness={0.2} 
                metalness={1.0} 
                emissive={THEME.highlight}
                emissiveIntensity={0.15}
            />
        </mesh>
        
        {/* Outer Geometric Shell */}
        <mesh scale={1.1}>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshBasicMaterial color={THEME.accent} wireframe transparent opacity={0.05} />
        </mesh>

        {/* Primary Input Nodes (Outer Ring - Ideas entering) */}
        {Array.from({length: 8}).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 2.8;
            return (
                <group key={`outer-${i}`} rotation={[Math.PI/6, angle, 0]}>
                     {/* The Node */}
                     <mesh position={[radius, 0, 0]}>
                        <octahedronGeometry args={[0.15, 0]} />
                        <meshStandardMaterial color={THEME.text} emissive={THEME.energy} emissiveIntensity={0.6} />
                     </mesh>
                     {/* The Connection Beam */}
                     <mesh position={[radius/2, 0, 0]} rotation={[0,0,Math.PI/2]}>
                        <cylinderGeometry args={[0.01, 0.03, radius]} />
                        <meshBasicMaterial color={THEME.highlight} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
                     </mesh>
                     {/* Data Particle flowing in */}
                     <mesh position={[radius * 0.8, 0, 0]}> 
                        <boxGeometry args={[0.08, 0.08, 0.08]} />
                        <meshBasicMaterial color={THEME.accent} />
                     </mesh>
                </group>
            )
        })}

        {/* Secondary Processing Nodes (Inner Ring - Processing) */}
        {Array.from({length: 12}).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 1.9;
            return (
                <group key={`inner-${i}`} rotation={[-Math.PI/6, angle + 0.2, 0]}>
                     <mesh position={[radius, 0, 0]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial color={THEME.highlight} emissive={THEME.accent} emissiveIntensity={0.4} />
                     </mesh>
                     <mesh position={[radius/2, 0, 0]} rotation={[0,0,Math.PI/2]}>
                        <cylinderGeometry args={[0.005, 0.015, radius]} />
                        <meshBasicMaterial color={THEME.accent} transparent opacity={0.1} blending={THREE.AdditiveBlending} />
                     </mesh>
                </group>
            )
        })}
        
        {/* Orbiting Ring for structure */}
        <mesh rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[2.2, 0.005, 16, 100]} />
            <meshBasicMaterial color={THEME.primary} transparent opacity={0.2} />
        </mesh>
      </group>

      <pointLight color={THEME.accent} intensity={2.5} distance={10} />
      <Sparkles count={60} scale={6} size={2} speed={0.5} opacity={0.3} color={THEME.accent} />
    </group>
  );
};


// --- STAGE 3: IMPACT (The Global Pulse) ---
// Represents "Changing the World" with shockwaves.
const TheImpact = () => {
  const globe = useRef<THREE.Mesh>(null);
  const shockwave = useRef<THREE.Mesh>(null);
  const shockwave2 = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
     const t = state.clock.elapsedTime;
     
     if (globe.current) {
         globe.current.rotation.y = t * 0.2;
     }
     
     // Expand and fade shockwaves
     if (shockwave.current) {
         const scale = (t * 1.5) % 3.5;
         shockwave.current.scale.setScalar(scale);
         const opacity = Math.max(0, 1 - (scale / 3.5));
         (shockwave.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5;
     }

     if (shockwave2.current) {
        const scale = ((t * 1.5) + 1.75) % 3.5;
        shockwave2.current.scale.setScalar(scale);
        const opacity = Math.max(0, 1 - (scale / 3.5));
        (shockwave2.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.3;
    }
  });

  return (
    <group position={[15, 0, 0]}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        
        {/* The World Sphere */}
        <mesh ref={globe}>
            <icosahedronGeometry args={[1.4, 4]} />
            <meshStandardMaterial 
                color={THEME.secondary}
                metalness={0.8}
                roughness={0.4}
                wireframe
                emissive={THEME.accent}
                emissiveIntensity={0.1}
            />
        </mesh>
        
        {/* Solid Core */}
        <mesh>
            <sphereGeometry args={[1.0, 32, 32]} />
            <meshStandardMaterial color="#000000" metalness={1} roughness={0} />
        </mesh>

        {/* Pulse Rings */}
        <mesh ref={shockwave}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color={THEME.accent} transparent opacity={0.5} wireframe />
        </mesh>
        <mesh ref={shockwave2}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color={THEME.highlight} transparent opacity={0.3} wireframe />
        </mesh>

        {/* Core Light */}
        <pointLight intensity={2} color={THEME.accent} distance={6} />
      </Float>
      
      {/* Stars/Dust around the impact */}
      <Sparkles count={60} scale={6} size={1.5} speed={0.2} opacity={0.4} color={THEME.accent} />
    </group>
  );
};

// --- CONNECTORS (Ghost Streams) ---
const GhostStream: React.FC<{ offset: number }> = ({ offset }) => {
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (!ref.current) return;
        const speed = 15; 
        const totalDist = 30;
        const t = (state.clock.elapsedTime * speed + offset) % totalDist; 
        const currentX = t - 15;
        
        ref.current.position.set(currentX, 0, 0);
        
        const distFromCenter = Math.abs(currentX);
        const fadeThreshold = 14; 
        let opacity = 0.2; 
        
        if (distFromCenter > fadeThreshold) {
            opacity = 0.2 * (1 - ((distFromCenter - fadeThreshold) / (15 - fadeThreshold)));
        }
        
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        if(mat) mat.opacity = Math.max(0, opacity);
        
        ref.current.scale.x = 2;
    });

    return (
        <mesh ref={ref} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.01, 0.01, 1, 6]} />
            <meshBasicMaterial 
                color={THEME.accent} 
                transparent 
                opacity={0.1}
                blending={THREE.AdditiveBlending}
                depthWrite={false} 
            />
        </mesh>
    );
}

const NodeConnections = () => {
    return (
        <group>
            {/* Guide Rail */}
            <mesh rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.005, 0.005, 30, 4]} />
                <meshBasicMaterial color={THEME.primary} transparent opacity={0.15} />
            </mesh>
            
            {Array.from({ length: 8 }).map((_, i) => (
                <GhostStream key={i} offset={i * 3.75} />
            ))}
        </group>
    )
}

// --- BACKGROUND ---
const CyberEnvironment = () => {
    return (
        <group>
             {/* Main Grid */}
             <gridHelper args={[80, 40, "#1e293b", "#0f172a"]} position={[0, -4, 0]} />
             
             {/* Distant Starfield for depth */}
             <Sparkles count={200} scale={40} size={2} speed={0.1} opacity={0.3} color="#ffffff" />
             
             {/* Atmospheric Fog */}
             <fog attach="fog" args={['#020202', 12, 45]} />
        </group>
    )
}

// --- MAIN CONTROLLER ---
export const ProcessJourney: React.FC = () => {
  const scroll = useScroll();
  const { viewport } = useThree();

  return (
    <group>
      <perspectiveCamera position={[0, 0, 15]} fov={35} />
      <SceneContent scroll={scroll} viewportWidth={viewport.width} />
    </group>
  );
};

const SceneContent = ({ scroll, viewportWidth }: { scroll: any, viewportWidth: number }) => {
    const worldRef = useRef<THREE.Group>(null);
    
    // --- RESPONSIVE LOGIC ---
    const isMobile = viewportWidth < 10;
    const scale = isMobile ? 0.6 : 1.0; 
    const objectDistance = 15; 
    
    useFrame((state, delta) => {
        if (worldRef.current) {
            worldRef.current.scale.set(scale, scale, scale);

            const offset = scroll?.offset || 0;
            const startX = objectDistance * scale;
            const endX = -objectDistance * scale;
            const totalTravel = startX - endX;
            
            const targetX = startX - (offset * totalTravel);
            
            worldRef.current.position.x = THREE.MathUtils.damp(worldRef.current.position.x, targetX, 2.5, delta);
            
            const depth = Math.sin(offset * Math.PI) * 1.5; 
            worldRef.current.position.z = THREE.MathUtils.damp(worldRef.current.position.z, -depth, 2, delta);
        }
    });

    return (
        <group ref={worldRef}>
            <CyberEnvironment />
            <NodeConnections />
            
            {/* STAGE 1: IDEATION */}
            <ChaosCloud />
            <SceneText 
                position={[-15, -3.0, 0]} 
                text="Ideation" 
                subtext="Your ideas and vision" 
                isMobile={isMobile}
            />

            {/* STAGE 2: CREATION */}
            <TheNeuralEngine />
            <SceneText 
                position={[0, -3.0, 0]} 
                text="Creation" 
                subtext="We will work hard to bring your vision to life"
                isMobile={isMobile}
            />

            {/* STAGE 3: IMPACT */}
            <TheImpact />
            <SceneText 
                position={[15, -3.0, 0]} 
                text="Impact" 
                subtext="Use your product to change the world"
                isMobile={isMobile}
            />
        </group>
    )
}