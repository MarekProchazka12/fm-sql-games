import React, { useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import './SQLCraftGame.css';
import gameData from '../../data/SQLCraft.json' 
import schema from '../../assets/SQLCraft_scheme.png'

export default function SQLCraftGame() {

  const [activeOverlay, setActiveOverlay] = useState('table');
  
  const [db, setDb] = useState(null);
  const [hearts, setHearts] = useState(9);
  const [currentScene, setCurrentScene] = useState(1);
  const [lastSuccessScene, setLastSuccessScene] = useState(0);
  const currSceneData = gameData.scenes[currentScene - 1]
  const [query, setQuery] = useState("SEM PIŠ DOTAZY");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const toggleOverlay = (type) => {
    setActiveOverlay(type);
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
      let trimmedUser = query.toLowerCase().trim();
      let trimmedAnswer = (currSceneData.answer).toLowerCase().trim();
      if(!trimmedUser.endsWith(";")){
        trimmedUser += ";";
      }
      
      if(trimmedUser == trimmedAnswer){
        console.log("prvni if")
        if((currentScene -1)  == lastSuccessScene  ){
          setLastSuccessScene(prev => prev + 1)
          console.log("druhy if")
          console.log(lastSuccessScene)
        }
      }
      setResult(res);
      setError(null);
    } catch (e) {
      if(hearts != 0){
          setHearts(hearts-1);
      }
      
      setError(e.message);
    }
  };

  if (!db) return <div className="loading">Načítám svět...</div>;

  return (
    <div class="page-container">
      <div className="side-toolbar">
          <button 
            className={`tool-square`} 
            onClick={() => toggleOverlay('table')}
          >📊</button>
          <button 
            className={`tool-square`} 
            onClick={() => toggleOverlay('schema')}
          >📜</button>
          <button 
            className={`tool-square`} 
            onClick={() => toggleOverlay('hint')}
          >💡</button>
          
          
        </div>

        <div className={`side-overlay`}>
          
          
          <div className="overlay-content">
            {activeOverlay === 'hint' && (
              <div className="content-box">
                <h3>NÁPOVĚDA</h3>
                <p className="hint-text">HINT HERE</p>
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


      <div className="game-screen" style={{ backgroundImage: `url("/pageAssets/SQLCraft/scenes/${currSceneData.img}")`, backgroundSize:"cover", backgroundPosition:"center" }}>
        <div className="info-bar">
          <span>Hráč: Steve</span> | <span>{"💔".repeat(9-hearts)}{"❤️".repeat(hearts)}</span>  
        </div>
        {currentScene > 1 &&(<button className="previous-scene" onClick={()=>setCurrentScene(prev => prev -1)}>
            ◀
        </button>)}

        {currentScene <= lastSuccessScene &&
        <button className="next-scene" onClick={()=>setCurrentScene(prev => prev +1)}>
            ▶
        </button>}
        <div className="task-book">
          <h3>Úkol {currSceneData.id}</h3>
          <p>{currSceneData.story}</p>
          <p><small>{currSceneData.prompt}</small></p>
        </div>
        <div className="bottom-area">
          <textarea spellCheck="false" className="input-area"value={query} onChange={(e) => setQuery(e.target.value)} />
          <button onClick={runSql}  className="send-btn">PROVÉST DOTAZ</button>
        </div>
      </div>
      
      </div>
  );
}