import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Toast from '../components/common/Toast';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'Full-time', description: '', requirements: '', minSalary: '', maxSalary: '', deadline: ''
  });
  const [toast, setToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
        salaryRange: { min: Number(formData.minSalary), max: Number(formData.maxSalary) }
      };
      const res = await api.post('/jobs', payload);
      setToast('Job posted successfully!');
      setTimeout(() => navigate(`/jobs/${res.data.data._id}`), 1000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Error posting job');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <h1 className="heading-2" style={{ marginBottom: '32px' }}>Post a New Job</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Job Title</label>
          <input className="input-field" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Company</label>
            <input className="input-field" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Location</label>
            <input className="input-field" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Job Type</label>
          <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="input-field" rows="5" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>
        <div className="form-group">
          <label className="form-label">Requirements (comma separated)</label>
          <input className="input-field" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} />
        </div>
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Min Salary ($)</label>
            <input type="number" className="input-field" value={formData.minSalary} onChange={e => setFormData({...formData, minSalary: e.target.value})} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Max Salary ($)</label>
            <input type="number" className="input-field" value={formData.maxSalary} onChange={e => setFormData({...formData, maxSalary: e.target.value})} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Deadline</label>
            <input type="date" className="input-field" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Post Job</button>
      </form>
    </div>
  );
};

export default CreateJobPage;
