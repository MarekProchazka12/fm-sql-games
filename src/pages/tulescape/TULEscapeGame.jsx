import React, { useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import './TULEscapeGame.css';
import gameData from '../../data/TULEscape.json';
import schema from '../../assets/TULEscape_scheme.png';
import _ from 'lodash';
import { supabase } from '../../supabaseClient';

export default function TULEscapeGame() {
    const [activeOverlay, setActiveOverlay] = useState('table');
    const [db, setDb] = useState(null);
    const [currentScene, setCurrentScene] = useState(1);
    const [lastSuccessScene, setLastSuccessScene] = useState(0);
    const currSceneData = gameData.scenes[currentScene - 1];
    const [query, setQuery] = useState('SEM PIŠ DOTAZY');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const toggleOverlay = (type) => {
        setActiveOverlay(type);
    };

    useEffect(() => {
        initSqlJs({ locateFile: (f) => `/${f}` }).then((SQL) => {
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
        try {
            const sceneConfirmTable = db.exec(currSceneData.confirmQuery);
            if (!res || res.length === 0 || !sceneConfirmTable || sceneConfirmTable.length === 0) {
                return false;
            }
            return _.isEqual(res, sceneConfirmTable);
        } catch {
            return false;
        }
    };

    const runSql = () => {
        setActiveOverlay('table');
        setError(null);
        setResult(null);
        let currentError = null;
        let isCorrect = false;

        try {
            const res = db.exec(query);
            isCorrect = isSuccesful(res);
            if (isCorrect) {
                if (currentScene - 1 === lastSuccessScene) {
                    setLastSuccessScene((prev) => prev + 1);
                }
            }
            if (!_.isEqual(res, [])) {
                setResult(res);
            } else {
                currentError = 'Prázdný výsledek';
                setError(currentError);
            }
        } catch (e) {
            currentError = e.message;
            setError(currentError);
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

    if (!db) return <div className="tul-loading">Navazuji spojení se servery TUL...</div>;

    return (
        <div className="tul-page-container">
            <div className="tul-side-toolbar">
                <button className="tool-square" onClick={() => toggleOverlay('table')}>
                    📊
                </button>
                <button className="tool-square" onClick={() => toggleOverlay('schema')}>
                    📜
                </button>
                <button className="tul-tool-square" onClick={() => toggleOverlay('hint')}>
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
                            <p className="tul-hint-text">HINT HERE</p>
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
                    <span>Uživatel: ladislav.jira</span> | <span>Status: INFILTRATED</span>
                </div>

                {currentScene > 1 && (
                    <button
                        className="tul-previous-scene"
                        onClick={() => setCurrentScene((prev) => prev - 1)}
                    >
                        ◀
                    </button>
                )}
                {currentScene <= lastSuccessScene && (
                    <button
                        className="tul-next-scene"
                        onClick={() => setCurrentScene((prev) => prev + 1)}
                    >
                        ▶
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
                    <textarea
                        spellCheck="false"
                        className="tul-input-area"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={runSql} className="tul-send-btn">
                        PROVÉST DOTAZ
                    </button>
                </div>
            </div>
        </div>
    );
}
