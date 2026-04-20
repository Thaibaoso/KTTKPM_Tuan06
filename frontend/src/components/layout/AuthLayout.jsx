import './AuthLayout.css';

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <aside className="auth-layout__brand" aria-label="Giới thiệu hệ thống nội bộ">
        <div className="auth-layout__brand-glow" />
        <div className="auth-layout__brand-copy">
          <p className="auth-layout__eyebrow">Cổng nội bộ</p>
          <h1>Chào mừng đến với hệ thống nội bộ</h1>
          <p>
            Trải nghiệm đăng nhập và đăng ký được thiết kế tối giản, rõ ràng và tập trung cho
            nhân sự nội bộ.
          </p>
          <ul className="auth-layout__points">
            <li>Thao tác nhanh, bố cục thoáng, dễ đọc</li>
            <li>Kết nối dịch vụ theo kiến trúc service-based</li>
            <li>Tối ưu cho màn hình desktop và tablet</li>
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