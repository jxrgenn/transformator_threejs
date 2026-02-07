import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useScroll, MeshTransmissionMaterial, Float, Instances, Instance, Text, RoundedBox, Sparkles } from '@react-three/drei';

// --- THEME COLORS ---
const THEME = {
    primary: "#1a5fb4", // Darker Electric Blue
    secondary: "#0d2b4a", // Deep Midnight
    highlight: "#62a0ea", // Soft Blue Highlight
    glass: "#cce0ff",
    wireframe: "#142840"
}

// --- SHARED TEXT COMPONENT ---
const SceneText = ({ 
  text, 
  subtext, 
  position 
}: { 
  text: string; 
  subtext: string; 
  position: [number, number, number] 
}) => {
  const group = useRef<THREE.Group>(null);
  const titleRef = useRef<THREE.Mesh>(null);
  const subRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    
    const worldPos = new THREE.Vector3();
    group.current.getWorldPosition(worldPos);
    const dist = Math.abs(worldPos.x);
    
    // Visibility logic with smooth fade
    const active = dist < 7;
    const opacity = Math.max(0, 1 - (dist / 10));

    if (titleRef.current) {
        (titleRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
        (titleRef.current.material as THREE.MeshBasicMaterial).transparent = true;
        
        // Subtle scale animation
        const targetScale = active ? 1 : 0.8;
        titleRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (subRef.current) {
        (subRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.7; 
        (subRef.current.material as THREE.MeshBasicMaterial).transparent = true;
    }
  });

  return (
    <group ref={group} position={position}>
      <Text
        ref={titleRef}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={1.0}
        letterSpacing={-0.05}
        color="white"
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
      >
        {text}
      </Text>
      <Text
        ref={subRef}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        fontSize={0.25}
        letterSpacing={0.2}
        color={THEME.highlight}
        anchorX="center"
        anchorY="middle"
        position={[0, -0.8, 0]} // Increased padding
      >
        {subtext.toUpperCase()}
      </Text>
    </group>
  );
};

// --- STAGE 1: BLUEPRINT (Voxel Cloud) ---
const BlueprintStage = () => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={group} position={[-15, 0, 0]}>
      {/* Grid of Voxels */}
      <Instances range={200}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.9} />
        {Array.from({ length: 200 }).map((_, i) => {
             const x = (Math.random() - 0.5) * 4;
             const y = (Math.random() - 0.5) * 4;
             const z = (Math.random() - 0.5) * 4;
             
             const snap = 0.5;
             const sx = Math.round(x / snap) * snap;
             const sy = Math.round(y / snap) * snap;
             const sz = Math.round(z / snap) * snap;

             return (
                <Instance
                    key={i}
                    position={[sx, sy, sz]}
                    rotation={[0, 0, 0]}
                    scale={Math.random() * 0.5 + 0.5}
                />
             );
        })}
      </Instances>

      <mesh>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color={THEME.wireframe} wireframe transparent opacity={0.2} />
      </mesh>
      
      <pointLight color={THEME.primary} intensity={2} distance={10} />
      <Sparkles count={50} scale={5} size={2} speed={0.4} opacity={0.3} color={THEME.primary} />
    </group>
  );
};

