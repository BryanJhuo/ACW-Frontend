import axios from "axios";
import React, { useEffect } from "react";
interface regionMap {
    [city: string]: string[];
}

interface AddressOrPhone {
  String: string;
  Valid: boolean;
}

interface MemberInfoProps {
  address: AddressOrPhone;
  email: string;
  id: number;
  name: string;
  phone_num:  AddressOrPhone;
  username: string;
}

const getMemberInfo = async (token: string) => {
  try {
    const response = await axios.get("http://localhost:8080/api/member/info", {
      headers: {
        Authorization: token,
      },
    });
    console.log("Member info:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      console.error("Unauthorized access. Please log in.");
    } else {
      console.error("Failed to fetch member info:", error);
    }
  }
};

const getStaticData = async () => {
  const response = await axios.get("http://localhost:8080/static/postal_codes.json");
  return response.data;
};

const processData = (data: any) => {
  const cities = Object.keys(data);
  const region: {[city: string]: string[]} = {};

  cities.forEach ((city) => {
    const districts = data[city];
    region[city] = Object.entries(districts).map(
      ([district, zip]) => `${district}, ${zip}`
    );
  });
  return { keys: cities, values: region };
};


const ProfileForm: React.FC = () => {
  const imageSrc = "https://i.imgur.com/Xrebmu1.jpg";
  const [city, setCity] = React.useState<string[]>([]);
  const [region, setRegion] = React.useState<regionMap>({});
  const [selectedCity, setSelectedCity] = React.useState<string>("");
  const [districts, setDistricts] = React.useState<string[]>([]); 
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");
  const [memberInfo, setMemberInfo] = React.useState<MemberInfoProps | null>(null);
  const [street, setStreet] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phone_num, setPhoneNum] = React.useState<string>("");

 const token = localStorage.getItem("authToken");

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = event.target.value;
      setSelectedCity(cityName);
      setDistricts(region[cityName] || []);
  };
    
  const haddleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(event.target.value);
  }

  const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStreet(event.target.value);
  }
    
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePhoneNumChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNum(event.target.value);
  }

  const handleUpdateMember = async() => {
    if (!token) {
      console.error("No auth token found");
      return;
    }

    const payload = {
      address: `${selectedCity}${selectedDistrict}${street}` || memberInfo?.address.String,
      email: email || memberInfo?.email,
      name: name || memberInfo?.name,
      phone_num: phone_num || memberInfo?.phone_num.String ,
    };
    
    try {
      const response = await axios.put("http://localhost:8080/api/member/update", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const updataMemberInfo = response.data;
      console.log("Member Updated successfully:", updataMemberInfo);
      alert("資料已更新! Member Updated successfully!");
    }
    catch (error) {
      console.error("Failed to update member info:", error);
      alert("資料更新失敗! Failed to update member info!");
    }
  };

  useEffect(() => { 
      if (!token) {
          console.error("No auth token found");
          return;
      }
      getMemberInfo(token).then((data) => {
        setMemberInfo(data);
      });
      getStaticData().then((data) => {
        const { keys, values } = processData(data);
        setCity(keys);
        setRegion(values);
      });

  }, []);

  return (
    <div className="max-w-md mx-auto bg-purple-50 p-8 rounded-md ">
      <div className="flex justify-center mb-6">
        <img src={imageSrc} alt="Avatar" className="w-24 h-24 rounded-full" />
      </div>
      {/*TODO: call API預先將 Name 和 Email填入 Placeholder 中 */}
      <div className="flex flex-col mb-4">
        <label className="text-gray-700 mb-1">姓名</label> 
        <input
          type="text"
          value={name || ""}
          onChange={handleNameChange}
          placeholder={memberInfo?.name || "姓名"}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-700 mb-1">信箱</label> 
        <input
          type="text"
          value={email || ""}
          onChange={handleEmailChange}
          placeholder={memberInfo?.email || "信箱"}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="flex flex-col mb-4">
        <label className="text-gray-700 mb-1">電話號碼</label> 
        <input
          type="text"
          value={phone_num || ""}
          onChange={handlePhoneNumChange}
          placeholder={memberInfo?.phone_num.String || "電話號碼"}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-500"
        />
      </div>
      
      <div className="flex flex-col mb-4">
        <label className="text-gray-700 mb-1">地址</label>
        <select
          className="border border-gray-300 rounded-md p-2 mb-2"
          value={selectedCity}
          onChange={handleCityChange}
        >
          <option>請選擇城市</option>
          {city.map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
        <select 
          className="border border-gray-300 rounded-md p-2 mb-2" 
          value={selectedDistrict} 
          onChange={haddleDistrictChange}
        >
          <option>請選擇地區</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={street}
          onChange={handleStreetChange}
          placeholder="請輸入街/弄/巷"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-500"
        />
        {/*TODO: call 修改 Memeber 的資料*/}
        <button 
          className="w-full bg-purple-400 hover:bg-purple-500 text-white py-2 rounded-md mt-2" 
          onClick={handleUpdateMember} 
        >
          修改
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;