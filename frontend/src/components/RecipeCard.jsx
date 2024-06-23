import { Link } from "react-router-dom"

export const RecipeCard = ({ title, img, recipeId }) => {
  return (
    <div className='flex flex-col border border-solid w-1/4 h-1/3'>
      <Link to={`/recipe/${recipeId}`}>
        <div className='flex-1 border border-solid'>
          <img src={img} alt={`${title} image`}/>
        </div>
        <div className='flex-2 border border-solid'>{title}</div>
      </Link>
    </div>
  )
}