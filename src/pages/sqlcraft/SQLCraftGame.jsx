import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import initSqlJs from 'sql.js';
import './SQLCraftGame.css';

export default function SQLCraftGame() {
  const location = useLocation();
  const difficulty = location.state?.difficulty || 'easy';
  
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("SELECT * FROM inventory");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    initSqlJs({ locateFile: f => `/${f}` }).then(SQL => {
      const database = new SQL.Database();
      database.run("CREATE TABLE inventory (id INT, item TEXT, count INT);");
      database.run("INSERT INTO inventory VALUES (1, 'Iron Sword', 1), (2, 'Apple', 5), (3, 'Torch', 16);");
      setDb(database);
    });
  }, []);

  const runSql = () => {
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
        <span>Hráč: Steve</span> | <span>Obtížnost: {difficulty}</span>
      </div>
      
      <div className="task-book">
        <h3>Úkol 1: Inventář</h3>
        <p>Vypiš všechny věci z tabulky <strong>inventory</strong>.</p>
        {difficulty === 'easy' && <small>Nápověda: Použij SELECT * FROM ...</small>}
      </div>

      <textarea value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={runSql} className="mc-btn">PROVÉST DOTAZ</button>

      {error && <div className="error-msg">{error}</div>}

      {result && (
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
      )}
    </div>
  );
}