import { useState, useEffect, useMemo } from "react"
import { KEY } from "../config.js";
import { RecipeCard } from "../components/RecipeCard";
import { Header } from "../components/Header.jsx";
import { Pagination } from "../components/Pagination.jsx";

export const Recipes = () => {
  const URL = "https://api.spoonacular.com/recipes/complexSearch";
  const [dish, setDish] = useState("");
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  useEffect(() => {
    try {
      const getLastSearch = localStorage.getItem("lastSearch");
      const getLastSearchArr = JSON.parse(getLastSearch);
      setResults([...getLastSearchArr]);
    } catch (e) {
      console.log(e.message);
    }
  }, [])

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
      console.log(dish);
      const response = await fetch(`${URL}?query=${dish}&apiKey=${KEY}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (!data.results.length) {
        setNoResults(true);
      }
      setResults([...data.results]);
      localStorage.setItem("lastSearch", JSON.stringify(data.results));
      setDish("");
    } catch (error) {
      console.error(error);
    }
  }

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  return(
    // Container
    <div className='h-full flex flex-col'>
      <Header />
      {/* Search recipe */}
      <div className='flex flex-col gap-5 justify-center'>
        {/* Header */}
        <div>
          Search for Recipes
        </div>
        <div className='flex justify-center items-center'>
          <input
            type='text'
            className='border border-black rounded w-1/3 p-2 mx-5'
            value={dish}
            onChange={(e) => setDish(e.target.value)}
            onKeyDown={(e) => handleEnter(e)}
            placeholder='Enter dish'
          />
          {/* Button to search */}
          <div className='h-full'>
            <button
              className='border border-black rounded p-1 h-full'
              onClick={() => handleSearch()}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {/* Load Recipes */}
      <div className='mt-5 mx-20'>
        <div className={`flex flex-wrap ${noResults ? 'justify-center' : ''} gap-10`}>
          {results && noResults ?
            (
              <div>There were no results found...</div>
            )
            :
            (
              results.map((res, id) => {
                return (
                  <RecipeCard key={id} title={res.title} img={res.image} recipeId={res.id}/>
                )
              })
            )
          }
        </div>
      </div>
    </div>
  )
}