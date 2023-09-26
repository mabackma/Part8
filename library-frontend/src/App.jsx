import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [authors, setAuthors] = useState([])
  const [books, setBooks] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  const authorsQuery = useQuery(ALL_AUTHORS)
  const booksQuery = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (!authorsQuery.loading && !booksQuery.loading) {
      setAuthors(authorsQuery.data.allAuthors)
      setBooks(booksQuery.data.allBooks)
    }
  }, [authorsQuery, booksQuery])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} authors={authors}/>
      <Books show={page === 'books'} books={books}/>
      <NewBook show={page === 'add'} setError={notify}/>
    </div>
  )
}

export default App
