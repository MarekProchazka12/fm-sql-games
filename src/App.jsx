import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import SQLCraftSetup from './pages/sqlcraft/SQLCraftSetup';
import SQLCraftGame from './pages/sqlcraft/SQLCraftGame';

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sqlcraft" element={<SQLCraftSetup />} />
        <Route path="sqlcraft/game" element={<SQLCraftGame />} />
      </Routes>
    </Router>
  )
}

export default App;