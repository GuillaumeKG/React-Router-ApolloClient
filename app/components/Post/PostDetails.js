import React from 'react';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import './Post.scss'

/******************************************* */
/*         GRAPHQL QUERIES HANDLING          */
/******************************************* */
// Define Query / Mutation / Subscription
const postQuery = gql`
 query postQuery($id: Int!){
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

const PostDetails = ({ data: { loading, error, post}, match }) => {
  console.log('PostDetails Component')
  // console.log(post)

  if (loading) {
    return <p>Loading... </p>
  }
  if (error) {
    return <p>{error.message}</p>
  }
  if (post === null) {
    return <p>No Data </p>
  }
  return (
    <div className="postDetails">
        <div className="header">
          <div>Share</div>
          <div></div>
          <div>Save</div>
        </div>
        <div className="picture">
          <img src={post.imgUrl} className="responsive-img" />
        </div>
        <div className="section details">
          {post.title}
          <br/> {post.votes} like(s)
        </div>
        <div className="divider"></div>
        <div className="section comments">
          Comments
        </div>
        
    </div>

  )
}

// Wrap react component(s) with data through High Order Component
export default graphql(postQuery, 
                       {
                         options: ({ match }) => ({ variables: { id:match.params.id } })
                       }
                      )
              (PostDetails)