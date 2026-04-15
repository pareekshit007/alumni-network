import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Spinner from '../components/common/Spinner';
import Avatar from '../components/common/Avatar';
import Toast from '../components/common/Toast';
import useAuth from '../hooks/useAuth';

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRSVP = async () => {
    try {
      await api.post(`/events/${id}/rsvp`);
      setToast('RSVP updated automatically!');
      const evRes = await api.get(`/events/${id}`);
      setEvent(evRes.data.data);
    } catch (err) {
      setToast(err.response?.data?.message || 'Error updating RSVP');
    }
  };

  if (loading) return <Spinner />;
  if (!event) return <p>Event not found</p>;

  const isAttending = event.attendees?.some(a => a._id === user.id);
  const isFull = event.maxAttendees && event.attendees?.length >= event.maxAttendees;

  const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000';
  const imgUrl = event.banner && event.banner.startsWith('/uploads') ? `${API_URL}${event.banner}` : event.banner;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      
      {event.banner && (
        <div style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '32px' }}>
          <img src={imgUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="flex justify-between items-start" style={{ marginBottom: '24px' }}>
          <div>
            <span className="badge" style={{ marginBottom: '12px' }}>{event.type}</span>
            <h1 className="heading-1" style={{ marginBottom: '8px' }}>{event.title}</h1>
            <p className="text-muted" style={{ fontSize: '1.125rem' }}>
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </p>
          </div>
          <div>
            <button 
              className={`btn ${isAttending ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={handleRSVP}
              disabled={!isAttending && isFull}
            >
              {isAttending ? 'Cancel RSVP' : isFull ? 'Event Full' : 'RSVP Now'}
            </button>
          </div>
        </div>

        <div className="flex gap-6" style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1 }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Venue</h4>
                <p style={{ fontWeight: 500 }}>{event.venue || 'N/A'}</p>
            </div>
            <div style={{ flex: 1 }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Online Link</h4>
                {event.onlineLink ? <a href={event.onlineLink} target="_blank" rel="noreferrer">Join Link</a> : <p>N/A</p>}
            </div>
            <div style={{ flex: 1 }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Attendees</h4>
                <p style={{ fontWeight: 500 }}>{event.attendees?.length || 0} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''}</p>
            </div>
        </div>

        <div>
          <h3 className="heading-3" style={{ marginBottom: '12px' }}>Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>{event.description}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="heading-3" style={{ marginBottom: '20px' }}>Attendees</h3>
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          {event.attendees?.map(attendee => (
            <Link to={`/profile/${attendee._id}`} key={attendee._id} className="flex-col items-center gap-2" style={{ width: '80px', textAlign: 'center' }}>
              <Avatar src={attendee.avatar} alt={attendee.name} size="60px" />
              <span style={{ fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.2 }}>{attendee.name.split(' ')[0]}</span>
            </Link>
          ))}
          {(!event.attendees || event.attendees.length === 0) && <p className="text-muted">No one has RSVP'd yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
