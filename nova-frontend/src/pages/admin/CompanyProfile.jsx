import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useToast } from '../../components/ui/ToastProvider';
import './CompanyProfile.css';

const CompanyProfile = () => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    taxNumber: '',
    address: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      
      let cId = null;
      const meRes = await axiosInstance.get('/employees/me');
      if (meRes.data && meRes.data.department && meRes.data.department.company) {
        cId = meRes.data.department.company.id;
      } else {
        const companiesRes = await axiosInstance.get('/companies');
        if (companiesRes.data && companiesRes.data.length > 0) {
          cId = companiesRes.data[0].id;
        }
      }

      if (cId) {
        setCompanyId(cId);
        
        const companyRes = await axiosInstance.get(`/companies/${cId}`);
        const cData = companyRes.data;
        setFormData({
          name: cData.name || '',
          taxNumber: cData.taxNumber || '',
          address: cData.address || '',
          email: cData.email || '',
          phone: cData.phone || ''
        });
        setLogoUrl(cData.logoUrl || null);
      } else {
        toast.error('Şirket bilgisi bulunamadı. Lütfen sistem yöneticinize başvurun.');
      }
    } catch (err) {
      toast.error('Veriler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!companyId) return;
    try {
      setIsLoading(true);
      await axiosInstance.put(`/companies/${companyId}`, formData);
      setIsEditing(false);
      toast.success('Şirket bilgileri başarıyla güncellendi!');
      await fetchCompanyData(); // Refresh data
    } catch (err) {
      toast.error('Şirket bilgileri kaydedilirken bir hata oluştu.');
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !companyId) return;
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(`/companies/${companyId}/logo`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLogoUrl(res.data);
      toast.success('Logo başarıyla yüklendi!');
    } catch (err) {
      toast.error('Logo yüklenirken hata oluştu.');
      console.error(err);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogoRemove = async () => {
    if (!companyId) return;
    if (window.confirm('Logoyu silmek istediğinize emin misiniz?')) {
      try {
        setIsLoading(true);
        await axiosInstance.delete(`/companies/${companyId}/logo`);
        setLogoUrl(null);
        toast.info('Logo kaldırıldı.');
      } catch (err) {
        toast.error('Logo silinirken hata oluştu.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header"><h2>Şirket Bilgileri Yükleniyor...</h2></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Şirket Profili</h2>
          <p>Şirketinizin genel görünümünü ve iletişim bilgilerini yönetin.</p>
        </div>
      </div>
      
      <div className="content-card company-card">
        {/* Banner / Cover Image */}
        <div className="company-cover">
          <div className="cover-overlay"></div>
        </div>

        {/* Logo Upload Area - Overlaps the banner */}
        <div className="logo-upload-section">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleLogoUpload}
          />
          
          {logoUrl ? (
            <div className="logo-display-container">
              <div className="logo-image-wrapper">
                <img src={`http://localhost:8080/uploads/logos/${logoUrl}`} alt="Company Logo" className="company-logo-img" />
              </div>
              <div className="logo-actions">
                <button className="btn-icon" onClick={() => fileInputRef.current.click()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  Değiştir
                </button>
                <button className="btn-icon danger" onClick={handleLogoRemove}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Kaldır
                </button>
              </div>
            </div>
          ) : (
            <div className="logo-placeholder" onClick={() => fileInputRef.current.click()}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>Şirket Logosu Yükle</span>
            </div>
          )}
        </div>

        {/* Form Grid */}
        <div className="company-form-section">
          <h3 className="section-title">Genel Bilgiler</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                Şirket İsmi
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "readonly-input" : ""}
                placeholder="Örn: Nova Yazılım A.Ş."
              />
            </div>

            <div className="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Vergi No
              </label>
              <input 
                type="text" 
                name="taxNumber" 
                value={formData.taxNumber} 
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "readonly-input" : ""}
                placeholder="10 Haneli Vergi Numarası"
              />
            </div>
          </div>

          <h3 className="section-title" style={{marginTop: '32px'}}>İletişim Bilgileri</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                E-posta Adresi
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "readonly-input" : ""}
                placeholder="info@sirketiniz.com"
              />
            </div>

            <div className="form-group">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Telefon Numarası
              </label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "readonly-input" : ""}
                placeholder="+90 (___) ___ __ __"
              />
            </div>

            <div className="form-group full-width">
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Açık Merkez Adresi
              </label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "readonly-input" : ""}
                rows="3"
                placeholder="Şirketinizin tam adresi..."
              />
            </div>
          </div>
        </div>

        <div className="card-actions">
          {isEditing ? (
            <>
              <button className="btn-secondary" onClick={() => {
                setIsEditing(false);
                fetchCompanyData(); // İptal edildiğinde eski veriyi geri çek
              }}>İptal</button>
              <button className="btn-primary" onClick={handleSave}>Kaydet</button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setIsEditing(true)}>Düzenle</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
