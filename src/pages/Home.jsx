import { Link } from 'react-router-dom';
import './Home.css';

const games = [
    {
        id: 'sqlcraft',
        title: 'SQL Craft',
        description: 'Sestav diamantový meč v kostičkovém světě pomocí SQL dotazů.',
        image: 'pageAssets/SQLCraft/scenes/20.jpg',
        active: true,
    },
    {
        id: 'tulescape',
        title: 'Escape from TUL',
        description:
            'Oprav s pomocí SQL dotazů svou diplomovou práci a unikni z informačního systému.',
        image: 'pageAssets/TULEscape/scenes/1.jpg',
        active: true,
    },
];

function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>FM TUL SQL GAMES</h1>
                <p>Vyber si hru a začni se učit!</p>
            </header>
            <div className="game-grid">
                {games.map((game) => (
                    <div key={game.id} className={`game-card ${!game.active ? 'disabled' : ''}`}>
                        <Link to={game.active ? `/${game.id}` : '#'}>
                            <div className="card-content">
                                <div
                                    className="card-image"
                                    style={{
                                        backgroundImage: `url("${game.image}")`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        imageRendering: 'pixelated',
                                    }}
                                ></div>
                                <h2>{game.title}</h2>
                                <p>{game.description}</p>
                                <span className="play-button">
                                    {game.active ? 'HRÁT' : 'JIŽ BRZY'}
                                </span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
