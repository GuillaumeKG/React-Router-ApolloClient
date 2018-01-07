import Author from './author'

export const typeDefs = `
  type Query { 
      author(id: Int!): Author
      post(id: Int!): Post
      posts: [ImgPost]
    }
  type Mutation {
    upvotePost(id: Int!):Post
    submitComment(id: Int!, message:String!):Comment
  }
  type Subscription {
    commentAdded(id: Int!): Comment
  }
`