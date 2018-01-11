import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Input } from 'react-materialize'

import './Login.scss'

class Login extends React.Component {

  render() {

    return (
      <main class="loginContainer">
        <div className="loginForm">
          <Row>
            <Input placeholder="Placeholder" s={6} label="First Name" />
            <Input s={6} label="Last Name" />
            <Input s={12} label="disabled" defaultValue="I am not editable" disabled />
            <Input type="password" label="password" s={12} />
            <Input type="email" label="Email" s={12} />
          </Row>
        </div>
      </main>
    )
  }
}


export default Login