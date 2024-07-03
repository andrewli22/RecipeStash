import { BackButton } from '../components/BackButton'
import { useState, useEffect } from 'react'
import { KEY } from '../config.js';
import { RecipeCard } from '../components/RecipeCard';

export const Ingredients = () => {
  const URL = 'https://api.spoonacular.com/recipes/complexSearch';
  const [results, setResults] = useState([]);
  const [ingredients, setIngredients] = useState({});
  const [measurement, setMeasurement] = useState('Units');
  const [quantity, setQuantity] = useState('');
  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleIngredientList(e.target.value);
      e.currentTarget.value = '';
    }
  }

  const handleIngredientList = (ingredient) => {
    console.log(ingredient);
    console.log(measurement);
    setIngredients({...ingredients, [ingredient]: measurement});
  }

  const handleQuantity = (e) => {
    const quantity = e.target.value + ' ' + measurement;
    console.log(quantity);
  }

  const handleSearch = () => {

  }

  const fetchRecipes = async (dish) => {
    try {
      const response = await fetch(`${URL}?apiKey=${KEY}&query=${dish}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults([...data.results]);
      localStorage.setItem('lastSearch', JSON.stringify(data.results));
    } catch (error) {
      console.error(error);
    }
  }

  return(
    // Container
    <div className='h-full flex flex-col'>
      {/* Back button */}
      <div className='flex justify-end mx-5'>
        <BackButton />
      </div>
      {/* Search recipe */}
      <div className='flex flex-col gap-5'>
        {/* Header */}
        <div>
          Search for Recipes
        </div>
        <div className='flex flex-col justify-center items-center gap-3 mx-40 p-5 rounded'>
          <div className='flex w-2/3 justify-between'>
            <div className='w-2/3'>
              <div className='flex mb-2'>
                <label>Ingredient:</label>
              </div>
              <input
                type='text'
                className='border rounded w-full p-2'
                onKeyDown={(e) => handleEnter(e)}
                placeholder='Enter Ingredients'
              />
            </div>
            <div className='w-1/5'>
              <div className='flex mb-2'>
                <label>Quantity:</label>
              </div>
              <div className='flex items-center'>
                <input
                  type='text'
                  className='border-y border-l rounded-l w-full p-2 z-20'
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <select
                  className='border-y border-r rounded-r p-2 bg-white'
                  value={measurement}
                  onChange={(e) => setMeasurement(e.target.value)}
                >
                  <option value='units'>Units</option>
                  <option value='mL'>mL</option>
                  <option value='L'>L</option>
                  <option value='g'>g</option>
                  <option value='kg'>kg</option>
                </select>
              </div>
            </div>
            <div className='flex items-center'>
              <button
                title='Add New'
                className='group cursor-pointer outline-none mt-8'
                onClick={() => console.log(quantity + ' ' + measurement)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='40px'
                  height='40px'
                  viewBox='0 0 24 24'
                  className='stroke-black fill-none group-hover:fill-slate-300 group-active:duration-0 duration-300'
                >
                  <path
                    d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
                    strokeWidth='1'
                  ></path>
                  <path d='M8 12H16' strokeWidth='1'></path>
                  <path d='M12 16V8' strokeWidth='1'></path>
                </svg>
              </button>
            </div>
          </div>
          <div className='flex justify-center items-center h-full w-14'>
            <button className='h-full w-full border border-black rounded' onClick={() => console.log(ingredients)}>Search</button>
          </div>
        </div>
      </div>
      {/* Load Ingredients */}
      {/* <div className='w-24'>
        <button
          className='inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md w-full h-full'
        >
          <svg
            stroke='currentColor'
            viewBox='0 0 24 24'
            fill='none'
            className='h-5 w-5 mr-2'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              strokeWidth='2'
              strokeLinejoin='round'
              strokeLinecap='round'
            />
          </svg>
          Delete
        </button>
      </div> */}
      {/* Load Recipes */}
      <div className='mt-2 mx-20'>
        <div className='flex flex-wrap gap-10'>
          {results &&
            results.map((res, id) => {
              return (
                <RecipeCard key={id} title={res.title} img={res.image} recipeId={res.id}/>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}