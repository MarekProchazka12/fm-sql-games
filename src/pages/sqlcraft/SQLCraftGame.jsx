import React, { useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import './SQLCraftGame.css';
import gameData from '../../data/SQLCraft.json';
import schema from '../../assets/SQLCraft_scheme.png';
import _ from 'lodash';
import { supabase } from '../../supabaseClient';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-sql';
import { sqlDictionary } from '../../data/sqlDictionary';
import { useGameScore } from '../../hooks/useGameScore';
import VictoryScreen from '../../components/VictoryScreen';

export default function SQLCraftGame() {
    const [activeOverlay, setActiveOverlay] = useState('table');

    const [db, setDb] = useState(null);
    const { score, registerMistake, registerHint, submitScene } = useGameScore();
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

    useEffect(() => {
        const editor = document.querySelector('.input-area');
        if (editor) {
            setTimeout(() => {
                editor.scrollTop = editor.scrollHeight;
            }, 0);
        }
    }, [query]);

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

        if (_.isEqual(res, sceneConfirmTable)) {
            return true;
        }
        return false;
    };

    function nextScene() {
        setCurrentScene((prev) => prev + 1);
    }

    function prevScene() {
        setCurrentScene((prev) => prev - 1);
    }

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
                if (currentScene - 1 == lastSuccessScene) {
                    setLastSuccessScene((prev) => prev + 1);
                    submitScene();
                }
            } else {
                registerMistake();
            }
            setError(null);
            if (!_.isEqual(res, [])) {
                setResult(res);
            } else {
                currentError = 'Nic tu není :/';
                setError('Nic tu není :/');
            }
            db.run('ROLLBACK;');
        } catch (e) {
            registerMistake();
            currentError = e.message;
            setError(currentError);
            db.run('ROLLBACK;');
        }
        const queryData = {
            gameName: 'SQLCraft',
            sceneId: currentScene,
            query: query,
            isCorrect: isCorrect,
            error: currentError,
        };

        logQuery(queryData);
    };

    if (!db) return <div className="loading">Načítám svět...</div>;

    //return <VictoryScreen score={850} gameName="SQLCraft" theme="sqlcraft" />

    return (
        <div className="page-container">
            <div className="side-toolbar">
                <button className={`tool-square`} onClick={() => toggleOverlay('table')}>
                    📊
                </button>
                <button className={`tool-square`} onClick={() => toggleOverlay('schema')}>
                    📜
                </button>
                <button
                    className={`tool-square`}
                    onClick={() => {
                        toggleOverlay('hint');
                        registerHint();
                    }}
                >
                    💡
                </button>
            </div>

            <div className={`side-overlay`}>
                <div className="overlay-content">
                    {activeOverlay === 'hint' && (
                        <div className="content-box">
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

                    {activeOverlay === 'schema' && (
                        <div className="content-box">
                            <h3>SCHÉMA</h3>
                            <img src={schema} alt="Database Schema" className="schema-img" />
                        </div>
                    )}

                    {activeOverlay === 'table' && (
                        <div className="content-box">
                            <h3>VÝSLEDEK DOTAZU</h3>
                            {error ? (
                                <div className="error-panel-box">{error}</div>
                            ) : result ? (
                                <div className="table-wrapper">
                                    <table className="mc-table">
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
                className="game-screen"
                style={{
                    backgroundImage: `url("/pageAssets/SQLCraft/scenes/${currSceneData.img}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="info-bar">
                    <span>Hráč: Steve</span> | <span>Skóre: {score} 💎</span>
                </div>
                {currentScene > 1 && (
                    <button className="previous-scene" onClick={prevScene}>
                        ◀
                    </button>
                )}

                {currentScene <= lastSuccessScene && (
                    <button className="next-scene" onClick={nextScene}>
                        ▶
                    </button>
                )}
                <div className="task-book">
                    <h3>Úkol {currSceneData.id}</h3>
                    <p>{currSceneData.story}</p>
                    <p>
                        <small>{currSceneData.prompt}</small>
                    </p>
                </div>
                <div className="bottom-area">
                    <Editor
                        value={query}
                        onValueChange={(code) => setQuery(code)}
                        highlight={(code) => highlight(code, languages.sql)}
                        padding={15}
                        className="input-area"
                    />
                    <button onClick={runSql} className="send-btn">
                        PROVÉST DOTAZ
                    </button>
                </div>
            </div>
        </div>
    );
}
