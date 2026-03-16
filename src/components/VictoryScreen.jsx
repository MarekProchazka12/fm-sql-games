import React, { useState } from 'react';
import './VictoryScreen.css';

export default function VictoryScreen({ score, gameName, onRestart, onBackToMenu, onSubmitScore }) {
    const [playerName, setPlayerName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const handleSubmit = () => {
        if (playerName.trim() === '') return;
        onSubmitScore(playerName);
        setIsSubmitted(true);
    };
    return (
        <div className="victory-overlay">
            <div className="victory-modal">
                <div className="victory-header">
                    <h2> MISE DOKONČENA! </h2>
                </div>

                <div className="victory-body">
                    <p>
                        Úspěšně jsi pokořil výzvu ve hře <strong>{gameName}</strong>
                    </p>

                    <div className="score-display">
                        <span className="score-label">Tvé finální skóre:</span>
                        <span className="score-value">{score}</span>
                    </div>
                </div>
                <div className="leaderboard-submission">
                    {!isSubmitted ? (
                        <>
                            <p className="leaderboard-hint">Zapiš se do leaderboardu</p>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Zadej svou přezdívku..."
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    maxLength={20}
                                    className="player-input"
                                />
                                <button
                                    className="btn-submit"
                                    onClick={handleSubmit}
                                    disabled={playerName.trim() === ''}
                                >
                                    Odeslat
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="success-msg">Skóre odesláno!</p>
                    )}
                </div>

                <div className="victory-actions">
                    <button className="btn-menu" onClick={onBackToMenu}>
                        Zpět do menu
                    </button>
                    <button className="btn-restart" onClick={onRestart}>
                        Hrát znovu
                    </button>
                </div>
            </div>
        </div>
    );
}
