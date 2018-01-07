
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

function Home({ data: { loading, error, posts }, match }) {
  console.log('Home Component')
  if (loading) {
    return <p>Loading... </p>
  }
  if (error) {
    return <p>{error.message}</p>
  }
  if (posts === null) {
    return <p>No Data </p>
  }
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

// Wrap react component(s) with data through High Order Component
export default graphql(postsListQuery)(Home)