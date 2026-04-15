import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="card flex-col justify-between" style={{ height: '100%' }}>
      <div>
        <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
          <span className="badge">{job.type}</span>
          <span className="text-muted" style={{ fontSize: '0.875rem' }}>{job.status}</span>
        </div>
        <h3 className="heading-3" style={{ marginBottom: '8px' }}>{job.title}</h3>
        <p style={{ fontWeight: 500, marginBottom: '4px' }}>{job.company}</p>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '16px' }}>{job.location}</p>
      </div>
      <Link to={`/jobs/${job._id}`} className="btn btn-primary" style={{ width: '100%' }}>View Details</Link>
    </div>
  );
};

export default JobCard;