// --- STAGE 2: ATOM BRAIN (The Engine) ---
// A hybrid atom/brain structure representing the JXSoft Engine
const AtomBrain = () => {
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringsRef.current) {
        ringsRef.current.rotation.x = t * 0.15;
        ringsRef.current.rotation.y = t * 0.1;
    }
    if (coreRef.current) {
        // Pulse
        const scale = 1 + Math.sin(t * 3) * 0.02;
        coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
        {/* Spinning Atomic Rings */}
        <group ref={ringsRef}>
            <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[3, 0.01, 16, 100]} />
                <meshBasicMaterial color={THEME.highlight} transparent opacity={0.2} />
            </mesh>
            <mesh rotation={[Math.PI/3, 0, 0]}>
                <torusGeometry args={[2.8, 0.01, 16, 100]} />
                <meshBasicMaterial color={THEME.secondary} transparent opacity={0.3} />
            </mesh>
            <mesh rotation={[-Math.PI/3, 0, 0]}>
                <torusGeometry args={[2.8, 0.01, 16, 100]} />
                <meshBasicMaterial color={THEME.primary} transparent opacity={0.2} />
            </mesh>
            
            {/* Particles on rings */}
            <Instances range={20}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
                {Array.from({ length: 20 }).map((_, i) => (
                    <Instance 
                        key={i} 
                        position={[
                            3 * Math.cos(i), 
                            3 * Math.sin(i), 
                            0
                        ]} 
                    />
                ))}
            </Instances>
        </group>

        {/* The Brain Core */}
        <Float speed={5} rotationIntensity={0.5} floatIntensity={0.2}>
            <mesh ref={coreRef}>
                <sphereGeometry args={[1.2, 64, 64]} />
                <meshStandardMaterial 
                    color="#020202" 
                    emissive={THEME.primary}
                    emissiveIntensity={0.6}
                    roughness={0.2}
                    metalness={1} 
                />
            </mesh>
            {/* Outer Shell */}
            <mesh scale={[1.4, 1.4, 1.4]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color={THEME.highlight} wireframe transparent opacity={0.05} />
            </mesh>
        </Float>

        <pointLight color={THEME.primary} intensity={4} distance={15} decay={2} />
        <Sparkles count={100} scale={6} size={2} speed={1} opacity={0.4} color={THEME.highlight} />
    </group>
  );
};

// --- STAGE 3: RESULT STACK (The Product) ---
const ResultStack = () => {
  return (
    <group position={[15, 0, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* Layer 1: Base */}
        <group position={[0, -0.6, 0]}>
            <RoundedBox args={[3, 0.2, 3]} radius={0.05} smoothness={4}>
                 <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.1} />
            </RoundedBox>
        </group>

        {/* Layer 2: Mid Logic */}
        <group position={[0, 0, 0]}>
            <RoundedBox args={[3, 0.2, 3]} radius={0.05} smoothness={4}>
                 <meshStandardMaterial color="#101010" metalness={0.8} roughness={0.1} />
            </RoundedBox>
             <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0.11, 0]}>
                 <planeGeometry args={[2.8, 2.8]} />
                 <meshBasicMaterial color={THEME.primary} wireframe transparent opacity={0.1} />
            </mesh>
        </group>

        {/* Layer 3: UI / Top Glass */}
        <group position={[0, 0.6, 0]}>
            <RoundedBox args={[3, 0.2, 3]} radius={0.05} smoothness={4}>
                <MeshTransmissionMaterial 
                    samples={8}
                    thickness={0.5}
                    chromaticAberration={0.05}
                    anisotropy={0.1}
                    roughness={0.05}
                    color="#e0eaff"
                    toneMapped={false}
                />
            </RoundedBox>
            {/* Glowing Icon Placeholder */}
            <mesh position={[0, 0.2, 0]} rotation={[Math.PI/2, 0, 0]}>
                 <ringGeometry args={[0.5, 0.6, 32]} />
                 <meshBasicMaterial color={THEME.highlight} toneMapped={false} />
            </mesh>
        </group>

      </Float>

      <Sparkles count={80} scale={5} size={2} speed={0.4} opacity={0.4} color={THEME.highlight} />
      <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={8} color="white" />
    </group>
  );
};

// --- CONNECTORS (Node to Node) ---

