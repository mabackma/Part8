import { useState } from 'react'

const Filters = ({setFilter}) => {
  return (
    <div>
      <button onClick={() => setFilter('refactoring')}>refactoring</button>
      <button onClick={() => setFilter('agile')}>agile</button>
      <button onClick={() => setFilter('patterns')}>patterns</button>
      <button onClick={() => setFilter('design')}>design</button>
      <button onClick={() => setFilter('crime')}>crime</button>
      <button onClick={() => setFilter('classic')}>classic</button>
      <button onClick={() => setFilter('')}>all genres</button>
    </div>
  )
} 

const Books = (props) => {
  const [filter, setFilter] = useState('')

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books.filter((b) => filter === '' || b.genres.includes(filter)).map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Filters setFilter={setFilter}/>
    </div>
  )
}

export default Books
