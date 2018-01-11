import React from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import PostList from 'Components/Post/PostList'
import FixedActionBtn from 'Components/FixedActionBtn/FixedActionBtn'

import {subscribeToNewVote} from 'Schema/subscription/vote'

import './Search.scss'

/******************************************* */
/*         GRAPHQL QUERIES HANDLING          */
/******************************************* */
// Define Query / Mutation / Subscription
const postsBySearchQuery = gql`
 query postsBySearchQuery($searchCriteria: String!){
   postsBySearch (searchCriteria: $searchCriteria){
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

class Search extends React.Component {

  componentWillMount() {
    console.log(' Search - componentWillMount')
    console.log(this.props)
    this.props.subscribeToNewVote({
      id: 1,
    })
  }

  render() {

    console.log('Start Search')
    let { data: { loading, error, postsBySearch }, match } = this.props

    if (loading) {
      console.log('loading')
      return <p>Loading... </p>
    }
    if (error) {
      return <p>{error.message}</p>
    }
    if (postsBySearch === null) {
      return <p>No Data </p>
    }

    console.log('result')

    return (
      <div className="home" >
        <div className="section header">
          Search Results for: {this.props.location.state.searchCriteria}
        </div>
        <PostList list={postsBySearch} />

        <FixedActionBtn />
      </div>
    )
  }
}

// Wrap react component(s) with data through High Order Component
export default graphql(postsBySearchQuery, {
  options: ({ location }) => ({ variables: { searchCriteria: location.state.searchCriteria } }),
  props: (props) => ({
    ...props,
    subscribeToNewVote: (params) => subscribeToNewVote(params, props)
  }),
})(Search)