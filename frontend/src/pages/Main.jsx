import { Link } from "react-router-dom"

export const Main = () => {
  localStorage.clear();
  return (
    <div className='h-full flex flex-col'>
      <header className='flex p-5 mb-5'>
        <Link to={'/'}>
          <h1 className='text-3xl'>Recipe Heaven</h1>
        </Link>
      </header>
      <div className='flex flex-col gap-2 h-full'>
        <div>
          <p>
            Search by:
          </p>
        </div>
        <div className='flex justify-center gap-10'>
          <Link to={'/recipe'}>
            <button className='btn-primary'>Recipes</button>
          </Link>
          <Link to={'/ingredients'}>
            <button className='btn-primary'>Ingredients</button>
          </Link>
        </div>
      </div>
    </div>
  )
}