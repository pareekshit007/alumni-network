import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';
import Avatar from '../components/common/Avatar';
import Toast from '../components/common/Toast';

const EditProfilePage = () => {
  const { user, updateMe } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', bio: '', currentCompany: '', currentRole: '', location: '', skills: ''
  });
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        currentCompany: user.currentCompany || '',
        currentRole: user.currentRole || '',
        location: user.location || '',
        skills: user.skills ? user.skills.join(', ') : ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, skills: formData.skills.split(',').map(s => s.trim()) };
      const res = await api.put('/users/profile', payload);
      
      if (file) {
        const fileData = new FormData();
        fileData.append('avatar', file);
        const avatarRes = await api.post('/users/avatar', fileData, { headers: { 'Content-Type': 'multipart/form-data' }});
        updateMe(avatarRes.data.data);
      } else {
        updateMe(res.data.data);
      }
      
      setToast('Profile updated successfully!');
      setTimeout(() => navigate(`/profile/${user.id}`), 1000);
    } catch (err) {
      setToast('Error updating profile');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <h1 className="heading-2" style={{ marginBottom: '32px' }}>Edit Profile</h1>
      
      <div className="flex items-center gap-6" style={{ marginBottom: '32px' }}>
        <Avatar src={user?.avatar} alt={user?.name} size="80px" />
        <div>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            Upload New Avatar
            <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </label>
          {file && <span style={{ marginLeft: '12px', fontSize: '0.875rem' }}>{file.name}</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea className="input-field" rows="4" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}></textarea>
        </div>
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Current Company</label>
            <input className="input-field" value={formData.currentCompany} onChange={e => setFormData({...formData, currentCompany: e.target.value})} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Current Role</label>
            <input className="input-field" value={formData.currentRole} onChange={e => setFormData({...formData, currentRole: e.target.value})} />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Location</label>
            <input className="input-field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Skills (comma separated)</label>
            <input className="input-field" placeholder="React, Node.js, AWS" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
          </div>
        </div>
        <div style={{ marginTop: '32px' }}>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
