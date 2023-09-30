import { useApolloClient } from '@apollo/client'

const Navigate = ({token, setToken, setFavorite, setPage}) => {
    const client = useApolloClient()
    const logout = () => {
      setToken(null)
      setFavorite('')
      localStorage.clear()
      client.resetStore()
      setPage('authors')
    }

    if(token) {
      return (
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommend')}>recommend</button>
          <button onClick={logout}>logout</button>
        </div>
      )
    }
    return (
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
      </div>
    )
  }

  export default Navigate