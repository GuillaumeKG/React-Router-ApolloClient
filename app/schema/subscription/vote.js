import gql from 'graphql-tag'

// Define Subscription
const voteSub = gql`
  subscription postVoteSub($id: ID!) {
    postVoted(id: $id) {
      id
      votes
    }
  }
`

export function subscribeToNewVote(params, props) {
  console.log('subscribeToNewVote')
  return props.data.subscribeToMore({
    document: voteSub,
    variables: {
      id: params.id,
    },
    updateQuery: (prev, { subscriptionData }) => {
      console.log('updateQuery')
      console.log(subscriptionData)
      console.log(prev)

      if (!subscriptionData.data) {
        return prev;
      }

      let updatedPost = subscriptionData.data.postVoted

      let posts = prev.posts.map(post => {
        if (post.id === updatedPost.id) {
          return { ...post, votes: updatedPost.votes }
        }

        return post
      })

      return Object.assign({}, prev, {
        entry: {
          posts
        }
      })
    }
  })
}