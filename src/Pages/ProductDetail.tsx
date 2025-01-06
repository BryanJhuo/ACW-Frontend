import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import ProductCard from "../components/ProductCard";

interface InputlayoutProps {
  label: string;
  remain: number;
}
interface ProductFromAPI {
  id: number;
  name: string;
  description: string;
  price: number;
  remain: number;
  tags: number[];
  image_url: {
    String: string;
    Valid: boolean;
  };
  vendor_announcement: string;
}

const Inputlayout: React.FC<InputlayoutProps & { onQuantityChange: (quantity: number) => void }> = ({ label, remain, onQuantityChange }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const haddleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= remain) {
      setQuantity(value);
      onQuantityChange(value);
    }
    else if (value > remain) {
      // console.log("超過庫存量")
      alert("超過庫存量")
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          className="border rounded p-2 w-20"
          value={quantity}
          onChange={haddleInputChange}
          min="1"
        />
      </div>
    </div>
  );
};

// Get product detail from API
const getProductDetail = async (id: string) => {
  try {
    const response = await axios.get("http://localhost:8080/api/product/list", {
      params: {
        id: Number(id),
        random: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get product detail error:", error);
    return null;
  }
};

const getTags = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/tag/list");
    return response.data;
  } catch (error) {
    console.error("Get tags error:", error);
    return null;
  }
};

const handleAddFavorite = async (productId: number, token: string) => {
  try {
    const response = await axios.post("http://localhost:8080/api/favorite/add",
      {}, // POST request body is empty
      {
        params: {
          product_id: productId,
        },
        headers: {
          Authorization: token,
        }
      });
    console.log(response);
  } catch (error: any) {
    if (error.response.status === 401) {
      alert("請先登入");
    }
    console.error("Add favorite error:", error);
  }
};

const handleAddToCart = async (productId: number, quantity: number, token: string) => {
  try {
    const response = await axios.post("http://localhost:8080/api/cart/add",
      {}, // POST request body is empty
      {
        params: {
          product_id: productId,
          count: quantity,
        },
        headers: {
          Authorization: token,
        }
      });
    console.log(response);
    alert("成功加入購物車");
  } catch (error: any) {
    if (error.response.status === 401) {
      alert("請先登入");
    }
    console.error("Add to cart error:", error);
  }
};

const ProductDetail: React.FC = () => {
  const token = localStorage.getItem("authToken");
  const [searchText, setSearchText] = useState("");
  const { id } = useParams<{ id: string }>();
  const [mainProduct, setMainProduct] = useState<ProductFromAPI | null>(null);
  const [tags, setTags] = useState<{ [key: number]: string }>({});
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id) {
      getProductDetail(id).then((data) => {
        if (data && data.length > 0) {
          const productData = data[0];
          setMainProduct({
            id: productData.id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            remain: productData.remain,
            tags: productData.tags,
            image_url: productData.image_url,
            vendor_announcement: productData.vendor_announcement,
          });
          console.log(productData);
        }
      });
    }
    getTags().then((data) => {
      if (data) {
        const tagMap: { [key: number]: string } = {};
        data.forEach((tag: { id: number; name: string }) => {
          tagMap[tag.id] = tag.name;
        });
        setTags(tagMap);
      }
    });
    // go to top when component mounted
    window.scrollTo(0, 0);
  }, [id]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  }

  const [products, setProducts] = useState<Product[]>([]);
  interface Product {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    tags: string[];
    liked: boolean;
  }
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
        setProducts(cleanedData);

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
        console.log(updatedData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [token]);
  const handleLike = async (productId: number) => {
    if (!token) {
      console.error("Please login first")
      window.location.href = "/auth"
      return
    }
    const isCurrentlyLiked = products.find((product) => product.id === productId)?.liked;
    try {
      if (isCurrentlyLiked) {
        alert("你已經收藏過，若要取消收藏，請到喜歡列表頁面解除收藏")
        return
      }
      await axios.post(`http://localhost:8080/api/favorite/add?product_id=${productId}`, null, {
        headers: { Authorization: `${token}` }
      })
      setProducts((prevItems) =>
        prevItems.map((prevItem: any) =>
          prevItem.id === productId ? { ...prevItem, liked: !isCurrentlyLiked } : prevItem
        )
      )
    } catch (error) {
      alert("你已經收藏過，若要取消收藏，請到喜歡列表頁面解除收藏")
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header searchText={searchText} onSearchChange={handleSearchChange} />

      <div className="flex flex-col lg:flex-row lg:items-start gap-8 p-8 w-full max-w-5xl">
        {/* 圖片 */}
        <div className="relative w-full lg:w-1/2">
          <div className="w-80 h-80 bg-gray-200 flex items-center justify-center">
            <img
              src={mainProduct?.image_url.String || ""}
              alt={mainProduct?.name || ""}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <button
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow"
            onClick={() => {
              if (token && mainProduct) {
                handleAddFavorite(mainProduct.id, token);
              }
            }}
          >
            ♥
          </button>
        </div>
        {/* 商品資訊 */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">{mainProduct?.name || ""}</h1>
          <span className="inline-block bg-green-200 text-green-800 px-2 py-1 mr-2 rounded">
            {mainProduct?.tags[0] !== undefined ? tags[mainProduct.tags[0]] : ""}
          </span>
          <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded">
            {mainProduct?.tags[1] !== undefined ? tags[mainProduct.tags[1]] : ""}
          </span>
          <p className="text-3xl font-bold">${mainProduct?.price}</p>

          {/* 下拉選單 */}
          <div className="flex grep-4">
            <Inputlayout
              label="數量"
              remain={mainProduct?.remain ?? 0}
              onQuantityChange={handleQuantityChange}
            />
          </div>
          {/* 購物按鈕 */}
          <button
            className="w-full bg-black text-white py-2 rounded"
            onClick={() => {
              if (token && mainProduct && quantity <= mainProduct.remain) {
                handleAddToCart(mainProduct.id, quantity, token);
              }
            }}
          >
            加入購物車
          </button>
        </div>
      </div>
      {/* 商品描述 */}
      <div className="w-full max-w-5xl mt-8 mb-8">
        <h2 className="text-xl font-bold mb-4">商品描述</h2>
        <p className="text-gray-700 leading-relaxed">
          {mainProduct?.description || ""}
        </p>
        <br />
        <p
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: mainProduct?.vendor_announcement || "",
          }}
        ></p>
      </div>

      <div className="w-full max-w-5xl my-9">
        <div className="flex justify-between items-center">
          <h2 className="text-left text-xl font-bold mb-4">精選商品</h2>
          <a href="/shop" className="text-blue-500">
            查看更多商品
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
      </div>

      {/* 頁尾 */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
