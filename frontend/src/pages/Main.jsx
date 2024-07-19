import { Link } from "react-router-dom"
import { Header } from "../components/Header";

export const Main = () => {
  localStorage.clear();
  return (
    <div className='h-full flex flex-col'>
      <Header />
      <div className='flex flex-col gap-2 h-full'>
        <div className='flex justify-center'>
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
      <footer className='flex justify-end p-5'>
        Made by Andrew Li
      </footer>
    </div>
  )
}