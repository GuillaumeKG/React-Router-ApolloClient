import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
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
const client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
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