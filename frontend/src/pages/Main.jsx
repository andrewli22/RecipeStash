import { Link } from "react-router-dom"
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { KEY } from "../config";
import { RecipeCard } from "../components/RecipeCard";

export const Main = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const getRecipes = async () => {
      const res = await fetch(`https://api.spoonacular.com/recipes/random?number=10&apiKey=${KEY}`)
                    .then(res => res.json());
      setRecipes(res.recipes);
    }
    getRecipes();
  },[]);
  localStorage.clear();
  return (
    <div className='h-full flex flex-col'>
      <Header />
      <div className='flex flex-col gap-2 h-full'>
        <div className='flex justify-center'>
          <p>
            Search by:
          </p>
        </div>
        <div className='flex justify-center gap-10'>
          <Link to={'/recipe'}>
            <button className='btn-primary'>Recipes</button>
          </Link>
          <Link to={'/ingredients'}>
            <button className='btn-primary'>Ingredients</button>
          </Link>
        </div>
        <div className='flex flex-col'>
          <div className='text-2xl mt-5'>
            Recipes
          </div>
          <div className='flex flex-wrap gap-5 justify-center'>
            {recipes &&
              recipes.map((curr, idx) => {
                return (
                  <RecipeCard key={idx} title={curr.title} img={curr.image} recipeId={curr.id} />
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}