const DataPulse: React.FC<{ offset: number }> = ({ offset }) => {
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (!ref.current) return;
        
        // Move from -15 to 15
        const speed = 6;
        const totalDist = 30;
        const t = (state.clock.elapsedTime * speed + offset) % totalDist; 
        const currentX = t - 15;
        
        ref.current.position.set(currentX, 0, 0);
        
        // Visibility logic (fade out at ends)
        const distFromCenter = Math.abs(currentX);
        const fadeThreshold = 12;
        let opacity = 1;
        
        if (distFromCenter > fadeThreshold) {
            opacity = 1 - ((distFromCenter - fadeThreshold) / (15 - fadeThreshold));
        }
        
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, opacity);
        
        // Stretch effect based on movement
        ref.current.scale.set(1.5, 1, 1);
    });

    return (
        <mesh ref={ref} rotation={[0, 0, Math.PI/2]}>
            <capsuleGeometry args={[0.04, 0.6, 4, 8]} />
            <meshBasicMaterial 
                color={THEME.highlight} 
                transparent 
                toneMapped={false}
            />
        </mesh>
    );
}

const NodeConnections = () => {
    return (
        <group>
            {/* Connection Lines - Extremely faint */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                <cylinderGeometry args={[0.02, 0.02, 30]} />
                <meshBasicMaterial color={THEME.primary} transparent opacity={0.05} />
            </mesh>
            
            {/* Traveling Data Pulses (Individual meshes for stability) */}
            {Array.from({ length: 5 }).map((_, i) => (
                <DataPulse key={i} offset={i * 6} />
            ))}
        </group>
    )
}

// --- DATA STREAM (Background) ---
const DataStream = () => {
  const streamRef = useRef<THREE.Group>(null);
  const lines = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
        const y = (Math.random() - 0.5) * 12;
        const width = Math.random() * 0.1;
        const length = Math.random() * 20 + 10;
        const speed = Math.random() * 0.5 + 0.2;
        return { y, width, length, speed, offset: Math.random() * 20 };
    });
  }, []);

  useFrame((state) => {
      if (!streamRef.current) return;
      streamRef.current.children.forEach((mesh, i) => {
          const info = lines[i];
          mesh.position.z = ((state.clock.elapsedTime * 15 * info.speed) + info.offset) % 40 - 20;
      });
  });

  return (
    <group ref={streamRef}>
        {lines.map((l, i) => (
             <mesh key={i} position={[ (Math.random()-0.5)*20 , l.y, 0]}>
                 <boxGeometry args={[0.02, 0.02, l.length]} />
                 <meshBasicMaterial color="#080808" transparent opacity={0.5} />
             </mesh>
        ))}
    </group>
  );
};

// --- MAIN CONTROLLER ---
export const ProcessJourney: React.FC = () => {
  const scroll = useScroll();

  return (
    <group>
      <perspectiveCamera position={[0, 0, 15]} fov={35} />
      <SceneContent scroll={scroll} />
    </group>
  );
};

const SceneContent = ({ scroll }: { scroll: any }) => {
    const worldRef = useRef<THREE.Group>(null);
    
    useFrame((state, delta) => {
        if (worldRef.current) {
            // Scroll Logic: Move world left as user scrolls down
            const targetX = 15 - (scroll.offset * 30);
            
            // Damping for smooth movement
            worldRef.current.position.x = THREE.MathUtils.damp(worldRef.current.position.x, targetX, 2, delta);
            
            // Depth ease-in-out
            const depth = Math.sin(scroll.offset * Math.PI) * 2; 
            worldRef.current.position.z = THREE.MathUtils.damp(worldRef.current.position.z, -depth, 2, delta);
        }
    });

    return (
        <group ref={worldRef}>
            <DataStream />
            <NodeConnections />
            
            {/* STAGE 1 */}
            <BlueprintStage />
            <SceneText 
                position={[-15, -3.5, 0]} 
                text="YOUR IDEAS" 
                subtext="And Vision" 
            />

            {/* STAGE 2 */}
            <AtomBrain />
            <SceneText 
                position={[0, -4.0, 0]} 
                text="JXSOFT" 
                subtext="We make your dreams a reality" 
            />

            {/* STAGE 3 */}
            <ResultStack />
            <SceneText 
                position={[15, -3.5, 0]} 
                text="RESULTS" 
                subtext="Enjoy your vision brought to life" 
            />
        </group>
    )
}