import React from 'react';

const Spinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px' }}>
      <div style={{
         width: '40px', 
         height: '40px', 
         border: '4px solid var(--border-color)', 
         borderTopColor: 'var(--primary)', 
         borderRadius: '50%', 
         animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Spinner;
