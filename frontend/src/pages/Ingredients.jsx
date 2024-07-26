import { BackButton } from '../components/BackButton'
import { useState, useEffect } from 'react'
import { KEY } from '../config.js';
import { RecipeCard } from '../components/RecipeCard';
import { DeleteButton } from '../components/DeleteButton.jsx';
import { PlusButton } from '../components/PlusButton.jsx';
import { EditButton } from '../components/EditButton.jsx';
import { ConfirmButton } from '../components/ConfirmButton.jsx';
import { Header } from '../components/Header.jsx';

export const Ingredients = () => {
  const URL = 'https://api.spoonacular.com/recipes/findByIngredients';
  const [results, setResults] = useState([]);
  const [ingredientList, setIngredientList] = useState({});
  const [ingredient, setIngredient] = useState('');
  const [ingredientOrder, setIngredientOrder] = useState([]);
  const [measurement, setMeasurement] = useState('Units');
  const [quantity, setQuantity] = useState('');
  const [editIngredient, setEditIngredient] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editMeasurement, setEditMeasurement] = useState('Units');
  const [editIdx, setEditIdx] = useState(null);

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

  const handleEdit = (idx, oldKey, quantity) => {
    console.log(oldKey);
    setEditIngredient(oldKey);
    const getNumeric = quantity.split(' ');
    setEditQuantity(getNumeric[0]);
    setEditIdx(idx);
  }

  const handleConfirmEdit = (oldKey) => {
    if (editIdx !== null) {
      setIngredientList(prevList => {
        const { [oldKey]: _, ...rest } = prevList;
        return {
          ...rest,
          [editIngredient]: `${editQuantity} ${editMeasurement}`
        };
      });

      setIngredientOrder(prevOrder => 
        prevOrder.map(key => key === oldKey ? editIngredient : key)
      );
    }
    setEditIdx(null);
    setEditIngredient('');
  }

  const handleDelete = (key) => {
    setIngredientList(prevList => {
      const { [key]: _, ...rest } = prevList;
      return rest;
    });
    setIngredientOrder(prevOrder => prevOrder.filter(item => item !== key));
  }

  useEffect(() => {
    if (editIdx !== null) {
      document.getElementById(`ingredient-input-${editIdx}`).focus();
    }
  }, [editIdx]);

  const handleSearch = () => {
    const ingredients = Object.keys(ingredientList);
    const ingredientString = ingredients.join(',+');
    fetchRecipes(ingredientString);
  }

  return(
    <div className='h-full flex flex-col'>
      {/* Back button */}
      <Header /> 
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
                  className='border-y border-r rounded-r bg-white p-2 h-10'
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
            <button className='h-full w-full border border-black rounded' onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
      {/* Load Ingredients */}
      <div className='flex flex-col gap-2 items-center'>
        {ingredientOrder.map((objKey, index) => {
          return (
            <div className='flex w-1/3 gap-5' key={index}>
              <div
                className='flex w-full items-center justify-center p-1 border rounded-lg h-8 gap-2'
              >
                <input
                  id={`ingredient-input-${index}`}
                  type='text'
                  className='w-full h-full text-sm font-semibold p-2'
                  onChange={(e) => setEditIngredient(e.target.value)}
                  value={index === editIdx ? editIngredient : objKey}
                  disabled={editIdx !== index}
                />
                <input
                  id={`quantity-input-${index}`}
                  type='text'
                  className='w-full h-full text-sm font-semibold p-2'
                  onChange={(e) => setEditQuantity(e.target.value)}
                  value={index === editIdx ? editQuantity : ingredientList[objKey]}
                  disabled={editIdx !== index}
                />
                {editIdx === index && (
                  <select
                  className='bg-white'
                  value={editMeasurement}
                  onChange={(e) => setEditMeasurement(e.target.value)}
                >
                  <option value='units'>Units</option>
                  <option value='mL'>mL</option>
                  <option value='L'>L</option>
                  <option value='g'>g</option>
                  <option value='kg'>kg</option>
                  </select>
                )}
              </div>
              <div className='flex gap-2'>
                <DeleteButton handleDelete={() => handleDelete(objKey)}/>
                {editIdx === index ? 
                  <ConfirmButton handleConfirmEdit={() => handleConfirmEdit(objKey)}/>
                  :
                  <EditButton handleEdit={() => handleEdit(index, objKey, ingredientList[objKey])}/>
                }
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