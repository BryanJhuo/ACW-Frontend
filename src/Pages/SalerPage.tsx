import React, { useState } from "react";
import Header from "../components/Header";
import NewProductForm from "../components/NewProductForm";

interface TabProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const Tabs: React.FC<TabProps> = ({ activeTab, onChange }) => {
  const tabs = ["新增商品", "庫存管理"];
  return (
    <div className="flex justify-center items-center bg-gray-200 rounded-full p-2 w-fit mx-auto shadow-md mt-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-6 py-2 text-lg font-medium rounded-full ${
            activeTab === tab
              ? "bg-white text-blue-500 shadow-md"
              : "text-gray-600 hover:text-black"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const SalerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("新增商品");
  const [searchText, setSearchText] = useState("");
  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <div className="min-h-screen">
      <Header searchText={searchText} onSearchChange={handleSearchChange} />
      <Tabs activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-4">
        {activeTab === "新增商品" && <NewProductForm />}
      </div>
    </div>
  );
};

export default SalerPage;
