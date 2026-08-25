import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import './Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosInstance.post('/auth/forgot-password', {
        email
      });
      setSuccess(response.data.message || 'Şifre sıfırlama bağlantısı gönderildi.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu, lütfen e-posta adresinizi kontrol edin.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Sol Panel: Hero Bölümü */}
        <div className="auth-hero signup-hero">
          <div className="hero-content">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              Nova Portal
            </div>
            
            <div className="hero-text-area">
                <h1 className="hero-title">Şifrenizi Mi Unuttunuz?</h1>
                <p className="hero-subtitle">Sorun değil, sisteme kayıtlı e-posta adresinizi girerek şifrenizi hızlıca sıfırlayabilirsiniz.</p>
            </div>
            
            <div className="hero-illustration">
               <div className="glow-effect"></div>
               <div className="signup-3d">
                   <div className="sphere"></div>
                   <div className="pyramid"></div>
               </div>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <div className="feature-text">
                  <h4>Hızlı Doğrulama</h4>
                  <p>Bağlantınız anında e-postanıza (mock) iletilir</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Panel: Form Bölümü */}
        <div className="auth-form-section">
          <div className="form-content-wrapper">
            <div className="form-header">
              <h2>Şifre Sıfırlama</h2>
              <p>Bağlantı almak için e-posta adresinizi girin.</p>
            </div>

            {error && <div className="auth-error-msg">{error}</div>}
            {success && (
              <div className="auth-error-msg" style={{ backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}>
                {success}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <label htmlFor="email">Kurumsal E-posta</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </span>
                  <input type="email" id="email" placeholder="ornek@sirket.com" required 
                         value={email} onChange={e => setEmail(e.target.value)} 
                         autoComplete="off" />
                </div>
              </div>

              <button type="submit" className="primary-btn">Sıfırlama Bağlantısı Gönder</button>
            </form>

            <p className="auth-footer">
              Şifrenizi hatırladınız mı? <button type="button" className="auth-link-btn" onClick={() => navigate('/login')}>Giriş Yap</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
