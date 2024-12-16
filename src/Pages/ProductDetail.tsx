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
            動漫Tag
          </span>
          <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded">
            類型Tag
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
      {/* 商品描述 */}
      <div className="w-full max-w-5xl mt-8">
        <h2 className="text-xl font-bold mb-4">商品描述</h2>
        <p className="text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
          laudantium provident, necessitatibus voluptates ex consectetur nemo
          recusandae a possimus delectus excepturi qui accusantium quidem, natus
          voluptas similique quisquam aliquam sed? Exercitationem ea cumque nam
          soluta quidem dolorum, enim sint. Quidem aliquam quae dolore natus
          nihil at cumque, repellat dignissimos voluptatibus.
        </p>
      </div>
      {/* 頁尾 */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
