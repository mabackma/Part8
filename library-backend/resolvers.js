const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const Author = require('./models/author')
const Book = require('./models/book')

const pubsub = new PubSub()

const resolvers = {
    Query: {
      me: (root, args, context) => {
        return context.currentUser
      },
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
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        const existingAuthor = await Author.findOne({ name: args.author })
        
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

        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return book
      },
      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        const author = await Author.findOne({ name: args.name })
        author.born = args.setBornTo
        return author.save()
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
    
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      }
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
      },
    }
  }
  
  module.exports = resolvers