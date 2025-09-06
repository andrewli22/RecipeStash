import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { Header } from '../components/Header.jsx';
import { Pagination } from '../components/Pagination.jsx';
import { PaginationFunction } from '../utils/PaginationFunction.jsx';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const { currentPage, setCurrentPage, paginatedData, nPages } = PaginationFunction(results);

  const searchUrl = useMemo(() => 
    `https://api.spoonacular.com/recipes/complexSearch?number=100&apiKey=${import.meta.env.VITE_API_KEY}`,
    []
  );

  const fetchRecipes = useCallback(async (query) => {
    if (!query.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${searchUrl}&query=${encodeURIComponent(query)}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        setNoResults(true);
        setResults([]);
      } else {
        setNoResults(false);
        setResults(data.results);
      }
      
      localStorage.setItem('lastSearch', JSON.stringify(data.results || []));
      setCurrentPage(1); // Reset to first page for new search
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to search recipes. Please try again.');
        console.error('Recipe search error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [searchUrl, setCurrentPage]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      fetchRecipes(searchQuery.trim());
    }
  }, [searchQuery, setSearchParams, fetchRecipes]);

  // Load initial search results if query exists
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      fetchRecipes(query);
    } else {
      // Load last search from localStorage if no query
      try {
        const lastSearch = localStorage.getItem('lastSearch');
        if (lastSearch) {
          const lastSearchData = JSON.parse(lastSearch);
          setResults(lastSearchData || []);
        }
      } catch (e) {
        console.log('Error loading last search:', e.message);
      }
    }
  }, [searchParams, fetchRecipes]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      
      <main className='flex flex-col'>
        {/* Search Section */}
        <section className='bg-white py-12 px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-8'>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight'>
                Search Recipes
              </h1>
              <p className='text-gray-600 text-lg'>
                Find your perfect recipe from thousands of options
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className='mb-8'>
              <div className='flex max-w-2xl mx-auto'>
                <input
                  type='text'
                  placeholder='Search recipes or ingredients...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-1 px-6 py-4 text-lg border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                />
                <button
                  type='submit'
                  className='px-8 py-4 bg-green-600 text-white font-semibold rounded-r-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500'
                >
                  Search
                </button>
              </div>
            </form>

            {/* Back to Home */}
            <div className='text-center'>
              <button
                onClick={() => navigate('/')}
                className='text-green-600 hover:text-green-700 font-medium transition-colors duration-200'
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className='py-12 px-4'>
          <div className='max-w-7xl mx-auto'>
            {searchParams.get('q') && (
              <h2 className='text-3xl font-bold text-gray-800 mb-8'>
                Results for '{searchParams.get('q')}'
              </h2>
            )}

            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-8 text-center'>
                <p className='text-red-600 mb-4'>{error}</p>
                <button
                  onClick={() => fetchRecipes(searchQuery)}
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
                <p className='mt-4 text-gray-600 text-lg'>Searching for recipes...</p>
              </div>
            ) : noResults ? (
              <div className='text-center py-20'>
                <div className='w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center'>
                  <svg className='w-12 h-12 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' />
                  </svg>
                </div>
                <p className='text-gray-500 text-xl'>No recipes found</p>
                <p className='text-gray-400 mt-2'>Try searching with different keywords</p>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                  {paginatedData.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      title={recipe.title}
                      img={recipe.image}
                      recipeId={recipe.id}
                    />
                  ))}
                </div>

                {results.length > 0 && nPages > 1 && (
                  <div className='mt-12'>
                    <Pagination 
                      currentPage={currentPage} 
                      nPages={nPages} 
                      setCurrentPage={setCurrentPage} 
                    />
                  </div>
                )}
              </>
            )}

            {!loading && !error && !noResults && results.length === 0 && searchParams.get('q') && (
              <div className='text-center py-20'>
                <div className='w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center'>
                  <svg className='w-12 h-12 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' />
                  </svg>
                </div>
                <p className='text-gray-500 text-xl'>Start your search above</p>
                <p className='text-gray-400 mt-2'>Enter ingredients or recipe names to find delicious recipes</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};