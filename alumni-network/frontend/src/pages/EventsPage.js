import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import EventCard from '../components/cards/EventCard';
import Spinner from '../components/common/Spinner';
import useAuth from '../hooks/useAuth';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
        <h1 className="heading-2">Upcoming Events</h1>
        {user?.role === 'admin' && (
          <Link to="/create-event" className="btn btn-primary">Create Event</Link>
        )}
      </div>
      
      {loading ? <Spinner /> : (
        <div className="grid-cards">
          {events.map(event => <EventCard key={event._id} event={event} />)}
          {events.length === 0 && <p>No events found.</p>}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
