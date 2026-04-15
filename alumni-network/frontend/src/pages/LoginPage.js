import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center" style={{ marginBottom: '32px' }}>
          <h1 className="heading-1" style={{ color: 'var(--primary)', marginBottom: '8px' }}>AlumniNet</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" required className="input-field"
              value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" required className="input-field"
              value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" style={{ fontSize: '0.875rem' }}>Remember me</label>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }} disabled={loading}>
            {loading ? <Spinner /> : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center" style={{ fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
