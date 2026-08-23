import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, Stars, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';

// ── Orbiting Skill Orb ─────────────────────────────────────────
function SkillOrb({ radius, angle, speed, color, label, yOffset = 0, size = 0.4 }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const currentAngle = angle + t * speed;
    const x = Math.cos(currentAngle) * radius;
    const z = Math.sin(currentAngle) * radius;
    
    // Smooth bobbing on the Y axis
    const y = yOffset + Math.sin(t * speed * 2 + angle) * 0.5;
    
    groupRef.current.position.set(x, y, z);
    
    // Always face the camera
    groupRef.current.lookAt(state.camera.position);
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Trail width={0.5} color={color} length={4} decay={1} attenuation={(t) => t * t}>
          <Sphere args={[size, 32, 32]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.9}
              roughness={0.2}
              metalness={0.8}
            />
          </Sphere>
        </Trail>
        
        {/* Glow effect */}
        <pointLight color={color} intensity={2.5} distance={6} decay={2} />
        <Sphere args={[size * 1.5, 16, 16]}>
           <meshBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </Sphere>
        
        {/* 3D Label */}
        <Text
          position={[0, -size - 0.3, 0]}
          fontSize={0.25}
          color="#F8FAFC"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
}

// ── Particle Field (Alternative to Stars for custom styling) ───
function ParticleField({ count = 2000 }) {
  const points = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40; // z
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    points.current.rotation.y = t * 0.02;
    // Move particles slowly towards camera
    points.current.position.z = (t * 0.5) % 20; 
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#FCD34D"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Main Scene ──────────────────────────────────────────────────
export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 bg-[#020617] w-full h-full">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <fog attach="fog" args={['#020617', 5, 25]} />
        
        <ambientLight intensity={0.2} color="#0F172A" />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color="#06B6D4" />
        <directionalLight position={[-10, 10, 5]} intensity={0.5} color="#F59E0B" />

        {/* Floating Skill Orbs */}
        <SkillOrb radius={3}   angle={0}           speed={0.4} color="#F59E0B" label="Python"    yOffset={1}   size={0.5} />
        <SkillOrb radius={4.5} angle={Math.PI / 3} speed={0.3} color="#06B6D4" label="Guitar"    yOffset={-1}  size={0.4} />
        <SkillOrb radius={3.5} angle={Math.PI}     speed={0.5} color="#8B5CF6" label="Design"    yOffset={0.5} size={0.45} />
        <SkillOrb radius={5}   angle={Math.PI*1.5} speed={0.2} color="#10B981" label="Language"  yOffset={-1.5} size={0.35} />
        <SkillOrb radius={2.5} angle={Math.PI*0.7} speed={0.6} color="#EC4899" label="Fitness"   yOffset={2}   size={0.3} />

        {/* Central Core Glow */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#020617" transparent opacity={0.8} />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#F59E0B" intensity={3} distance={8} decay={2} />

        {/* Particles */}
        <ParticleField count={1500} />
        <Stars radius={50} depth={20} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* Floor Grid */}
        <gridHelper args={[40, 40, '#0891B2', '#0F172A']} position={[0, -4, 0]} />
        
      </Canvas>
    </div>
  );
}
