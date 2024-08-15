import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { KEY } from '../config';
import { Header } from '../components/Header';
import DOMPurify from 'dompurify';

export const RecipePage = () => {
  const { recipeId, title } = useParams();
  const [recipeData, setRecipeData] = useState({
    info: null,
    dietary: [],
    directions: [],
  });
  const [ingredients, setIngredients] = useState([]);
  const [currServing, setCurrServing] = useState(0);

  const handleIngredientQuantity = (ingredients) => {
    // Convert fractions to decimals and string numbers to integers
    const fractRegex = /\d+\/\d+/;
    for (let i = 0; i < ingredients.length; i++) {
      let arr = ingredients[i].split(' ');
      for  (let j = 0; j < arr.length; j++) {
        if (!isNaN(arr[j])) {
          arr[j] = parseInt(arr[j]);
        }
        if (fractRegex.test(arr[j])) {
          arr[j] = convertToDecimal(arr[j]);
        }
      }
      if (!isNaN(arr[0]) && !isNaN(arr[1])) {
        arr[0] += arr[1];
        arr.splice(1,1);
      }
      ingredients[i] = arr;
    }
    return ingredients;
  }

  const convertToDecimal = (fraction) => {
    const parts = fraction.split("/");
    if (parts.length === 2) {
      const numerator = parseFloat(parts[0].trim());
      const denominator = parseFloat(parts[1].trim());
      return Math.round((numerator/denominator)*10)/10;
    }
    throw new Error('Invalid Fraction');
  }

  const fetchRecipeInfo = useCallback(async () => {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${KEY}`);
      const recipeInfo = await response.json();
      const { creditsText, healthScore, image, readyInMinutes, servings, extendedIngredients, instructions, diets } = recipeInfo;
      const sanitiseInstructions = DOMPurify.sanitize(instructions);
      const instructionArr = sanitiseInstructions
        .replaceAll(/<[^>]+>/g, '')
        .split('.')
        .filter(instruction => instruction.trim() !== '' && !/^\d+$/.test(instruction.trim()))
        .map(instruction => instruction.trim());

      let fetchedIngredients = extendedIngredients.map(({ original }) => 
        original.replace(/^[–-]\s*/, '').trim()
      );
      console.log(fetchedIngredients);
      fetchedIngredients = handleIngredientQuantity(fetchedIngredients);

      const updatedIngredients = fetchedIngredients.map(item => ({
        quantity: item[0],
        measurement: item[1],
        ingredient: item.slice(2).join(' ')
      }));

      setIngredients(updatedIngredients);
      setCurrServing(servings);
      setRecipeData({
        info: {
          credits: creditsText,
          healthScore: healthScore,
          image: image,
          time: readyInMinutes,
          servingSize: servings
        },
        dietary: diets,
        directions: instructionArr.slice(0, -1),
      });
    } catch (error) {
      console.log(error);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipeInfo();
  }, [fetchRecipeInfo]);

  const handleCalculateQuantity = (item) => {
    if (isNaN(item.quantity)) {
      return item.quantity;
    }
    let quant = Math.round(((item.quantity/recipeData.info.servingSize)*currServing)*10)/10;
    let prev = Math.round(((item.quantity/recipeData.info.servingSize)*(currServing+1))*10)/10;
    return quant > 0 ? quant : prev;
  }

  return (
    <div>
      <Header />
      <main className='flex flex-col items-center justify-center mx-60 bg-amber-100 rounded-lg p-5'>
        <div className='flex justify-between items-center w-full'>
          <div className='text-3xl flex-grow text-center'>
            {title}
          </div>
        </div>
        {recipeData.info && (
          <section>
            <div className='flex justify-evenly items-center my-5 mx-10'>
              <img className='h-1/4 w-1/4 mr-5' src={recipeData.info.image} alt={`${title} image`} />
              <div className='flex justify-evenly border rounded-md p-3 w-full max-w-md my-5 border-amber-500'>
                <div className='flex flex-col'>
                  <div>
                    Health Score
                  </div>
                  <div className='text-2xl'>
                    {recipeData.info.healthScore}
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div>
                    Cooking Time
                  </div>
                  <div className='text-2xl'>
                    {recipeData.info.time} {recipeData.info.time < 2 ? 'min' : 'mins'}
                  </div>
                </div>
                <div className='flex flex-col'>
                  <div onClick={() => console.log(ingredients)}>
                    Serving Size
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center h-full w-8'>
                      <button
                        title='Decrease Serving'
                        onClick={() => setCurrServing(Math.max(1, currServing-1))}
                        className='group cursor-pointer outline-none h-full hover:bg-slate-200 rounded-full flex justify-center items-center w-full bg-amber-500 text-lg'
                      >
                        -
                      </button>
                    </div>
                    <div className='h-full text-2xl'>
                      {currServing}
                    </div>
                    <div className='flex items-center h-full w-8'>
                      <button
                        title='Increase Serving'
                        onClick={() => setCurrServing(currServing + 1)}
                        className='group cursor-pointer outline-none h-full hover:bg-slate-200 rounded-full flex justify-center items-center w-full bg-amber-500 text-lg'
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section className='max-w-4l mx-auto px-5'>
              <div className='flex flex-col items-center'>
                <div className='text-xl mb-5'>Ingredients</div>
                <div className='w-full'>
                  <ul className='grid grid-cols-2 list-disc gap-x-28'>
                    {ingredients.map((item, id) => {
                      return (
                        <li className='text-left mb-2 pl-2' key={id}>
                          {handleCalculateQuantity(item)} {item.measurement} {item.ingredient}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </section>
            <section className='mt-8'>
              <div className='text-xl mb-5 text-center'>Instructions</div>
                <ol className='list-decimal pl-6'>
                  {recipeData.directions.map((instruction, id) => {
                    return (
                      <li key={id} className='text-left mb-2 pl-2'>{instruction}</li>
                    )
                  })}
                </ol>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}