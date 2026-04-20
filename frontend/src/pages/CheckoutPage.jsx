import { useState } from 'react';
import { orderApi, paymentApi } from '../api/http';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function CheckoutPage() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [method, setMethod] = useState('COD');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const placeOrder = async () => {
    if (!user) {
      setMessage('Please login first.');
      return;
    }

    if (items.length === 0) {
      setMessage('Add items to cart before checkout.');
      return;
    }

    setProcessing(true);
    setMessage('');

    try {
      const orderPayload = {
        userId: user.id,
        items: items.map((item) => ({ foodId: item.foodId, quantity: item.quantity })),
      };

      const orderResponse = await orderApi.post('/orders', orderPayload);
      const orderId = orderResponse.data.id;

      const paymentResponse = await paymentApi.post('/payments', {
        orderId,
        method,
      });

      clearCart();
      setMessage(
        `${paymentResponse.data.message} Order #${orderId} is ${paymentResponse.data.status}.`
      );
    } catch (error) {
      setMessage(error.response?.data?.error || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="stack">
      <section className="card hero compact">
        <p className="eyebrow">Order Service + Payment Service</p>
        <h1>Checkout</h1>
        <p className="lede">Creates an order, then simulates payment and prints the notification.</p>
      </section>

      <section className="card stack">
        <div className="row spread">
          <span>Logged in as</span>
          <strong>{user ? `${user.username} (${user.role})` : 'Guest'}</strong>
        </div>
        <div className="row spread">
          <span>Items</span>
          <strong>{items.length}</strong>
        </div>
        <div className="row spread">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>

        <label className="stack">
          <span>Payment Method</span>
          <select value={method} onChange={(event) => setMethod(event.target.value)}>
            <option value="COD">COD</option>
            <option value="Banking">Banking</option>
          </select>
        </label>

        <button type="button" onClick={placeOrder} disabled={processing}>
          {processing ? 'Processing...' : 'Create Order & Pay'}
        </button>
      </section>

      {message && <div className="card notice">{message}</div>}
    </div>
  );
}

export default CheckoutPage;