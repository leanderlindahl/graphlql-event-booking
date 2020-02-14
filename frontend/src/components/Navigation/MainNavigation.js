import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

const mainNavigation = () => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Eventify</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button
                      className="button button-primary"
                      onClick={context.logout}
                      type="button"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
              {!context.token && (
                <li>
                  <NavLink to="/auth">Login</NavLink>
                </li>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
