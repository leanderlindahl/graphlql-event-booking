import React, { useState } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';

const EventsPage = () => {
  const [creating, setCreating] = useState(false);

  const startCreateEventHandler = event => {
    event.preventDefault();
    setCreating(true);
  };

  const modalConfirmHandler = () => {};
  const modalCancelHandler = () => {
    setCreating(false);
  };

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
              <input type="text" id="title" name="title" />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" name="price" />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows="4" />
            </div>
          </form>
        </Modal>
      )}

      <article className="events">
        <header>
          <h1>Share your own Events!</h1>
        </header>
        <main>
          <form className="events-control">
            <button
              type="button"
              className="button button-primary"
              onClick={startCreateEventHandler}
            >
              Create Event
            </button>
          </form>
        </main>
      </article>
    </>
  );
};

export default EventsPage;
