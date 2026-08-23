import React from 'react';

const Calendar = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div className="content-card" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📅</div>
        <h2 style={{ margin: '0 0 8px 0' }}>Takvim (Yakında)</h2>
        <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>
          Bu sayfa yapım aşamasındadır. Yakında toplantılarınızı ve etkinliklerinizi buradan takip edebileceksiniz.
        </p>
      </div>
    </div>
  );
};

export default Calendar;
