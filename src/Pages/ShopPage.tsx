import { useState, useEffect } from "react"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import ProductGrid from "../components/ProductGrid"
import Header from "../components/Header"
import Footer from "../components/Footer"
import axios from 'axios'
import { useLocation } from "react-router-dom"

function ShopPage() {
  const location = useLocation();
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [totalPages, setTotalPages] = useState(Math.ceil(items.length / 6))
  const [priceRange, setPriceRange] = useState([0, 0])
  const [tags, setTags] = useState([])
  const [disabledTags, setDisabledTags] = useState<number[]>([])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const search = params.get("search") || ""
    setSearchText(search)
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/product/list")
        let data = response.data
        data = data.filter((item: any) => item.disability === false)

        const tagResponse = await axios.get("http://localhost:8080/api/tag/list")
        const tagsData = tagResponse.data

        interface ProductFromAPI {
          id: number
          name: string
          description: string
          price?: number
          tags: number[]
          image_url?: {
            String: string
            Valid: boolean
          }
        }

        interface TagFromAPI {
          id: number
          name: string
          type: number
        }

        const tagDictionary = tagsData.reduce(
          (acc: { [key: number]: string }, tag: { id: number; name: string }) => {
            acc[tag.id] = tag.name
            return acc
          },
          {}
        )

        let cleanedData = data.map((product: ProductFromAPI) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price || 0,
          tags: product.tags.map((tagId: number) => tagDictionary[tagId] || `Tag ${tagId}`),
          tagsId: product.tags,
          image: product.image_url?.String || '',
          liked: false,
          toggleLiked: () => {
            console.log("Please login first")
            window.location.href = "/auth"
          }
        }))

        const cleanedTag = tagsData.map((tag: TagFromAPI) => ({
          id: tag.id,
          name: tag.name,
          type: tag.type,
        }))

        if (search) {
          cleanedData = cleanedData.filter((item: any) => item.name.includes(search))
        }

        setItems(cleanedData)
        setFilteredItems(cleanedData)
        setTags(cleanedTag)
        setTotalPages(Math.ceil(cleanedData.length / 6))
        setCurrentPage(cleanedData.length === 0 ? 0 : 1)
        setPriceRange([0, Math.max(...cleanedData.map((item: any) => item.price))])

        const token = localStorage.getItem("authToken")
        if (!token) return

        const likedResponse = await axios.get("http://localhost:8080/api/favorite/list", {
          headers: { Authorization: `${token}` }
        })
        const likedData = likedResponse.data

        const updatedData = cleanedData.map((item: any) => ({
          ...item,
          liked: likedData === null ? false : likedData.some((likedItem: any) => likedItem.id === item.id),
          toggleLiked: async () => {
            if (!token) {
              console.error("Please login first")
              window.location.href = "/auth"
              return
            }
            const isCurrentlyLiked = item.liked
            try {
              await axios.post(`http://localhost:8080/api/favorite/add?product_id=${item.id}`, {}, {
                headers: { Authorization: `${token}` }
              })
              setItems((prevItems: any) =>
                prevItems.map((prevItem: any) =>
                  prevItem.id === item.id ? { ...prevItem, liked: !isCurrentlyLiked } : prevItem
                )
              )
            } catch (error) {
              alert("你已經收藏過，若要取消收藏，請到喜歡列表頁面解除收藏")
            }
          }
        }))
        setItems(updatedData)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    updateItems()
  }, [disabledTags, priceRange])

  useEffect(() => {
    updateItems(false)
  }, [items])

  useEffect(() => {
    setTotalPages(filteredItems.length === 0 ? 0 : Math.ceil(filteredItems.length / 6))
  }, [filteredItems])

  const handleSearchChange = (text: string) => {
    setSearchText(text)
  }

  const updateItems = (toFirstPage = true) => {
    setFilteredItems(
      [...items]
        .filter((item: any) => disabledTags.every((tagId: number) => !item.tagsId.includes(tagId)))
        .filter((item: any) => item.price >= priceRange[0] && item.price <= priceRange[1])
    )
    if (toFirstPage) setCurrentPage(1)
  }

  const toggleTag = (tagId: number) => {
    setDisabledTags((prev: number[]) => {
      if (prev.includes(tagId)) return prev.filter((id: number) => id !== tagId)
      else return [...prev, tagId]
    })
  }

  return (
    <>
      <Header searchText={searchText} onSearchChange={handleSearchChange} />

      <div className="flex bg-gray-50 min-h-min flex-1 p-6 container mx-auto max-w-6xl">
        <aside className="w-64 bg-white p-4 border rounded-xl shadow-sm">
          <h2 className="font-bold mb-4 font-funnel-sans text-lg">Filter</h2>
          <hr className="mb-2"></hr>
          <div className="mb-4">
            <p className="font-medium mb-2 font-funnel-sans">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className={`px-2 py-1 rounded text-sm cursor-pointer font-funnel-sans ${disabledTags.includes(tag.id) ? 'bg-red-100' : 'bg-green-100'}`}
                  onClick={() => {
                    toggleTag(tag.id)
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <p className="font-medium mb-2 font-funnel-sans">Price</p>
              <p className="text-sm text-gray-500 font-funnel-sans">
                ${priceRange[0]} ~ ${priceRange[1]}
              </p>
            </div>
            <Slider
              range
              min={0}
              max={Math.max(...items.map((item: any) => item.price))}
              value={priceRange}
              onChange={(value: number | number[]) => {
                if (Array.isArray(value)) {
                  setPriceRange(value)
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

        <div className="flex-1 p-6">
          <div className="flex justify-center space-x-2 pb-4">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => {
                setItems([...items].sort((a: any, b: any) => b.price - a.price))
                updateItems()
              }}
            >
              價格由高到低
            </button>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => {
                setItems([...items].sort((a: any, b: any) => a.price - b.price))
                updateItems()
              }}
            >
              價格由低到高
            </button>
          </div>

          <ProductGrid
            items={filteredItems.slice((currentPage - 1) * 6, currentPage * 6)}
          />

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