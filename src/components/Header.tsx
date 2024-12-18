import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface HeaderProps {
  searchText: string;
  onSearchChange: (text: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchText, onSearchChange }) => {
  const clearSearch = () => {
    onSearchChange(""); // 清空搜尋文字
  };

  return (
    <header className="w-full flex items-center py-6 px-4 lg:px-10 bg-white relative shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <a href="/" className="text-xl font-bold">
        🅱️
      </a>

      {/* 搜尋框置中 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-96 max-w-[40%] px-4 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchText} // 由父元件控制的搜尋文字
          onChange={(e) => onSearchChange(e.target.value)} // 更新父元件的搜尋文字
          className="border-2 border-gray-300 rounded-full w-full px-4 py-1 outline-none font-bold text-sm shadow-sm placeholder-gray-500 pr-8"
        />
        {/* 只有當有搜尋文字時才顯示叉叉圖示 */}
        {searchText && (
          <AiOutlineClose
            onClick={clearSearch} // 點擊叉叉清空搜尋框
            className="absolute right-6 text-gray-600 cursor-pointer"
          />
        )}
      </div>

      {/* 右側功能按鈕 */}
      <div className="flex items-center space-x-2 lg:space-x-4 ml-auto">
        <a
          href="/shop"
          className="px-3 py-1 lg:px-10 lg:py-1 border-2 border-gray-700 rounded-xl text-sm lg:text-base"
        >
          Shop
        </a>
        <a
          href="/auth"
          className="px-3 py-1 lg:px-10 lg:py-1 border-3 border-gray-700 rounded-xl text-sm lg:text-base"
        >
          Members
        </a>
        <a
          href="/cart"
          className="px-3 py-1 lg:px-10 lg:py-1 border-2 border-gray-700 rounded-xl text-sm lg:text-base"
        >
          Cart
        </a>
      </div>
    </header>
  );
};

export default Header;
