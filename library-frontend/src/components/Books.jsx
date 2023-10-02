const Filters = ({setFilter}) => {
  return (
    <div>
      <button onClick={() => setFilter('refactoring')}>refactoring</button>
      <button onClick={() => setFilter('agile')}>agile</button>
      <button onClick={() => setFilter('patterns')}>patterns</button>
      <button onClick={() => setFilter('design')}>design</button>
      <button onClick={() => setFilter('crime')}>crime</button>
      <button onClick={() => setFilter('classic')}>classic</button>
      <button onClick={() => setFilter(null)}>all genres</button>
    </div>
  )
} 

const Books = (props) => {

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
          {props.books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Filters setFilter={props.setFilter}/>
    </div>
  )
}

export default Books
