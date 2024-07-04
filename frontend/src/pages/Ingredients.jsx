import { BackButton } from '../components/BackButton'
import { useState, useEffect, useRef } from 'react'
import { KEY } from '../config.js';
import { RecipeCard } from '../components/RecipeCard';
import { DeleteButton } from '../components/DeleteButton.jsx';
import { PlusButton } from '../components/PlusButton.jsx';
import { EditButton } from '../components/EditButton.jsx';

export const Ingredients = () => {
  const URL = 'https://api.spoonacular.com/recipes/findByIngredients';
  const [results, setResults] = useState([]);
  const [ingredientList, setIngredientList] = useState({});
  const [ingredient, setIngredient] = useState('');
  const [measurement, setMeasurement] = useState('Units');
  const [quantity, setQuantity] = useState('');
  const [edit, setEdit] = useState(false);

  const ingredientRef = useRef(null);
  const quantityRef = useRef(null);

  const handleAddIngredient = () => {
    const quant = quantity + ' ' + measurement;
    setIngredientList({...ingredientList, [ingredient]: quant});
    setIngredient('');
    setQuantity('');
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

  const handleEdit = () => {
    setEdit(!edit);
    // if (edit) {
    //   ingredientRef.current.focus();
    //   quantityRef.current.focus();
    // }
  }

  const handleDelete = () => {

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
                  className='border-y border-l rounded-l w-full p-2 z-20'
                  onChange={(e) => setQuantity(e.target.value)}
                  value={quantity}
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
              <PlusButton handleAddIngredient={handleAddIngredient} />
            </div>
          </div>
          <div className='flex justify-center items-center h-full w-14'>
            <button className='h-full w-full border border-black rounded' onClick={() => console.log(ingredientList)}>Search</button>
          </div>
        </div>
      </div>
      {/* Load Ingredients */}
      <div className='flex flex-col gap-2 items-center'>
        {Object.keys(ingredientList).map((objKey, index) => {
          return (
            <div className='flex w-1/3 gap-5' key={index}>
              <div
                className='flex w-full items-center justify-center p-1 border rounded-lg h-9'
              >
                <input
                  type='text'
                  className='w-full h-full text-sm font-semibold p-2 mr-2'
                  value={objKey}
                  disabled={!edit}
                  ref={ingredientRef}
                />
                <input
                  type='text'
                  className='w-full h-full text-sm font-semibold p-2'
                  value={ingredientList[objKey]}
                  disabled={!edit}
                  ref={quantityRef}
                />
              </div>
              <div className='flex gap-2'>
                <DeleteButton handleDelete={handleDelete}/>
                <EditButton handleEdit={handleEdit} />
              </div>
            </div>
          );
        })}
      </div>
      
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