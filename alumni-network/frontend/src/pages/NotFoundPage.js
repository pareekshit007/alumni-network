import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '16px' }}>404</h1>
      <h2 className="heading-2" style={{ marginBottom: '24px' }}>Page not found</h2>
      <p className="text-muted" style={{ marginBottom: '32px' }}>Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
    </div>
  );
};

export default NotFoundPage;
