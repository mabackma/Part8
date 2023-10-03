import { useState, useEffect } from 'react'
import Navigate from './components/Navigate'
import LoginForm from './components/LoginForm'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import Notify from './components/Notify'
import { useQuery, useSubscription, useApolloClient } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, GET_USER_INFO, BOOK_ADDED } from './queries'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving a book with same title twice
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [favorite, setFavorite] = useState(null)
  const [page, setPage] = useState('authors')
  const [authors, setAuthors] = useState([])
  const [books, setBooks] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [filter, setFilter] = useState(null)

  const userInfoQuery = useQuery(GET_USER_INFO)
  const authorsQuery = useQuery(ALL_AUTHORS)
  const booksQuery = useQuery(ALL_BOOKS)

  const client = useApolloClient()
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
      setPage('books')
    }
  })

  // Set books and authors
  useEffect(() => {  
    if (!authorsQuery.loading && !booksQuery.loading) {
      setAuthors(authorsQuery.data.allAuthors)

      const variables = { genre: filter }
      booksQuery.refetch(variables).then((result) => {
        setBooks(result.data.allBooks);
      })
    }
  }, [authorsQuery, booksQuery, filter])

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
      <Navigate token={token} setToken={setToken} setFilter={setFilter} favorite={favorite} setFavorite={setFavorite} setPage={setPage}/>
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} authors={authors} token={token} setError={notify}/>
      <Books show={page === 'books'} books={books} setFilter={setFilter}/>
      <NewBook show={page === 'add'} setError={notify}/>
      <Recommend show={page === 'recommend'} books={books} />
      <LoginForm setToken={setToken} setError={notify} show={page === 'login'} setPage={setPage} />
    </div>
  )
}

export default App
