import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'

import App from './app/App'
import client from './app/graphQLConfig'
import Login from 'Components/Login/Login'

ReactDOM.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
        <Switch>
            <Route path="/login" component={Login}/>
            <Route component={App}/>
        </Switch>
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('app'))
