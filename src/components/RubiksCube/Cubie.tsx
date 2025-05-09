import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useSnapshot } from "valtio";
import { animated, useSpring } from "@react-spring/three";
import { CubieProperties } from "../../store/cubeStore"; // Reverted path

interface CubieComponentProps {
    cubieProxy: CubieProperties; // Pass the Valtio proxy for this specific cubie
    size?: number;
}

// const AnimatedGroup = animated(THREE.Group); // This was incorrect

const Cubie: React.FC<CubieComponentProps> = ({ cubieProxy, size = 1 }) => {
    const snap = useSnapshot(cubieProxy);
    const boxSize = size * 0.95; // Add a small gap between cubies

    const { position, quaternion } = useSpring({
        // Read initial/current values directly from the snapshot for the spring
        // useSpring will interpolate from previous to new if these change
        to: {
            position: [
                snap.currentPosition.x,
                snap.currentPosition.y,
                snap.currentPosition.z,
            ],
            quaternion: [
                snap.orientation.x,
                snap.orientation.y,
                snap.orientation.z,
                snap.orientation.w,
            ],
        },
        config: { mass: 1, tension: 300, friction: 30 }, // Adjust for desired animation feel
    });

    // Materials are based on initial colors and don't change per se,
    // the mesh orientation handles how they are viewed.
    const materials = snap.colors.map((color, index) => (
        <meshStandardMaterial
            key={index}
            attach={`material-${index}`}
            color={color}
            roughness={0.3}
            metalness={0.2}
        />
    ));

    // We use an animated.group which takes animated position and quaternion
    return (
        <animated.group
            position={position as any}
            quaternion={quaternion as any}
        >
            <mesh>
                <boxGeometry args={[boxSize, boxSize, boxSize]} />
                {materials}
            </mesh>
        </animated.group>
    );
};

export default Cubie;
