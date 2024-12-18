import { useState } from "react"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import ProductGrid from "../components/ProductGrid"
import Header from "../components/Header"
import Footer from "../components/Footer"

function ShopPage() {
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  // TODO : fetch items from API
  const [items, setItems] = useState(Array.from({ length: 10 }, (_, index) => ({
    id: index,
    name: "Text",
    price: index,
    tags: ["tag1", "tag2"],
    description: "Body text.",
    image: "https://placehold.co/400",
    liked: false,
    toggleLiked: () => {
      // TODO : call API to toggle liked status
      setItems((prevItems) => prevItems.map((item) => {
        if (item.id === index)
          return { ...item, liked: !item.liked }
        return item
      }))
    }
  })))
  const [totalPages, setTotalPages] = useState(Math.ceil(items.length / 6))
  const [priceRange, setPriceRange] = useState([0, Math.max(...items.map((item) => item.price))])

  // 當文字改變時更新 searchText
  const handleSearchChange = (text: string) => {
    setSearchText(text)
  }

  return (
    <>
      <Header searchText={searchText} onSearchChange={handleSearchChange} />

      <div className="flex bg-gray-50 min-h-min flex-1 p-6 container mx-auto max-w-6xl">

        {/* Filter Panel */}
        <aside className="w-64 bg-white p-4 border rounded-xl shadow-sm">
          <h2 className="font-bold mb-4 font-funnel-sans text-lg">Filter</h2>
          <hr className="mb-2"></hr>
          {/* TODO : Tags */}
          <div className="mb-4">
            <p className="font-medium mb-2 font-funnel-sans">Tags</p>
            <div className="flex flex-wrap gap-2">
              {["Smart", "Modern"].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-200 rounded text-sm cursor-pointer font-funnel-sans"
                >
                  {tag} ✕
                </span>
              ))}
            </div>
            {/* TODO : Select tag section */}
          </div>
          {/* Price Range */}
            <div className="mb-4">
            <div className="flex justify-between items-center">
              <p className="font-medium mb-2 font-funnel-sans">Price</p>
              <p className="text-sm text-gray-500 font-funnel-sans">${priceRange[0]} ~ ${priceRange[1]}</p>
            </div>
            <Slider
              range
              min={0}
              max={Math.max(...items.map((item) => item.price))}
              value={priceRange}
              onChange={(value: number | number[]) => {
              if (Array.isArray(value)) {
                setPriceRange(value)
                setCurrentPage(1)
                setTotalPages(Math.ceil(items.filter((item) => item.price >= value[0] && item.price <= value[1]).length / 6))
              }
              }}
              trackStyle={[{ backgroundColor: '#000000', height: '4px' }]}
              handleStyle={[
              { backgroundColor: '#000000', borderColor: '#000000', height: '14px', width: '14px' },
              { backgroundColor: '#000000', borderColor: '#000000', height: '14px', width: '14px' }
              ]}
              railStyle={{ backgroundColor: '#cbd5e1', height: '4px' }}
            />
            </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-center space-x-2 pb-4">
            <button className="px-2 py-1 border rounded"
              onClick={() => setItems([...items].sort((a, b) => b.price - a.price))}>價格由高到低</button>
            <button className="px-2 py-1 border rounded"
              onClick={() => setItems([...items].sort((a, b) => a.price - b.price))}>價格由低到高</button>
          </div>

          {/* Product Grid */}
          <ProductGrid items={items.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1]).slice((currentPage - 1) * 6, currentPage * 6)} />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              className={`px-2 py-1 border rounded ${currentPage === 1 ? 'opacity-50' : ''}`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              &larr; Previous
            </button>

            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>

            <button
              className={`px-2 py-1 border rounded ${currentPage === totalPages ? 'opacity-50' : ''}`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ShopPage
