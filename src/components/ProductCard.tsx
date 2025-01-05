import { Link } from "react-router-dom";
interface ProductCardProps {
  id: number
  name: string
  price: number
  description: string
  tags: string[]
  image: string
  liked: boolean
  toggleLiked: () => void
}

function ProductCard({ id, name, price, description, tags, image, liked, toggleLiked }: ProductCardProps) {

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      {/* Full-size Placeholder Image */}
      <div className="bg-gray-200 h-56 w-full rounded mb-4 flex items-center justify-center">
        <img src={image} alt={name} className="h-56 object-cover" />
      </div>

      {/* Details */}
      <h3 className="font-bold">{name}</h3>
      <p className="text-gray-900 font-semibold">${price}</p>
      <p className="text-sm text-gray-400 mb-2 line-clamp-1">{description}</p>

      {/* Labels */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="py-1.5 px-2 bg-gray-200 rounded text-sm cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Like and Cart Icons */}
      <div className="flex justify-between mt-4 text-sm">
        <button
          className={`transition-colors flex items-center gap-1 ${liked ? "text-red-500" : "text-gray-600"
            }`}
          onClick={toggleLiked}
        >
          <span>{liked ? "❤️" : "🤍"}</span>
          <span>Like</span>
        </button>

        <Link
          to={`/product/${id}`}
          className="text-gray-600 flex items-center gap-1"
        >
          <span>🛒</span>
          <span>Buy Now</span>
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
