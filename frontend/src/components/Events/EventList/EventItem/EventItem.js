import React from 'react';
import './EventItem.css';

const eventItem = ({
  eventId,
  title,
  price,
  date,
  creatorId,
  userId,
  onDetail
}) => (
  <li className="event__list-item">
    <div>
      <h1>{title}</h1>
      <h2>
        SEK {price} - {new Date(date).toLocaleDateString('sv-SE')}
      </h2>
    </div>
    <div>
      {userId === creatorId ? (
        <p>You&#39;re the owner of this event</p>
      ) : (
        <button
          className="button"
          type="button"
          onClick={() => onDetail(eventId)}
        >
          View Details
        </button>
      )}
    </div>
  </li>
);

export default eventItem;
