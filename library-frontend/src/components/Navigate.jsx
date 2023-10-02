import { useApolloClient } from '@apollo/client'

const Navigate = ({token, setToken, setFilter, favorite, setPage}) => {
    const client = useApolloClient()
    const logout = () => {
      setToken(null)
      setFilter(null)
      localStorage.clear()
      client.resetStore()
      setPage('authors')
    }

    if(token) {
      return (
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button
            onClick={() => {
              setPage('books');
              setFilter(null);
            }}
          >
            books
          </button>
          <button onClick={() => setPage('add')}>add book</button>
          <button
            onClick={() => {
              setPage('recommend');
              setFilter(favorite);
            }}
          >
            recommend
          </button>
          <button onClick={logout}>logout</button>
        </div>
      )
    }
    return (
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button
            onClick={() => {
              setPage('books');
              setFilter(null);
            }}
          >
            books
        </button>
        <button onClick={() => setPage('login')}>login</button>
      </div>
    )
  }

  export default Navigate