import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Spinner from '../components/common/Spinner';
import Avatar from '../components/common/Avatar';
import Toast from '../components/common/Toast';
import useAuth from '../hooks/useAuth';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      await api.post(`/jobs/${id}/apply`);
      setToast('Successfully applied to job!');
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.data);
    } catch (err) {
      setToast(err.response?.data?.message || 'Error applying to job');
    }
  };

  if (loading) return <Spinner />;
  if (!job) return <p>Job not found</p>;

  const hasApplied = job.applicants?.some(a => a.user._id === user.id);
  const isOwner = job.postedBy._id === user.id || user.role === 'admin';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="flex justify-between items-start" style={{ marginBottom: '20px' }}>
          <div>
            <span className="badge" style={{ marginBottom: '12px' }}>{job.type}</span>
            <h1 className="heading-1" style={{ marginBottom: '8px' }}>{job.title}</h1>
            <p className="text-muted" style={{ fontSize: '1.25rem' }}>{job.company} &bull; {job.location}</p>
          </div>
          <div>
            {job.status === 'open' && !hasApplied && !isOwner && (
              <button className="btn btn-primary" onClick={handleApply}>Apply Now</button>
            )}
            {hasApplied && <span className="btn btn-secondary cursor-not-allowed">Applied</span>}
            {job.status === 'closed' && <span className="btn btn-danger">Closed</span>}
          </div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <h3 className="heading-3" style={{ marginBottom: '12px' }}>Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>{job.description}</p>
        </div>

        {job.requirements?.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h3 className="heading-3" style={{ marginBottom: '12px' }}>Requirements</h3>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
              {job.requirements.map((req, i) => <li key={i} style={{ listStyleType: 'disc', marginBottom: '8px' }}>{req}</li>)}
            </ul>
          </div>
        )}

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '40px' }}>
            <div>
                <p className="text-muted" style={{ marginBottom: '4px' }}>Salary Range</p>
                <p style={{ fontWeight: 500 }}>{job.salaryRange?.min ? `$${job.salaryRange.min} - $${job.salaryRange.max}` : 'Not specified'}</p>
            </div>
            <div>
                <p className="text-muted" style={{ marginBottom: '4px' }}>Deadline</p>
                <p style={{ fontWeight: 500 }}>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not specified'}</p>
            </div>
        </div>
      </div>

      <div className="card">
        <h3 className="heading-3" style={{ marginBottom: '20px' }}>Posted By</h3>
        <Link to={`/profile/${job.postedBy._id}`} className="flex items-center gap-4">
          <Avatar src={job.postedBy.avatar} alt={job.postedBy.name} size="60px" />
          <div>
            <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>{job.postedBy.name}</p>
            <p className="text-muted">{job.postedBy.role} at {job.postedBy.company || 'Unknown'}</p>
          </div>
        </Link>
      </div>
      
      {isOwner && job.applicants?.length > 0 && (
         <div className="card" style={{ marginTop: '24px' }}>
           <h3 className="heading-3" style={{ marginBottom: '20px' }}>Applicants ({job.applicants.length})</h3>
           {job.applicants.map((app, i) => (
             <div key={i} className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                 <Link to={`/profile/${app.user._id}`} className="flex items-center gap-4">
                     <Avatar src={app.user.avatar} alt={app.user.name} size="40px" />
                     <p style={{ fontWeight: 500 }}>{app.user.name}</p>
                 </Link>
                 <span className="text-muted" style={{ fontSize: '0.875rem' }}>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
             </div>
           ))}
         </div>
      )}
    </div>
  );
};

export default JobDetailPage;
