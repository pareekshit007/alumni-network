import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import JobCard from '../components/cards/JobCard';
import Spinner from '../components/common/Spinner';
import useAuth from '../hooks/useAuth';

const JobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', location: '' });

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      let query = '/jobs?';
      if (filters.type) query += `type=${filters.type}&`;
      if (filters.location) query += `location=${filters.location}&`;
      try {
        const res = await api.get(query);
        setJobs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchJobs, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="flex gap-6">
      <div className="card" style={{ width: '280px', height: 'fit-content' }}>
        <h3 className="heading-3" style={{ marginBottom: '20px' }}>Job Filters</h3>
        <div className="form-group">
          <label className="form-label">Job Type</label>
          <select className="input-field" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="input-field" placeholder="City or Remote" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} />
        </div>
        {(user?.role === 'admin' || user?.role === 'alumni') && (
          <Link to="/create-job" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>Post a Job</Link>
        )}
      </div>
      
      <div style={{ flex: 1 }}>
        <h1 className="heading-2" style={{ marginBottom: '24px' }}>Job Board</h1>
        {loading ? <Spinner /> : (
          <div className="grid-cards">
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
            {jobs.length === 0 && <p>No jobs found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
