
import React from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Button } from 'react-materialize'

import PostList from '../../components/Post/PostList'

import './Home.scss';

/******************************************* */
/*         GRAPHQL QUERIES HANDLING          */
/******************************************* */
// Define Query / Mutation / Subscription
const postsListQuery = gql`
 query {
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
 }
`

// Define Subscription
const voteSub = gql`
  subscription postVoteSub($id: ID!) {
    postVoted(id: $id) {
      id
      votes
    }
  }
`

class Home extends React.Component {
  componentWillMount() {
    console.log(' Home - componentWillMount')
    this.props.subscribeToNewVote({
      id: 1,
    })
  }

  render() {

    console.log('Start Home')
    let { data: { loading, error, posts }, match } = this.props

    if (loading) {
      console.log('loading')
      return <p>Loading... </p>
    }
    if (error) {
      return <p>{error.message}</p>
    }
    if (posts === null) {
      return <p>No Data </p>
    }

    console.log('result')

    return (
      <div className="home" >
        <PostList list={posts} />

        <Button floating fab='vertical' icon='add' className='darkgreen' large style={{ bottom: '45px', right: '24px' }}>
          <Button floating icon='image' className='red' />
          <Button floating icon='video_label' className='yellow darken-1' />
          <Button floating icon='subject' className='green' />
        </Button>
      </div>
    )
  }
}

// Wrap react component(s) with data through High Order Component
export default graphql(postsListQuery, {
  props: (props) => ({
    ...props,
    subscribeToNewVote: params => {
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
              return { ...post, votes: updatedPost.votes}
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
  }),
})(Home)