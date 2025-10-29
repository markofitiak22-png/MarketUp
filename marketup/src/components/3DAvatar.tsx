'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';

interface Avatar3DProps {
  modelUrl: string;
  avatarId: string;
  className?: string;
}

function Model({ url, avatarId }: { url: string; avatarId: string }) {
  // Create different 3D shapes based on avatar ID
  const getAvatarShape = () => {
    switch (avatarId) {
      case '3d-alex-001':
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ff6b6b" />
          </mesh>
        );
      case '3d-jordan-002':
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#4ecdc4" />
          </mesh>
        );
      case '3d-sam-003':
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <coneGeometry args={[1, 2, 8]} />
            <meshStandardMaterial color="#45b7d1" />
          </mesh>
        );
      case '3d-casey-004':
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 1, 2, 8]} />
            <meshStandardMaterial color="#96ceb4" />
          </mesh>
        );
      case '3d-riley-005':
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <octahedronGeometry args={[1.2]} />
            <meshStandardMaterial color="#feca57" />
          </mesh>
        );
      case '3d-taylor-006':
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <torusGeometry args={[1, 0.4, 16, 32]} />
            <meshStandardMaterial color="#ff9ff3" />
          </mesh>
        );
      default:
        return (
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
        );
    }
  };

  return (
    <group scale={[1, 1, 1]} position={[0, 0, 0]}>
      {getAvatarShape()}
    </group>
  );
}

function FallbackModel() {
  return (
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshLambertMaterial color="#666666" />
    </mesh>
  );
}

export default function Avatar3D({ modelUrl, avatarId, className = '' }: Avatar3DProps) {
  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: '300px' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        <Suspense fallback={<FallbackModel />}>
          <Model url={modelUrl} avatarId={avatarId} />
        </Suspense>
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={1}
        />
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
