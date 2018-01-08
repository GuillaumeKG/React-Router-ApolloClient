# React-Router-ApolloClient
Template for React React-Router Apollo Client project

Apollo Client


QUERY
-----------------------------

Object returned by apollo query
data: {
  user: { name: "James" },
  likes: { count: 10 },
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
            errorPolicy: 'none',
            notifyOnNetworkStatusChange: false,
            context: {...}
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
     author{
       firstName
       lastName
     }
     votes
   }
   post(id:$id) {
    id
    title
    keywords
    imgUrl
    author{
      firstName
      lastName
    }
    votes
  }
 }
` 
get data in render(): data.posts and data.post

-----------------------------
Pagination

data.fetchMore({
  updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
    return {
      ...previousResult,
      // Add the new feed data to the end of the old feed data.
      feed: [...previousResult.feed, ...fetchMoreResult.feed],
    }
  },
})


--------------------------------
Subsription

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
            optimisticResponse: {      
              createTodo: {
                id: -1, // A temporary id. The server decides the real id.
                text: newText,
                completed: false,
              },
            },
            update: (proxy, { data: { createTodo } }) => {
              const data = proxy.readQuery({ query });
              data.todos.push(createTodo);
              proxy.writeQuery({ query, data });
            },
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
