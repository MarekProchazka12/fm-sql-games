import {Link} from 'react-router-dom';
import './Home.css';

const games = [
  {
    id: 'sqlcraft',
    title: 'SQL Craft',
    description: 'Sestav diamantový meč v kostičkovém světě pomocí SQL dotazů.',
    image: '/assets/sqlcraft-icon.png',
    active: true
  },
  {
    id: 'tulescape',
    title: 'Escape from TUL',
    description: 'Uteč z TULky',
    image: '/assets/tulescape-icon.png'
  }
]

function Home(){
  return(
    <div className='home-container'>
      <header className='home-header'>
          <h1>FM TUL SQL GAMES</h1>
          <p>Vyber si hru a začni se učit!</p>
      </header>
      <div className='game-grid'>
        {games.map((game) => (
          <div key={game.id} className={`game-card ${!game.active ? 'disabled' : ''}`}>
            <Link to={game.active ? `/${game.id}` : '#'}>
              <div className="card-content">
                <div className="card-image">
                  
                </div>
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
  )
}

export default Home;