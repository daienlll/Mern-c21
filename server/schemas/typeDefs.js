const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        bookid: ID!
        authors: String
        description: String
        title: String
        image: String
        link: String
    }
    input InputBook{
        bookid: ID!
        authors: String
        description: String
        title: String
        image: String
        link: String
    }
    type User{
        _id: ID!
        username: String!
        email: String!
        bookcount: Int
        savebooks: Book
    }
    type Auth{
        tokken: ID!
        user: User
    }
    type Query{
        me: User
    }
    type mutation{
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(newBook: InputBook!): User
        removeBook(bookId: ID!): User
    }
`;
module.exports = typeDefs;