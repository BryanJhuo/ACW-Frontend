import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

interface TabProps {
    activeTab: string;
    onChange: (tab: string) => void;
}

interface Product {
  build_time: string;
  count: number;
  description: string;
  image_url: {
    String: string;
    Valid: boolean;
  };
  name: string;
  price: number;
  vendor_name: string;
}
interface Order {
  address: string;
  description: string;
  id: number;
  name: string;
  payment_method: number;
  phone_number: string;
  products: Product[];
  shipment_method: number;
  state: string;
}

interface OrderCardProps {
  order: Order;
}

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

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {

  const totalAmount = order.products.reduce(
    (sum, product) => sum + product.price * product.count,0);


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
        {/* All State Value : Math.random() > 0.5 ? '未出貨' : Math.random() > 0.5 ? '處理中' : Math.random() > 0.5 ? '運送中' : '已送達', */}
        <div
          className={`text-sm rounded-full px-3 py-1 ${
            order.state === "已送達"
              ? "bg-green-100 text-green-600"
              : order.state === "未出貨"
              ? "bg-red-100 text-red-600"
              : order.state === "處理中"
              ? "bg-blue-100 text-blue-600"
              : "bg-rose-300 text-rose-600"
          }`}
        >
          {order.state}
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
          {order.products.map((product, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <p className="text-gray-600 mr-2">
                {product.name} x {product.count}
              </p>
              {/* 單個商品金額 */}
              <p className="text-gray-700 text-right">
                ${product.price * product.count}
              </p>
            </div>
          ))}
        </div>
        {/* Price Total */}
      </div>
      <div className="text-right">
          <p className="text-gray-700 font-semibold">訂單金額: ${totalAmount}</p>
        </div>
    </div>
  );
};

const OrderForm: React.FC = () => {
  const token = localStorage.getItem("authToken"); 
  const [activeTab, setActiveTab] = useState("歷史訂單");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/order/list", {
          headers: {
            Authorization: token,
          },
        });
        console.log(response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          console.error("Unauthorized access. Please log in.");
          alert("請重新登入! Unauthorized access. Please log in.");
        } else {
          console.error("Failed to fetch orders:", error);
          alert("訂單獲取失敗! Failed to fetch orders!");
        }
      }
    };

    setTimeout(() => {
      fetchOrders();
    }, 1000);
  }, []);

  const historyOrders = orders.filter((order) => order.state === "已送達");
  const shippingOrders = orders.filter(
    (order) => order.state === "未出貨" || order.state === "處理中" || order.state === "運送中"
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

export default OrderForm;