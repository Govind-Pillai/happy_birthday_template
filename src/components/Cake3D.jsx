import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float, ContactShadows, Text } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

const Candle = ({ position, onBlow }) => {
    const [isLit, setIsLit] = useState(true);
    const flameRef = useRef();

    useFrame((state) => {
        if (flameRef.current && isLit) {
            flameRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
            flameRef.current.scale.y = 1 + Math.cos(state.clock.elapsedTime * 15) * 0.2;
        }
    });

    const handleBlow = (e) => {
        e.stopPropagation();
        if (isLit) {
            setIsLit(false);
            onBlow();
        }
    };

    return (
        <group position={position} onClick={handleBlow}>
            <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
                <meshStandardMaterial color="#ff69b4" />
            </mesh>
            {isLit && (
                <mesh ref={flameRef} position={[0, 0.9, 0]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial
                        color="#ffcc00"
                        emissive="#ff8800"
                        emissiveIntensity={2}
                    />
                    <pointLight color="#ff8800" intensity={1} distance={2} />
                </mesh>
            )}
        </group>
    );
};

const Cake = ({ onBlowAll }) => {
    const [blownCount, setBlownCount] = useState(0);
    const totalCandles = 5;

    const handleBlowCandle = () => {
        setBlownCount(prev => {
            const newCount = prev + 1;
            if (newCount === totalCandles) {
                onBlowAll();
            }
            return newCount;
        });
    };

    const candlePositions = useMemo(() => {
        const positions = [];
        const radius = 0.6;
        for (let i = 0; i < totalCandles; i++) {
            const angle = (i / totalCandles) * Math.PI * 2;
            positions.push([Math.cos(angle) * radius, 0.8, Math.sin(angle) * radius]);
        }
        return positions;
    }, []);

    return (
        <group>
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
                <meshStandardMaterial color="#fce4ec" />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[1, 1, 0.8, 32]} />
                <meshStandardMaterial color="#f8bbd0" />
            </mesh>
            <mesh position={[0, 1.25, 0]}>
                <torusGeometry args={[0.95, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {candlePositions.map((pos, i) => (
                <Candle key={i} position={pos} onBlow={handleBlowCandle} />
            ))}

            <ContactShadows
                position={[0, -0.5, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4.5}
            />
        </group>
    );
};

const Cake3D = ({ onCelebration }) => {
    return (
        <div style={{ width: "100%", height: "400px", cursor: "pointer" }}>
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 2, 5]} />
                <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Cake onBlowAll={onCelebration} />
                </Float>

                <Text
                    position={[0, 3, 0]}
                    fontSize={0.3}
                    color="#ff4081"
                    anchorX="center"
                    anchorY="middle"
                >
                    {"Blow the candles!"}
                </Text>
            </Canvas>
        </div>
    );
};

export default Cake3D;
