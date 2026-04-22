import './AuthLayout.css';

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-layout__brand" aria-label="Giới thiệu hệ thống nội bộ">
        <div className="auth-layout__brand-glow" />
        <div className="auth-layout__brand-copy">
          <span className="auth-layout__eyebrow">Dịch vụ đặt đồ ăn trực tuyến</span>
          <h1>Hương vị tinh tế, Giao hàng siêu tốc</h1>
          <p>Trải nghiệm tinh hoa ẩm thực ngay tại nhà với hàng trăm món ăn hấp dẫn từ các đầu bếp chuyên nghiệp.</p>
          <ul className="auth-layout__points">
            <li>Nguyên liệu tươi ngon mỗi ngày</li>
            <li>Đội ngũ shipper thân thiện</li>
            <li>Thanh toán an toàn, bảo mật</li>
          </ul>
        </div>
      </aside>

      <main className="auth-layout__surface">
        <div className="auth-layout__panel">{children}</div>
      </main>
    </div>
  );
}

export default AuthLayout;