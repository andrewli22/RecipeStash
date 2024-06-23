import { useParams } from 'react-router';

export const RecipePage = () => {
  const recipeId = useParams().recipeId;
  return (
    <div>
      Recipe Page {recipeId}
    </div>
  )
}