import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginRegisterPage from './pages/LoginRegisterPage';
import FoodListPage from './pages/FoodListPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<LoginRegisterPage />} />
          <Route path="/foods" element={<FoodListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
