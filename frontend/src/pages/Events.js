import React, { useState, useContext, useEffect } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';

import './Events.css';

const EventsPage = () => {
  const context = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const titleElRef = React.createRef();
  const priceElRef = React.createRef();
  const dateElRef = React.createRef();
  const descriptionElRef = React.createRef();

  const fetchEvents = () => {
    setIsLoading(true);
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
        const retrievedEvents = resData.data.events;
        setEvents(retrievedEvents);
        setIsLoading(false);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        setIsLoading(false);
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
        const updatedEvents = [...events];
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          title: resData.data.createEvent.title,
          description: resData.data.createEvent.description,
          date: resData.data.createEvent.date,
          price: resData.data.createEvent.price,
          creator: {
            _id: context.userId,
            email: context.email
          }
        });
        setEvents(updatedEvents);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const bookEventHandler = () => {
    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId:"${selectedEvent._id}") {
              _id
              createdAt
              updatedAt
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
          throw new Error('Book event failed2!');
        }
        return res.json();
      })
      .then(resData => {
        console.log('Bookevent', resData);
        setSelectedEvent(null);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  };

  const showDetailHandler = eventId => {
    const theEvent = events.find(event => event._id === eventId);
    setSelectedEvent(theEvent);
    console.log('selectedEvent', selectedEvent);
  };

  const onDeleteHandler = eventId => {
    const theEvent = events.find(event => event._id === eventId);
    const requestBody = {
      query: `
          mutation {
            deleteEvent(eventId: "${eventId}") {
              _id
              title
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
          throw new Error('Delete event failed!');
        }
        return res.json();
      })
      .then(resData => {
        // @todo: remove the event from the EventList
        console.log(resData);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  };

  return (
    <>
      {creating || (selectedEvent && <Backdrop />)}
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
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm={context.token}
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText="Book event"
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            SEK {selectedEvent.price} -{' Date: '}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
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
            {isLoading ? (
              <Spinner />
            ) : (
              <EventList
                events={events}
                authUserId={context.userId}
                onViewDetail={showDetailHandler}
                onDelete={onDeleteHandler}
              />
            )}
          </section>
        </main>
      </article>
    </>
  );
};

export default EventsPage;
