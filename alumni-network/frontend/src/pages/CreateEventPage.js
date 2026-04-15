import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Toast from '../components/common/Toast';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', time: '', venue: '', onlineLink: '', type: 'Offline', maxAttendees: ''
  });
  const [file, setFile] = useState(null);
  const [toast, setToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => payload.append(key, formData[key]));
      if (file) payload.append('banner', file);

      const res = await api.post('/events', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToast('Event created successfully!');
      setTimeout(() => navigate(`/events/${res.data.data._id}`), 1000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Error creating event');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <h1 className="heading-2" style={{ marginBottom: '32px' }}>Create New Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Title</label>
          <input className="input-field" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Banner Image</label>
          <input type="file" className="input-field" accept="image/*" onChange={e => setFile(e.target.files[0])} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="input-field" rows="5" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Date</label>
            <input type="date" className="input-field" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Time</label>
            <input type="time" className="input-field" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
             <label className="form-label">Type</label>
             <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
               <option value="Offline">Offline</option>
               <option value="Online">Online</option>
             </select>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="form-group" style={{ flex: 2 }}>
            <label className="form-label">{formData.type === 'Online' ? 'Online Link' : 'Venue'}</label>
            <input className="input-field" 
              value={formData.type === 'Online' ? formData.onlineLink : formData.venue} 
              onChange={e => {
                  if(formData.type === 'Online') setFormData({...formData, onlineLink: e.target.value});
                  else setFormData({...formData, venue: e.target.value});
              }} 
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Max Attendees (optional)</label>
            <input type="number" className="input-field" value={formData.maxAttendees} onChange={e => setFormData({...formData, maxAttendees: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
