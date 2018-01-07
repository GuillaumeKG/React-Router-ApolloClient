import React from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, CardTitle, Icon, Chip, Tag, Button } from 'react-materialize'

import './Post.scss'

/******************************************* */
/*         GRAPHQL QUERIES HANDLING          */
/******************************************* */
// Define Query / Mutation / Subscription
const submitVote = gql`
  mutation submitRepository($id: Int!) {
    upvotePost(id: $id) {
      id
      title
      votes
    }
  }
`

const Post = ({data, submit}) => {
  console.log(data)
  console.log(submit)
  return (
    <Card
      className="hoverable"
      header={
        <div className="right-align">
          <Link to={'/Post/' + data.id}>
            <CardTitle reveal image={data.imgUrl} waves='light' >
            </CardTitle>
          </Link>
          <Button floating className='grey' waves='light' icon='favorite' />
          &nbsp;
            <Button floating className='grey' waves='light' icon='thumb_up' onClick={()=>submit(data.id)} />
          &nbsp;
        </div>
      }
      title={data.title}
      reveal={
        <div>
          <p>Here is some more information about this product that is only revealed once clicked on.</p>
          {data.keywords.map((kwd, idx) => <Tag key={idx}>{kwd}</Tag>)}
        </div>
      }
    >
      <Chip>
        <img src='https://placeimg.com/320/240/nature' alt='Contact Person' />
        {data.author.firstName} {data.author.lastName}
      </Chip>
    </Card>

  )
}

// Wrap react component(s) with data through High Order Component
export default graphql(submitVote, {
  props: ({ mutate }) => ({
    submit: (id) => mutate({ variables: { id } }),
  }),
})(Post);