import { useState } from 'react'
import { KEY } from '../config.js';
import { RecipeCard } from '../components/RecipeCard';
import { PlusButton } from '../components/PlusButton.jsx';
import { Header } from '../components/Header.jsx';
import { LoadIngredients } from '../utils/LoadIngredients.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { PaginationFunction } from "../utils/PaginationFunction.jsx";

export const Ingredients = () => {
  const URL = 'https://api.spoonacular.com/recipes/findByIngredients';
  const [results, setResults] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [ingredientOrder, setIngredientOrder] = useState([]);

  const {currentPage, setCurrentPage, paginatedData, nPages} = PaginationFunction(results);

  const handleAddIngredient = () => {
    if (ingredient !== '') {
      setIngredientOrder([...ingredientOrder, ingredient]);
      setIngredient('');
    }
  }

  const fetchRecipes = async (userIngredients) => {
    try {
      const response = await fetch(`${URL}?apiKey=${KEY}&ingredients=${userIngredients}&number=100`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults([...data]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSearch = () => {
    const ingredientString = ingredientOrder.join(',+');
    fetchRecipes(ingredientString);
  }

  return(
    <div className='min-h-screen flex flex-col'>
      <Header /> 
      {/* Add Ingredients */}
      <main className='flex flex-grow'>
        <div className='flex w-1/4 bg-red-300 rounded-t-md'>
          <div className='flex flex-col w-full p-4'>
            <div className='text-center'>
              Add Ingredients
            </div>
            <div className='flex justify-between gap-2'>  
              <div className='w-4/5'>
                <div className='flex mb-2'>
                  <label>Ingredient:</label>
                </div>
                <input
                  type='text'
                  className='border rounded w-full p-2 h-10'
                  onChange={(e) => setIngredient(e.target.value)}
                  value={ingredient}
                  placeholder='Enter Ingredients'
                />
              </div>
              <div className='flex items-center'>
                <PlusButton handleAddIngredient={handleAddIngredient} />
              </div>
            </div>
            <LoadIngredients ingredientOrder={ingredientOrder} setIngredientOrder={setIngredientOrder} />
            <div>
              <button onClick={handleSearch}>Find Recipes</button>
            </div>
          </div>
        </div>
        {/* Load Recipes */}
        <div className='mt-2 px-10 grow'>
          <div className='grid grid-cols-5 gap-5 h-5/6'>
            {results &&
              paginatedData.map((res, id) => {
                return (
                  <div key={id} className='flex justify-center'>
                    <RecipeCard title={res.title} img={res.image} recipeId={res.id}/>
                  </div>
                )
              })
            }
          </div>
          <div className=''>
            {results.length > 0 ?
              (
                <Pagination currentPage={currentPage} nPages={nPages} setCurrentPage={setCurrentPage} />
              ) : (
                ''
              )
            }
          </div>
        </div>
      </main>
    </div>
  )
}