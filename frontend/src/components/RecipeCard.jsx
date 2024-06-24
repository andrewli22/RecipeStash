import { Link } from "react-router-dom"

export const RecipeCard = ({ title, img, recipeId }) => {
  return (
    <Link to={`/recipe/${recipeId}/${title}`}>
      <div className='flex flex-col border border-solid rounded w-56 h-56 shadow-md'>
        <div className='border-solid'>
          <img src={img} alt={`${title} image`}/>
        </div>
        <div className='flex justify-center items-center h-full'>
          {title}
        </div>
      </div>
    </Link>
  )
}