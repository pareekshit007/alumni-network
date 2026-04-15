import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Avatar from '../components/common/Avatar';
import Spinner from '../components/common/Spinner';

const ProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setProfile(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <Spinner />;
  if (!profile) return <p>Profile not found</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '40px', marginBottom: '24px' }}>
        <div className="flex gap-6 items-center">
          <Avatar src={profile.avatar} alt={profile.name} size="120px" />
          <div>
            <h1 className="heading-1" style={{ marginBottom: '8px' }}>{profile.name}</h1>
            <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '16px' }}>
              {profile.currentRole} at {profile.currentCompany} &bull; {profile.location}
            </p>
            <div className="flex gap-2">
              {profile.skills?.map((skill, i) => (
                <span key={i} className="badge">{skill}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '32px' }}>
          <h3 className="heading-3" style={{ marginBottom: '12px' }}>About</h3>
          <p style={{ color: 'var(--text-muted)' }}>{profile.bio || 'No bio provided.'}</p>
        </div>
      </div>
      
      <div className="card">
        <h3 className="heading-3" style={{ marginBottom: '20px' }}>Connections ({profile.connections?.filter(c => c.status === 'accepted').length || 0})</h3>
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          {profile.connections?.filter(c => c.status === 'accepted').map(conn => (
            <Link to={`/profile/${conn.user._id}`} key={conn._id} className="card text-center" style={{ width: '140px', padding: '16px' }}>
              <div className="flex justify-center" style={{ marginBottom: '10px' }}>
                <Avatar src={conn.user?.avatar} alt={conn.user?.name} size="50px" />
              </div>
              <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{conn.user?.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
