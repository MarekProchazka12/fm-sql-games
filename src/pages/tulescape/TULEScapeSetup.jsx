import { useNavigate } from "react-router-dom";
import './TULEscapeSetup.css';

export default function TULEscapeSetup() {
    const navigate = useNavigate();

    const start = () => {
        navigate('/tulescape/game');
    }

    return (
        <div className="tul-gui-container">
            <div className="tul-modal">
                <h1>INFILTRACE SYSTÉMU</h1>
                <p>
                    Vítej v Escape from TUL. Tvá mise je kritická: nabourej se do školního informačního systému, 
                    najdi svou chybnou diplomovou práci a nahraď ji dříve, než vyprší časový limit. 
                    K postupu hlouběji do sítě musíš používat SQL příkazy. 
                    V levém panelu najdeš schéma sítě (📜) a výstupy z terminálu (📊) nebo si otevřít nápovědu (💡), když si nebudeš vědět rady.
                    Hodně štěstí, hackere.
                </p>
                <button onClick={start} className="tul-btn">ZAHÁJIT HACK</button>
                <button onClick={() => navigate('/')} className="tul-btn secondary">ODPOJIT SE</button>
            </div>
        </div>
    )
}