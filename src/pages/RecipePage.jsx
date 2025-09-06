import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KEY } from '../config';
import { Header } from '../components/Header';
import DOMPurify from 'dompurify';

export const RecipePage = () => {
  const { recipeId, title } = useParams();
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = useState({
    info: null,
    dietary: [],
    directions: [],
  });
  const [ingredients, setIngredients] = useState([]);
  const [currServing, setCurrServing] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${KEY}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to load recipe. Please try again.');
        console.error('Recipe fetch error:', err);
      }
    } finally {
      setLoading(false);
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
    <div className='min-h-screen bg-gray-50'>
      <Header />
      
      <main className='flex flex-col'>
        {/* Hero Section */}
        <section className='bg-white p-5'>
          <div className='flex items-center justify-between mx-10'>
            <button
              onClick={() => navigate(-1)}
              className='flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200'
            >
              <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
              Back
            </button>
          </div>
          <div className='max-w-4xl mx-auto'>
            
            <h1 className='text-4xl md:text-5xl font-bold text-center mb-2'>
              {title}
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className='py-12 px-4'>
          <div className='max-w-6xl mx-auto'>
            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center'>
                <p className='text-red-600 mb-4'>{error}</p>
                <button
                  onClick={fetchRecipeInfo}
                  className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200'
                >
                  Try Again
                </button>
              </div>
            )}

            {loading ? (
              <div className='flex flex-col items-center justify-center py-20'>
                <div className='relative'>
                  <div className='w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin'></div>
                </div>
                <p className='mt-4 text-gray-600 text-lg'>Loading recipe...</p>
              </div>
            ) : recipeData.info && (
              <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                {/* Recipe Image and Stats */}
                <div className='lg:flex'>
                  <div className='lg:w-1/2 p-8 rounded-lg'>
                    <img 
                      className='w-full h-80 lg:h-96 object-cover' 
                      src={recipeData.info.image} 
                      alt={`${title} image`} 
                    />
                  </div>
                  <div className='lg:w-1/2 p-8'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                      <div className='text-center p-4 bg-green-50 rounded-lg'>
                        <div className='text-sm text-gray-600 mb-1'>Health Score</div>
                        <div className='text-3xl font-bold text-green-600'>
                          {recipeData.info.healthScore}
                        </div>
                      </div>
                      
                      <div className='text-center p-4 bg-blue-50 rounded-lg'>
                        <div className='text-sm text-gray-600 mb-1'>Cooking Time</div>
                        <div className='text-3xl font-bold text-blue-600'>
                          {recipeData.info.time}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {recipeData.info.time < 2 ? 'min' : 'mins'}
                        </div>
                      </div>
                      
                      <div className='text-center p-4 bg-purple-50 rounded-lg'>
                        <div className='text-sm text-gray-600 mb-2'>Serving Size</div>
                        <div className='flex items-center justify-center space-x-3'>
                          <button
                            title='Decrease Serving'
                            onClick={() => setCurrServing(Math.max(1, currServing-1))}
                            className='w-8 h-8 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 flex items-center justify-center font-semibold'
                          >
                            -
                          </button>
                          <div className='text-2xl font-bold text-purple-600 min-w-[3rem] text-center'>
                            {currServing}
                          </div>
                          <button
                            title='Increase Serving'
                            onClick={() => setCurrServing(currServing + 1)}
                            className='w-8 h-8 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 flex items-center justify-center font-semibold'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dietary Tags */}
                    {recipeData.dietary.length > 0 && (
                      <div className='mb-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-3'>Dietary Information</h3>
                        <div className='flex flex-wrap gap-2'>
                          {recipeData.dietary.map((diet, index) => (
                            <span 
                              key={index}
                              className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium'
                            >
                              {diet}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Ingredients Section */}
                <div className='p-8 border-t border-gray-200'>
                  <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Ingredients</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {ingredients.map((item, id) => (
                      <div key={id} className='flex items-center p-3 bg-gray-50 rounded-lg'>
                        <div className='w-3 h-3 bg-green-600 rounded-full mr-3 flex-shrink-0'></div>
                        <span className='text-gray-800'>
                          <span className='font-semibold text-green-600'>
                            {handleCalculateQuantity(item)} {item.measurement}
                          </span>
                          {' '}{item.ingredient}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Instructions Section */}
                <div className='p-8 border-t border-gray-200'>
                  <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Instructions</h2>
                  <div className='space-y-4'>
                    {recipeData.directions.map((instruction, id) => (
                      <div key={id} className='flex items-start p-4 bg-gray-50 rounded-lg'>
                        <div className='flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold mr-4 mt-1'>
                          {id + 1}
                        </div>
                        <p className='text-gray-800 leading-relaxed'>{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};