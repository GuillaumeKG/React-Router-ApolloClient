import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Row, Input, Button, Icon } from 'react-materialize'
import axios from 'axios'

import './Login.scss'

class Login extends React.Component {

  constructor(props) {
    super(props)
    console.log('Login constructor')
    console.log(props)

    const { location } = props
    let isLogged = localStorage.getItem('token')
    this.state = {
      name: 'name',
      pwd: 'pwd',
      isLogged,
    }

    if (isLogged) {
      location.replace='/'
    }

    this.handleChange = this.handleChange.bind(this)
    this.login = this.login.bind(this)
  }

  // Handle user inputs
  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  // Login function
  login(event) {
    event.preventDefault()

    let that = this

    axios.post('http://localhost:3000/login', {
      name: this.state.name,
      pwd: this.state.pwd
    })
      .then(function (response) {
        console.log('login response: ' + response.data.token)

        localStorage.setItem('token', response.data.token)

        that.setState({
          isLogged: true
        })
        
      that.props.history.push('/')

      })
      .catch(function (error) {
        let err = error.response
        console.log(err.status + ' - ' + err.data.msg)

        that.setState({
          errMsg: err.status + ' - ' + err.data.msg
        })
      })
  }

  render() {

    if (this.state.isLogged) {
      return (
        < Redirect exact from="/" to="/" />
      )
    } else {
      return (
        <main className="loginContainer">
          <form className="loginForm" onSubmit={this.login}>
            <Row>
              <div className="error">{this.state.errMsg}</div>
            </Row>
            <Row>
              <Input placeholder="Username" label="First Name" s={12}
                name="name" onChange={this.handleChange}><Icon>account_circle</Icon></Input>
              <Input type="password" label="password" s={12}
                name="pwd " onChange={this.handleChange} ><Icon>lock</Icon></Input>
            </Row>
            <Row>
              <Input name='Memorize Username' type='switch' value='0' />
            </Row>
            <Row>
              <div className="Section"></div>
            </Row>
            <Row className="center">
              <Button waves='light'>Login<Icon small right>send</Icon></Button>
            </Row>
          </form>
        </main>
      )
    }
  }
}


export default Login