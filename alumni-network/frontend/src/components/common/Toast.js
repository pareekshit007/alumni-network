import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'success' ? 'var(--secondary)' : 'var(--danger)';

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', 
      backgroundColor: bg, color: 'white', 
      padding: '12px 24px', borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-md)', zIndex: 9999,
      fontWeight: 500
    }}>
      {message}
    </div>
  );
};

export default Toast;
