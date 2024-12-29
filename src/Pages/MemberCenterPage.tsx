import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  isPrimary?: boolean; // 用來區分主要button
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  isPrimary = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2 rounded-full text-lg font-semibold
            ${
              isPrimary
                ? "bg-black text-white"
                : "border-2 border-gray-300 text-gray-700"
            }
            hover:opacity-80 transition`}
    >
      {text}
    </button>
  );
};

const MemberCenter: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleLogout = () => {
    console.log("登出");
  };

  const handleNavigate = (path: string, text: string) => {
    navigate(path, { state: { activeTab: text } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* 頁首 */}
      <Header searchText={searchText} onSearchChange={handleSearchChange} />
      {/* 內容 */}
      <div className="w-full max-w-xs mx-auto mt-20 space-y-4">
        <h1 className="text-3xl font-bold text-center">會員中心</h1>
        <Button
          text="個人資料"
          onClick={() => handleNavigate("/member/detail", "個人資料")}
        />
        <Button
          text="訂單狀態"
          onClick={() => handleNavigate("/member/detail", "訂單狀態")}
        />
        <Button
          text="喜好項目"
          onClick={() => handleNavigate("/member/detail", "喜好項目")}
        />
        <Button text="登出" isPrimary onClick={handleLogout} />
      </div>
      {/* 頁尾 */}
      <Footer />
    </div>
  );
};

export default MemberCenter;
