import { useCart } from '../context/CartContext';

function CartPage() {
  const { items, updateQuantity, clearCart, total } = useCart();

  return (
    <div className="stack">
      <section className="hero">
        <h1>Giỏ Hàng Của Bạn</h1>
        <p className="lede">Xem lại danh sách món ăn bạn đã chọn trước khi tiến hành thanh toán.</p>
      </section>

      <section className="card stack">
        {items.length === 0 ? (
          <p>Giỏ hàng của bạn đang trống. Hãy quay lại Thực đơn để chọn món nhé.</p>
        ) : (
          <>
            {items.map((item) => (
              <div className="cart-row" key={item.foodId}>
                <div>
                  <strong>{item.name}</strong>
                  <p>${item.price.toFixed(2)} / món</p>
                </div>
                <input
                  className="quantity-input"
                  min="1"
                  type="number"
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.foodId, Number(event.target.value))}
                />
              </div>
            ))}
            <div className="row spread total-row">
              <strong>Tổng cộng</strong>
              <strong style={{ color: 'var(--brand)', fontSize: '1.5rem' }}>${total.toFixed(2)}</strong>
            </div>
            <button type="button" className="alt" onClick={clearCart}>
              Xóa Giỏ Hàng
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default CartPage;