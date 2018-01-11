import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import jwt from 'jsonwebtoken'


class CheckLoginContainer extends React.Component {

    componentDidMount() {
        console.log('CheckLoginContainer')
        const { location } = this.props

        let token = localStorage.getItem('token')
        let currentTime = new Date().getTime()/1000
        let payload = {}
        let isExpired = false

        console.log('token ' + token)

        if (token) {
            payload = jwt.decode(token)
            isExpired = payload.exp < currentTime
        }

        console.log('payload')
        console.log(payload)
        console.log('currentTime: ' + currentTime)
        console.log('isExpired: ' + isExpired)

        if (!token || isExpired) {
            location.replace = '/login'
            localStorage.clear()
        }
    }

    render() {
        if (localStorage.getItem('token')) {
            return this.props.children
        } else {
            return <Redirect to="/login" />
        }
    }
}

export default withRouter(CheckLoginContainer)