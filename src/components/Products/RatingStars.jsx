import { Star } from 'lucide-react'

const RatingStars = ({ rating = 0, onRate = null, size = 'md', interactive = false }) => {
  const stars = [1, 2, 3, 4, 5]
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }[size]

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          className={`transition-all ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Star
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-2">
          {rating}.0
        </span>
      )}
    </div>
  )
}

export default RatingStars
