import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { KEY } from '../config';
import DOMPurify from 'dompurify';

export const RecipePage = () => {
  const { recipeId, title } = useParams();
  const [info, setInfo] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [dietary, setDietary] = useState([]);
  const fetchRecipeInfo = useCallback(async () => {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${KEY}`);
      const recipeInfo = await response.json();
      const getRecipeInfo = {
        credits: recipeInfo.creditsText,
        healthScore: recipeInfo.healthScore,
        image: recipeInfo.image,
        instructions: recipeInfo.instructions,
        time: recipeInfo.readyInMinutes,
        servingSize: recipeInfo.servings
      };

      const getIngredients = recipeInfo.extendedIngredients.map((item) => ({
        original: item.original,
        image: item.image
      }));
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

  const sanitiseInstruction = (instructions) => {
    return DOMPurify.sanitize(instructions);
  }

  const removeTag = (htmlString) => {
    console.log(typeof htmlString);
    console.log(htmlString);
    return htmlString.replace(/<ol[^>]*>[\s\S]*?<\/ol>/ig,'')  
  }

  return (
    <div className='flex flex-col'>
      <div className='text-3xl'>
        {title}
      </div>
      <button onClick={() => console.log(removeTag(sanitiseInstruction(info.instructions)))}>test</button>
      {info &&
        <div>
          <div className='flex justify-center'>
            <img src={info.image} alt={`${title} image`} />
          </div>
          <div className='ml-5'>
            <div className='flex gap-3'>
              <div>Health Score: {info.healthScore}</div>
              <div>Cooking Time: {info.time}</div>
              <div>Serving Size: {info.servingSize}</div>
            </div>
            <div className='flex text-xl'>Ingredients:</div>
            <div>
              <ul className='flex flex-col gap-2 w-1/2 ml-5'>
                {ingredients.map((item, id) => {
                  return (
                    <li className='flex' key={id}>
                      {item.original}
                    </li>
                  );
                })}
              </ul>
              <div/>
            </div>
            <div className=' flex text-xl'>Instructions</div>
          </div>
        </div>
      }
    </div>
  )
}