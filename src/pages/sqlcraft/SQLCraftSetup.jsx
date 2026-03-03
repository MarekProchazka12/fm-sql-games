


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
        <p style={{color:"black"}}>Vítej v SQLCraftu, hře, kde procházíš kostičkovaným světem pomocí psaní SQL dotazů! Tvůj postup je jednoduchý: uprostřed obrazovky si vždy přečti zadání úkolu pro danou scénu. Pomocí levého panelu si můžeš zobrazit schéma databáze (📜), abys viděl dostupné tabulky a sloupce, nebo si otevřít nápovědu (💡), když si nebudeš vědět rady. Svůj SQL kód pak napiš do textového pole dole a klikni na „PROVÉST DOTAZ“. Hra ti automaticky zobrazí výsledek v tabulce (📊), a pokud je tvůj dotaz přesně to, co úkol vyžadoval, objeví se šipka doprava (▶), kterou se posuneš do dalšího kola.</p>
        <button onClick={() => start()} className="mc-btn">Hrát</button>
        <button onClick={() => navigate('/')} className="mc-btn secondary">ZPĚT</button>
      </div>
    </div>
  );
}

