import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';
import JobCard from '../components/cards/JobCard';
import EventCard from '../components/cards/EventCard';
import Avatar from '../components/common/Avatar';
import Spinner from '../components/common/Spinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes, eventsRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/jobs?limit=3'),
          api.get('/events?limit=3')
        ]);
        setStats(statsRes.data.data);
        setJobs(jobsRes.data.data.slice(0, 3));
        setEvents(eventsRes.data.data.slice(0, 3));
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="heading-1" style={{ marginBottom: '32px' }}>Good morning, {user?.name.split(' ')[0]} 👋</h1>
      
      <div className="grid-cards" style={{ marginBottom: '40px', gap: '20px' }}>
        <div className="card text-center">
          <h2 className="heading-1" style={{ color: 'var(--primary)' }}>{stats?.totalAlumni || 0}</h2>
          <p className="text-muted">Total Alumni</p>
        </div>
        <div className="card text-center">
          <h2 className="heading-1" style={{ color: 'var(--secondary)' }}>{stats?.totalJobs || 0}</h2>
          <p className="text-muted">Total Jobs</p>
        </div>
        <div className="card text-center">
          <h2 className="heading-1" style={{ color: '#F59E0B' }}>{stats?.totalEvents || 0}</h2>
          <p className="text-muted">Total Events</p>
        </div>
        <div className="card text-center">
          <h2 className="heading-1" style={{ color: 'var(--danger)' }}>{stats?.myConnections || 0}</h2>
          <p className="text-muted">Your Connections</p>
        </div>
      </div>

      <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h2 className="heading-2" style={{ marginBottom: '20px' }}>Recent Jobs</h2>
          <div className="flex-col gap-4">
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
            {jobs.length === 0 && <p>No jobs posted yet.</p>}
          </div>
        </div>
        <div style={{ flex: '1 1 400px' }}>
          <h2 className="heading-2" style={{ marginBottom: '20px' }}>Upcoming Events</h2>
          <div className="flex-col gap-4">
            {events.map(event => <EventCard key={event._id} event={event} />)}
            {events.length === 0 && <p>No upcoming events.</p>}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 className="heading-2" style={{ marginBottom: '20px' }}>Your Connections</h2>
        <div className="flex gap-4" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
            {user?.connections && user.connections.filter(c => c.status === 'accepted').length > 0 ? (
                user.connections.filter(c => c.status === 'accepted').map(c => (
                    <div key={c._id || Math.random()} className="card flex-col items-center" style={{ minWidth: '150px' }}>
                        <Avatar src={c.user?.avatar} alt={c.user?.name} size="60px" />
                        <p style={{ marginTop: '10px', fontWeight: 500, textAlign: 'center' }}>{c.user?.name || 'Connected User'}</p>
                    </div>
                ))
            ) : <p>No connections yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
