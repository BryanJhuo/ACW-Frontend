import React, { useState, useEffect } from "react";
import axios from "axios";

interface ProductProps {
  id: number;
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
}

const InventoryManagementForm: React.FC = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/store/info", {
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`,
          },
        });
        const vendorID = res.data.store_id;

        const response = await axios.get("http://localhost:8080/api/product/list?vendor_id=" + vendorID);
        const data = response.data;

        let cleanedData = data.map((product: any) => ({
          id: product.id,
          description: product.description,
          disability: product.disability,
          image_url: product.image_url,
          name: product.name,
          price: product.price,
          remain: product.remain,
          tags: product.tags,
        }));
        cleanedData = data.map((product: any) => ({ ...product })).sort((a : any, b : any) => a.id - b.id);
        setProducts(cleanedData);
        console.log("products:", cleanedData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (product: ProductProps) => {
    setEditingProductId(product.id);
    setEditingProduct(product);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingProduct) {
      const { name, value } = e.target;
      if (name === "disability") {
        setEditingProduct({ ...editingProduct, [name]: value === "true" });
      }
      else if (name === "price" || name === "remain") {
        setEditingProduct({ ...editingProduct, [name]: parseInt(value) });
      }
      else {
        setEditingProduct({ ...editingProduct, [name]: value });
      }
    }
  };

  const handleSubmit = async () => {
    if (editingProduct) {
      try {
        await axios.put(`http://localhost:8080/api/product/update`, editingProduct, {
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`,
          },
        });
        alert("商品更新成功");
        setEditingProductId(null);
        setEditingProduct(null);
        // Refresh the product list
        const res = await axios.get("http://localhost:8080/api/store/info", {
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`,
          },
        });
        const vendorID = res.data.store_id;

        const response = await axios.get("http://localhost:8080/api/product/list?vendor_id=" + vendorID);
        const data = response.data;

        let cleanedData = data.map((product: any) => ({
          id: product.id,
          description: product.description,
          disability: product.disability,
          image_url: product.image_url,
          name: product.name,
          price: product.price,
          remain: product.remain,
          tags: product.tags,
        }));
        cleanedData = data.map((product: any) => ({ ...product })).sort((a : any, b : any) => a.id - b.id);
        setProducts(cleanedData);
      } catch (error) {
        console.error("商品更新失敗：", error);
        alert("商品更新失敗");
      }
    }
  };

  return (
    <div className="overflow-x-auto border-2 rounded-lg shadow-lg">
      <table className="table-fixed w-36 border-collapse bg-white text-sm text-left">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2 border-2 w-40">商品名稱</th>
            <th className="px-4 py-2 border-2 w-80">商品描述</th>
            <th className="px-4 py-2 border-2 w-32">商品價格</th>
            <th className="px-4 py-2 border-2 w-32">商品數量</th>
            <th className="px-4 py-2 border-2 w-40">商品狀態</th>
            <th className="px-4 py-2 border-2 w-32">操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              {editingProductId === product.id ? (
                <>
                  <td className="px-4 py-2 border-2 w-40">
                    <input
                      type="text"
                      name="name"
                      value={editingProduct?.name || ""}
                      onChange={handleChange}
                      className="w-full border rounded-md px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2 border-2 w-80">
                    <input
                      type="text"
                      name="description"
                      value={editingProduct?.description || ""}
                      onChange={handleChange}
                      className="w-full border rounded-md px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2 border-2 w-32">
                    <input
                      type="number"
                      name="price"
                      value={editingProduct?.price || 0}
                      onChange={handleChange}
                      className="w-full border rounded-md px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2 border-2 w-32">
                    <input
                      type="number"
                      name="remain"
                      value={editingProduct?.remain || 0}
                      onChange={handleChange}
                      className="w-full border rounded-md px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2 border-2 w-40">
                    <select
                      name="disability"
                      value={editingProduct?.disability ? "true" : "false"}
                      onChange={handleChange}
                      className="w-full border rounded-md px-2 py-1"
                    >
                      <option value="false">上架</option>
                      <option value="true">未上架</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border-2 text-center w-32">
                    <button
                      className="px-4 py-1 bg-green-500 text-white rounded-md"
                      onClick={handleSubmit}
                    >
                      保存
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-2 border-2 w-40 truncate whitespace-nowrap overflow-hidden">{product.name}</td>
                  <td className="px-4 py-2 border-2 w-80 truncate whitespace-nowrap overflow-hidden">{product.description}</td>
                  <td className="px-4 py-2 border-2 w-32 truncate whitespace-nowrap overflow-hidden">{product.price}</td>
                  <td className="px-4 py-2 border-2 w-32 truncate whitespace-nowrap overflow-hidden">{product.remain}</td>
                  <td className="px-4 py-2 border-2 w-40 truncate whitespace-nowrap overflow-hidden">{product.disability ? "未上架" : "上架"}</td>
                  <td className="px-4 py-2 border-2 text-center w-32">
                    <button
                      className="px-4 py-1 bg-blue-500 text-white rounded-md"
                      onClick={() => handleEdit(product)}
                    >
                      編輯
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagementForm;