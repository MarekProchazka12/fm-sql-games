


import { useNavigate } from 'react-router-dom';
import './SQLCraftSetup.css';

export default function SQLCraftSetup() {
  const navigate = useNavigate();

  const start = (level) => {
    navigate('/sqlcraft/game', { state: { difficulty: level } });
  };

  return (
    <div className="mc-gui-container">
      <div className="mc-modal">
        <h1>NASTAVENÍ EXPEDICE</h1>
        <p>Vyber si náročnost úkolů:</p>
        <button onClick={() => start('easy')} className="mc-btn">EASY (S nápovědou)</button>
        <button onClick={() => start('hard')} className="mc-btn">HARD (Bez nápovědy)</button>
        <button onClick={() => navigate('/')} className="mc-btn secondary">ZPĚT</button>
      </div>
    </div>
  );
}

