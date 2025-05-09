import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import RubiksCube from "../src/components/RubiksCube/RubiksCube";
import CubeControls from "../src/components/Controls/CubeControls";
import { performMove, resetCubeState, cubeStore } from "../src/store/cubeStore";
import { useSnapshot } from "valtio";

export default function Home() {
    const [moveCount, setMoveCount] = useState(0);
    const snap = useSnapshot(cubeStore);

    const handleMove = (move: string) => {
        if (snap.isAnimating) return;

        performMove(move);
        setMoveCount((prev) => prev + 1);
    };

    const handleReset = () => {
        if (snap.isAnimating) return;

        resetCubeState();
        setMoveCount(0);
    };

    useEffect(() => {
        // console.log("Cube state changed:", snap.cubies.map(c => ({id: c.id, pos: c.currentPosition, ori: c.orientation})) );
    }, [snap.cubies]);

    return (
        <div className={styles.container}>
            <Head>
                <title>3D Rubik&apos;s Cube</title>
                <meta
                    name="description"
                    content="Interactive 3D Rubik's Cube"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>3D Rubik&apos;s Cube</h1>
                <RubiksCube />
                <CubeControls
                    onMove={handleMove}
                    onReset={handleReset}
                    moveCount={moveCount}
                />
                {/* UI Controls will go here */}
            </main>
        </div>
    );
}
