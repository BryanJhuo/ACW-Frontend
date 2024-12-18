import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

interface TabProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
}

const Tabs: React.FC<TabProps> = ({ activeTab, onChange }) => {
  const tabs = ["個人資料", "訂單狀態", "預填訂購資料"];
  return (
    <div className="flex justify-center space-x-8 text-gray-500 text-lg">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-2 ${
            activeTab === tab
              ? "text-purple-600 border-b-2 border-purple-600"
              : "hover:text-purple-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
}) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-500"
      />
    </div>
  );
};

const ProfileForm: React.FC = () => {
  const imageSrc = "https://i.imgur.com/Xrebmu1.jpg";
  return (
    <div className="max-w-md mx-auto bg-purple-50 p-8 rounded-md ">
      <div className="flex justify-center mb-6">
        <img src={imageSrc} alt="Avatar" className="w-24 h-24 rounded-full" />
      </div>
      <InputField label="姓名" placeholder="姓名" />
      <InputField label="信箱" placeholder="信箱" />
      <div className="flex flex-col mb-4">
        <label className="text-gray-700 mb-1">地址</label>
        <select className="border border-gray-300 rounded-md p-2 mb-2">
          <option>請選擇城市</option>
        </select>
        <select className="border border-gray-300 rounded-md p-2 mb-2">
          <option>請選擇地區</option>
        </select>
        <input
          type="text"
          placeholder="請輸入街/弄/巷"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-500"
        />
        <button className="w-full bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-md mt-2">
          修改
        </button>
      </div>
    </div>
  );
};

const CenterDetail: React.FC = () => {
  const path = useLocation();
  const [activeTab, setActiveTab] = useState<string>(
    path.state?.activeTab || "個人資料"
  );
  const [searchText, setSearchText] = useState("");
  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* 頁首 */}
      <Header searchText={searchText} onSearchChange={handleSearchChange} />
      <div className="bg-purple-50 flex flex-col items-center my-10 px-36">
        <div className="w-full max-w-4xl mt-10">
          <Tabs activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === "個人資料" && <ProfileForm />}
        </div>
      </div>
      {/* 頁尾 */}
      <Footer />
    </div>
  );
};

export default CenterDetail;
