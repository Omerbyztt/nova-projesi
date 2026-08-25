import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import './Login.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Geçersiz veya eksik sıfırlama bağlantısı.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!token) {
      setError('Token bulunamadı, lütfen geçerli bir bağlantı kullandığınızdan emin olun.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor, lütfen tekrar kontrol edin.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword
      });
      setSuccess(res.data.message || 'Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...');
      
      // Yönlendirmeden önce kullanıcıya mesajı okuması için biraz zaman veriyoruz
      setTimeout(() => {
        navigate('/login');
      }, 2500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Şifre sıfırlanırken bir hata oluştu.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Sol Panel: Hero Bölümü */}
        <div className="auth-hero">
          <div className="hero-content">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              Nova Portal
            </div>
            
            <div className="hero-text-area">
                <h1 className="hero-title">Yeni Şifrenizi Belirleyin</h1>
                <p className="hero-subtitle">Hesabınız için yeni ve güvenli bir şifre oluşturun.</p>
            </div>
            
            <div className="hero-illustration">
               <div className="glow-effect"></div>
               <div className="mockup-container">
                 <div className="hero-dashboard-mockup" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                 </div>
               </div>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <div className="feature-text">
                  <h4>Hesap Güvenliği</h4>
                  <p>Şifrenizi kimseyle paylaşmayınız</p>
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
              <p>Lütfen yeni şifrenizi giriniz.</p>
            </div>

            {error && <div className="auth-error-msg">{error}</div>}
            {success && (
              <div className="auth-error-msg" style={{ backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}>
                {success}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
              
              <div className="form-group">
                <label htmlFor="newPassword">Yeni Şifre</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="newPassword" 
                    placeholder="••••••••••••" 
                    required 
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    disabled={!token || success}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} disabled={!token || success}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </span>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    id="confirmPassword" 
                    placeholder="••••••••••••" 
                    required 
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    disabled={!token || success}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={!token || success}>
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="primary-btn" style={{marginTop: '1rem'}} disabled={!token || success}>Sıfırla</button>
            </form>
            
            <p className="auth-footer" style={{marginTop: '2rem'}}>
              Giriş sayfasına dön: <button type="button" className="auth-link-btn" onClick={() => navigate('/login')}>Giriş Yap</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
