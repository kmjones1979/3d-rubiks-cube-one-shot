import React from "react";
import styles from "./CubeControls.module.css";

interface CubeControlsProps {
    onMove: (move: string) => void;
    onReset: () => void;
    moveCount: number;
}

const MOVES = {
    STANDARD: ["U", "D", "L", "R", "F", "B"],
    PRIME: ["U'", "D'", "L'", "R'", "F'", "B'"],
    DOUBLE: ["U2", "D2", "L2", "R2", "F2", "B2"],
};

const CubeControls: React.FC<CubeControlsProps> = ({
    onMove,
    onReset,
    moveCount,
}) => {
    return (
        <div className={styles.controlsContainer}>
            <div className={styles.stats}>
                <p>Moves: {moveCount}</p>
                <button onClick={onReset} className={styles.resetButton}>
                    Reset Cube
                </button>
            </div>
            <div className={styles.buttonsGrid}>
                {MOVES.STANDARD.map((move) => (
                    <button
                        key={move}
                        onClick={() => onMove(move)}
                        className={styles.moveButton}
                    >
                        {move}
                    </button>
                ))}
                {MOVES.PRIME.map((move) => (
                    <button
                        key={move}
                        onClick={() => onMove(move)}
                        className={styles.moveButton}
                    >
                        {move}
                    </button>
                ))}
                {MOVES.DOUBLE.map((move) => (
                    <button
                        key={move}
                        onClick={() => onMove(move)}
                        className={styles.moveButton}
                    >
                        {move}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CubeControls;
