import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FoodListPage from './pages/FoodListPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/foods" element={<FoodListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
