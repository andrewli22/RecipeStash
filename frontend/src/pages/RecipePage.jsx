import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { KEY } from '../config';
import { Header } from '../components/Header';
import DOMPurify from 'dompurify';

export const RecipePage = () => {
  const { recipeId, title } = useParams();
  const [recipeData, setRecipeData] = useState({
    info: null,
    ingredients: [],
    dietary: [],
    directions: [],
  });
  
  const fetchRecipeInfo = useCallback(async () => {
    try {
      const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${KEY}`);
      const recipeInfo = await response.json();
      const { creditsText, healthScore, image, readyInMinutes, servings, extendedIngredients, instructions, diets } = recipeInfo;
      console.log("here");
      const sanitiseInstructions = DOMPurify.sanitize(instructions);
      const instructionArr = sanitiseInstructions
        .replaceAll(/<[^>]+>/g, '')
        .split('.')
        .filter(instruction => instruction.trim() !== '' && !/^\d+$/.test(instruction.trim()))
        .map(instruction => instruction.trim());

      setRecipeData({
        info: {
          credits: creditsText,
          healthScore: healthScore,
          image: image,
          time: readyInMinutes,
          servingSize: servings
        },
        ingredients: extendedIngredients.map(({ original }) => 
          original.replace(/^[–-]\s*/, '').trim()
        ),
        dietary: diets,
        directions: instructionArr.slice(0, -1),
        numServing: servings
      });
    } catch (error) {
      console.log(error);
    }
  }, [recipeId]);

  useEffect(() => {
    fetchRecipeInfo();
  }, []);

  return (
    <div>
      <Header />
      <main className='flex flex-col items-center justify-center mx-60'>
        <div className='flex justify-between items-center w-full'>
          <div className='text-3xl flex-grow text-center'>
            {title}
          </div>
        </div>
        {recipeData.info && (
          <section>
            <div className='flex justify-between items-center my-5 mx-10'>
              <img className='h-1/4 w-1/4 mr-5' src={recipeData.info.image} alt={`${title} image`} />
              <div className='flex justify-center gap-3 mr-20'>
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
              </div>
            </div>
            <div className='flex flex-col items-center ml-5'>
              <div className='flex text-xl justify-center'>Ingredients</div>
              <div className='flex justify-center border rounded-md p-3 w-1/2 my-5'>
                <div className='flex flex-col'>
                  <div onClick={() => console.log(recipeData)}>
                    Serving Size
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center h-full w-8'>
                      <button
                        title='Increase Serving'
                        onClick={() => setRecipeData(prevData => ({
                          ...prevData,
                          info: {
                            ...prevData.info,
                            servingSize: Math.max(1, prevData.info.servingSize - 1)
                          }
                        }))}
                        className='group cursor-pointer outline-none h-full border-2 hover:bg-slate-300 rounded-full flex justify-center items center w-full'
                      >
                        -
                      </button>
                    </div>
                    <div className='h-full text-2xl'>
                      {recipeData.info.servingSize}
                    </div>
                    <div className='flex items-center h-full w-8'>
                      <button
                        title='Decrease Serving'
                        onClick={() => setRecipeData(prevData => ({
                          ...prevData,
                          info: {
                            ...prevData.info,
                            servingSize: prevData.info.servingSize + 1
                          }
                        }))}
                        className='group cursor-pointer outline-none h-full border-2 hover:bg-slate-300 rounded-full flex justify-center items center w-full'
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full ml-10'>
                <ul className='grid grid-cols-2 list-disc'>
                  {recipeData.ingredients.map((item, id) => {
                    return (
                      <li className='text-left mb-2' key={id}>
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className='flex justify-center text-xl'>Instructions</div>
            <div className='ml-10 w-full'>
              <ol className='list-decimal'>
                {recipeData.directions.map((instruction, id) => {
                  return (
                    <li key={id} className='text-left mb-2'>{instruction}</li>
                  )
                })}
              </ol>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}