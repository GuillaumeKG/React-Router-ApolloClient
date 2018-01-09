import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'

import Home from './containers/Home/Home';
import Header from './components/Canvas/Header';
import PostDetails from './components/Post/PostDetails';
import About from './components/About';

import'./App.scss';

/******************************************* */
/*           GRAPHQL CLIENT SETUP            */
/******************************************* */
// Define GraphQL client (GraphQL server, cache, other options...)

// Create an http link:
const httpLink = new HttpLink({
    uri: 'http://localhost:3000/graphql'
  })
  
  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: 'ws://localhost:3000/subscriptions',
    options: {
      reconnect: true
    }
  })
  
  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  )

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
})

/******************************************* */
/*             MAIN REACT COMPONENT          */
/******************************************* */
class App extends Component {

    render() {
        return (
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <div>
                        <Header />
                        <div className="body">
                            <Switch>
                                <Route exact path='/' component={Home} />
                                <Route path='/about' component={About} />
                                <Route path='/explorer' component={Home} />
                                <Route path='/account' component={About} />
                                <Route path='/post/:id' component={PostDetails} />
                            </Switch>
                        </div>
                    </div>
                </BrowserRouter>
            </ApolloProvider>
        )
    }
}

export default App