import React from 'react';
import './SkeletonTable.css';

const SkeletonTable = ({ columns = 4, rows = 5 }) => {
  return (
    <div className="skeleton-table">
      <div className="skeleton-header">
        {[...Array(columns)].map((_, i) => (
          <div key={i} className="skeleton-box skeleton-th"></div>
        ))}
      </div>
      <div className="skeleton-body">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="skeleton-row">
            {[...Array(columns)].map((_, colIndex) => (
              <div key={colIndex} className="skeleton-box skeleton-td" style={{ width: `${Math.random() * 40 + 40}%` }}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;
