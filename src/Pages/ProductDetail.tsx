import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

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

const Inputlayout: React.FC<InputlayoutProps & { onQuantityChange: (quantity: number) => void }> = ({ label , remain, onQuantityChange }) => {
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
  try{
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
  const [product, setProduct] = useState<ProductFromAPI | null>(null);
  const [tags, setTags] = useState<{ [key: number]: string }>({});
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (id){
      getProductDetail(id).then((data) => {
        if (data && data.length > 0) {
          const productData = data[0];
          setProduct({
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
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header searchText={searchText} onSearchChange={handleSearchChange} />

      <div className="flex flex-col lg:flex-row lg:items-start gap-8 p-8 w-full max-w-5xl">
        {/* 圖片 */}
        <div className="relative w-full lg:w-1/2">
          <div className="w-80 h-80 bg-gray-200 flex items-center justify-center">
            <img
              src={product?.image_url.String || ""}
              alt={product?.name || ""} 
              className="w-full h-full object-cover rounded"
            />
          </div>
          <button 
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow"
            onClick={() => {
              if (token && product) {
                handleAddFavorite(product.id, token);
              }
            }}
          >
            ♥
          </button>
        </div>
        {/* 商品資訊 */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">{product?.name || ""}</h1>
          <span className="inline-block bg-green-200 text-green-800 px-2 py-1 mr-2 rounded">
            {product?.tags[0] !== undefined ? tags[product.tags[0]] : ""}
          </span>
          <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded">
            {product?.tags[1] !== undefined ? tags[product.tags[1]] : ""}
          </span>
          <p className="text-3xl font-bold">${product?.price}</p>

          {/* 下拉選單 */}
          <div className="flex grep-4">
            <Inputlayout 
              label="數量" 
              remain={product?.remain ?? 0}
              onQuantityChange={handleQuantityChange}
            />
          </div>
          {/* 購物按鈕 */}
          <button 
            className="w-full bg-black text-white py-2 rounded"
            onClick={() => {
              if (token && product && quantity <= product.remain) {
                handleAddToCart(product.id, quantity, token);
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
          {product?.description || ""}
        </p>
        <br />
        <p
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: product?.vendor_announcement|| "",
          }}
        ></p>
        </div>
      {/* 頁尾 */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
