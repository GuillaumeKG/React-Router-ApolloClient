import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Row, Input, Button, Icon } from 'react-materialize'
import axios from 'axios'

import './Post.scss'

class CreatePost extends React.Component {

  constructor(props) {
    super(props)
    console.log('CreatePost constructor')
    console.log(props)

    this.state = {
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
        <section>
          <hr />
          <div className="error">{this.state.errMsg}</div>

          <div className="createPostSection">

            <div className="uploadZone">
              <div className="dropZone"></div>
            </div>

            <div className="fieldZone">
              <Input placeholder="Username" label="Website URL" s={12}
                name="url" onChange={this.handleChange}></Input>

              <Input label="Description" s={12}
                name="desc" onChange={this.handleChange} ></Input>

            </div>

          </div>
          <hr />

          <Button waves='light'>Create<Icon small right>save</Icon></Button>

        </section>
      )
    }
  }
}


export default CreatePost