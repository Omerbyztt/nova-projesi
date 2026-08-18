import React, { useState } from 'react';
import './Signup.css';

const Signup = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Sol Panel: Hero Bölümü (%45) */}
        <div className="auth-hero signup-hero">
          <div className="hero-content">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              Nova Portal
            </div>
            
            <div className="hero-text-area">
                <h1 className="hero-title">Hesap Oluştur</h1>
                <p className="hero-subtitle">Kurumsal hesabınızı oluşturarak başlayın.</p>
            </div>
            
            <div className="hero-illustration">
               <div className="glow-effect"></div>
               
               {/* Premium 3D Team/Profile Mockup */}
               <div className="mockup-container">
                 <div className="floating-badge badge-3">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                   Şifrelenmiş Veri
                 </div>

                 <div className="team-card card-background">
                    <div className="mockup-avatar alt-avatar"></div>
                    <div className="mockup-lines">
                       <div className="line-1"></div>
                       <div className="line-2"></div>
                    </div>
                 </div>
                 
                 <div className="team-card">
                    <div className="mockup-avatar"></div>
                    <div className="mockup-lines">
                       <div className="line-1"></div>
                       <div className="line-2"></div>
                    </div>
                 </div>

               </div>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <div className="feature-text">
                  <h4>Verileriniz %100 güvende</h4>
                  <p>Endüstri standartlarında şifreleme kullanıyoruz</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Panel: Form Bölümü (%55) */}
        <div className="auth-form-section">
          <div className="form-content-wrapper">
            <div className="form-header">
              <h2>Kayıt Ol</h2>
              <p>Nova Portal'a bugün katılın.</p>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="fullName">Ad Soyad</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </span>
                  <input type="text" id="fullName" placeholder="Ahmet Yılmaz" required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">E-posta</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </span>
                  <input type="email" id="email" placeholder="e-posta@sirket.com" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department">Departman</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                    </span>
                    <select id="department" required defaultValue="">
                      <option value="" disabled>Departman Seç</option>
                      <option value="yazilim">Yazılım</option>
                      <option value="ik">İnsan Kaynakları</option>
                      <option value="pazarlama">Pazarlama</option>
                      <option value="satis">Satış</option>
                      <option value="finans">Finans</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="role">Rol</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </span>
                    <select id="role" required defaultValue="">
                      <option value="" disabled>Rol Seç</option>
                      <option value="yonetici">Yönetici</option>
                      <option value="calisan">Çalışan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Şifre</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="••••••••••••" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    title="Şifreyi Göster/Gizle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="primary-btn signup-btn">Kayıt Ol</button>
            </form>

            <p className="auth-footer">
              Zaten hesabınız var mı? <button type="button" className="auth-link-btn" onClick={onSwitch}>Giriş Yap</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
