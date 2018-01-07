import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import './Header.scss';

const Header = () => {
  return (
    <header className="navbar darkgreen">
      <div className="navElement logo"><Link to='/'><img src='../../../img/logo.png' /> </Link></div>
      <div className="navElement search">
        <div className="input-field">
          <input id="search" type="search" required/>
          <label className="label-icon"><i className="material-icons">search</i></label>
          <i className="material-icons">close</i>
        </div>
      </div>
      <div className="navElement menu"><NavLink to='/explorer' activeClassName="selected">Explorer</NavLink></div>
      <div className="navElement menu"><NavLink to='/account' activeClassName="selected">Account</NavLink></div>
      <div className="navElement menu">Messenger</div>
    </header>
      )
}

export default Header
