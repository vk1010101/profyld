'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Float, OrbitControls } from '@react-three/drei';
import GlassCard from './GlassCard';
import { Suspense } from 'react';

export default function Scene3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ preserveDrawingBuffer: true }}
            onCreated={({ gl }) => {
                gl.domElement.addEventListener('webglcontextlost', (event) => {
                    event.preventDefault();
                    console.log('Context lost');
                }, false);
            }}
        >
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

            <Suspense fallback={null}>
                {/* Environment map for realistic reflections */}
                <Environment preset="city" />

                <Float
                    speed={2}
                    rotationIntensity={0.5}
                    floatIntensity={1}
                >
                    <GlassCard />
                </Float>
            </Suspense>

            {/* Minimal controls - disable zoom/pan for restricted feel */}
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
    );
}
