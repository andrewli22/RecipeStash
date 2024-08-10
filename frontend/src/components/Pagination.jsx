export const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

  const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

  const goToNextPage = () => {
          if(currentPage !== nPages) setCurrentPage(currentPage + 1)
  }
  const goToPrevPage = () => {
      if(currentPage !== 1) setCurrentPage(currentPage - 1)
  }
  return (
    <nav className='flex justify-center my-8'>
      <ul className='pagination justify-content-center flex gap-5'>
        <li className="page-item">
          <a className="page-link" 
            onClick={goToPrevPage} 
            href='#'>
            Previous
          </a>
        </li>
        {pageNumbers.map(pgNumber => (
          <li key={pgNumber} 
            className= {`page-item ${currentPage == pgNumber ? 'active' : ''} border-solid`} >
            <a onClick={() => setCurrentPage(pgNumber)}  
              className='page-link' 
              href='#'>
              {pgNumber}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a className="page-link" 
            onClick={goToNextPage}
            href='#'>
            Next
          </a>
        </li>
      </ul>
    </nav>
  )
}