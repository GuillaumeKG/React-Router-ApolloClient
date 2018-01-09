# React-Router-ApolloClient
Template for React React-Router Apollo Client project

Apollo Client

---------------------------
CREATE CLIENT
---------------------------

******************
    CACHE SETUP
******************
Cache implementation
  Hermes https://github.com/convoyinc/apollo-cache-hermes
  InMemoryCache

Persitence
  localStorage (Web)
  sessionStorage (Web)
  AsyncStorage (React Native)
  localForage (Web) https://github.com/localForage/localForage

import { persistCache } from 'apollo-cache-persist'

const cache = new InMemoryCache({
  addTypename: true,
  dataIdFromObject: object => {
    switch (object.__typename) {
      case 'foo': return object.key; // use `key` as the primary key
      case 'bar': return `bar:${object.blah}`; // use `bar` prefix and `blah` as the primary key
      default: return defaultDataIdFromObject(object); // fall back to default handling
    }
  }
  fragmentMatcher: new IntrospectionFragmentMatcher({ introspectionQueryResultData }),
  cacheResolvers: {
    Query: {
      book: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Book', id: args.id })),
    },
  }
})

// For persistence
// Different persistence solution
// https://github.com/apollographql/apollo-cache-persist
persistCache({
  cache,
  storage: localStorage,
})

*********
  LINK
*********

import { HttpLink } from 'apollo-link-http'
import { ApolloLink, from } from 'apollo-link'

const link = new HttpLink({
  uri: 'https://example.com/graphql',
  credentials: 'same-origin',
  headers: ''
})

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('token') || null,
    } 
  })

  return forward(operation);
})

const client = new ApolloClient({
  from([
    authMiddleware,
    link
  ]),
  cache,
})

AFTERWARE (executed after query result)

import { onError } from 'apollo-link-error'

const logoutLink = onError(({ networkError }) => {
  if (networkError.statusCode === 401) logout()
})

const client = new ApolloClient({
  link: logoutLink.concat(link),
})




-----------------------------
QUERY
-----------------------------

Object returned by apollo query
data: {
  user: { name: "James" },
  loading: false,
  error: null,
  variables: { id: 'asdf' }, // variables sent to gql server
  refetch() { ... }, // to rexecute the gql query, to reload data on event for instance
  fetchMore() { ... }, // Handle pagination
  startPolling() { ... },
  stopPolling() { ... },
  subscribeToMore(){}, // handle subscription and processing of new data
  updateQuery(){},  // update data in store (not on server)
  networkStatus: 1, 
  
}

networkStatus:

1    loading: The query has never been run before and the request is now pending. A query will still have this network status even if a result was returned from the cache, but a query was dispatched anyway.

2    setVariables: If a query’s variables change and a network request was fired then the network status will be setVariables until the result of that query comes back. React users will see this when options.variables changes on their queries.

3    fetchMore: Indicates that fetchMore was called on this query and that the network request created is currently in flight.

4    refetch: It means that refetch was called on a query and the refetch request is currently in flight.

5    Unused.

6    poll: Indicates that a polling query is currently in flight. So for example if you are polling a query every 10 seconds then the network status will switch to poll every 10 seconds whenever a poll request has been sent but not resolved.

7    ready: No request is in flight for this query, and no errors happened. Everything is OK.

8    error: No request is in flight for this query, but one or more errors were detected.

-----------------------------

// The caller could do something like:
<ProfileWithData avatarSize={300} />

// QUERY: HOC could look like:
const ProfileWithData = graphql(CurrentUserForLayout, {
    options: (ownProps) => (
        { 
            variables: { 
                avatarSize: ownProps.avatarSize 
            },
            pollInterval: 20000,
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'none', // 'ignore' 'all'
            notifyOnNetworkStatusChange: false,
            context: {
              queryDeduplication: true,
              ...
            }
        }),
    skip: (ownProps) => !ownProps.authenticated,
    name: 'customName',
    props: ({ ownProps, data: { loading, currentUser, refetch } }) => (
        {
            userLoading: loading,
            user: currentUser,
            refetchUser: refetch,
        }),

})(Profile);


// Can call multiple queries in 1 gql
const postsListQuery = gql`
 query ($id: Int!){
   posts {
     id
     title
     imgUrl
     keywords
   }
   post(id:$id) {
    id
    title
    keywords
    imgUrl
  }
 }
` 
get data in render(): data.posts and data.post

-----------------------------
Pagination
-----------------------------

const FeedWithData = graphql(FeedQuery, {
  props({ data: { loading, feed, currentUser, fetchMore } }) {
    return {
      loading,
      feed,
      currentUser,
      loadNextPage() {
        return fetchMore({
          variables: {
            offset: feed.length,
          },

          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) { return previousResult; }

            return Object.assign({}, previousResult, {
              feed: [...previousResult.feed, ...fetchMoreResult.feed],
            });
          },
        });
      },
    };
  },
})(Feed)


--------------------------------
 Subsription
--------------------------------

