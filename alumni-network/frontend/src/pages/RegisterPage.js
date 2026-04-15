import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', graduationYear: '', branch: '', role: 'alumni'
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError(null);
    try {
      await register(formData);
      // login happens implicitly inside AuthContext -> redirect via PublicRoute
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrapper" style={{ padding: '40px 20px' }}>
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="text-center" style={{ marginBottom: '24px' }}>
          <h1 className="heading-1" style={{ color: 'var(--primary)' }}>Create Account</h1>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" required className="input-field"
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" required className="input-field"
              value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Password</label>
              <input type="password" required className="input-field"
                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Confirm Password</label>
              <input type="password" required className="input-field"
                value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Graduation Year</label>
              <input type="number" required className="input-field"
                value={formData.graduationYear} onChange={e => setFormData({ ...formData, graduationYear: e.target.value })} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Branch</label>
              <select className="input-field" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}>
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="input-field" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', marginBottom: '16px' }}>
            Register
          </button>
        </form>
        
        <div className="text-center" style={{ fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
