import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import 'animate.css';

interface FavoriteProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setError("未授權，請登入後重試。");
        localStorage.removeItem("authToken"); // 刪除 token
        navigate("/auth"); // 跳轉到登入頁面
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<FavoriteProduct[]>(
          "http://localhost:8080/api/favorite/list",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        const data = response.data ?? [];
        console.log("Favorite products:", data);
        setFavorites(data);
      } catch (err: unknown) {
        console.error("Error fetching favorite products:", err);
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 401) {
            localStorage.removeItem("authToken"); // 刪除 token
            navigate("/auth"); // 跳轉到登入頁面
            return;
          }
          switch (err.response.status) {
            case 400:
              setError("請求無效，請稍後再試。");
              break;
            case 500:
              setError("伺服器錯誤，請稍後再試。");
              break;
            default:
              setError("無法載入喜好項目，請稍後再試。");
              break;
          }
        } else {
          setError("網絡錯誤，請檢查您的連接。");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, navigate]);

  const deleteFavorite = async (productId: number) => {
    if (!token) {
      setDeleteError("未授權，請登入後重試");
      return;
    }

    if (!window.confirm("確定要刪除此喜好項目嗎？")) {
      return;
    }

    setDeleting(productId);

    try {
      await axios.delete(
        `http://localhost:8080/api/favorite/delete?product_id=${productId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setFavorites(favorites.filter((product) => product.id !== productId));
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 2000); // 2秒後隱藏成功訊息
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          localStorage.removeItem("authToken"); // 刪除 token
          navigate("/auth"); // 跳轉到登入頁面
          return;
        }
        setDeleteError(`錯誤: ${err.response.data.error}`);
      } else {
        setDeleteError("網絡錯誤，請稍後再試");
      }
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-500 text-center animate__animated animate__fadeIn">
        <p>載入中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center animate__animated animate__shakeX">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 container mx-auto px-4">
      {deleteSuccess && (
        <div className="text-green-500 text-center mb-4 animate__animated animate__fadeOut">
          <p>刪除成功！</p>
        </div>
      )}
      {favorites.length === 0 ? (
        <p className="text-gray-500 text-center animate__animated animate__fadeIn">目前沒有喜好項目。</p>
      ) : (
        <div className="space-y-4">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="border p-2 bg-white shadow-md hover:shadow-lg transition-shadow mb-4 animate__animated animate__zoomIn flex items-center space-x-4 min-w-[800px] h-24 rounded-md"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md transform hover:scale-110 transition-transform duration-300"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-300">{product.name}</h3>
                </Link>
                <p className="text-gray-600 mb-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-md">
                  {product.description}
                </p>
                <p className="text-purple-600 font-bold">
                  ${product.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteFavorite(product.id)}
                className={`text-red-500 hover:text-red-700 ${deleting === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={deleting === product.id}
              >
                {deleting === product.id ? '刪除中...' : '刪除'}
              </button>
              {deleteError && (
                <div className="text-red-500 text-center mt-2 animate__animated animate__shakeX">
                  <p>{deleteError}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;