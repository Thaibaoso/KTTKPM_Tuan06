import { useEffect, useState } from 'react';
import { foodApi } from '../api/http';
import { useCart } from '../context/CartContext';

function FoodListPage() {
  const { addToCart } = useCart();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const response = await foodApi.get('/foods');
        setFoods(response.data);
      } catch (error) {
        setMessage(error.response?.data?.error || 'Failed to load foods');
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  const handleAdd = (food) => {
    addToCart(food);
    setMessage(`${food.name} added to cart`);
  };

  return (
    <div className="stack">
      <section className="card hero compact">
        <p className="eyebrow">Food Service</p>
        <h1>Menu</h1>
        <p className="lede">Seed data lives in the Food Service and is fetched directly over HTTP.</p>
      </section>

      {message && <div className="card notice">{message}</div>}

      <div className="grid food-grid">
        {loading ? (
          <div className="card">Loading foods...</div>
        ) : (
          foods.map((food) => (
            <article className="card food-card stack" key={food.id}>
              <div className="row spread">
                <h3>{food.name}</h3>
                <strong>${food.price.toFixed(2)}</strong>
              </div>
              <p>{food.description}</p>
              <button type="button" onClick={() => handleAdd(food)}>
                Add to Cart
              </button>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default FoodListPage;