*********************
 INIT CONNECTION
*********************

import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

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


*********************
 SUBSCRIBE 
*********************

const withData = graphql(COMMENT_QUERY, {
    name: 'comments',
    options: ({ params }) => ({
        variables: {
            repoName: `${params.org}/${params.repoName}`
        },
    }),
    props: props => {
        return {
            subscribeToNewComments: params => {
                return props.comments.subscribeToMore({
                    document: COMMENTS_SUBSCRIPTION,
                    variables: {
                        repoName: params.repoFullName,
                    },
                    updateQuery: (prev, {subscriptionData}) => {
                        if (!subscriptionData.data) {
                            return prev;
                        }

                        const newFeedItem = subscriptionData.data.commentAdded;

                        return Object.assign({}, prev, {
                            entry: {
                                comments: [newFeedItem, ...prev.entry.comments]
                            }
                        })
                    }
                })
            }
        }
    },
})

// Subscribe in Component
export class CommentsPage extends Component {
    componentWillMount() {
        this.props.subscribeToNewComments({
            repoFullName: this.props.repoFullName,
        });
    }
}





class SubscriptionComponent extends Component {
  componentWillReceiveProps(nextProps) {
    if(!nextProps.data.loading) {
      // Check for existing subscription
      if (this.unsubscribe) {
        // Check if props have changed and, if necessary, stop the subscription
        if (this.props.subscriptionParam !== nextProps.subscriptionParam) {
          this.unsubscribe();
        } else {
          return;
        }
      }

      // Subscribe
      this.unsubscribe = nextProps.data.subscribeToMore({
        document: gql`subscription {...}`,
        updateQuery: (previousResult, { subscriptionData, variables }) => {
          // Perform updates on previousResult with subscriptionData
          return updatedResult;
        }
      });
    }
  }
  render() {
    ...
  }
}


---------------------------
MUTATION
---------------------------

const ProfileWithData = graphql(gqlMutation, {
    options: (ownProps) => (
        { 
            variables: { 
                id: ownProps.id ,
                text: newText
            },
            name: 'customName',
            // Response mocked waiting for server response
            optimisticResponse: {      
              createTodo: {
                id: -1, // A temporary id. The server decides the real id.
                text: newText,
                completed: false,
              },
            },
            // Update cache after mutation, before server response
            update: (proxy, { data: { createTodo } }) => {
              const data = proxy.readQuery({ query });
              data.todos.push(createTodo);
              proxy.writeQuery({ query, data });
            },
            // Refresh cache after mutation
            refetchQueries: [
              {
                query: 'CommentList', 
              },
              {
                query: 'Post', // Query name in gql schema
                variables: {
                  id: ownProps.id,
                }
              }
            ],
        }),
    props: ({ ownProps, mutate }) => ({
      submit: (props) => mutate(options),
  })

})(Profile);


Multiple mutations

import { compose } from 'react-apollo';

const ComponentWithMutations = compose(
  graphql(submitNewUser, { name: 'newUserMutation' }),
  graphql(submitRepository, { name: 'newRepositoryMutation' })
)(Component)

Optimistic UI

const CommentPageWithData = graphql(submitComment, {
  props: ({ ownProps, mutate }) => ({
    submit: (props) => mutate({
      variables: { id: props.id},
      optimisticResponse: {
        __typename: 'Mutation',
        submitComment: {
          __typename: 'Comment',
          // Note that we can access the props of the container at `ownProps` if we
          // need that information to compute the optimistic response
          postedBy: ownProps.currentUser,
          createdAt: +new Date,
          content: props.commentContent,
        },
      },
    }),
  }),
})(CommentPage);

// Update cache immediately after mutation
// createTodo: gql mutation
// todosQuery: gql query
// todos: name of the query in schemas
export default graphql(submitVote, {
  props: ({ mutate }) => ({
    submit: (id) => mutate(
      { 
        variables: { id },
        update:(proxy, { data: { createTodo}}) => {
           const data = proxy.readQuery({query: TodosQuery})
           
           data.todos.push(createTodo)
           proxy.writeQuery({query: TodosQuery, data})
        },
      }
    ),
  }),
})(Post);

-----------------------------
  CACHE ACCESS
-----------------------------

const { todo } = client.readQuery({
  query: gql`
    query ReadTodo($id: Int!) {
      todo(id: $id) {
        id
        text
        completed
      }
    }
  `,
  variables: {
    id: 5,
  },
})

const todo = client.readFragment({
  id: ..., // `id` is any id that could be returned by `dataIdFromObject`.
  fragment: gql`
    fragment myTodo on Todo {
      id
      text
      completed
    }
  `,
})

// Write only in cache not in DB
client.writeFragment({
  id: '5',
  fragment: gql`
    fragment myTodo on Todo {
      completed
    }
  `,
  data: {
    completed: true,
  },
})

-----------------------------
  ERROR MANAGEMENT
-----------------------------

import { onError } from "apollo-link-error"

const link = onError(({ operation, response, graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`)
})