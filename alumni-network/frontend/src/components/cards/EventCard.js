import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const dateObj = new Date(event.date);
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const day = dateObj.getDate();

  const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000';
  const imgUrl = event.banner && event.banner.startsWith('/uploads') ? `${API_URL}${event.banner}` : event.banner;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ height: '140px', backgroundColor: '#E5E7EB', position: 'relative' }}>
        {event.banner && <img src={imgUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'var(--surface)', padding: '4px 12px', 
          borderRadius: 'var(--radius-sm)', textAlign: 'center', fontWeight: 'bold'
        }}>
          <div style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>{month.toUpperCase()}</div>
          <div style={{ fontSize: '1.25rem' }}>{day}</div>
        </div>
      </div>
      <div style={{ padding: '20px' }}>
        <span className="badge" style={{ marginBottom: '8px' }}>{event.type}</span>
        <h3 className="heading-3" style={{ marginBottom: '8px', fontSize: '1.25rem' }}>{event.title}</h3>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '16px' }}>
          {event.time} &bull; {event.venue || 'Online'}
        </p>
        <Link to={`/events/${event._id}`} className="btn btn-secondary" style={{ width: '100%' }}>View Event</Link>
      </div>
    </div>
  );
};

export default EventCard;
