import Author from './author'

export const typeDefs = `
type Query { 
    user(id: ID!): User
    post(id: ID!): ImgPost
    posts: [ImgPost]
    mailbox(id: ID!):  MailBox
  }

type Mutation {
  upvotePost(id: ID!):Post
  submitComment(id: ID!, message:String!):Comment
}

type Subscription {
  commentAdded(id: ID!): Comment
}
`