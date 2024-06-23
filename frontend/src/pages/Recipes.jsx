import { BackButton } from "../components/BackButton"
import { useState } from "react"
import { KEY } from "../config.js";
import { RecipeCard } from "../components/RecipeCard";

export const Recipes = () => {
  const URL = "https://api.spoonacular.com/recipes/complexSearch";
  const [dish, setDish] = useState("");
  const [results, setResults] = useState([]);
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  const handleSearch = () => {
    fetchRecipes(dish);
    setDish("");
  }

  const fetchRecipes = async (dish) => {
    try {
      const response = await fetch(`${URL}?apiKey=${KEY}&query=${dish}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults([...data.results]);
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
        <div>
          <input
            type="text"
            className='border border-black rounded w-1/3 p-2'
            onChange={(e) => setDish(e.target.value)}
            onKeyDown={(e) => handleEnter(e)}
          />
        </div>
        {/* Button to search */}
        <div>
          <button
            className='border border-black rounded p-1'
            onClick={() => handleSearch()}
          >
            Search
          </button>
        </div>
      </div>
      {/* Load Recipes */}
      <div className='mt-2 mx-20'>
        <div className='flex flex-wrap gap-10'>
          {results &&
            results.map((res, id) => {
              return (
                <RecipeCard title={res.title} img={res.image} recipeId={res.id}/>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}