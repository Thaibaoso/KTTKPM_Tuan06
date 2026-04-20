import { useCart } from '../context/CartContext';

function CartPage() {
  const { items, updateQuantity, clearCart, total } = useCart();

  return (
    <div className="stack">
      <section className="card hero compact">
        <p className="eyebrow">Local Cart</p>
        <h1>Cart</h1>
        <p className="lede">Cart state stays in the browser until checkout creates an order.</p>
      </section>

      <section className="card stack">
        {items.length === 0 ? (
          <p>Your cart is empty. Add food from the menu.</p>
        ) : (
          <>
            {items.map((item) => (
              <div className="cart-row" key={item.foodId}>
                <div>
                  <strong>{item.name}</strong>
                  <p>${item.price.toFixed(2)} each</p>
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
              <strong>Total</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button type="button" className="alt" onClick={clearCart}>
              Clear Cart
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default CartPage;