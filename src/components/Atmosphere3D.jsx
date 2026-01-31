import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Environment } from '@react-three/drei';

const Atmosphere3D = () => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        // Very subtle rotation for a "breathing" effect
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.02; // Slower rotation
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Ambient Environment for Reflections */}
            <Environment preset="city" />

            {/* Pure Luxury Gold Dust - Minimal, Slow, Elegant */}
            <Sparkles
                count={100}
                scale={[20, 20, 10]}
                size={3}
                speed={0.1}
                opacity={0.6}
                color="#D4AF37" // Brand Gold
            />
        </group>
    );
};

export default Atmosphere3D;
