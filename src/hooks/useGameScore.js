import { useState } from 'react';

export const useGameScore = () => {
    const [totalScore, setTotalScore] = useState(0);
    const [sceneAttempts, setSceneAttempts] = useState(0);
    const [usedHint, setUsedHint] = useState(false);
    const BASE_SCORE = 100;
    const MISTAKE_PENALTY = 10;
    const HINT_PENALTY = 25;
    const MIN_SCORE_PER_SCENE = 10;

    const registerMistake = () => {
        setSceneAttempts((prev) => prev + 1);
    };

    const registerHint = () => {
        setUsedHint(true);
    };

    const submitScene = () => {
        let earnedPoints = BASE_SCORE;

        earnedPoints -= sceneAttempts * MISTAKE_PENALTY;

        if (usedHint) {
            earnedPoints -= HINT_PENALTY;
        }

        if (earnedPoints < MIN_SCORE_PER_SCENE) {
            earnedPoints = MIN_SCORE_PER_SCENE;
        }

        setTotalScore((prev) => prev + earnedPoints);

        setSceneAttempts(0);
        setUsedHint(false);
        return earnedPoints;
    };

    return {
        score: totalScore,
        sceneAttempts,
        usedHint,
        registerMistake,
        registerHint,
        submitScene,
    };
};
