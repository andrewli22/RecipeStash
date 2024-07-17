import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { KEY } from '../config';
import DOMPurify from 'dompurify';
import { BackButton } from '../components/BackButton';

export const RecipePage = () => {
  const { recipeId, title } = useParams();
  const [info, setInfo] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [dietary, setDietary] = useState([]);
  const [directions, setDirections] = useState();
  const [numServing, setNumServing] = useState();

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
        original: item.original.replace(/^[–-]\s*/, '').trim(),
        image: item.image
      }));
      console.log(getIngredients);
      const sanitiseInstructions = DOMPurify.sanitize(recipeInfo.instructions);
      const instructionArr = sanitiseInstructions
        .replaceAll(/(<([^>]+)>)/ig, '')
        .split('.')
        .filter(instruction => instruction.trim() !== '' && !/^\d+$/.test(instruction.trim()))
        .map(instruction => instruction.trim());
      instructionArr.pop();
      setDirections(instructionArr);
      setInfo(getRecipeInfo);
      setIngredients(getIngredients);
      setDietary(recipeInfo.diets);
      setNumServing(recipeInfo.servings);
    } catch (error) {
      console.log(error);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipeInfo();
  }, [fetchRecipeInfo]);

  return (
    <div className='flex flex-col'>
      {/* <div className='flex justify-end'>
      </div> */}
      <div className='flex justify-between items-center w-full'>
        <div className='w-1/3'></div>
        <div className='text-3xl flex-grow text-center'>
          {title}
        </div>
        <div className='w-1/3 flex justify-end'>
          <BackButton />
        </div>
      </div>
      {info &&
        <div>
          <div className='flex justify-center items-center'>
            <img className='h-1/4 w-1/4 mr-5' src={info.image} alt={`${title} image`} />
            <div className='flex justify-center gap-3'>
              <div>Health Score: {info.healthScore}</div>
              <div>Cooking Time: {info.time} {info.time < 2 ? 'min' : 'mins'}</div>
              <div>Serving Size: {info.servingSize}</div>
            </div>
          </div>
          <div className='ml-5'>
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