import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import initSqlJs from 'sql.js';
import './SQLCraftGame.css';
import gameData from '../../data/SQLCraft.json' 

export default function SQLCraftGame() {
  const location = useLocation();
  const difficulty = location.state?.difficulty || 'easy';

  const [activeOverlay, setActiveOverlay] = useState(null);
  
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("SELECT * FROM inventory");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const toggleOverlay = (type) => {
    setActiveOverlay(activeOverlay === type ? null : type);
  };

  useEffect(() => {
    initSqlJs({ locateFile: f => `/${f}` }).then(SQL => {
      const database = new SQL.Database();
      database.run(gameData.createScript);
      database.run(gameData.insertScript);
      setDb(database);
    });
  }, []);

  const runSql = () => {
    setActiveOverlay('table')
    setError(null);
    setResult(null);
    try {
      const res = db.exec(query);
      setResult(res);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  if (!db) return <div className="loading">Načítám svět...</div>;

  return (
    <div className="game-screen">
      <div className="info-bar">
        <span>Hráč: Steve</span>  <span>Obtížnost: {difficulty}</span>  {difficulty === 'easy' &&   <span>Nápověda: Použij SELECT * FROM ...</span>}
      </div>

      <div className="side-toolbar">
        <button 
          className={`tool-square ${activeOverlay === 'hint' ? 'active' : ''}`} 
          onClick={() => toggleOverlay('hint')}
        >💡</button>
        <button 
          className={`tool-square ${activeOverlay === 'schema' ? 'active' : ''}`} 
          onClick={() => toggleOverlay('schema')}
        >📜</button>
        <button 
          className={`tool-square ${activeOverlay === 'table' ? 'active' : ''}`} 
          onClick={() => toggleOverlay('table')}
        >📊</button>
      </div>

      <div className={`side-overlay ${activeOverlay ? 'open' : ''}`}>
        <button className="close-overlay" onClick={() => setActiveOverlay(null)}>◀</button>
        
        <div className="overlay-content">
          {activeOverlay === 'hint' && (
            <div className="content-box">
              <h3>NÁPOVĚDA</h3>
              <p className="hint-text">neco</p>
            </div>
          )}

          {activeOverlay === 'schema' && (
            <div className="content-box">
              <h3>SCHÉMA</h3>
              <img src="/assets/schema.png" alt="Database Schema" className="schema-img" />
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
                        <tr>{result[0].columns.map(c => <th key={c}>{c}</th>)}</tr>
                      </thead>
                      <tbody>
                        {result[0].values.map((row, i) => (
                          <tr key={i}>{row.map((val, j) => <td key={j}>{val}</td>)}</tr>
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
      
      <div className="task-book">
        <h3>Úkol 1: Inventář</h3>
        <p>Vypiš všechny věci z tabulky <strong>inventory</strong>.</p>
      </div>


      <div className="bottom-area">
        <textarea spellCheck="false" className="input-area"value={query} onChange={(e) => setQuery(e.target.value)} />
        <button onClick={runSql}  className="send-btn">PROVÉST DOTAZ</button>
      </div>

      
    </div>
  );
}