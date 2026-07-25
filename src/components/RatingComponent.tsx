import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingComponentProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export default function RatingComponent({
  rating,
  size = 'md',
  interactive = false,
  onRatingChange,
  showValue = true,
  reviewCount,
  className = '',
}: RatingComponentProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      setSelectedRating(starRating);
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoveredRating(starRating);
    }
  };

  const handleStarLeave = () => {
    if (interactive) {
      setHoveredRating(0);
    }
  };

  const currentRating = interactive ? selectedRating : rating;
  const displayRating = hoveredRating > 0 ? hoveredRating : currentRating;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="flex items-center gap-1"
        onMouseLeave={handleStarLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= displayRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            }`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
          />
        ))}
      </div>
      
      {showValue && (
        <div className="flex items-center gap-1">
          <span className={`font-medium ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          }`}>
            {currentRating.toFixed(1)}
          </span>
          {reviewCount && (
            <span className={`text-gray-500 ${
              size === 'sm' ? 'text-xs' : 'text-sm'
            }`}>
              ({reviewCount})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function RatingStars({ rating, size = 'md', className = '' }: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
