import { Link } from "react-router-dom";
import { useState, useCallback } from "react";

export const RecipeCard = ({ title, img, recipeId, time }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Calculate and display cooking time on the recipe card
  const formatTime = (minutes) => {
    if (!minutes) {
      return '';
    }
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Set the colour of the cooking time based on time needed to prepare meal
  const getTimeBadgeColor = (minutes) => {
    if (!minutes) {
      return '';
    } else if (minutes <= 20) {
      return 'bg-green-600';
    } else if (minutes <= 45) {
      return 'bg-yellow-500';
    }
    return 'bg-orange-500';
  };

  return (
    <Link to={`/recipe/${recipeId}/${title}`}>
      <div className='rounded-2xl shadow-lg overflow-hidden hover:shadow-xl duration-300 hover:-translate-y-1 w-full max-w-sm mx-auto'>
        {/* Image Container */}
        <div className='relative h-48'>
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Recipe Image */}
          <img 
            src={hasError ? '/placeholder-recipe.jpg' : img} 
            alt={`${title} image`} 
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* Time Badge */}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-medium shadow-md ${getTimeBadgeColor(time)}`}>
            {formatTime(time)}
          </div>
          
          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-500 text-xs">Image unavailable</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='p-4'>
          <h3 className='text-center text-gray-800 font-semibold line-clamp-2'>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};