const { ApolloServer, gql, GraphQLError } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v4: uuid } = require('uuid')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // object for storing passed arguments
      let search = {}

      if (args.author) {
        const author = await Author.collection.findOne({ name: args.author })
        if (author) {
          search.author = author
        }
      }
      
      if (args.genre) {
        search.genres = args.genre;
      }
      console.log("search: ", search)

      return Book.find(search).populate('author')
    },
    allAuthors: async () => {
      return Author.find({})
    }
  },
  Author: {
    bookCount: async (root) => {
      const count = await Book.collection.countDocuments({ author: root._id });
      return count;
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      console.log("addBook resolver")
      const existingAuthor = await Author.findOne({ name: args.author });

      // Use existing author or create a new author
      let author
      if (existingAuthor) {
        author = existingAuthor
      } else {
        author = new Author({ name: args.author })
        await author.save()
      }

      // Create new book and include author object
      const book = new Book({
        title: args.title,
        author: author,
        published: args.published,
        genres: args.genres,
      })
      console.log("boook:", book)
      
      // Save book to database
      try {
        await book.save()
      } catch (error) {
      throw new GraphQLError('Saving book failed', {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.title,
          error
          }
        })
      }
      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      return author.save()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})