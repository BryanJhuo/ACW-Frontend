import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ShoppingCartPage = () => {
    const [searchText, setSearchText] = useState(''); // 儲存搜尋文字

    // 當文字改變時更新 searchText
    const handleSearchChange = (text: string) => {
        setSearchText(text);
    };
    // 購物車商品的資料格式
    interface CartItem {
        id: number;
        image: string;
        name: string;
        description: string;
        price: number;
    }

    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // 假設當前用戶的 member_id 為 1
    const currentUserId = 1;

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                // 首先獲取購物車資料，過濾出屬於當前用戶的資料
                const cartResponse = await fetch(`http://localhost:3001/carts?member_id=${currentUserId}`);
                const cartData = await cartResponse.json();

                // 獲取商品資料
                const productResponse = await fetch('http://localhost:3001/products');
                const productData = await productResponse.json();

                // 透過 cartData 中的 product_id 查詢對應商品資料
                const combinedData = cartData.map((cartItem: { product_id: number; count: number }) => {
                    const product = productData.find(
                        (product: { id: number; image: string; name: string; description: string; price: number }) => product.id === cartItem.product_id
                    );

                    return {
                        id: product.id,
                        image: product.image,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        count: cartItem.count
                    };
                });

                setCartItems(combinedData);
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
            }
        };

        fetchCartItems();
    }, [currentUserId]);

    return (
        <div className="flex flex-col items-center">
            <Header searchText={searchText} onSearchChange={handleSearchChange} />


            <div className="w-full max-w-4xl mt-8">
                <h2 className="text-left text-xl font-bold mb-4">購物車</h2>

                <div className="flex flex-col gap-6">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4 flex items-center gap-4 shadow-md"
                            style={{ minHeight: '150px' }}
                        >
                            {/* 商品圖片 */}
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-32 h-32 object-cover"
                            />

                            {/* 商品資訊 */}
                            <div className="flex flex-col justify-between h-full">
                            <h3 className="text-lg font-semibold mb-2" style={{ textDecoration: 'underline' }}>{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" style={{ width: '100px' }}>
                                    移除
                                </button>
                            </div>

                            {/* 商品價格 */}
                            <span className="text-gray-800 font-semibold ml-auto">${item.price}</span>
                        </div>
                    ))}
                </div>

                {/* 總金額區域 */}
                <div className="mt-8 border-t pt-4 text-left">
                    <h3 className="text-lg font-bold">總金額: ${cartItems.reduce((total, item) => total + item.price, 0)}</h3>
                    <h4 className="text-md font-semibold mt-2">總數量: {cartItems.length}</h4>
                </div>

                {/* 操作按鈕 */}
                <div className="mt-8 flex justify-center gap-4">
                    <button className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600">繼續購物</button>
                    <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">去結帳</button>
                </div>
            </div>
            <div className="mb-8"></div>
            <Footer />
        </div>
    );
};

export default ShoppingCartPage;
