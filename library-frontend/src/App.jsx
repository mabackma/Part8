import { useState, useEffect } from 'react'
import Navigate from './components/Navigate'
import LoginForm from './components/LoginForm'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import Notify from './components/Notify'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, GET_USER_INFO } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [favorite, setFavorite] = useState('')
  const [page, setPage] = useState('authors')
  const [authors, setAuthors] = useState([])
  const [books, setBooks] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  const userInfoQuery = useQuery(GET_USER_INFO)
  const authorsQuery = useQuery(ALL_AUTHORS)
  const booksQuery = useQuery(ALL_BOOKS)

  // Set books and authors
  useEffect(() => {
    if (!authorsQuery.loading && !booksQuery.loading) {
      setAuthors(authorsQuery.data.allAuthors)
      setBooks(booksQuery.data.allBooks)
    }
  }, [authorsQuery, booksQuery])

  // Fetch favorite genre
  useEffect(() => {
    if (userInfoQuery.data && userInfoQuery.data.me) {
      const favoriteGenre = userInfoQuery.data.me.favoriteGenre
      if (favoriteGenre) {
        setFavorite(favoriteGenre)
      }
    }
  }, [userInfoQuery, setFavorite])

  // Refetch user's favorite genre when token changes
  useEffect(() => {
    if (token) {
      userInfoQuery.refetch()
    }
  }, [token, userInfoQuery])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Navigate token={token} setToken={setToken} setFavorite={setFavorite} setPage={setPage}/>
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} authors={authors} setError={notify}/>
      <Books show={page === 'books'} books={books}/>
      <NewBook show={page === 'add'} setError={notify}/>
      <Recommend show={page === 'recommend'} favorite={favorite} books={books} />
      <LoginForm setToken={setToken} setError={notify} show={page === 'login'} setPage={setPage} />
    </div>
  )
}

export default App
