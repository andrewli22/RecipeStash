export const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

  const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

  const goToNextPage = () => {
    if(currentPage !== nPages) setCurrentPage(currentPage + 1)
  }
  const goToPrevPage = () => {
    if(currentPage !== 1) setCurrentPage(currentPage - 1)
  }
  return (
    <nav className='flex justify-center my-5'>
      <ul className='pagination justify-center flex gap-5'>
        <li className='p-1'>
          <a
            onClick={goToPrevPage} 
            href='#'>
            Previous
          </a>
        </li>
        {pageNumbers.map(pgNumber => (
          <li key={pgNumber} 
            className= {
              `${currentPage == pgNumber ? 'bg-amber-400' : ''}
              border-solid
              w-6
              hover:bg-amber-200
              rounded-lg
              p-1`
            }>
            <a onClick={() => setCurrentPage(pgNumber)}  
             
              href='#'>
              {pgNumber}
            </a>
          </li>
        ))}
        <li className='p-1'>
          <a
            onClick={goToNextPage}
            href='#'>
            Next
          </a>
        </li>
      </ul>
    </nav>
  )
}