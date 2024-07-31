import { Link } from "react-router-dom"

export const Header = () => {
  return (
    <header className='flex justify-between items-center p-5 mb-5 bg-[#545855]'>
        <Link className='w-1/3' to={'/'}>
          <h1 className='text-3xl'>Recipe Heaven</h1>
        </Link>
      <div className='flex justify-evenly w-1/3'>
        <Link to={'/trending'}>
          <h1>Trending</h1>
        </Link>
        <Link>
          <h1>About</h1>
        </Link>
      </div>
    </header>
  )
}