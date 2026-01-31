import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Environment, PerspectiveCamera, Sparkles, ContactShadows, MeshReflectorMaterial, Float } from '@react-three/drei';
import { SuitModel } from './SuitModel';
import { Overlay } from './Overlay';

const Experience = () => {
    return (
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
            <color attach="background" args={['#f5f5f0']} />

            {/* BRIGHT STUDIO LIGHTING */}
            <ambientLight intensity={1.5} />
            <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={15} color="#ffffff" castShadow />
            <spotLight position={[-5, 8, -5]} angle={0.25} penumbra={1} intensity={10} color="#e6e6fa" />
            <pointLight position={[0, -2, 0]} intensity={2} color="white" />

            {/* Environment for reflections */}
            <Environment preset="apartment" />

            {/* Atmosphere - Subtle dust */}
            <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#333333" />

            {/* SHOWROOM FLOOR */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
                <planeGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={40}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#e0e0e0"
                    metalness={0.5}
                />
            </mesh>

            <ScrollControls pages={3} damping={0.2}>
                <SuitModel />
                <Overlay />
            </ScrollControls>
        </Canvas>
    );
};

export default Experience;
