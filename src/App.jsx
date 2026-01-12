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

import ServiceDetail from './pages/ServiceDetail';
import BookingCart from './pages/BookingCart';
import UserAuth from './pages/UserAuth';
import UserDashboard from './pages/UserDashboard';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <StoreProvider>
      <GalleryProvider>
        <AuthProvider>
          <BookingProvider>
            <Router>
              <Cart />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/store" element={<Store />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/booking" element={<BookingCart />} />
                <Route path="/login" element={<UserAuth />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/gallery" element={<ClientLogin />} />
                <Route path="/gallery/:code" element={<ClientGallery />} />
              </Routes>
            </Router>
          </BookingProvider>
        </AuthProvider>
      </GalleryProvider>
    </StoreProvider>
  );
}

export default App;
