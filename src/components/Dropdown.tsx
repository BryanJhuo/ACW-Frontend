import React, { useState } from "react";

interface DropdownProps {
  label: string;
  options: number[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, options }) => {
  const [quantity, setQuantity] = useState<number>(options[0]);

  /*const haddleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };*/

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        {/* 下拉選單 */}
        <select
          className="border rounded p-2"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {/* 數量輸入框
        <input
          type="number"
          className="border rounded p-2 w-20"
          value={quantity}
          onChange={haddleInputChange}
          min={1}
        /> */}
      </div>
    </div>
  );
};

export default Dropdown;
