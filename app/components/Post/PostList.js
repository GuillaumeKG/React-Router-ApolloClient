import React from 'react';

import PostCard from './PostCard'

import './Post.scss'

const PostList = ({ list }) => {
  console.log('PostList')
  console.log(list)
  return (
    <div className="postList">
      {list.map(p => <PostCard key={p.id} data={p} />)}
    </div>
  )
}

export default PostList