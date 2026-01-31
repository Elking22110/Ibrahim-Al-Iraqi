import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Detailed Procedural Tuxedo v2
const Tuxedo = (props) => {
  const jacketMaterial = new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.5 });
  const lapelMaterial = new THREE.MeshStandardMaterial({ color: "#000", roughness: 0.2, metalness: 0.3 });
  const shirtMaterial = new THREE.MeshStandardMaterial({ color: "#fff", roughness: 0.9 });
  const goldMaterial = new THREE.MeshStandardMaterial({ color: "#D4AF37", metalness: 0.8, roughness: 0.2 });

  // Create Jacket Shape (Half profile then mirrored or full shape)
  const jacketShape = new THREE.Shape();
  // Start bottom center
  jacketShape.moveTo(0, 0);
  jacketShape.lineTo(2.5, 0); // Bottom width
  jacketShape.bezierCurveTo(2.8, 2, 3.2, 4, 4.5, 6.5); // Waist to Shoulder outer
  jacketShape.lineTo(4.5, 7.5); // Shoulder height
  jacketShape.lineTo(1.5, 8.5); // Neck opening
  jacketShape.lineTo(1.5, 6); // Inner lapel line top
  jacketShape.lineTo(0, 3.5); // V-neck bottom
  jacketShape.lineTo(0, 0); // Close loop

  const extrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };

  return (
    <group {...props} scale={[0.12, 0.12, 0.12]}> {/* Scale down because shapes are drawn in larger units */}

      {/* JACKET BODY (Extruded Shape) */}
      <group position={[0, 5, 0]}>
        {/* Left Side */}
        <mesh castShadow receiveShadow position={[-0.2, 0, 0]} rotation={[0, Math.PI, 0]} material={jacketMaterial}>
          <extrudeGeometry args={[jacketShape, extrudeSettings]} />
        </mesh>
        {/* Right Side */}
        <mesh castShadow receiveShadow position={[0.2, 0, 0]} material={jacketMaterial}>
          <extrudeGeometry args={[jacketShape, extrudeSettings]} />
        </mesh>
      </group>

      {/* LAPELS */}
      <mesh position={[0, 9.5, 1.6]} rotation={[0.4, 0, 0]} material={lapelMaterial}>
        <boxGeometry args={[2.5, 5, 0.2]} />
      </mesh>

      {/* SHIRT (Simple backing) */}
      <mesh position={[0, 9, 0.5]} material={shirtMaterial}>
        <boxGeometry args={[3, 5, 1]} />
      </mesh>

      {/* BOW TIE */}
      <group position={[0, 11.5, 1.8]}>
        <mesh material={lapelMaterial} position={[-0.8, 0, 0]} rotation={[0, 0, 0.2]}>
          <sphereGeometry args={[0.6, 32, 32]} />
        </mesh>
        <mesh material={lapelMaterial} position={[0.8, 0, 0]} rotation={[0, 0, -0.2]}>
          <sphereGeometry args={[0.6, 32, 32]} />
        </mesh>
        <mesh material={lapelMaterial} position={[0, 0, 0.2]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh>
      </group>

      {/* BUTTONS */}
      <mesh position={[0, 6.5, 1.6]} material={goldMaterial}>
        <sphereGeometry args={[0.25, 32, 32]} />
      </mesh>
      <mesh position={[0, 5, 1.6]} material={goldMaterial}>
        <sphereGeometry args={[0.25, 32, 32]} />
      </mesh>

      {/* ARMS - Better cylinder positioning */}
      <mesh castShadow position={[-5, 7, 0]} rotation={[0, 0, 0.2]} material={jacketMaterial}>
        <cylinderGeometry args={[1, 0.8, 10, 16]} />
      </mesh>
      <mesh castShadow position={[5, 7, 0]} rotation={[0, 0, -0.2]} material={jacketMaterial}>
        <cylinderGeometry args={[1, 0.8, 10, 16]} />
      </mesh>

    </group>
  );
};

export const SuitModel = () => {
  const groupRef = useRef();
  const scroll = useScroll();

  useFrame((state, delta) => {
    const offset = scroll.offset; // 0 to 1
    if (groupRef.current) {
      // Smooth rotation based on scroll (lerped for smoothness)
      // We use damping logic manually or trust useScroll which is not reactive by default in this way without useFrame

      // Direct mapping for responsiveness during scroll
      const targetRotation = offset * Math.PI * 2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.1);

      // Floating animation
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, Math.sin(state.clock.elapsedTime) * 0.05 - 1, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>

      <Tuxedo />

      {/* Shadows instead of physical pod */}
      <ContactShadows resolution={1024} scale={10} blur={1} opacity={0.7} far={10} color="#000000" />

      {/* Decorative Floor Ring (optional, tech vibe) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.5, 1.55, 64]} />
        <meshBasicMaterial color="#D4AF37" opacity={0.5} transparent />
      </mesh>
    </group>
  );
};
