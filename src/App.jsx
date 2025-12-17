import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Portfolio from './pages/Portfolio';
import Store from './pages/Store';
import Admin from './pages/Admin';
import { StoreProvider } from './context/StoreContext';
import Cart from './components/Cart';
import './App.css';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Cart />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/store" element={<Store />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
