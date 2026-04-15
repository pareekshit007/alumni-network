import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import AlumniCard from '../components/cards/AlumniCard';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';
import useAuth from '../hooks/useAuth';

const AlumniPage = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ branch: '', location: '', minYear: '', maxYear: '' });
  const [toast, setToast] = useState('');

  const fetchAlumni = async () => {
    setLoading(true);
    let query = `/users?role=alumni`;
    if (search) query += `&search=${search}`;
    if (filters.branch) query += `&branch=${filters.branch}`;
    if (filters.location) query += `&location=${filters.location}`;
    if (filters.minYear) query += `&graduationYearMin=${filters.minYear}`;
    if (filters.maxYear) query += `&graduationYearMax=${filters.maxYear}`;
    
    try {
      const res = await api.get(query);
      setAlumni(res.data.data.filter(u => u.role === 'alumni'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAlumni();
    }, 400); // Debounce search
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters]);

  const handleConnect = async (id) => {
    try {
      await api.post(`/users/${id}/connect`, { action: 'send' });
      setToast('Connection request sent!');
      fetchAlumni();
    } catch (err) {
      setToast(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="flex gap-6">
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <div className="card" style={{ width: '280px', height: 'fit-content' }}>
        <h3 className="heading-3" style={{ marginBottom: '20px' }}>Filters</h3>
        <div className="form-group">
          <label className="form-label">Branch</label>
          <select className="input-field" value={filters.branch} onChange={e => setFilters({...filters, branch: e.target.value})}>
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="input-field" placeholder="City or Country" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} />
        </div>
        <div className="flex gap-2">
          <div className="form-group">
            <label className="form-label">Min Year</label>
            <input type="number" className="input-field" value={filters.minYear} onChange={e => setFilters({...filters, minYear: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Year</label>
            <input type="number" className="input-field" value={filters.maxYear} onChange={e => setFilters({...filters, maxYear: e.target.value})} />
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '24px' }}>
          <input 
            type="text" className="input-field" placeholder="Search by name..." 
            value={search} onChange={e => setSearch(e.target.value)} 
            style={{ padding: '14px', fontSize: '1.1rem' }}
          />
        </div>
        
        {loading ? <Spinner /> : (
          <div className="grid-cards">
            {alumni.map(alum => (
              <AlumniCard key={alum._id} alumni={alum} currentUserId={user.id} onConnect={handleConnect} />
            ))}
            {alumni.length === 0 && <p>No alumni found matching your criteria.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniPage;
