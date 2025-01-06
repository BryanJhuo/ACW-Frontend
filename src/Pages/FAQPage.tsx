import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

function FAQPage() {
    const [searchText, setSearchText] = useState("");

    const handleSearchChange = (text : string) => {
        setSearchText(text);
    }

    const questionsAndAnswers = [
        {
            question: "如何註冊帳戶？",
            answer: "點擊首頁右上角的「Login」按鈕，填寫您的用戶名、密碼、電子郵件和姓名，然後點擊「註冊」按鈕即可。",
        },
        {
            question: "購物是否需要註冊？",
            answer: "是的，購物前需要註冊並登入帳戶。",
        },
        {
            question: "支援哪些支付方式？",
            answer: "我們目前支援以下支付方式：\n- 貨到付款\n- 信用卡（透過外部安全支付流程）",
        },
        {
            question: "如何查看我的訂單狀態？",
            answer: "登入帳戶後，前往「我的訂單」頁面即可查看訂單進度與配送詳情。",
        },
        {
            question: "配送範圍有哪些？",
            answer: "我們提供全國配送，且偏遠地區不收取額外費用。",
        },
        {
            question: "配送需要多長時間？",
            answer: "訂單確認後，商品通常會在 3-7 個工作日內送達，具體時間依地區而定。",
        },
        {
            question: "訂單確認後可以修改嗎？",
            answer: "訂單確認後無法修改。請在下單前仔細檢查商品資訊。如有特殊需求，請聯繫客服。",
        },
        {
            question: "是否提供退換貨服務？",
            answer: "我們目前不提供退換貨服務。請確認所有商品資訊無誤後再下單。如收到損壞或錯誤商品，請聯繫客服處理。",
        },
        {
            question: "如何聯繫客服？",
            answer: "您可以透過以下方式聯繫我們：\n- 電子郵件：support@onlineshop.com\n- 客服熱線：114-514-1919（週一至週五 9:00-18:00）",
        },
        {
            question: "如何保障支付安全？",
            answer: "我們採用外部安全支付流程，確保您的付款資訊安全無虞。",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
        <Header onSearchChange={handleSearchChange} searchText={searchText} />
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 text-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-center">常見問題</h1>
            <div className="space-y-6">
                {questionsAndAnswers.map((qa, index) => (
                    <div key={index} className="p-4 bg-white rounded shadow">
                        <h2 className="text-xl
                        font-semibold mb-2">{qa.question}</h2>
                        <p className="text-md 
                        whitespace-pre-line">{qa.answer}</p>
                    </div>
                ))}
            </div>
        </div>
        <Footer />
        </div>
    );
};

export default FAQPage;
