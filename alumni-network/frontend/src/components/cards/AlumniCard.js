import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';

const AlumniCard = ({ alumni, currentUserId, onConnect }) => {
  
  // Find connection status between current user and this alumni
  let connStatus = null;
  if (alumni.connections && currentUserId) {
    const conn = alumni.connections.find(c => c.user._id === currentUserId || c.user === currentUserId);
    if (conn) connStatus = conn.status;
  }

  return (
    <div className="card text-center flex-col items-center">
      <div style={{ marginBottom: '16px' }}>
        <Avatar src={alumni.avatar} alt={alumni.name} size="80px" />
      </div>
      <h3 className="heading-3" style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{alumni.name}</h3>
      <p className="text-muted" style={{ marginBottom: '4px', fontSize: '0.875rem' }}>Class of {alumni.graduationYear}</p>
      <p style={{ fontWeight: 500, marginBottom: '16px', fontSize: '0.875rem' }}>
        {alumni.currentRole} at {alumni.currentCompany}
      </p>
      
      <div className="flex gap-2 justify-center" style={{ marginBottom: '20px', flexWrap: 'wrap' }}>
        {alumni.skills && alumni.skills.slice(0, 3).map((skill, i) => (
          <span key={i} className="badge">{skill}</span>
        ))}
      </div>

      <div className="flex gap-2" style={{ width: '100%' }}>
        <Link to={`/profile/${alumni._id}`} className="btn btn-secondary" style={{ flex: 1 }}>Profile</Link>
        {alumni._id !== currentUserId && (
          <button 
            className={`btn ${connStatus === 'accepted' ? 'btn-secondary' : 'btn-primary'}`} 
            style={{ flex: 1 }}
            disabled={connStatus === 'pending' || connStatus === 'accepted'}
            onClick={() => onConnect && onConnect(alumni._id)}
          >
            {connStatus === 'accepted' ? 'Connected' : connStatus === 'pending' ? 'Pending' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AlumniCard;
