import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/auth-context';

import Spinner from '../components/Spinner/Spinner';

const BookingsPage = () => {
  const context = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  let isActive = true;

  const fetchBookings = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
            bookings {
              _id
              event {
                _id
                title
                date
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
        console.log('bookings resData', resData);
        const retrievedBookings = resData.data.bookings;
        if (isActive) {
          setBookings(retrievedBookings);
          setIsLoading(false);
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log(err);
        if (isActive) {
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line no-return-assign
    return () => (isActive = false);
  }, []);

  return (
    <section>
      <h1>The Bookings Page</h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul>
          {bookings.map(booking => (
            <li key={booking._id}>
              {booking.event.title}({booking._id})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BookingsPage;
