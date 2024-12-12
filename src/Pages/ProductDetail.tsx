import React, { useState } from "react";
import Dropdown from "../components/Dropdown";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductDetail: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const imageSrc = "https://i.imgur.com/Xrebmu1.jpg";

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <Header searchText={searchText} onSearchChange={handleSearchChange} />

      <div className="flex flex-col lg:flex-row lg:items-start gap-8 w-full max-w-5xl">
        {/* 圖片 */}
        <div className="relative w-full lg:w-1/2">
          <div className="w-80 h-80 bg-gray-200 flex items-center justify-center">
            <img
              src={imageSrc}
              alt="Product"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow">
            ♥
          </button>
        </div>
        {/* 商品資訊 */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">我是商品</h1>
          <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded">
            Tag1
          </span>
          <p className="text-3xl font-bold">$10000000000</p>

          {/* 下拉選單 */}
          <div className="flex grep-4">
            <Dropdown label="數量" options={quantityOptions} />
          </div>
          {/* 購物按鈕 */}
          <button className="w-full bg-black text-white py-2 rounded">
            加入購物車
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
