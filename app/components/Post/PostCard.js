import React from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, CardTitle, Icon, Chip, Tag, Button } from 'react-materialize'

import './Post.scss'

/******************************************* */
/*         GRAPHQL QUERIES HANDLING          */
/******************************************* */
// Define Mutation
const submitVote = gql`
  mutation submitRepository($id: ID!) {
    upvotePost(id: $id) {
      id
      title
      votes
    }
  }
`

class Post extends React.Component {

  render() {
    console.log('Post')
    let {post, submit} = this.props

    return (
      <Card
        className="hoverable"
        header={
          <div className="right-align">
            <Link to={'/Post/' + post.id}>
              <CardTitle reveal image={post.imgUrl} waves='light' >
              </CardTitle>
            </Link>
            <Button floating className='grey' waves='light' icon='favorite' />
            &nbsp;
              <Button floating className='grey' waves='light' icon='thumb_up' onClick={()=>submit(post.id)} />
            &nbsp;
          </div>
        }
        title={post.title}
        reveal={
          <div>
            <p>Here is some more information about this product that is only revealed once clicked on.</p>
            {post.keywords.map((kwd, idx) => <Tag key={idx}>{kwd}</Tag>)}
          </div>
        }
      >
        <Chip>
          <img src='https://placeimg.com/320/240/nature' alt='Contact Person' />
          {post.author.firstName} {post.author.lastName}
        </Chip>
        {post.votes} 
      </Card>

    )
  }
}

// Wrap react component(s) with data through High Order Component
export default graphql(submitVote, {
  props: (props) => ({
    submit: (id) => {
      console.log('submit ' + id)
      console.log(props)

      return props.mutate(
      { 
        variables: { id },
      }
    )},
  }),
})(Post)