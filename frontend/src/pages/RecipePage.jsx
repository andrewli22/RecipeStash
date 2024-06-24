import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { KEY } from '../config';

export const RecipePage = () => {
  const { recipeId, title } = useParams();
  const [info, setInfo] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [dietary, setDietary] = useState([]);
  useEffect(() => {
    const getInfo = async () => {
      const recipeInfo = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${KEY}`)
        .then((res) => res.json())
      const getRecipeInfo = {
        credits: recipeInfo.creditsText,  
        healthScore: recipeInfo.healthScore,
        image: recipeInfo.image,
        instructions: recipeInfo.instructions,
        time: recipeInfo.readyInMinutes,
        servingSize: recipeInfo.servings
      }
      setInfo(getRecipeInfo);
      const getIngredients = recipeInfo.extendedIngredients.map((item) => ({
        original: item.original,
        image: item.image
      }))
      setIngredients([...getIngredients])
      setDietary(recipeInfo.diets);
    }
    getInfo();
  }, [])
  return (
    <div className='flex flex-col'>
      <div className='text-3xl'>
        {title}
      </div>
      <button onClick={() => console.log(info)}>test</button>
      <div className='flex justify-center'>
        <img src={info.image} alt={`${title} image`} />
      </div>
      <div className='ml-5'>
        <div className='flex gap-3'>
          <div>
            Health Score: {info.healthScore}
          </div>
          <div>Cooking Time: {info.time}</div>
          <div>Serving Size: {info.servingSize}</div>
        </div>
        <div className='flex text-xl'>
          Ingredients:
        </div>
        <div>Instructions</div>
      </div>
    </div>
  )
}