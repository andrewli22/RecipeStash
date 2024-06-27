import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { KEY } from '../config';
import DOMPurify from 'dompurify';

export const RecipePage = () => {
  const { recipeId, title } = useParams();
  const [info, setInfo] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [dietary, setDietary] = useState([]);
  const [directions, setDirections] = useState();

  const fetchRecipeInfo = useCallback(async () => {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${KEY}`);
      const recipeInfo = await response.json();
      const getRecipeInfo = {
        credits: recipeInfo.creditsText,
        healthScore: recipeInfo.healthScore,
        image: recipeInfo.image,
        time: recipeInfo.readyInMinutes,
        servingSize: recipeInfo.servings
      };

      const getIngredients = recipeInfo.extendedIngredients.map((item) => ({
        original: item.original,
        image: item.image
      }));

      const sanitiseInstructions = DOMPurify.sanitize(recipeInfo.instructions);
      const instructionArr = sanitiseInstructions.replaceAll(/(<([^>]+)>)/ig, '').split('.');
      instructionArr.pop();
      setDirections(instructionArr);
      setInfo(getRecipeInfo);
      setIngredients(getIngredients);
      setDietary(recipeInfo.diets);
    } catch (error) {
      console.log(error);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipeInfo();
  }, [fetchRecipeInfo]);

  return (
    <div className='flex flex-col'>
      <div className='text-3xl'>
        {title}
      </div>
      {info &&
        <div>
          <div className='flex justify-center'>
            <img src={info.image} alt={`${title} image`} />
          </div>
          <div className='ml-5'>
            <div className='flex justify-center gap-3'>
              <div>Health Score: {info.healthScore}</div>
              <div>Cooking Time: {info.time}</div>
              <div>Serving Size: {info.servingSize}</div>
            </div>
            <div className='flex text-xl'>Ingredients:</div>
            <div className='ml-5 w-1/2'>
              <ul className='list-disc'>
                {ingredients.map((item, id) => {
                  return (
                    <li className='text-left mb-2' key={id}>
                      {item.original}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className=' flex text-xl'>Instructions</div>
            <div className='ml-5 w-full'>
              <ol className='list-decimal'>
                {directions.map((instrct, id) => {
                  return (
                    <li key={id} className='text-left mb-2'>{instrct}</li>
                  )
                })}
              </ol>
            </div>
          </div>
        </div>
      }
    </div>
  )
}