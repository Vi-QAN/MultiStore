import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import About from './pages/About';

import { SearchProvider } from './hooks/useSearch';
import { CartProvider } from './hooks/useCart';
import { AuthenticationProvider } from './hooks/useAuthentication';

import './App.css';

function App() {
  return (
    <AuthenticationProvider>
      <SearchProvider>
        <CartProvider>
          <Router>
            <Routes >
              <Route exact path="/index.html" element={<Navigate to="/home" />} />
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="/home" exact element={<Home />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />}/>
              <Route path="/orders" element={<Orders />}/>
              <Route path="/about" element={<About />} />
            </Routes>
          </Router>
        </CartProvider>
      </SearchProvider>
    </AuthenticationProvider>
  );
}

export default App;
