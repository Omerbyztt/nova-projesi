import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useToast } from '../ui/ToastProvider';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', password: '' });

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const { default: axiosInstance } = await import('../../api/axiosConfig');
      const res = await axiosInstance.get('/employees/me');
      setCurrentUser(res.data);
      setProfileData({
        firstName: res.data.firstName || '',
        lastName: res.data.lastName || '',
        email: res.data.email || '',
        title: res.data.title || '',
        password: ''
      });
    } catch (err) {
      console.error('Failed to fetch user profile', err);
    }
  };

  const handleProfileUpdate = async () => {
    if (!currentUser) return;
    try {
      const { default: axiosInstance } = await import('../../api/axiosConfig');
      
      const payload = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        title: profileData.title,
        role: currentUser.role,
        department: currentUser.department
      };
      
      if (profileData.password) {
        payload.password = profileData.password;
      }
      
      await axiosInstance.put(`/employees/${currentUser.id}`, payload);
      toast.success('Profil başarıyla güncellendi!');
      setShowProfileModal(false);
      fetchMe();
    } catch (err) {
      toast.error('Profil güncellenirken bir hata oluştu.');
      console.error(err);
    }
  };

  const formatRole = (role) => {
    switch(role) {
      case 'COMPANY_ADMIN': return 'Şirket Yöneticisi';
      case 'SUPER_ADMIN': return 'Sistem Yöneticisi';
      case 'EMPLOYEE': return 'Çalışan';
      default: return role;
    }
  };

  const toggleDarkMode = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Check saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const modules = [
    { name: 'Şirket Bilgileri', path: '/company' },
    { name: 'Departman Yönetimi', path: '/departments' },
    { name: 'Çalışanlar', path: '/employees' },
    { name: 'Görevler', path: '/tasks' }
  ];

  const filteredModules = modules.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
          <div className="brand-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <span className="brand-text">Nova Portal</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/company" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <path d="M9 22v-4h6v4"></path>
                  <path d="M8 6h.01"></path>
                  <path d="M16 6h.01"></path>
                  <path d="M12 6h.01"></path>
                  <path d="M12 10h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M16 10h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M8 10h.01"></path>
                  <path d="M8 14h.01"></path>
                </svg>
                <span className="nav-text">Şirket Bilgileri</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/departments" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span className="nav-text">Departman Yönetimi</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className="nav-text">Çalışanlar</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span className="nav-text">Görevler</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="nav-text">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Modüllerde ara..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {showDropdown && searchQuery && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, 
                backgroundColor: 'white', borderRadius: '8px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid var(--admin-border)', zIndex: 50,
                overflow: 'hidden'
              }}>
                {filteredModules.length > 0 ? filteredModules.map(m => (
                  <div key={m.path} 
                       style={{padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-main)', fontSize: '0.9rem', fontWeight: 500}}
                       onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--admin-bg-color)'}
                       onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                       onMouseDown={(e) => {
                         e.preventDefault(); // Prevents input from losing focus immediately
                         navigate(m.path);
                         setSearchQuery('');
                         setShowDropdown(false);
                       }}>
                    {m.name}
                  </div>
                )) : (
                  <div style={{padding: '12px 16px', color: 'var(--admin-text-muted)', fontSize: '0.9rem'}}>
                    "{searchQuery}" için sonuç bulunamadı.
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="topbar-actions">
            <button className="action-btn theme-toggle-btn" onClick={toggleDarkMode} title="Temayı Değiştir">
              <svg className="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              <svg className="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </button>
            <button className="notification-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="badge">3</span>
            </button>
            <div style={{ position: 'relative' }}>
              <div className="user-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <div className="avatar">
                  {currentUser ? `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}` : 'ÖF'}
                </div>
                <div className="user-info">
                  <span className="user-name">{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Yükleniyor...'}</span>
                  <span className="user-role">{currentUser ? formatRole(currentUser.role) : ''}</span>
                </div>
              </div>
              
              {showProfileMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  backgroundColor: 'white', borderRadius: '8px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: '1px solid var(--admin-border)', zIndex: 50,
                  minWidth: '200px', overflow: 'hidden'
                }}>
                  <div style={{padding: '12px 16px', borderBottom: '1px solid var(--admin-border)'}}>
                    <strong style={{display: 'block', fontSize: '0.9rem'}}>{currentUser?.email}</strong>
                  </div>
                  <div style={{padding: '8px 0'}}>
                    <div style={{padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s'}}
                         onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--admin-bg-color)'}
                         onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                         onClick={() => {
                           setShowProfileMenu(false);
                           setShowProfileModal(true);
                         }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profili Düzenle
                    </div>
                    <div style={{padding: '10px 16px', cursor: 'pointer', fontSize: '0.9rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s'}}
                         onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--admin-bg-color)'}
                         onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                         onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Çıkış Yap
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{marginTop: 0, marginBottom: '24px', fontSize: '1.5rem', color: 'var(--admin-text-main)'}}>Profili Düzenle</h3>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600}}>Ad</label>
                <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                       style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600}}>Soyad</label>
                <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                       style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600}}>E-posta</label>
                <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                       style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600}}>Ünvan</label>
                <input type="text" value={profileData.title} onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                       style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600}}>Yeni Şifre (Boş bırakılabilir)</label>
                <input type="password" placeholder="********" value={profileData.password} onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                       style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)'}} />
              </div>
            </div>

            <div style={{display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'flex-end'}}>
              <button onClick={() => setShowProfileModal(false)}
                      style={{padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'white', cursor: 'pointer', fontWeight: 600}}>
                İptal
              </button>
              <button onClick={handleProfileUpdate}
                      style={{padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--admin-primary)', color: 'white', cursor: 'pointer', fontWeight: 600}}>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
