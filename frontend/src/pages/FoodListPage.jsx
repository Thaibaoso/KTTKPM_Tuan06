import { useEffect, useState } from 'react';
import { foodApi } from '../api/http';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function FoodListPage() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingFood, setEditingFood] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formContent, setFormContent] = useState({ name: '', description: '', price: '', imageUrl: '' });

  const isAdmin = user?.role === 'ADMIN';

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

  useEffect(() => {
    loadFoods();
  }, []);

  const handleAddToCart = (food) => {
    addToCart(food);
    setMessage(`${food.name} added to cart`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food?')) return;
    try {
      await foodApi.delete(`/foods/${id}`, {
        headers: { 'X-User-Id': user.id }
      });
      setMessage('Food deleted');
      loadFoods();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to delete food');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const price = parseFloat(formContent.price);
      if (isNaN(price)) throw new Error('Invalid price');

      if (editingFood) {
        await foodApi.put(`/foods/${editingFood.id}`, { ...formContent, price }, {
          headers: { 'X-User-Id': user.id }
        });
        setMessage('Food updated');
      } else {
        await foodApi.post('/foods', { ...formContent, price }, {
          headers: { 'X-User-Id': user.id }
        });
        setMessage('Food added');
      }
      setEditingFood(null);
      setShowAddForm(false);
      setFormContent({ name: '', description: '', price: '', imageUrl: '' });
      loadFoods();
    } catch (error) {
      setMessage(error.response?.data?.error || error.message || 'Failed to save food');
    }
  };

  const startEdit = (food) => {
    setEditingFood(food);
    setFormContent({ 
      name: food.name, 
      description: food.description, 
      price: food.price.toString(),
      imageUrl: food.imageUrl || ''
    });
    setShowAddForm(true);
  };

  return (
    <div className="stack">
      <section className="hero">
        <h1>Thực Đơn Đa Dạng, Giao Hàng Tận Nơi</h1>
        <p className="lede">Khám phá danh sách món ăn tươi ngon được chuẩn bị bởi các đầu bếp hàng đầu. Đặt hàng ngay để thưởng thức bữa tối tuyệt vời tại nhà.</p>
        {isAdmin && (
          <div style={{ marginTop: '2rem' }}>
            <button type="button" onClick={() => { setShowAddForm(!showAddForm); setEditingFood(null); setFormContent({name:'', description:'', price:'', imageUrl:''}) }}>
              {showAddForm ? 'Đóng Form' : 'Thêm Món Mới'}
            </button>
          </div>
        )}
      </section>

      {message && <div className="notice">{message}</div>}

      {showAddForm && isAdmin && (
        <section className="card stack" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
          <h2>{editingFood ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới'}</h2>
          <form className="stack" onSubmit={handleSave}>
            <label className="field">
              <span>Tên món ăn</span>
              <input 
                required 
                placeholder="Ví dụ: Burger Bò Mỹ"
                value={formContent.name} 
                onChange={e => setFormContent({...formContent, name: e.target.value})} 
              />
            </label>
            <label className="field">
              <span>Mô tả</span>
              <input 
                required 
                placeholder="Mô tả ngắn gọn về nguyên liệu..."
                value={formContent.description} 
                onChange={e => setFormContent({...formContent, description: e.target.value})} 
              />
            </label>
            <label className="field">
              <span>Giá bán ($)</span>
              <input 
                type="number" 
                step="0.01" 
                required 
                placeholder="9.99"
                value={formContent.price} 
                onChange={e => setFormContent({...formContent, price: e.target.value})} 
              />
            </label>
            <label className="field">
              <span>Đường dẫn ảnh (URL)</span>
              <input 
                placeholder="https://images.unsplash.com/..."
                value={formContent.imageUrl} 
                onChange={e => setFormContent({...formContent, imageUrl: e.target.value})} 
              />
            </label>
            <button type="submit">Lưu Thay Đổi</button>
          </form>
        </section>
      )}

      <div className="grid">
        {loading ? (
          <div className="card">Đang chuẩn bị thực đơn cho bạn...</div>
        ) : (
          foods.map((food) => (
            <article className="card food-card" key={food.id}>
              <div className="food-card__image-wrap">
                <img 
                  className="food-card__image" 
                  src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'} 
                  alt={food.name} 
                />
              </div>
              <div className="food-card__content">
                <div className="row spread">
                  <h3>{food.name}</h3>
                  <span className="price">${food.price.toFixed(2)}</span>
                </div>
                <p>{food.description}</p>
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }} className="stack">
                  {!isAdmin && (
                    <button type="button" onClick={() => handleAddToCart(food)}>
                      Thêm Vào Giỏ
                    </button>
                  )}
                  {isAdmin && (
                    <div className="row">
                      <button type="button" className="alt" style={{ flex: 1 }} onClick={() => startEdit(food)}>
                        Sửa
                      </button>
                      <button type="button" className="alt" style={{ flex: 1, color: 'var(--brand)' }} onClick={() => handleDelete(food.id)}>
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default FoodListPage;