import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { data } from "react-router-dom";

interface InputlayoutProps {
  label: string;
}

const Inputlayout: React.FC<InputlayoutProps> = ({ label }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const haddleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      // 需再加上驗證是否超過 remain
      setQuantity(value);
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
          min={1}
        />
      </div>
    </div>
  );
};

// Get product detail from API
const getProductDetail = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/product/list", {
      params: {
        id: 1,
        vendor_id: "3",
        random: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get product detail error:", error);
    return null;
  }
};

const ProductDetail: React.FC = () => {
  //const imageSrc = "https://i.imgur.com/Xrebmu1.jpg";
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getProductDetail().then((data) => {
      console.log(data);
    });
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header searchText={searchText} onSearchChange={handleSearchChange} />

      <div className="flex flex-col lg:flex-row lg:items-start gap-8 p-8 w-full max-w-5xl ">
        {/* 圖片 */}
        <div className="relative w-full lg:w-1/2">
          <div className="w-80 h-80 bg-gray-200 flex items-center justify-center">
            {/* <img
              src={}
              alt={}
              className="w-full h-full object-cover rounded"
            /> */}
          </div>
          <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow">
            ♥
          </button>
        </div>
        {/* 商品資訊 */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold"></h1>
          <span className="inline-block bg-green-200 text-green-800 px-2 py-1 mr-2 rounded">
            動漫Tag
          </span>
          <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded">
            類型Tag
          </span>
          <p className="text-3xl font-bold"></p>

          {/* 下拉選單 */}
          <div className="flex grep-4">
            <Inputlayout label="數量" />
          </div>
          {/* 購物按鈕 */}
          <button className="w-full bg-black text-white py-2 rounded">
            加入購物車
          </button>
        </div>
      </div>
      {/* 商品描述 */}
      <div className="w-full max-w-5xl mt-8">
        <h2 className="text-xl font-bold mb-4">商品描述</h2>
        <p className="text-gray-700 leading-relaxed">
          <br />
        </p>
      </div>
      {/* 頁尾 */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
