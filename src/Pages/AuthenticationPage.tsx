import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios"; // 如果使用 axios
import { useNavigate } from 'react-router-dom';

function AuthenticationPage() {
  const [searchText, setSearchText] = useState(""); // 儲存搜尋文字
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setNickname] = useState("");
  const [activeTab, setActiveTab] = useState("sign-in");
  const [message, setMessage] = useState(""); // 儲存訊息
  const navigate = useNavigate();
  // 當文字改變時更新 searchText
  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (activeTab === "sign-in") handleSignIn();
    else handleSignUp();
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });
      setMessage("登入成功！");
      console.log("登入成功：", response.data); // 主控台顯示成功訊息
      localStorage.setItem("authToken", response.data.token);
      console.log("Token文存成功：", response.data.token); // 主控台顯示成功訊息

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios 錯誤處理
        if (error.response) {
          switch (error.response.status) {
            case 400:
              setMessage("請求資料無效，請確認您的輸入格式是否正確！");
              console.error("錯誤 400：", error.response.data);
              break;
            case 401:
              setMessage("登入失敗，信箱或密碼錯誤！");
              console.error("錯誤 401：", error.response.data);
              break;
            case 500:
              setMessage("伺服器內部錯誤，請稍後再試！");
              console.error("錯誤 500：", error.response.data);
              break;
            default:
              setMessage("發生未知錯誤，請稍後再試！");
              console.error(`錯誤 ${error.response.status}：`, error.response.data);
              break;
          }
        } else if (error.request) {
          setMessage("無法連接伺服器，請檢查您的網路連線！");
          console.error("無法連接伺服器：", error.request);
        } else {
          setMessage("發生未知錯誤，請稍後再試！");
          console.error("未知錯誤：", error.message);
        }
      } else {
        // 非 Axios 錯誤
        setMessage("發生未知錯誤，請稍後再試！");
        console.error("非 Axios 錯誤：", error);
      }
    }
  }

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/member/register", {
        name,
        username,
        email,
        password,
      });
      setMessage("註冊成功！");
      console.log("註冊成功：", response.data);  // 主控台顯示成功訊息
      setActiveTab("sign-in"); // 註冊成功後切換到登入狀態
    } catch (error) {
      // 判斷錯誤類型
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // 伺服器回應錯誤，例如 400、409 或 500 等
          console.error("註冊錯誤：", error.response.data);
          if (error.response.status === 400) {
            setMessage("請求資料格式錯誤，請檢查您的資料。");
          } else if (error.response.status === 409) {
            setMessage("用戶名已存在");
            setActiveTab("sign-in"); // 註冊成功後切換到登入狀態

          } else {
            setMessage("伺服器錯誤，請稍後再試。");
          }
        } else if (error.request) {
          // 請求未發送的錯誤
          console.error("未收到伺服器回應：", error.request);
          setMessage("無法連接伺服器，請檢查網路或稍後再試。");
        } else {
          // 其他錯誤
          console.error("錯誤：", error.message);
          setMessage("註冊失敗，請稍後再試。");
        }
      } else {
        // 非 Axios 錯誤
        console.error("錯誤：", error);
        setMessage("註冊失敗，請稍後再試。");
      }
    }
  };

  return (
    <div className="flex flex-col item-center min-h-screen">
      <Header searchText={searchText} onSearchChange={handleSearchChange} />
      <div className="flex flex-col min-h-min my-10">
        {/* 中間內容區域 */}
        <div className="flex flex-1 justify-center items-center flex-col">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow border-gray-300 border">
            <div className="font-funnel-sans text-6xl font-extrabold text-center mb-6">
              {activeTab === "sign-in" ? "Sign In" : "Sign Up"}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "sign-up" && (
                <>
                  <div className="fa fa-trash">
                    <label
                      htmlFor="name"
                      className="block font-bold text-gray-700"
                    >
                      姓名：
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring"
                    />
                  </div>
                </>
              )}
              <div>
                <label
                  htmlFor="nickname"
                  className="block font-bold text-gray-700"
                >
                  暱稱：
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={username}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring"
                />
              </div>
              {activeTab === "sign-up" && (
                <>
                  <div className="fa fa-trash">
                    <label
                      htmlFor="email"
                      className="block font-bold text-gray-700"
                    >
                      信箱：
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring"
                    />
                  </div>
                </>
              )}
              <div>
                <label
                  htmlFor="password"
                  className="block font-bold text-gray-700"
                >
                  密碼：
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-gray-900 rounded hover:bg-black focus:outline-none focus:ring"
              >
                {activeTab === "sign-in" ? "Sign In" : "Sign Up"}
              </button>
            </form>
            {message && (
              <div className="mt-4 text-center text-red-500">
                {message}
              </div>
            )}
          </div>

          {/* Tab 切換按鈕，放置在表單下方並加上適當的間距 */}
          <div className="flex justify-center w-full mt-6">
            <div className="flex items-center justify-between w-max border border-gray-400 rounded-full">
              {/* Sign In Button */}
              <button
                onClick={() => setActiveTab("sign-in")}
                className={`relative flex items-center px-6 py-3 rounded-l-full border-r border-gray-400 ${activeTab === "sign-in"
                  ? "bg-purple-100 text-black"
                  : "text-gray-500 bg-transparent"
                  }`}
              >
                {activeTab === "sign-in" && (
                  <span className="absolute left-2 text-purple-700 mx-1">
                    ✔
                  </span>
                )}
                <span className="ml-4 font-funnel-sans">Sign In</span>
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => setActiveTab("sign-up")}
                className={`relative flex items-center px-6 py-3 rounded-r-full ${activeTab === "sign-up"
                  ? "bg-purple-100 text-black"
                  : "text-gray-500 bg-transparent"
                  }`}
              >
                {activeTab === "sign-up" && (
                  <span className="absolute left-2 text-purple-700 mx-1">
                    ✔
                  </span>
                )}
                <span className="ml-4 font-funnel-sans">Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AuthenticationPage;
