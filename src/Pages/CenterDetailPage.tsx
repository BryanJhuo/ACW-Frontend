import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

interface TabProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

interface Order {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  status: "已完成" | "待出貨" | "出貨中";
}

interface OrderCardProps {
  order: Order;
}

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
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

const OrderTabs: React.FC<TabProps> = ({ activeTab, onChange }) => {
  const tabs = ["歷史訂單", "查看訂單物流狀態"];
  return (
    <div className="flex justify-center space-x-8 text-gray-500 text-lg">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-2 px-1 ${
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

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-purple-100 mb-6 shadow-md">
      <div className="flex justify-between items-center mb-4">
        {/* Image and OrderID */}
        <div className="flex items-center">
          <img
            src="https://pic.616pic.com/ys_bnew_img/00/58/17/FxXVddDT7U.jpg"
            alt="OrderID"
            className="w-6 h-6 mr-2"
          />
          <p className="text-gray-700 font-semibold">{order.id}</p>
        </div>
        {/* Order State */}
        <div
          className={`text-sm rounded-full px-3 py-1 ${
            order.status === "已完成"
              ? "bg-green-100 text-green-600"
              : order.status === "待出貨"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {order.status}
        </div>
      </div>
      {/* Order Info. */}
      <div className="flex items-center">
        {/* Image */}
        <img
          src="https://i.imgur.com/Xrebmu1.jpg"
          alt="Product"
          className="w-16 h-16 rounded-md mr-4"
        />
        {/* Product Name and Quantity */}
        <div className="flex-grow">
          <p className="text-gray-600">
            {order.productName} x {order.quantity}
          </p>
        </div>
        {/* Price Total */}
        <div className="text-right">
          <p className="text-gray-700 font-semibold">${order.price}</p>
        </div>
      </div>
      <div className="flex items-center text-right"></div>
    </div>
  );
};

const useFetchOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    {
      /*TODO: Call API to Get All Orders */
    }
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: "店鋪名稱1",
          productName: "商品A",
          quantity: 1,
          price: 100,
          total: 1000,
          status: "待出貨",
        },
        {
          id: "店鋪名稱2",
          productName: "商品B",
          quantity: 2,
          price: 250,
          total: 1230,
          status: "出貨中",
        },
        {
          id: "店鋪名稱3",
          productName: "商品C",
          quantity: 2,
          price: 120,
          total: 4230,
          status: "已完成",
        },
        {
          id: "店鋪名稱4",
          productName: "商品D我是商品我的名字非常的長想不到吧我只是想測試長度",
          quantity: 2,
          price: 250,
          total: 1230,
          status: "出貨中",
        },
        {
          id: "店鋪名稱5",
          productName: "E",
          quantity: 2,
          price: 550,
          total: 14230,
          status: "已完成",
        },
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);
  return { orders, loading };
};

const ProfileForm: React.FC = () => {
  const imageSrc = "https://i.imgur.com/Xrebmu1.jpg";
  return (
    <div className="max-w-md mx-auto bg-purple-50 p-8 rounded-md ">
      <div className="flex justify-center mb-6">
        <img src={imageSrc} alt="Avatar" className="w-24 h-24 rounded-full" />
      </div>
      {/*TODO: call API預先將 Name 和 Email填入 Placeholder 中 */}
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
        {/*TODO: call 修改 Memeber 的資料*/}
        <button className="w-full bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-md mt-2">
          修改
        </button>
      </div>
    </div>
  );
};

const OrderForm: React.FC = () => {
  const { orders, loading } = useFetchOrders();
  const [activeTab, setActiveTab] = useState("歷史訂單");

  // Filter Data
  const historyOrders = orders.filter((order) => order.status === "已完成");
  const shippingOrders = orders.filter(
    (order) => order.status === "出貨中" || order.status === "待出貨"
  );

  return (
    <div>
      <OrderTabs activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === "歷史訂單" && (
        <div className="mt-8">
          {loading ? (
            <p className="text-gray-500 text-center">載入中...</p>
          ) : (
            historyOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      )}
      {activeTab === "查看訂單物流狀態" && (
        <div className="mt-8">
          {loading ? (
            <p className="text-gray-500 text-center">載入中...</p>
          ) : (
            shippingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      )}
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
