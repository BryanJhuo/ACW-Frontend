import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// 購物車商品的資料格式
interface CartItem {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  count: number;
  remain : number;
}

const ShoppingCartPage = () => {
  const [searchText, setSearchText] = useState(""); // 儲存搜尋文字
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate(); // 使用 useNavigate 來進行跳轉

  // 當文字改變時更新 searchText
  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) {
        console.error("No auth token found");
        navigate("/auth"); // 跳轉到登入頁面
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/cart/list', {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log("購物車商品：", response.data); // 主控台顯示成功訊息
        // 將返回的資料轉換為 CartItem 格式
        const formattedCartItems = response.data.map((item: { id: number; name: string; image_url: string | { String: string }; description: string; price: number; count: number; remain: number }) => ({
          id: item.id,
          name: item.name,
          image: typeof item.image_url === "string" ? item.image_url : item.image_url.String, // 提取字串
          description: item.description,
          price: item.price,
          count: item.count,
          remain: item.remain
        }));

        setCartItems(formattedCartItems);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          console.error("Unauthorized access. Please log in.");
          localStorage.removeItem("authToken"); // 刪除 token
          navigate("/auth"); // 跳轉到登入頁面
        } else {
          console.error("Failed to fetch cart items:", error);
        }
      }
    };

    fetchCartItems();
  }, [token, navigate]);

  const updateCart = async (productID: number, count: number) => {
    if (!token) {
      console.error("No auth token found");
      navigate("/auth"); // 跳轉到登入頁面
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/cart/update?product_id=${productID}&count=${count}`, {
        method: 'PUT', // 使用 PUT 方法來更新
        headers: {
          'Authorization': `${token}`, // 帶上身份驗證的 JWT token
        },
      });

      // 檢查是否有內容返回
      const data = response.headers.get('content-length') !== '0' ? await response.json() : {};

      if (response.ok) {
        console.log('購物車更新成功:', data.message); // 顯示成功訊息
      } else {
        if (response.status === 401) {
          console.error("Unauthorized access. Please log in.");
          localStorage.removeItem("authToken"); // 刪除 token
          navigate("/auth"); // 跳轉到登入頁面
        } else {
          console.log('錯誤:', data.error); // 顯示錯誤訊息
        }
      }
    } catch (error) {
      console.error('發生錯誤:', error); // 顯示網路錯誤或其他錯誤
    }
  };

  const deleteProduct = async (productID: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/delete?product_id=${productID}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        // 根據狀態碼給出不同的錯誤處理
        if (response.status === 400) {
          console.error("刪除商品失敗: 商品不在購物車中");
        } else if (response.status === 401) {
          console.error("刪除商品失敗: 未授權");
          localStorage.removeItem("authToken"); // 刪除 token
          navigate("/auth"); // 跳轉到登入頁面
        } else if (response.status === 500) {
          console.error("刪除商品失敗: 伺服器錯誤");
        } else {
          console.error("刪除商品失敗:", errorResponse.error || "未知錯誤");
        }
      } else {
        console.log("成功刪除商品:", productID);
        setCartItems((prevItems) => prevItems?.filter((item) => item.id !== productID) || null);
      }
    } catch (error) {
      console.error("刪除商品時發生錯誤:", error);
    }
  };

  const handleQuantityChange = (id: number, newCount: number) => {
    // 直接更新數量
    setCartItems((prevItems) =>
      prevItems?.map((item) =>
        item.id === id ? { ...item, count: newCount } : item
      ) || null
    );
  };

  const handleBlur = (id: number, count: number) => {
    if (count <= 0) {
      const confirmDelete = window.confirm("數量為 0 或空，是否刪除此商品？");
      if (confirmDelete) {
        deleteProduct(id); // 刪除商品
      } else {
        setCartItems((prevItems) =>
          prevItems?.map((item) =>
            item.id === id ? { ...item, count: 1 } : item
          ) || null
        );
        updateCart(id, 1); // 更新購物車數量
      }
    } else {
      if (cartItems) {
        const item = cartItems.find(item => item.id === id);
        if (item && count > item.remain) {
          alert("超過庫存數量");
          setCartItems((prevItems) =>
            prevItems?.map((item) =>
              item.id === id ? { ...item, count: item.remain } : item
            ) || null
          );
          updateCart(id, item.remain); // 更新購物車數量
          return;
        }
      }
      updateCart(id, count); // 更新購物車數量
    }
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems?.map((item) => {
        if (item.id === id && item.count > 0) {
          const newCount = item.count - 1;
          // 如果減少後數量為0，顯示彈窗
          if (newCount === 0) {
            const confirmDelete = window.confirm(
              "數量為 0，是否刪除此商品？"
            );
            if (confirmDelete) {
              deleteProduct(id); // 刪除商品
              return { ...item, count: 0 };
            } else {
              // 如果取消刪除，將數量恢復為 1
              updateCart(id, 1); // 更新購物車數量
              return { ...item, count: 1 };
            }
          }
          updateCart(id, newCount); // 更新購物車數量
          return { ...item, count: newCount };
        }
        return item;
      }) || null
    );
  };

  const increaseQuantity = (id: number) => {
    // check remain
    if (cartItems) {
      const item = cartItems.find(item => item.id === id);
      if (item && item.count >= item.remain) {
        alert("超過庫存數量");
        return;
      }
    }
    setCartItems((prevItems) =>
      prevItems?.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      ) || null
    );
    const item = cartItems?.find(item => item.id === id);
    if (item) {
      updateCart(id, item.count + 1); // 更新購物車數量
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header searchText={searchText} onSearchChange={handleSearchChange} />

      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-left text-xl font-bold mb-4">購物車</h2>

        <div className="flex flex-col gap-6">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 flex items-center gap-4 shadow-md"
                style={{ minHeight: "150px" }}
              >
                {/* 商品圖片 */}
                <Link to={`/product/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover"
                  />
                </Link>

                {/* 商品資訊 */}
                <div className="flex flex-col justify-between h-full">
                  <Link to={`/product/${item.id}`}>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ textDecoration: "underline" }}
                    >
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>

                  {/* 數量控制區域 */}
                  <div className="flex items-center gap-0">
                    <button
                      onClick={() => decreaseQuantity(item.id)} // 減少數量
                      className="px-2 py-0.75 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.count}
                      onChange={(e) => {
                        const newCount = parseInt(e.target.value || "0", 10);
                        handleQuantityChange(item.id, newCount); // 更新數量
                      }}
                      onBlur={(e) => handleBlur(item.id, parseInt(e.target.value || "0", 10))} // 輸入完後進行檢查
                      className="text-center border rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      size={Math.max(item.count.toString().length, 1)}
                      style={{ maxWidth: "80px", minWidth: "40px" }}
                    />
                    <button
                      onClick={() => increaseQuantity(item.id)} // 增加數量
                      className="px-2 py-0.75 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 商品價格 */}
                <span className="text-gray-800 font-semibold ml-auto">
                  ${item.price * item.count}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">購物車中沒有商品。</p>
          )}
        </div>

        {/* 總金額區域 */}
        <div className="mt-8 border-t pt-4 text-left">
          <h3 className="text-lg font-bold">
            總金額: ${cartItems ? cartItems.reduce((total, item) => total + item.price * item.count, 0) : 0}
          </h3>
          <h4 className="text-md font-semibold mt-2">
            總數量: {cartItems ? cartItems.reduce((total, item) => total + item.count, 0) : 0}
          </h4>
        </div>

        {/* 操作按鈕 */}
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/shop" className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600">
            繼續購物
          </Link>
          {cartItems && cartItems.length > 0 && (
            <Link to="/order" className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
              去結帳
            </Link>
          )}
        </div>
      </div>
      <div className="mb-8"></div>
      <Footer />
    </div>
  );
};

export default ShoppingCartPage;