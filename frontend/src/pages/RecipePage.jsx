import { useParams } from 'react-router';

export const RecipePage = () => {
  const { recipeId, title } = useParams();
  return (
    <div>
      {title}
    </div>
  )
}