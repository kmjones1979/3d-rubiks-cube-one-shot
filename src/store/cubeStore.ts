import { proxy } from "valtio";
import * as THREE from "three";

// Standard Rubik's Cube colors (can be shared or redefined if preferred)
const COLORS = {
    WHITE: new THREE.Color(0xffffff),
    YELLOW: new THREE.Color(0xffff00),
    BLUE: new THREE.Color(0x0000ff),
    GREEN: new THREE.Color(0x00ff00),
    RED: new THREE.Color(0xff0000),
    ORANGE: new THREE.Color(0xffa500),
    BLACK: new THREE.Color(0x1a1a1a), // Darker black for inner faces
};

export interface CubieProperties {
    id: string;
    initialPosition: readonly [number, number, number]; // Changed to readonly tuple
    currentPosition: THREE.Vector3; // Current position in world space
    orientation: THREE.Quaternion; // Current orientation
    colors: readonly THREE.Color[]; // Changed to readonly array of colors
}

const CUBE_SIZE = 3;
const CUBIE_SIZE = 1;
const offset = (CUBE_SIZE - 1) / 2;

const createInitialCubies = (): CubieProperties[] => {
    const cubies: CubieProperties[] = [];
    for (let x = 0; x < CUBE_SIZE; x++) {
        for (let y = 0; y < CUBE_SIZE; y++) {
            for (let z = 0; z < CUBE_SIZE; z++) {
                if (
                    CUBE_SIZE % 2 !== 0 &&
                    x === offset &&
                    y === offset &&
                    z === offset &&
                    CUBE_SIZE > 1
                ) {
                    continue; // Skip center cubie for 3x3x3
                }

                const initialPosArray: [number, number, number] = [
                    (x - offset) * CUBIE_SIZE,
                    (y - offset) * CUBIE_SIZE,
                    (z - offset) * CUBIE_SIZE,
                ];

                const cubieColors = [
                    initialPosArray[0] === offset * CUBIE_SIZE
                        ? COLORS.ORANGE
                        : COLORS.BLACK, // Right (+X)
                    initialPosArray[0] === -offset * CUBIE_SIZE
                        ? COLORS.RED
                        : COLORS.BLACK, // Left (-X)
                    initialPosArray[1] === offset * CUBIE_SIZE
                        ? COLORS.WHITE
                        : COLORS.BLACK, // Top (+Y)
                    initialPosArray[1] === -offset * CUBIE_SIZE
                        ? COLORS.YELLOW
                        : COLORS.BLACK, // Bottom (-Y)
                    initialPosArray[2] === offset * CUBIE_SIZE
                        ? COLORS.BLUE
                        : COLORS.BLACK, // Front (+Z)
                    initialPosArray[2] === -offset * CUBIE_SIZE
                        ? COLORS.GREEN
                        : COLORS.BLACK, // Back (-Z)
                ];

                if (
                    cubieColors.some(
                        (color) =>
                            color.getHexString() !== COLORS.BLACK.getHexString()
                    )
                ) {
                    cubies.push({
                        id: `cubie-${x}-${y}-${z}`,
                        initialPosition: initialPosArray,
                        currentPosition: new THREE.Vector3(...initialPosArray),
                        orientation: new THREE.Quaternion(),
                        colors: cubieColors,
                    });
                }
            }
        }
    }
    return cubies;
};

interface CubeState {
    cubies: CubieProperties[];
    isAnimating: boolean;
    // Add other state properties like currentMove, scramble, etc. if needed
}

export const cubeStore = proxy<CubeState>({
    cubies: createInitialCubies(),
    isAnimating: false,
});

export const resetCubeState = () => {
    cubeStore.isAnimating = true; // Indicate change is happening
    const newCubies = createInitialCubies();
    // Directly update proxies for react-spring to pick up changes
    newCubies.forEach((newCubie, index) => {
        if (cubeStore.cubies[index]) {
            cubeStore.cubies[index].currentPosition.copy(
                new THREE.Vector3(...newCubie.initialPosition)
            );
            cubeStore.cubies[index].orientation.copy(new THREE.Quaternion());
            // Colors and ID remain the same, initialPosition is for reference
        }
    });
    // If lengths differ (should not happen with fixed CUBE_SIZE), replace the array
    if (cubeStore.cubies.length !== newCubies.length) {
        cubeStore.cubies = newCubies;
    }
    cubeStore.isAnimating = false;
    // Reset move count in the UI component that calls this
};

