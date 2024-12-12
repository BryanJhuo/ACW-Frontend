import React from "react";
import Dropdown from "../components/Dropdown";

const ProductDetail: React.FC = () => {
  const quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const imageSrc = "/assets/images/欠揍1.jpg";

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      {/* 圖片 */}
      <div className="relative">
        <div className="w-80 h-80 bg-gray-200 flex items-center justify-center">
          <img
            src={imageSrc}
            alt="Product"
            className="w-full h-full object-cover- rounded"
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
  );
};

export default ProductDetail;
