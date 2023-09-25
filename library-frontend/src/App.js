import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [authors, setAuthors] = useState([])
  const [books, setBooks] = useState([])

  const authorsQuery = useQuery(ALL_AUTHORS)
  const booksQuery = useQuery(ALL_BOOKS)

  useEffect(() => {
    if (!authorsQuery.loading && !booksQuery.loading) {
      setAuthors(authorsQuery.data.allAuthors)
      setBooks(booksQuery.data.allBooks)
    }
  }, [authorsQuery, booksQuery])

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors show={page === 'authors'} authors={authors}/>

      <Books show={page === 'books'} books={books}/>

      <NewBook show={page === 'add'}/>
    </div>
  )
}

export default App
