import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import OrderForm from "../components/OrderForm";
interface TabProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const Tabs: React.FC<TabProps> = ({ activeTab, onChange }) => {
  const tabs = ["個人資料", "訂單狀態", "喜好項目"];
  return (
    <div className="flex justify-center space-x-8 text-gray-500 text-lg">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-2 px-2 ${
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
        <div className="w-full max-w-4xl mt-10 ">
          <Tabs activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === "個人資料" && <ProfileForm />} 
          {activeTab === "訂單狀態" && <OrderForm />}
        </div>
      </div>
      {/* 頁尾 */}
      <Footer />
    </div>
  );
};

export default CenterDetail;
