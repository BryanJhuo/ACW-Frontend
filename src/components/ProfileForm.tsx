import axios from "axios";
import React, { useEffect } from "react";
interface regionMap {
    [city: string]: string[];
}

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

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const cityName = event.target.value;
        setSelectedCity(cityName);
        setDistricts(region[cityName] || []);
    };

    useEffect(() => { 
        getStaticData().then((data) => {
            const { keys, values } = processData(data);
            setCity(keys);
            setRegion(values);
        });
    });

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
          placeholder="姓名"
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-gray-700 mb-1">信箱</label> 
        <input
          type="text"
          placeholder="信箱"
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
        <select className="border border-gray-300 rounded-md p-2 mb-2">
          <option>請選擇地區</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
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