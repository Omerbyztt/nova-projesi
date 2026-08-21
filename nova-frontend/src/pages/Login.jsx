import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      // Admin paneline /dashboard rotasına yönlendir
      navigate('/dashboard');
    } catch (err) {
      setError('Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Sol Panel: Hero Bölümü (%45) */}
        <div className="auth-hero">
          <div className="hero-content">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
              Nova Portal
            </div>
            
            <div className="hero-text-area">
                <h1 className="hero-title">Tekrar Hoş Geldiniz</h1>
                <p className="hero-subtitle">Devam etmek için kurumsal hesabınıza giriş yapın</p>
            </div>
            
            <div className="hero-illustration">
               <div className="glow-effect"></div>
               
               {/* Premium 3D Dashboard Mockup */}
               <div className="mockup-container">
                 <div className="floating-badge badge-1">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   Sistem Aktif
                 </div>
                 
                 <div className="hero-dashboard-mockup">
                    <div className="mockup-header">
                       <div className="mockup-dot"></div>
                       <div className="mockup-dot"></div>
                       <div className="mockup-dot"></div>
                    </div>
                    <div className="mockup-body">
                       <div className="mockup-chart">
                          <div className="bar" style={{height: '40%'}}></div>
                          <div className="bar" style={{height: '70%'}}></div>
                          <div className="bar" style={{height: '50%'}}></div>
                          <div className="bar" style={{height: '90%'}}></div>
                          <div className="bar" style={{height: '65%'}}></div>
                       </div>
                       <div className="mockup-stats">
                          <div className="stat-card"></div>
                          <div className="stat-card"></div>
                       </div>
                    </div>
                 </div>

                 <div className="floating-badge badge-2">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                   Canlı Analitik
                 </div>
               </div>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <div className="feature-text">
                  <h4>Güvenli ve Güvenilir</h4>
                  <p>Kurumsal düzeyde güvenlik</p>
                </div>
              </div>
              <div className="feature-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                <div className="feature-text">
                  <h4>Güçlü Analitik</h4>
                  <p>Gerçek zamanlı içgörüler ve raporlar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Panel: Form Bölümü (%55) */}
        <div className="auth-form-section">
          <div className="form-content-wrapper">
            <div className="form-header">
              <h2>Giriş Yap</h2>
              <p>Portala erişmek için lütfen bilgilerinizi girin.</p>
            </div>

            {error && <div className="auth-error-msg">{error}</div>}

            <form className="auth-form" onSubmit={handleLogin} autoComplete="off">
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
                    value={password} onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
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

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Beni hatırla
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="forgot-password">Şifremi unuttum?</a>
              </div>

              <button type="submit" className="primary-btn">Giriş Yap</button>
              
              <div className="divider">
                <span>veya şununla devam et</span>
              </div>

              <div className="social-login">
                <div className="social-btn" title="Google">
                  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div className="social-btn" title="Microsoft">
                  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                    <rect x="13" y="1" width="10" height="10" fill="#7fba00"/>
                    <rect x="1" y="13" width="10" height="10" fill="#00a4ef"/>
                    <rect x="13" y="13" width="10" height="10" fill="#ffb900"/>
                  </svg>
                </div>
                <div className="social-btn" title="LinkedIn">
                  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#0077b5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
              </div>
            </form>

            <p className="auth-footer">
              Hesabınız yok mu? <button type="button" className="auth-link-btn" onClick={() => navigate('/signup')}>Kayıt Ol</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;