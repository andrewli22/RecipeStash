import { BackButton } from "../components/BackButton"
import { useState } from "react"
import { KEY } from "../config";
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
    console.log(dish);
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
    <div className='h-full flex flex-col gap-3'>
      <div className='flex justify-end'>
        <BackButton />
      </div>
      <div className='flex flex-col gap-3'>
        <div>
          Search for recipe by dish
        </div>
        <div className='flex flex-col justify-center items-center gap-5'>
          <input
            type='text'
            className='border border-solid w-2/3 p-2 rounded'
            placeholder='Enter name of dish'
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            onKeyDown={(e) => handleEnter(e)}
          />
          <button
            className='border border-solid w-20 rounded p-1'
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div className='flex flex-wrap h-screen gap-2 justify-center'>
        {results &&
          results.map((recipe, id) => {
            return (
              <RecipeCard key={id} title={recipe.title} img={recipe.image} recipeId={recipe.id} />      
            )
          })
        }
      </div>
      <button onClick={() => console.log(results)}>test</button>
    </div>
  )
}