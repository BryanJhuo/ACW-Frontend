import React from "react";

interface InputFieldProps {
    label: string;
    placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
  }) => {
    return (
      <div className="flex flex-col mb-4">
        <label className="text-gray-700 mb-1">{label}</label>
        <input
          type="text"
          placeholder={placeholder}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-500"
        />
      </div>
    );
  };

const ProfileForm: React.FC = () => {
    const imageSrc = "https://i.imgur.com/Xrebmu1.jpg";
    return (
        <div className="max-w-md mx-auto bg-purple-50 p-8 rounded-md ">
      <div className="flex justify-center mb-6">
        <img src={imageSrc} alt="Avatar" className="w-24 h-24 rounded-full" />
      </div>
      {/*TODO: call API預先將 Name 和 Email填入 Placeholder 中 */}
      <InputField label="姓名" placeholder="姓名" />
      <InputField label="信箱" placeholder="信箱" />
      <div className="flex flex-col mb-4">
        <label className="text-gray-700 mb-1">地址</label>
        <select className="border border-gray-300 rounded-md p-2 mb-2">
          <option>請選擇城市</option>
        </select>
        <select className="border border-gray-300 rounded-md p-2 mb-2">
          <option>請選擇地區</option>
        </select>
        <input
          type="text"
          placeholder="請輸入街/弄/巷"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-500"
        />
        {/*TODO: call 修改 Memeber 的資料*/}
        <button className="w-full bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-md mt-2">
          修改
        </button>
      </div>
    </div>
    )
};

export default ProfileForm;