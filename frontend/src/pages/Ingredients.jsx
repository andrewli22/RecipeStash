import { BackButton } from "../components/BackButton"
import { useState, useEffect } from "react"
import { KEY } from "../config.js";
import { RecipeCard } from "../components/RecipeCard";

export const Ingredients = () => {
  const URL = "https://api.spoonacular.com/recipes/complexSearch";
  const [dish, setDish] = useState("");
  const [results, setResults] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      // handleSearch();
      handleIngredientList();
    }
  }

  const handleIngredientList = () => {
    
  }
  const handleSearch = () => {
    // fetchRecipes(dish);
    // setDish("");
  }

  const fetchRecipes = async (dish) => {
    try {
      const response = await fetch(`${URL}?apiKey=${KEY}&query=${dish}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults([...data.results]);
      localStorage.setItem("lastSearch", JSON.stringify(data.results));
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
        <div className='flex justify-center items-center'>
          <input
            type="text"
            className='border border-black rounded w-1/3 p-2 mx-6'
            onChange={(e) => setDish(e.target.value)}
            onKeyDown={(e) => handleEnter(e)}
            placeholder='Enter Ingredients'
          />
          <div className='flex justify-center items-center h-full w-14'>
            <button className='h-full w-full border border-black rounded'>Enter</button>
          </div>
        </div>
      </div>
      {/* Load Ingredients */}
      <div className='w-24'>
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
              stroke-width='2'
              stroke-linejoin='round'
              stroke-linecap='round'
            />
          </svg>
          Delete
        </button>
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