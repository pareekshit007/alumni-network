import React from 'react';

const Avatar = ({ src, alt = "User", size = "48px" }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    const split = name.split(' ');
    if (split.length > 1) return (split[0][0] + split[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000';
  const imgUrl = src && src.startsWith('/uploads') ? `${API_URL}${src}` : src;

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', 
      backgroundColor: 'var(--primary)', color: 'white', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      flexShrink: 0, fontWeight: 'bold'
    }}>
      {src ? (
        <img src={imgUrl} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: `calc(${size} * 0.4)` }}>{getInitials(alt)}</span>
      )}
    </div>
  );
};

export default Avatar;
