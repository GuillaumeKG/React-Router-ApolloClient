import React from 'react';
import { NavLink, Link, Redirect, withRouter } from 'react-router-dom';
import { Input, Button, Icon, Row } from 'react-materialize'

import './Header.scss';


class Header extends React.Component {


  /******************** */
  /*     CONSTRUCTOR    */
  /******************** */
  constructor(props) {
    super(props)

    this.state = {
      toRedirect: false,
      search: ''
    }

    this.logout = this.logout.bind(this)
    this.search = this.search.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  /******************** */
  /*       LOGOUT       */
  /******************** */
  logout() {
    localStorage.clear()

    this.props.history.push('/Login')

    this.setState({
      toRedirect: true
    })
  }

  /******************** */
  /*       SEARCH       */
  /******************** */

  // Handle user inputs
  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  search(event) {
    console.log('search')
    console.log(this.state.search)

    this.props.history.push({
      pathname: '/search',
      state: { searchCriteria: this.state.search }
    })
  }


  /******************** */
  /*       RENDER       */
  /******************** */
  render() {
    return (
      <header className="navbar darkgreen">
        <div className="navElement logo">
          <Link to='/'><img src='/Img/logo.png' /> </Link>
        </div>

        <div className="navElement search">
          <Row className="searchForm">
            <Input placeholder="Search" name="search" value={this.state.search}
              onChange={this.handleChange} />
            <div className="btnSearch valign-wrapper" onClick={this.search}>
              <Icon small className="cyan-text text-darken-4">search</Icon>
            </div>
          </Row>
        </div>

        <div className="navElement menu">
          <NavLink to='/explorer' activeClassName="selected" title="Explorer">
            <Icon title="Explorer"> public</Icon>
          </NavLink>
        </div>

        <div className="navElement menu">
          <NavLink to='/account' activeClassName="selected" title="My Account">
            <Icon>account_box</Icon>
          </NavLink>
        </div>

        <div className="navElement menu" title="Notifications">
          <Icon> email</Icon>
        </div>

        <div className="navElement menu right-align" title="Logout">
          <div onClick={this.logout}>
            <Icon >exit_to_app</Icon>
          </div>
        </div>
      </header>
    )
  }
}

export default withRouter(Header)
