import React from 'react';
import EventItem from './EventItem/EventItem';

import './EventList.css';

const eventList = ({ events, authUserId, onViewDetail }) => {
  return (
    <ul className="event__list">
      {events.map(event => (
        <EventItem
          key={event._id}
          eventId={event._id}
          title={event.title}
          price={event.price}
          date={event.date}
          creatorId={event.creator._id}
          userId={authUserId}
          onDetail={onViewDetail}
        />
      ))}
    </ul>
  );
};

export default eventList;
