import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from 'Containers/Home/Home'
import Search from 'Containers/Search/Search'
import Header from 'Components/Canvas/Header'
import PostDetails from 'Components/Post/PostDetails'
import About from 'Components/About'
import CheckLoginContainer from 'Components/Login/CheckLogin'

import './App.scss'

/******************************************* */
/*             MAIN REACT COMPONENT          */
/******************************************* */
class App extends Component {

    render() {
        const token = localStorage.getItem('token')
        console.log('App render ' + token)
        return (
            <CheckLoginContainer protected="false">
                <div>
                    <Header />
                    <div className="body">
                        <Switch>
                            <Route path='/about' component={About} />
                            <Route path='/explorer' component={Home} />
                            <Route path='/account' component={About} />
                            <Route path='/search' component={Search} />
                            <Route path='/post/:id' component={PostDetails} />
                            <Route exact path='/' component={Home} />
                        </Switch>
                    </div>
                </div>
            </CheckLoginContainer>
        )
    }
}

export default App