const CUBIE_THRESHOLD = 0.5; // To account for floating point inaccuracies

export const performMove = (move: string) => {
    if (cubeStore.isAnimating) return; // Prevent moves during animation (basic guard)
    cubeStore.isAnimating = true;

    const [face, modifier] =
        move.length === 2 ? [move[0], move[1]] : [move[0], " "]; // ' ' for single turn, '\'' for prime, '2' for double
    let angle = Math.PI / 2; // 90 degrees
    let turns = 1;

    if (modifier === "'") {
        angle = -angle; // Counter-clockwise
    } else if (modifier === "2") {
        turns = 2; // 180 degrees (or two 90-degree turns)
    }

    let axis = new THREE.Vector3();
    let cubiesToRotate: CubieProperties[] = [];
    const currentCubies = cubeStore.cubies; // Work with current state

    switch (face) {
        case "U":
            axis.set(0, 1, 0);
            cubiesToRotate = currentCubies.filter(
                (c) =>
                    Math.abs(c.currentPosition.y - offset * CUBIE_SIZE) <
                    CUBIE_THRESHOLD
            );
            if (modifier !== "'") angle = -angle; // U is clockwise looking from top, so -Y axis rotation for RHR
            break;
        case "D":
            axis.set(0, 1, 0);
            cubiesToRotate = currentCubies.filter(
                (c) =>
                    Math.abs(c.currentPosition.y + offset * CUBIE_SIZE) <
                    CUBIE_THRESHOLD
            );
            if (modifier === "'") angle = -angle; // D prime is clockwise, D is anti-clockwise from top view perspective (or +Y axis for RHR)
            break;
        case "L":
            axis.set(1, 0, 0);
            cubiesToRotate = currentCubies.filter(
                (c) =>
                    Math.abs(c.currentPosition.x + offset * CUBIE_SIZE) <
                    CUBIE_THRESHOLD
            );
            if (modifier !== "'") angle = -angle;
            break;
        case "R":
            axis.set(1, 0, 0);
            cubiesToRotate = currentCubies.filter(
                (c) =>
                    Math.abs(c.currentPosition.x - offset * CUBIE_SIZE) <
                    CUBIE_THRESHOLD
            );
            if (modifier === "'") angle = -angle;
            break;
        case "F":
            axis.set(0, 0, 1);
            cubiesToRotate = currentCubies.filter(
                (c) =>
                    Math.abs(c.currentPosition.z - offset * CUBIE_SIZE) <
                    CUBIE_THRESHOLD
            );
            if (modifier !== "'") angle = -angle;
            break;
        case "B":
            axis.set(0, 0, 1);
            cubiesToRotate = currentCubies.filter(
                (c) =>
                    Math.abs(c.currentPosition.z + offset * CUBIE_SIZE) <
                    CUBIE_THRESHOLD
            );
            if (modifier === "'") angle = -angle;
            break;
        default:
            console.warn("Unknown move:", move);
            cubeStore.isAnimating = false;
            return;
    }

    // Perform the rotation 'turns' number of times
    for (let t = 0; t < turns; t++) {
        const rotation = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        cubiesToRotate.forEach((cubieProxy) => {
            // Find the actual proxy in the store to modify it
            const storeCubie = cubeStore.cubies.find(
                (c) => c.id === cubieProxy.id
            );
            if (storeCubie) {
                // Rotate position around the world origin (0,0,0)
                storeCubie.currentPosition.applyQuaternion(rotation);
                // Rotate orientation (local rotation)
                storeCubie.orientation.premultiply(rotation);
            }
        });
    }

    // After all updates, Valtio will notify components, and react-spring will animate
    // A small delay might be needed if isAnimating is used to block UI,
    // to allow springs to start, but react-spring should handle this gracefully.
    // For simplicity, we set it false immediately. With proper animation setup,
    // this flag might be more about disabling UI during the actual state change phase.
    cubeStore.isAnimating = false;
};

// --- Move Logic (Placeholder - to be implemented) ---
// Example: function applyMove(move: string) { ... }
