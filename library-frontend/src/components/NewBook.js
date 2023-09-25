import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const CREATE_BOOK = gql`
mutation createBook($title: String!, $published: Int, $author: String!, $genres: [String!]) {
  addBook(
    title: $title,
    published: $published,
    author: $author,
    genres: $genres
  ) {
    title
    published
    author
    genres
  }
}
`

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [ createBook ] = useMutation(CREATE_BOOK)

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    console.log('add book...')

    // Update the server
    createBook({  variables: { title, published: Number(published), author, genres } })

    // Update the books state
    const newBook = {
      title: title,
      published: published,
      author: author,
      genres: genres
    }
    props.setBooks([...props.books, newBook])

    // Update the authors state
    const newAuthor = {
      name: author,
      bookCount: 1
    }
    if (!props.authors.some(a => a.name === newAuthor.name)) {
      props.setAuthors([...props.authors, newAuthor])
    }
    else {
      // If the author exists, update bookCount for existing user
      const updatedAuthors = props.authors.map(a => {
        if (a.name === newAuthor.name) {
          return {
            ...a,
            bookCount: a.bookCount + 1
          }
        }
      return a
      })
      props.setAuthors(updatedAuthors)
    }
    
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook