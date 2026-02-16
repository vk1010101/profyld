'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function GlassCard() {
    const mesh = useRef(null);

    useFrame((state, delta) => {
        if (mesh.current) {
            // Gentle floating rotation
            mesh.current.rotation.x += delta * 0.1;
            mesh.current.rotation.y += delta * 0.15;

            // Mouse interaction (lerp to mouse position)
            const { x, y } = state.mouse;
            mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, y * 0.5, 0.1);
            mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, x * 0.5, 0.1);
        }
    });

    return (
        <group>
            <mesh ref={mesh}>
                <boxGeometry args={[3, 4.5, 0.4]} />
                <MeshTransmissionMaterial
                    backside={true}
                    samples={16}
                    thickness={0.5}
                    chromaticAberration={0.5} // "Holo" rainbow effect
                    anisotropy={0.3}
                    distortion={0.4}
                    distortionScale={0.5}
                    temporalDistortion={0.1}
                    iridescence={1}
                    iridescenceIOR={1}
                    iridescenceThicknessRange={[0, 1400]}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor="#ffffff"
                    color="#e0e0e0"
                    background={new THREE.Color('#000')}
                />
            </mesh>

            {/* Text Inside the Glass */}
            <Text
                font="https://fonts.gstatic.com/s/rajdhani/v15/L10x2TVB9QfaJ7gmxlG9.woff"
                position={[0, 0, -0.3]} // Slightly behind center
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                IDENTITY
            </Text>
            <Text
                position={[0, -0.8, -0.3]}
                fontSize={0.2}
                color="#aaa"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.2}
            >
                CLASSIFIED
            </Text>
        </group>
    );
}
