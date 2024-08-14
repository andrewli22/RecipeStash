import { useState } from 'react'
import { KEY } from '../config.js';
import { RecipeCard } from '../components/RecipeCard';
import { PlusButton } from '../components/PlusButton.jsx';
import { Header } from '../components/Header.jsx';
import { LoadIngredients } from '../utils/LoadIngredients.jsx';

export const Ingredients = () => {
  const URL = 'https://api.spoonacular.com/recipes/findByIngredients';
  const [results, setResults] = useState([]);
  const [ingredientList, setIngredientList] = useState({});
  const [ingredient, setIngredient] = useState('');
  const [ingredientOrder, setIngredientOrder] = useState([]);
  const [measurement, setMeasurement] = useState('Units');
  const [quantity, setQuantity] = useState('');

  const handleAddIngredient = () => {
    if (ingredient !== '' && quantity !== '') {
      const quant = quantity + ' ' + measurement;
      setIngredientList({...ingredientList, [ingredient]: quant});
      setIngredientOrder([...ingredientOrder, ingredient]);
      setIngredient('');
      setQuantity('');
    }
  }

  const fetchRecipes = async (userIngredients) => {
    try {
      const response = await fetch(`${URL}?apiKey=${KEY}&ingredients=${userIngredients}`);
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
    const ingredients = Object.keys(ingredientList);
    const ingredientString = ingredients.join(',+');
    fetchRecipes(ingredientString);
  }

  return(
    <div className='h-full flex flex-col'>
      <Header /> 
      {/* Add Ingredients */}
      <section className='flex w-2/6 h-screen bg-amber-100 rounded-md'>
        <div className='flex flex-col w-full h-full p-4'>
          <div className='text-center'>
            Add Ingredients
          </div>
          <div className='flex justify-between gap-2'>  
            <div className='w-3/5'>
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
            <div className='w-1/5'>
              <div className='flex mb-2'>
                <label>Quantity:</label>
              </div>
              <div className='flex items-center'>
                <input
                  type='text'
                  className='border-y border-l rounded-l w-full p-2 z-20 h-10'
                  onChange={(e) => setQuantity(e.target.value)}
                  value={quantity}
                />
                <select
                  className='border-y border-r rounded-r bg-white p-2 h-10 w-10'
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
              <PlusButton handleAddIngredient={handleAddIngredient} />
            </div>
          </div>
          <LoadIngredients ingredientOrder={ingredientOrder} ingredientList={ingredientList} setIngredientList={setIngredientList} setIngredientOrder={setIngredientOrder} />
        </div>
      </section>
      
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