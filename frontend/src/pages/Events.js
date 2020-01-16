import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';

class EventsPage extends Component {
  state = {
    creating: false
  };
  startCreateEventHandler = event => {
    event.preventDefault();
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {};
  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <p>Modal Content</p>
          </Modal>
        )}

        <article className="events">
          <header>
            <h1>Share your own Events!</h1>
          </header>
          <main>
            <form className="events-control">
              <button
                className="button button-primary"
                onClick={this.startCreateEventHandler}
              >
                Create Event
              </button>
            </form>
          </main>
        </article>
      </React.Fragment>
    );
  }
}

export default EventsPage;
