import React, { useEffect, useState  } from "react";
import axios from "axios";

interface TagProps {
  id: number;
  name: string;
  type: number;
};

interface ProductProps {
  description: string;
  disability: boolean;
  image_url: {
    string: string;
    valid: boolean;
  };
  name: string;
  price: number;
  remain: number;
  tags: number[];
};


const getTags = async () => { 
  try {
    const response = await axios.get("http://localhost:8080/api/tag/list");
    return response.data;
  } catch (error) {
    console.error("Get tags error:", error);
    return null;
  }
};

const NewProductForm: React.FC = () => {
  const token = localStorage.getItem("authToken");
  const [tagDict, setTagDict] = useState<Record<string, number>>({});
  const [type0Array, setType0Array] = useState<string[]>([]);
  const [type1Array, setType1Array] = useState<string[]>([]);
  const [product, setProduct] = useState<ProductProps >({
    description: "",
    disability: false,
    image_url: {
      string: "",
      valid: true,
    },
    name: "",
    price: 0,
    remain: 0,
    tags: [],
  });

  useEffect(() => {
    getTags().then((data) => {
      if (data) {
        // console.log(data);
        const dict: Record<string, number> = {};
        data.forEach((tag: TagProps) => {
          dict[tag.name] = tag.id;
        });
        setTagDict(dict);
        const type0: string[] = data.filter((item: TagProps) => item.type === 0).map((item: TagProps) => item.name);
        const type1: string[] = data.filter((item: TagProps) => item.type === 1).map((item: TagProps) => item.name);
        setType0Array(type0);
        setType1Array(type1);
      }
    });
  }, []);

  const handleInputChange = (key: keyof ProductProps | "image_url.string", value: any) => {
    if (key === "image_url.string") {
      setProduct((prev) => ({
        ...prev,
        image_url: {
          string: value,
          valid: true,
        },
      }));
    }else {
      setProduct((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleTagSelection = (type: number, value: string) => {
    console.log(type);
    const tagId = tagDict[value];
    if (tagId && !product.tags.includes(tagId)) {
      setProduct((prev) => ({
        ...prev,
        tags: [...prev.tags, tagId],
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submit form data: ",product);
      const response= await axios.post("http://localhost:8080/api/product/create", product, { 
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        alert("上架成功!");
      } else {
        alert(`更新失敗，狀態碼：${response.status}`);
      }
    } catch (error: any) {
      console.error("Create product error:", error);
      alert("上架失敗");
    }
  };

  return (
    <div className="bg-gray-100 p-6 border rounded-md shadow-md max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-bold text-center mb-4">基本資訊
        <span className="text-red-500 text-xs">*必填</span>
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700">商品名稱</label>
        <input
          type="text"
          placeholder="輸入商品名稱"
          className="w-full border rounded p-2"
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">圖片連結</label>
        <input
          type="text"
          placeholder="輸入圖片連結"
          className="w-full border rounded p-2"
          onChange={(e) => handleInputChange("image_url.string", e.target.value)}
        />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">動漫類型</label>
          <select
            className="w-full border rounded p-2"
            onChange={(e) => handleTagSelection(0, e.target.value)}
          >
            <option>選擇動漫類型</option>
            {type0Array.map((item, index) => (
              <option key={index}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">產品類型</label>
          <select 
            className="w-full border rounded p-2"
            onChange={(e) => handleTagSelection(1, e.target.value)}
          >
            <option>選擇產品類型</option>
            {type1Array.map((item, index) => (
              <option key={index}>{item}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700">庫存數量</label>
          <input
            type="number"
            min="1"
            placeholder="輸入庫存數量"
            className="w-full border rounded p-2"
            onChange={(e) => handleInputChange("remain", parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-gray-700">價格</label>
          <input
            type="number"
            min="1"
            placeholder="輸入價格"
            className="w-full border rounded p-2"
            onChange={(e) => handleInputChange("price", parseInt(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-gray-700">是否上架</label>
          <select 
            className="w-full border rounded p-2"
            onChange={(e) => handleInputChange("disability", e.target.value === "true")}
          >
            <option>選擇是否上架</option>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">商品描述</label>
        <textarea
          placeholder="輸入商品描述"
          className="w-full border rounded p-2"
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        上架商品
      </button>
    </div>
  );
};

export default NewProductForm;
