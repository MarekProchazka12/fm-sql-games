import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SQLCraftSetup from './pages/sqlcraft/SQLCraftSetup';
import SQLCraftGame from './pages/sqlcraft/SQLCraftGame';
import TULEscapeGame from './pages/tulescape/TULEscapeGame';
import TULEscapeSetup from './pages/tulescape/TULEScapeSetup';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="sqlcraft" element={<SQLCraftSetup />} />
                <Route path="sqlcraft/game" element={<SQLCraftGame />} />
                <Route path="tulescape" element={<TULEscapeSetup />} />
                <Route path="tulescape/game" element={<TULEscapeGame />} />
            </Routes>
        </Router>
    );
}

export default App;
