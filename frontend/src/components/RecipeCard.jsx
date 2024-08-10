import { Link } from "react-router-dom"

export const RecipeCard = ({ title, img, recipeId }) => {
  return (
    <Link to={`/recipe/${recipeId}/${title}`}>
      <div className='flex flex-col border border-solid rounded w-52 h-52 shadow-md'>
        <div className='h-2/3 overflow-hidden'>
          <img src={img} alt={`${title} image`} className='w-full h-full object-cover'/>
        </div>
        <div className='flex justify-center items-center h-1/3 p-2'>
          <p className='text-center overflow-hidden overflow-ellipsis line-clamp-2'>
            {title}
          </p>
        </div>
      </div>
    </Link>
  )
}