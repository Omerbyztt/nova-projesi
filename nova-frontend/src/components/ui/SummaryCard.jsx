import React from 'react';
import './SummaryCard.css';

const SummaryCard = ({ title, value, icon, trend, trendLabel, color = "blue" }) => {
  return (
    <div className="summary-card">
      <div className="summary-content">
        <div className="summary-info">
          <span className="summary-title">{title}</span>
          <h3 className="summary-value">{value}</h3>
          
          {trend && (
            <div className={`summary-trend ${trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {trend.startsWith('+') ? (
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                ) : (
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                )}
                {trend.startsWith('+') && <polyline points="17 6 23 6 23 12"></polyline>}
                {!trend.startsWith('+') && <polyline points="17 18 23 18 23 12"></polyline>}
              </svg>
              <span>{trend}</span>
              {trendLabel && <span className="trend-label">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className={`summary-icon icon-${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
