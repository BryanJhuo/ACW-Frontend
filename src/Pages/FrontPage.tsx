import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProductCard from "../components/ProductCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 宣告產品型別
interface Product {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  liked: boolean;
}

const FrontPage = () => {
  const [searchText, setSearchText] = useState(""); // 搜尋文字
  const [products, setProducts] = useState<Product[]>([]); // 儲存商品資料
  const token = localStorage.getItem("authToken");
  // 假設這是後端回傳的精選商品資料
  const slides = [
    {
      src: "https://cms.cdn.91app.com/images/compress/40809/72755d45-b6ac-4cc6-8c80-ba8b58804583-1732846378-60rkvqagil_m_1920x980.webp",
      link: "https://example.com/page1",
    },
    {
      src: "https://cms.cdn.91app.com/images/compress/40809/72755d45-b6ac-4cc6-8c80-ba8b58804583-1733279402-6i5l1zorx8_m_1920x980.webp",
      link: "https://example.com/page2",
    },
    {
      src: "https://cms.cdn.91app.com/images/compress/40809/72755d45-b6ac-4cc6-8c80-ba8b58804583-1699239031-gn4q60paoi_m_1920x980.webp",
      link: "https://example.com/page3",
    },
    {
      src: "https://cms.cdn.91app.com/images/original/40809/72755d45-b6ac-4cc6-8c80-ba8b58804583-1656397804-pfdg8v35in_m_1200x613_800x408_400x204.jpg",
      link: "https://example.com/page3",
    },
    {
      src: "https://cms.cdn.91app.com/images/original/40809/72755d45-b6ac-4cc6-8c80-ba8b58804583-1676623142-o5kvux8gaj_m_1200x613_800x408_400x204.jpg",
      link: "https://example.com/page3",
    }
  ];


  // 取得商品資料

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/product/list?random=true");
        const data = response.data;

        const tagResponse = await axios.get("http://localhost:8080/api/tag/list");
        const tagsData = tagResponse.data;

        // 定義後端回傳的商品型別
        interface ProductFromAPI {
          id: number;
          name: string;
          description: string;
          price?: number;
          tags: number[];
          image_url?: {
            String: string;
            Valid: boolean;
          };
        }

        const tagDictionary = tagsData.reduce((acc: { [key: number]: string }, tag: { id: number, name: string }) => {
          acc[tag.id] = tag.name;
          return acc;
        }, {});

        const cleanedData = data.map((product: ProductFromAPI) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price || 0,
          tags: product.tags.map((tagId: number) => tagDictionary[tagId] || `Tag ${tagId}`),
          image: (product.image_url?.String || ''),  // 使用可選鏈運算子
          liked: false,
        }));

        if (!token) return;

        const likedResponse = await axios.get("http://localhost:8080/api/favorite/list", {
          headers: { Authorization: `${token}` }
        });
        const likedData = likedResponse.data;

        const updatedData = cleanedData.map((item: Product) => ({
          ...item,
          liked: likedData === null ? false : likedData.some((likedItem: { id: number }) => likedItem.id === item.id),
        }));
        setProducts(updatedData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [token]);

  const handleLike = async (productId: number) => {
    if (!token) {
      alert("請先登入");
      window.location.href = "/auth";
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/favorite/add?product_id=${productId}`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, liked: !product.liked } : product
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem("authToken"); // 刪除 token
          window.location.href = "/auth"; // 跳轉到登入頁面
          return;
        }
        if (err.response.data.error === "Product is already in favorite") {
          try {
            await axios.delete(
              `http://localhost:8080/api/favorite/delete?product_id=${productId}`,
              {
                headers: {
                  Authorization: `${token}`,
                },
              }
            );
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product.id === productId ? { ...product, liked: !product.liked } : product
              )
            );
          } catch (deleteErr) {
            if (axios.isAxiosError(deleteErr) && deleteErr.response) {
              alert(`刪除錯誤: ${deleteErr.response.data.error}`);
            } else {
              alert("刪除錯誤: 未知錯誤");
            }
          }
        } else {
          alert(`錯誤: ${err.response.data.error}`);
        }
      } else {
        alert("網絡錯誤，請稍後再試");
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header searchText={searchText} onSearchChange={setSearchText} />
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        direction="horizontal"
        navigation
        pagination={{
          clickable: true,
          renderBullet: (_, className) =>
            `<span class="${className} bg-gray-400 w-4 h-4 rounded-full mx-1 transition-transform transform scale-100"></span>`,
        }}
        autoplay={{ delay: 5000 }}
        loop
        className="w-5/6 h-1/1 swiper-custom"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <a href={slide.link} target="_blank" rel="noopener noreferrer">
              <img
                src={slide.src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles */}
      <style>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background-color: lightgray;
          border: 2px solid white;
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background-color: blue !important;
          transform: scale(1.5);
          border: 3px solid white;
          box-shadow: 0 0 10px blue, 0 0 20px blue;
          transition: all 0.3s ease;
        }

        .swiper-button-next,
        .swiper-button-prev {
          background: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          color: white;
          font-size: 20px;
        }
      `}</style>

      {/* 精選商品 */}
      <div className="w-full max-w-7xl mt-9">
        <div className="flex justify-between items-center">
          <h2 className="text-left text-2xl font-bold mb-4">精選商品</h2>
          <a
            href="/shop" // 替換成實際的更多商品頁面路徑
            className="text-blue-600 font-semibold hover:text-blue-800 flex items-center text-2xl"
          >
            更多商品
            <span className="ml-2 text-3xl">{'>'}</span>
          </a>
        </div>

        <div className="relative overflow-x-auto">
          <div className="flex gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0" // 移除w-1/4，這樣寬度不會依照父元素的比例來調整
                style={{ width: '250px' }} // 設定固定寬度
              >
                <ProductCard
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  tags={product.tags}
                  liked={product.liked}
                  toggleLiked={() => handleLike(product.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 更多商品按鈕 */}
        <div className="flex justify-center mt-8">
          <a
            href="/shop" // 替換成實際的更多商品頁面路徑
            className="bg-blue-600 text-white py-3 px-8 rounded-full text-xl font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            更多商品
          </a>
        </div>
      </div>
      <div className="mb-8"></div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FrontPage;