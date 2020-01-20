import React, { useState, useContext, useEffect } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import './Events.css';

const EventsPage = () => {
  const context = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  const [creating, setCreating] = useState(false);

  const titleElRef = React.createRef();
  const priceElRef = React.createRef();
  const dateElRef = React.createRef();
  const descriptionElRef = React.createRef();

  const fetchEvents = () => {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:8001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        const retrievedEvents = resData.data.events;
        setEvents(retrievedEvents);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const startCreateEventHandler = event => {
    event.preventDefault();
    setCreating(true);
  };

  const modalConfirmHandler = () => {
    setCreating(false);
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price.length < 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const event = {
      title,
      price,
      date,
      description
    };

    console.log('modalConfirm event', event);

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:8001/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        fetchEvents();
      })
      .catch(err => {
        console.log(err);
      });
  };
  const modalCancelHandler = () => {
    setCreating(false);
  };

  const eventsList = events.map(event => (
    <li key={event._id} className="events__list-item">
      {event.title}
    </li>
  ));
  return (
    <>
      {creating && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" ref={titleElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" name="price" ref={priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                ref={dateElRef}
              />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                ref={descriptionElRef}
                rows="4"
              />
            </div>
          </form>
        </Modal>
      )}

      <article className="events">
        <header>
          <h1>Share your own Events!</h1>
        </header>
        <main>
          <section>
            {context.token && (
              <form className="events-control">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={startCreateEventHandler}
                >
                  Create Event
                </button>
              </form>
            )}
          </section>
          <section>
            <ul className="events__list">{eventsList}</ul>
          </section>
        </main>
      </article>
    </>
  );
};

export default EventsPage;
