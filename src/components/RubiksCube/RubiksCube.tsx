import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { cubeStore, CubieProperties } from "../../store/cubeStore"; // Reverted path
import Cubie from "./Cubie"; // Assuming Cubie.tsx is in the same directory

const CUBIE_SIZE = 1;

// This component will be responsible for handling move requests
// and triggering animations/state updates in the Valtio store.
// For now, it just renders the cube based on the store.
const RubiksCube: React.FC = () => {
    const snap = useSnapshot(cubeStore);

    return (
        <Canvas
            style={{ width: "100%", height: "500px", background: "#222" }}
            camera={{ position: [5, 5, 5], fov: 30 }}
        >
            <ambientLight intensity={0.7} />
            <directionalLight
                position={[10, 15, 10]}
                intensity={0.8}
                castShadow
            />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />

            <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
                {" "}
                {/* Initial rotation for a nice view */}
                {snap.cubies.map((cubieProxy: CubieProperties) => (
                    // Pass the proxy itself, not the snapshot, if Cubie needs to make changes
                    // or if you want finer-grained reactivity within Cubie.
                    // For rendering based on snapshot, snap.cubies[i] is fine.
                    // Here, we pass the proxy from the store directly.
                    <Cubie
                        key={cubieProxy.id}
                        cubieProxy={
                            cubeStore.cubies.find(
                                (c) => c.id === cubieProxy.id
                            )!
                        }
                        size={CUBIE_SIZE}
                    />
                ))}
            </group>

            <OrbitControls enablePan={true} minDistance={3} maxDistance={20} />
        </Canvas>
    );
};

export default RubiksCube;
