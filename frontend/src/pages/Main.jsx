import { Link } from "react-router-dom"

export const Main = () => {
  return (
    <div className='h-full flex flex-col justify-center gap-2'>
      <div>
        <p>Recipe Finder</p>
      </div>
      <div>
        <p>
          Search by
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
  )
}