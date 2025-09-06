import { useState, useEffect } from 'react';
import { KEY } from '../config.js';
import { RecipeCard } from '../components/RecipeCard';
import { PlusButton } from '../components/PlusButton.jsx';
import { Header } from '../components/Header.jsx';
import { LoadIngredients } from '../utils/LoadIngredients.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { PaginationFunction } from '../utils/PaginationFunction.jsx';

export const Ingredients = () => {
  const URL = 'https://api.spoonacular.com/recipes/findByIngredients';
  const [results, setResults] = useState(() => {
    const savedResults = localStorage.getItem('ingredientSearchResults');
    return savedResults ? JSON.parse(savedResults) : [];
  });
  const [ingredient, setIngredient] = useState('');
  const [ingredientOrder, setIngredientOrder] = useState(() => {
    const savedIngredients = localStorage.getItem('searchedIngredients');
    return savedIngredients ? JSON.parse(savedIngredients) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { currentPage, setCurrentPage, paginatedData, nPages } = PaginationFunction(results);

  // Save to localStorage whenever results or ingredients change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem('ingredientSearchResults', JSON.stringify(results));
    }
  }, [results]);

  useEffect(() => {
    if (ingredientOrder.length > 0) {
      localStorage.setItem('searchedIngredients', JSON.stringify(ingredientOrder));
    } else {
      // Clear localStorage when no ingredients
      localStorage.removeItem('searchedIngredients');
      localStorage.removeItem('ingredientSearchResults');
    }
  }, [ingredientOrder]);

  const handleAddIngredient = (e) => {
    e?.preventDefault();
    if (ingredient.trim() !== '') {
      setIngredientOrder([...ingredientOrder, ingredient.trim()]);
      setIngredient('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddIngredient(e);
    }
  };

  const fetchRecipes = async (userIngredients) => {
    try {
      setLoading(true);
      setError(null);
      // If user exits page whilst a request is being made, abort the request.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(
        `${URL}?apiKey=${KEY}&ingredients=${userIngredients}&number=100`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setResults([...data]);
      setCurrentPage(1); // Reset to first page when new search
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError('Failed to fetch recipes. Please try again.');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (ingredientOrder.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }
    const ingredientString = ingredientOrder.join(',+');
    fetchRecipes(ingredientString);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      
      <main className='flex max-w-7xl mx-auto px-4 py-8 gap-8'>
        {/* Sidebar - Add Ingredients */}
        <aside className='w-80 flex-shrink-0'>
          <div className='bg-white rounded-2xl shadow-lg p-5 sticky top-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              Add Ingredients
            </h2>
            
            {/* Input Section */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Enter Ingredient
              </label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  className='flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  onChange={(e) => setIngredient(e.target.value)}
                  value={ingredient}
                  placeholder='e.g. chicken, tomatoes...'
                  onKeyDown={handleKeyPress}
                />
                <button
                  onClick={handleAddIngredient}
                  className='px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z' clipRule='evenodd' />
                  </svg>
                </button>
              </div>
            </div>

            {/* Added Ingredients */}
            <div className='mb-6'>
              <LoadIngredients 
                ingredientOrder={ingredientOrder} 
                setIngredientOrder={setIngredientOrder} 
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={ingredientOrder.length === 0 || loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                ingredientOrder.length === 0 || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:-translate-y-0.5 shadow-lg'
              }`}
            >
              {loading ? (
                <div className='flex items-center justify-center'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                  Searching...
                </div>
              ) : (
                'Find Recipes'
              )}
            </button>

            {/* Ingredient Counter */}
            {ingredientOrder.length > 0 && (
              <div className='mt-4 text-center text-sm text-gray-600'>
                {ingredientOrder.length} ingredient{ingredientOrder.length !== 1 ? 's' : ''} added
              </div>
            )}
          </div>
        </aside>

        {/* Main Content - Recipe Results */}
        <div className='flex-1'>
          {/* Error Message */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
              <div className='flex items-center'>
                <svg className='w-5 h-5 text-red-500 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                </svg>
                <span className='text-red-600'>{error}</span>
              </div>
            </div>
          )}

          {/* Results Header */}
          {results.length > 0 && (
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-gray-800'>
                Recipe Results
              </h2>
              <p className='text-gray-600 mt-1'>
                Found {results.length} recipes with your ingredients
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <div className='w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin'></div>
              <p className='mt-4 text-gray-600 text-lg'>Finding recipes with your ingredients...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              {/* Recipe Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
                {paginatedData.map((res) => (
                  <div key={res.id} className='flex justify-center'>
                    <RecipeCard 
                      title={res.title} 
                      img={res.image} 
                      recipeId={res.id}
                      time={res.readyInMinutes}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {nPages > 1 && (
                <div className='flex justify-center'>
                  <Pagination 
                    currentPage={currentPage} 
                    nPages={nPages} 
                    setCurrentPage={setCurrentPage} 
                  />
                </div>
              )}
            </>
          ) : !loading && ingredientOrder.length > 0 ? (
            /* No Results */
            <div className='text-center py-20'>
              <div className='w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center'>
                <svg className='w-12 h-12 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-600 mb-2'>No recipes found</h3>
              <p className='text-gray-500'>Try different ingredients or remove some to get more results.</p>
            </div>
          ) : (
            /* Initial State */
            <div className='text-center py-20'>
              <div className='w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center'>
                <svg className='w-12 h-12 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-600 mb-2'>Start by adding ingredients</h3>
              <p className='text-gray-500'>Add ingredients from your kitchen and we'll find recipes you can make!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};