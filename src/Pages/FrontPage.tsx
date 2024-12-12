import { useState, useEffect } from 'react';
import Header from '../components/Header'; // 引入 Header 元件
import Footer from '../components/Footer'; // 引入 Footer 元件

const FrontPage = () => {
    const [searchText, setSearchText] = useState(''); // 儲存搜尋文字

    // 當文字改變時更新 searchText
    const handleSearchChange = (text: string) => {
        setSearchText(text);
    };
    const [products, setProducts] = useState<Product[]>([]);
    const [imageOffset] = useState({ x: 50, y: 50 });  // 記錄圖片的偏移量
    const [imageScale] = useState(1);  // 記錄圖片的縮放比例

    // 假設這是後端回傳的精選商品資料
    interface Product {
        id: number;
        image: string;
        name: string;
        description: string;
    }

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            // 透過 API 請求並限制返回資料數量為 5
            const response = await fetch('http://localhost:3001/products?_limit=5');
            const data = await response.json();
    
            // 資料清洗，保留 id, name, image, description
            const cleanedData = data.map((product: Product) => ({
              id: product.id,
              image: product.image,
              name: product.name,
              description: product.description,
            }));
    
            setProducts(cleanedData);
          } catch (error) {
            console.error('Failed to fetch products:', error);
          }
        };
    
        fetchProducts();
      }, []);

    return (

        <div className="flex flex-col items-center">
            <Header searchText={searchText} onSearchChange={handleSearchChange} />
            {/* 上半部分：圖片背景，圖片可調整偏移量和縮放 */}
            <div
                className="w-full bg-gray-300 overflow-hidden relative"  // overflow-hidden 用來裁切超出部分
                style={{
                    height: '50vh',  // 設定這裡的高度為你希望的比例 (50% 屏幕高度)
                }}
            >
                <img
                    src="https://ikuma.cc/wp-content/uploads/flickr/50264978082_99d33410fd_c.jpg"
                    alt="Single Image"
                    style={{
                        position: 'absolute',
                        top: '60%',
                        left: '50%',
                        transform: `translate(-50%, -50%) scale(${imageScale})`,  // 讓圖片中心保持在容器中並縮放
                        width: 'auto',
                        height: '160%',
                        objectFit: 'contain',  // 使用contain可以讓圖片縮放以完整顯示，並避免裁切
                        objectPosition: `${imageOffset.x}% ${imageOffset.y}%`,  // 調整圖片的偏移量
                        transition: 'transform 0.3s ease-in-out',  // 平滑過渡效果
                    }}
                />
                {/* 左邊按鈕 */}
                <button
                    className="absolute bottom-10 left-1/3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    style={{
                        position: 'absolute',
                        bottom: '10%',  // 距離底部的距離
                        left: '43%',    // 稍微偏左
                    }}
                >
                    左邊按鈕
                </button>

                {/* 右邊按鈕 */}
                <button
                    className="absolute bottom-10 right-1/3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    style={{
                        position: 'absolute',
                        bottom: '10%',  // 距離底部的距離
                        right: '43%',   // 稍微偏右
                    }}
                >
                    右邊按鈕
                </button>
            </div>

            {/* 下半部分：精選商品 */}
            <div className="w-full max-w-4xl mt-8">
                <h2 className="text-left text-xl font-bold mb-4">精選商品</h2> {/* 改為 text-left */}
                <div className="flex flex-col gap-6"> {/* 改為 flex-col 垂直排列 */}
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="border rounded-lg p-4 flex items-center gap-4 shadow-md"  // 保持左右排列
                            style={{ minHeight: '150px' }}  // 設定最小高度，讓區塊顯得比較長
                        >
                            {/* 商品圖片 */}
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-32 h-32 object-cover"  // 圖片大小
                            />
                            {/* 右邊區塊：商品名稱、描述、按鈕 */}
                            <div className="flex flex-col justify-between h-full text-left">
                                <h3 className="text-lg font-semibold mb-2" style={{ textDecoration: 'underline' }}>{product.name}</h3>  {/* 加入底線 */}
                                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 " style={{ width: '100px' }}>
                                    按鈕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 在 Footer 之前加入額外的間距 */}
            <div className="mb-8"></div>  {/* 可以調整這裡的數值來增加間距 */}

            <Footer />
        </div>
    );
};

export default FrontPage;
