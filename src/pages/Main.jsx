import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { RecipeCard } from '../components/RecipeCard';

export const Main = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recipes');

  // Memoized API URL to avoid recreating on every render
  const apiUrl = useMemo(() =>
    `https://api.spoonacular.com/recipes/random?number=12&apiKey=${import.meta.env.VITE_API_KEY}`,
    []
  );

  // Memoized fetch function to prevent unnecessary re-renders
  const getRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiUrl, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to fetch recipes. Please try again.');
        console.error('Recipe fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    getRecipes();
    localStorage.clear();
  }, [getRecipes]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  // Memoized recipe list to prevent unnecessary re-renders
  const recipeList = useMemo(() => {
    if (!recipes.length) {
      return null;
    }
    
    return recipes.map((recipe) => (
      <RecipeCard
        key={recipe.id}
        title={recipe.title}
        img={recipe.image}
        recipeId={recipe.id}
        time={recipe.readyInMinutes}
      />
    ));
  }, [recipes]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <main className='flex flex-col'>
        {/* Hero Section */}
        <section className='bg-white py-16 px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-5xl md:text-6xl font-bold mb-8'>
              Find Your Next Favorite Recipe
            </h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className='mb-8'>
              <div className='flex max-w-2xl mx-auto'>
                <input
                  type='text'
                  placeholder='Search recipes'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-1 p-3 text-lg border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                />
                <button
                  type='submit'
                  className='p-3 bg-green-600 text-white font-semibold rounded-r-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  Search
                </button>
              </div>
            </form>

            {/* Tab Buttons */}
            <div className='flex justify-center'>
              <div className='inline-flex bg-gray-100 rounded-lg p-1'>
                <Link to={'/recipe'}>
                  <button
                    onClick={() => setActiveTab('recipes')}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === 'recipes'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                    </svg>
                    Recipes
                  </button>
                </Link>
                <Link to={'/ingredients'}>
                  <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === 'ingredients'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z' clipRule='evenodd' />
                    </svg>
                    Ingredients
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Recipes Section */}
        <section className='py-16 px-4 bg-gray-50'>
          <div className='max-w-7xl mx-auto'>
            <h2 className='text-4xl font-bold text-gray-800 mb-12'>
              Trending Recipes
            </h2>

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center'>
                <p className='text-red-600 mb-4'>{error}</p>
                <button
                  onClick={getRecipes}
                  className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200'
                >
                  Try Again
                </button>
              </div>
            )}

            {loading ? (
              <div className='flex flex-col items-center justify-center py-20'>
                <div className='relative'>
                  <div className='w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin'></div>
                </div>
                <p className='mt-4 text-gray-600 text-lg'>Finding delicious recipes for you...</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                {recipeList}
              </div>
            )}

            {!loading && !error && recipes.length === 0 && (
              <div className='text-center py-20'>
                <div className='w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center'>
                  <svg className='w-12 h-12 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' clipRule='evenodd' />
                  </svg>
                </div>
                <p className='text-gray-500 text-xl'>No recipes found</p>
                <p className='text-gray-400 mt-2'>Try refreshing the page or check back later</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};