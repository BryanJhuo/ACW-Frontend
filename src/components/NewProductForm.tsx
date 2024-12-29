import React from "react";

const NewProductForm: React.FC = () => {
  {
    /*TODO: 按下Submit之後，應該 Call API 去 Insert 商品 */
  }
  return (
    <div className="bg-gray-100 p-6 border rounded-md shadow-md max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-bold text-center mb-4">基本資訊(*必填)</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">商品名稱</label>
          <input
            type="text"
            placeholder="輸入商品名稱"
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">作品類別</label>
          <input
            type="text"
            placeholder="輸入作品類別"
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">商品類別</label>
          <input
            type="text"
            placeholder="輸入商品類別"
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">圖片連結</label>
          <input
            type="text"
            placeholder="輸入圖片連結"
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">商品描述</label>
          <textarea
            placeholder="輸入商品描述"
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          上架商品
        </button>
      </form>
    </div>
  );
};

export default NewProductForm;
