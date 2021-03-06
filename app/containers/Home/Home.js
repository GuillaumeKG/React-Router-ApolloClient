import React from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import PostList from 'Components/Post/PostList'
import FixedActionBtn from 'Components/FixedActionBtn/FixedActionBtn'

import {subscribeToNewVote} from 'Schema/subscription/vote'

import './Home.scss'

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

        <FixedActionBtn />
      </div>
    )
  }
}

// Wrap react component(s) with data through High Order Component
export default graphql(postsListQuery, {
  props: (props) => ({
    ...props,
    subscribeToNewVote: (params) => subscribeToNewVote(params, props)
  }),
})(Home)