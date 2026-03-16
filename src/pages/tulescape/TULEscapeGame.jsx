import React, { useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import './TULEscapeGame.css';
import gameData from '../../data/TULEscape.json';
import schema from '../../assets/TULEscape_scheme.png';
import _ from 'lodash';
import { supabase } from '../../supabaseClient';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-sql';
import { sqlDictionary } from '../../data/sqlDictionary';
import { useGameScore } from '../../hooks/useGameScore';
import VictoryScreen from '../../components/VictoryScreen';
import { useNavigate } from 'react-router-dom';

export default function TULEscapeGame() {
    const [activeOverlay, setActiveOverlay] = useState('table');
    const [db, setDb] = useState(null);
    const [currentScene, setCurrentScene] = useState(1);
    const [lastSuccessScene, setLastSuccessScene] = useState(0);
    const currSceneData = gameData.scenes[currentScene - 1];
    const [query, setQuery] = useState('SEM PIŠ DOTAZY');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const { score, registerMistake, registerHint, submitScene, resetScore } = useGameScore();
    const navigate = useNavigate();
    const [isGameFinished, setIsGameFinished] = useState(false);

    const toggleOverlay = (type) => {
        setActiveOverlay(type);
    };

    useEffect(() => {
        const editor = document.querySelector('.tul-input-area');
        if (editor) {
            setTimeout(() => {
                editor.scrollTop = editor.scrollHeight;
            }, 0);
        }
    }, [query]);

    useEffect(() => {
        initSqlJs({ locateFile: (f) => `${import.meta.env.BASE_URL}${f}` }).then((SQL) => {
            const database = new SQL.Database();
            database.run(gameData.createScript);
            database.run(gameData.insertScript);
            setDb(database);
        });
    }, []);

    const logQuery = async (queryData) => {
        const { error } = await supabase.from('query_logs').insert([
            {
                game_name: queryData.gameName,
                scene_id: queryData.sceneId,
                query: queryData.query,
                is_correct: queryData.isCorrect,
                error: queryData.error || null,
            },
        ]);
        if (error) {
            console.error('Chyba při logování:', error.message);
        }
    };

    const isSuccesful = (res) => {
        let trimmedUser = query.toLowerCase().trim();
        let trimmedAnswer = currSceneData.answer.toLowerCase().trim();
        if (!trimmedUser.endsWith(';')) {
            trimmedUser += ';';
        }
        if (trimmedUser == trimmedAnswer) {
            return true;
        }
        const sceneConfirmTable = db.exec(currSceneData.answer);

        if (!res || res.length === 0 || !sceneConfirmTable || sceneConfirmTable.length === 0) {
            return false;
        }

        if (res[0].columns.length !== sceneConfirmTable[0].columns.length) {
            return false;
        }

        if (res[0].values.length !== sceneConfirmTable[0].values.length) {
            return false;
        }

        if (_.isEqual(res.values, sceneConfirmTable.values)) {
            return true;
        }
        return false;
    };

    function nextScene() {
        if (currentScene >= gameData.number_of_scenes) {
            setIsGameFinished(true);
        } else {
            setCurrentScene((prev) => prev + 1);
        }
    }

    function prevScene() {
        setCurrentScene((prev) => prev - 1);
    }

    const handleRestart = () => {
        setIsGameFinished(false);
        setCurrentScene(1);
        setLastSuccessScene(0);
        setQuery('SEM PIŠ DOTAZY');
        setResult(null);
        setError(null);
        resetScore();
    };

    const handleBackToMenu = () => {
        navigate('/');
    };

    const badWords = [
        'drop',
        'delete',
        'insert',
        'update',
        'alter',
        'truncate',
        'grant',
        'commit',
        'rollback',
        'pragma',
        'attach',
        'replace',
        'upsert',
        'vacuum',
        'detach',
        'begin',
    ];

    const runSql = () => {
        setActiveOverlay('table');
        setError(null);
        setResult(null);
        let currentError = null;
        let isCorrect = false;
        db.run('BEGIN TRANSACTION;');
        try {
            if (badWords.some((word) => query.toLowerCase().includes(word))) {
                throw new Error('Ve tvém dotazu jsou nějaká nehezká slova!');
            }
            const statements = query
                .split(';')
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
            if (statements.length > 1) {
                throw new Error('Pouze jeden dotaz najednou!');
            }
            const res = db.exec(query);
            isCorrect = isSuccesful(res);
            if (isCorrect) {
                if (currentScene - 1 === lastSuccessScene) {
                    setLastSuccessScene((prev) => prev + 1);
                    submitScene();
                }
            } else {
                registerMistake();
            }
            if (!_.isEqual(res, [])) {
                setResult(res);
            } else {
                currentError = 'Prázdný výsledek';
                setError(currentError);
            }
            db.run('ROLLBACK;');
        } catch (e) {
            registerMistake();
            currentError = e.message;
            setError(currentError);
            db.run('ROLLBACK;');
        }
        const queryData = {
            gameName: 'TULEscape',
            sceneId: currentScene,
            query: query,
            isCorrect: isCorrect,
            error: currentError,
        };
        logQuery(queryData);
    };

    const saveScoreToLeaderboard = async (playerName) => {
        const { error } = await supabase.from('leaderboard').insert([
            {
                game_name: 'TULEscape',
                player_name: playerName,
                score: score,
            },
        ]);

        if (error) {
            console.error('Chyba při ukládání skóre:', error.message);
        } else {
            console.log('Skóre úspěšně uloženo do žebříčku!');
        }
    };

    if (!db) return <div className="tul-loading">Navazuji spojení se servery TUL...</div>;

    return (
        <div className="tul-page-container">
            {isGameFinished && (
                <VictoryScreen
                    score={score}
                    gameName="TULEscape"
                    onRestart={handleRestart}
                    onBackToMenu={handleBackToMenu}
                    onSubmitScore={saveScoreToLeaderboard}
                />
            )}
            <div className="tul-side-toolbar">
                <button className="tool-square" onClick={() => toggleOverlay('table')}>
                    📊
                </button>
                <button className="tool-square" onClick={() => toggleOverlay('schema')}>
                    📜
                </button>
                <button
                    className="tul-tool-square"
                    onClick={() => {
                        toggleOverlay('hint');
                        registerHint();
                    }}
                >
                    💡
                </button>
            </div>

            <div className="tul-side-overlay">
                <div className="tul-overlay-content">
                    {activeOverlay === 'schema' && (
                        <div className="tul-content-box">
                            <h3>SCHÉMA SÍTĚ</h3>
                            <img src={schema} alt="TUL Schema" className="tul-schema-img" />
                        </div>
                    )}
                    {activeOverlay === 'hint' && (
                        <div className="tul-content-box">
                            <h3>NÁPOVĚDA</h3>
                            {currSceneData.keywords && currSceneData.keywords.length > 0 ? (
                                <div className="hint-content">
                                    <p className="hint-intro">
                                        K vyřešení tohoto úkolu zkus použít tyto příkazy:
                                    </p>

                                    <ul className="keyword-list">
                                        {currSceneData.keywords.map((keyword, index) => (
                                            <li key={index} className="hint-item">
                                                <strong className="hint-keyword">{keyword}</strong>
                                                <span className="hint-definition">
                                                    {sqlDictionary[keyword] ||
                                                        ' - (Definice chybí)'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="hint-text">
                                    Pro tuto úroveň není k dispozici žádná speciální nápověda.
                                </p>
                            )}
                        </div>
                    )}
                    {activeOverlay === 'table' && (
                        <div className="tul-content-box">
                            <h3>VÝSTUP TERMINÁLU</h3>
                            {error ? (
                                <div className="tul-error-msg">{error}</div>
                            ) : result ? (
                                <div className="tul-table-wrapper">
                                    <table className="tul-table">
                                        <thead>
                                            <tr>
                                                {result[0].columns.map((c) => (
                                                    <th key={c}>{c}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result[0].values.map((row, i) => (
                                                <tr key={i}>
                                                    {row.map((val, j) => (
                                                        <td key={j}>{val}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>Zatím žádná data. Spusť dotaz!</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div
                className="tul-game-screen"
                style={{
                    backgroundImage: `url("/pageAssets/TULEscape/scenes/${currSceneData.img}")`,
                }}
            >
                <div className="tul-info-bar">
                    <span>Uživatel: ladislav.jira</span> | <span>Status: INFILTRATED</span> |{' '}
                    <span>Skóre: {score}</span>
                </div>

                {currentScene > 1 && (
                    <button className="tul-previous-scene" onClick={prevScene}>
                        ◀
                    </button>
                )}

                {currentScene <= lastSuccessScene && (
                    <button className="tul-next-scene" onClick={nextScene}>
                        {currentScene === gameData.number_of_scenes ? ' DOKONČIT HRU ' : '▶'}
                    </button>
                )}

                <div className="tul-task-book">
                    <h3>MISE {currSceneData.id}</h3>
                    <p>{currSceneData.story}</p>
                    <p className="tul-prompt">
                        <small>&gt; {currSceneData.prompt}</small>
                    </p>
                </div>

                <div className="tul-bottom-area">
                    <Editor
                        value={query}
                        onValueChange={(code) => setQuery(code)}
                        highlight={(code) => highlight(code, languages.sql)}
                        padding={15}
                        className="tul-input-area"
                    />
                    <button onClick={runSql} className="tul-send-btn">
                        PROVÉST DOTAZ
                    </button>
                </div>
            </div>
        </div>
    );
}
