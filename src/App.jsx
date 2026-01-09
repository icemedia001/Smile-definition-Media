import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Portfolio from './pages/Portfolio';
import Store from './pages/Store';
import Admin from './pages/Admin';
import { StoreProvider } from './context/StoreContext';
import { GalleryProvider } from './context/GalleryContext';
import Cart from './components/Cart';
import ClientLogin from './pages/ClientLogin';
import ClientGallery from './pages/ClientGallery';
import './App.css';

function App() {
  return (
    <StoreProvider>
      <GalleryProvider>
        <Router>
          <Cart />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/store" element={<Store />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/gallery" element={<ClientLogin />} />
            <Route path="/gallery/:code" element={<ClientGallery />} />
          </Routes>
        </Router>
      </GalleryProvider>
    </StoreProvider>
  );
}

export default App;
