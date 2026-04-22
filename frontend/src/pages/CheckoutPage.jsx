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
      setMessage('Vui lòng đăng nhập trước khi thanh toán.');
      return;
    }

    if (items.length === 0) {
      setMessage('Vui lòng thêm món ăn vào giỏ hàng.');
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
        `${paymentResponse.data.message}. Đơn hàng #${orderId} đang ở trạng thái ${paymentResponse.data.status}.`
      );
    } catch (error) {
      setMessage(error.response?.data?.error || 'Thanh toán thất bại, vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="stack">
      <section className="hero">
        <h1>Hoàn Thành Đơn Hàng</h1>
        <p className="lede">Hệ thống sẽ tạo đơn hàng và giả lập quy trình thanh toán để gửi thông báo đến bạn.</p>
      </section>

      <section className="card stack">
        <div className="row spread">
          <span>Đang đăng nhập với</span>
          <strong>{user ? `${user.username} (${user.role === 'ADMIN' ? 'Người quản trị' : 'Khách hàng'})` : 'Khách'}</strong>
        </div>
        <div className="row spread">
          <span>Số lượng món</span>
          <strong>{items.length} món</strong>
        </div>
        <div className="row spread">
          <span>Tổng tiền</span>
          <strong style={{ color: 'var(--brand)', fontSize: '1.25rem' }}>${total.toFixed(2)}</strong>
        </div>

        <label className="field">
          <span>Phương thức thanh toán</span>
          <select value={method} onChange={(event) => setMethod(event.target.value)}>
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="Banking">Chuyển khoản ngân hàng</option>
          </select>
        </label>

        <button type="button" onClick={placeOrder} disabled={processing}>
          {processing ? 'Đang xử lý...' : 'Đặt hàng & Thanh toán'}
        </button>
      </section>

      {message && <div className="card notice">{message}</div>}
    </div>
  );
}

export default CheckoutPage;