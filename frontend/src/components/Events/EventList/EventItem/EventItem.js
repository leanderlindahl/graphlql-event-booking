import React from 'react';
import './EventItem.css';
import eventList from '../EventList';

const eventItem = ({
  eventId,
  title,
  price,
  date,
  creatorId,
  userId,
  onDetail,
  onDelete
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
        <div>
          <p>You&#39;re the owner of this eventList</p>
          <button type="button" onClick={() => onDelete(eventId)}>
            Delete
          </button>
          <button type="button" onClick={() => onDetail(eventId)}>
            View Details
          </button>
        </div>
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
