import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface RegionMap {
  [city: string]: string[];
}

interface CreditCardInfo {
  cardNum: string;
  expirationDate: string;
  ccv: string;
}

interface FormData {
  address: string;
  description: string;
  name: string;
  payment_method: number;
  phone_num: string;
  shipment_method: number;
  state: string;
}

const getStaticData = async (): Promise<any> => {
  try {
    const response = await axios.get('http://localhost:8080/static/postal_codes.json');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getStaticData2 = async (): Promise<any> => {
  try {
    const response = await axios.get('http://localhost:8080/static/store_locations.json');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const processData = (data: any) => {
  const cities = Object.keys(data) || [];
  const region: RegionMap = {};

  cities.forEach((city) => {
    const districts = data[city];
    region[city] = Object.entries(districts).map(
      ([district, zip]) => `${district}, ${zip}`
    );
  });
  return { keys: cities, values: region };
};

const OrderPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showCreditCard, setShowCreditCard] = useState(false);
  const [shipmentMethod, setShipmentMethod] = useState(-1);
  const [storeData, setStoreData] = useState<any>([]);
  const [creditCard, setCreditCard] = useState<CreditCardInfo>({
    cardNum: '',
    expirationDate: '',
    ccv: '',
  });
  const [formData, setFormData] = useState<FormData>({
    address: '',
    description: '',
    name: '',
    payment_method: -1,
    phone_num: '',
    shipment_method: -1,
    state: Math.random() > 0.5 ? '未出貨' : Math.random() > 0.5 ? '處理中' : Math.random() > 0.5 ? '運送中' : '已送達',
  });
  const [city, setCity] = useState<string[]>([]);
  const [region, setRegion] = useState<RegionMap>({});
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    (async () => {
      const data = await getStaticData();
      if (data) {
        const { keys, values } = processData(data);
        setCity(keys);
        setRegion(values);
      }
    })();
    (async () => {
      const data = await getStaticData2();
      if (data) {
        setStoreData(data);
      }
    })();
  }, []);

  const handleSearchChange = (text: string) => setSearchText(text);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'payment_method') {
      setShowCreditCard(value === '0');
    }

    if (name === 'shipment_method') {
      setShipmentMethod(parseInt(value));
      if (parseInt(value) === 0) {
        setSelectedCity('');
        setSelectedDistrict('');
        setAddress('');
      }
      if (parseInt(value) === 1) {
        setSelectedStoreCity('');
        setSelectedStoreDistrict('');
        setSelectedStore('');
      }
      setFormData((prev) => ({ ...prev, address: '' }));
    }

    setFormData((prev) => ({ ...prev, [name]: (name === 'payment_method' || name === 'shipment_method') ? parseInt(value) : value }));
  };

  const handleCreditCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreditCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = event.target.value;
    setSelectedCity(cityName);
    setDistricts(region[cityName] || []);
    handleChange({
      target: {
        name: 'address',
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = event.target.value;
    setSelectedDistrict(districtName);
    handleChange({
      target: {
        name: 'address',
        value: `${selectedCity}, ${selectedDistrict}, ${event.target.value}`,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedCity === '' || selectedDistrict === '') {
      alert('請選擇城市與地區');
      return;
    }
    setAddress(event.target.value);
    handleChange({
      target: {
        name: 'address',
        value: `${selectedCity}, ${selectedDistrict}, ${event.target.value}`,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const [selectedStoreCity, setSelectedStoreCity] = useState<string>("");
  const [selectedStoreDistrict, setSelectedStoreDistrict] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string>("");

  // Handle city selection
  const handleStoreCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedStoreCity(city);
    setSelectedStoreDistrict("");
    setSelectedStore("");
    handleChange({
      target: {
        name: 'address',
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Handle district selection
  const handleStoreDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const district = event.target.value;
    setSelectedStoreDistrict(district);
    setSelectedStore("");
    handleChange({
      target: {
        name: 'address',
        value: "",
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Handle store selection
  const handleStoreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const store: any = event.target.value;
    setSelectedStore(store);
    const address: any = storeData[selectedStoreCity]?.[selectedStoreDistrict]?.[store] || "";
    handleChange({
      target: {
        name: 'address',
        value: address,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const checkFilled = (obj: FormData): boolean => {
      if (!obj.name) return alert('請填寫姓名'), false;
      if (!obj.phone_num) return alert('請填寫電話'), false;
      if (obj.shipment_method === -1) return alert('請選擇配送方式'), false;
      if (obj.payment_method === -1) return alert('請選擇付款方式'), false;
      if (!obj.address) return alert('請填寫地址或門市'), false;
      return true;
    };

    if (!checkFilled(formData)) return;

    try {
      if (formData.payment_method === 0) {
        if (!creditCard.cardNum || !creditCard.expirationDate || !creditCard.ccv) {
          alert('請填寫信用卡資訊');
          return;
        }
      }

      console.log(formData);
      await axios.post('http://localhost:8080/api/order/create', formData, {
        headers: {
          Authorization: `${localStorage.getItem('authToken')}`
        },
      });
      alert('訂單提交成功');
    } catch (err: any) {
      const response = err.response;
      if (response) {
        if (response.status === 401) {
          alert('請先登入');
        }
        if (response.status === 400) {
          const data = response.data;
          if (data && data.error) {
            if (data.error === 'Invalid token') {
              alert('登入逾期，請重新登入');
              localStorage.removeItem('authToken');
              localStorage.removeItem('role');
              window.location.href = '/auth';
            }
            else if (data.error === 'Cart is empty') {
              alert('購物車是空的，請先加入商品');
            }
            else if (data.error === 'Not enough stock') {
              if (data.stock === 0)
                alert(`${data.product_name} 商品已售完`);
              else
                alert(`商品太熱銷了，${data.product_name} 只剩 ${data.remain} 個`);
            }
            else {
              alert('訂單提交失敗');
            }
          }
        }
      } else {
        alert('訂單提交失敗');
      }
    }
  };

  return (
    <div>
      <Header searchText={searchText} onSearchChange={handleSearchChange} />
      <div className="max-w-2xl mx-auto py-12 min-h-[calc(100vh-300px)]">
        {/* Step Progress Indicator */}
        <div className="flex items-center justify-around mb-6">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full w-10 h-10 flex items-center justify-center ${currentStep === step ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
                    }`}
                >
                  {step}
                </div>
                <p className="mt-1">步驟 {step}</p>
              </div>
              {step < 3 && <div className="flex-1 h-0.5 bg-gray-300 mx-2" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <StepOne formData={formData} handleChange={handleChange} nextStep={nextStep} />
        )}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">第二步：配送方式</h2>
            <div>
              <label className="block mb-1">配送方式</label>
              <select
                className="w-full border rounded p-2"
                name="shipment_method"
                value={formData.shipment_method}
                onChange={handleChange}
              >
                <option value={-1}>請選擇配送方式</option>
                <option value={0}>宅配</option>
                <option value={1}>超商取貨</option>
              </select>
            </div>
            {shipmentMethod === 0 && (
              <div>
                <label className="block mb-1"></label>
                <select
                  className="w-full border rounded p-2"
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
                <label className="block mb-1"></label>
                <select
                  className="w-full border rounded p-2"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                >
                  <option>請選擇地區</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <input
                  className="w-full border rounded p-2 block mt-2"
                  name="address"
                  placeholder="請輸入地址"
                  value={address}
                  onChange={handleAddressChange}
                />
              </div>
            )}
            {shipmentMethod === 1 && (
              <div>
                <label className="block mb-1">超商取貨門市</label>
                <select
                  className="w-full border rounded p-2"
                  value={selectedStoreCity}
                  onChange={handleStoreCityChange}
                >
                  <option>請選擇城市</option>
                  {Object.keys(storeData).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <label className="block mb-1"></label>
                <select
                  className="w-full border rounded p-2"
                  value={selectedStoreDistrict}
                  onChange={handleStoreDistrictChange}
                >
                  <option>請選擇地區</option>
                  {storeData[selectedStoreCity] && Object.keys(storeData[selectedStoreCity]).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <label className="block mb-1"></label>
                <select
                  className="w-full border rounded p-2"
                  value={selectedStore}
                  onChange={handleStoreChange}
                >
                  <option>請選擇門市</option>
                  {selectedStoreDistrict &&
                    Object.keys(storeData[selectedStoreCity][selectedStoreDistrict]).map(
                      (store) => (
                        <option key={store} value={store}>
                          {store}
                        </option>
                      )
                    )}
                </select>
              </div>
            )}
            <div className="flex justify-between">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={prevStep}>
                上一步
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={nextStep}>
                下一步
              </button>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <StepThree
            showCreditCard={showCreditCard}
            creditCard={creditCard}
            handleCreditCardChange={handleCreditCardChange}
            formData={formData}
            handleChange={handleChange}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

const StepOne: React.FC<{
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
}> = ({ formData, handleChange, nextStep }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">第一步：基本資訊</h2>
    {['name', 'description', 'phone_num'].map((field) => (
      <div key={field}>
        <label className="block mb-1">{field === 'name' ? '姓名' : field === 'description' ? '訂單備註' : '電話'}</label>
        <input
          className="w-full border rounded p-2"
          name={field}
          value={formData[field as keyof FormData] as string}
          onChange={handleChange}
        />
      </div>
    ))}
    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={nextStep}>
      下一步
    </button>
  </div>
);

const StepThree: React.FC<{
  showCreditCard: boolean;
  creditCard: CreditCardInfo;
  handleCreditCardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  prevStep: () => void;
  handleSubmit: () => void;
}> = ({
  showCreditCard,
  creditCard,
  handleCreditCardChange,
  formData,
  handleChange,
  prevStep,
  handleSubmit,
}) => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">第三步：付款方式</h2>
      <div>
        <label className="block mb-1">付款方式<span className='text-sm text-gray-500 ml-4'>本服務採用外部付款系統，無儲存信用卡資料與 CCV，保障用戶安全</span></label>

        <select
          className="w-full border rounded p-2"
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
        >
          <option value={-1}>請選擇付款方式</option>
          <option value={0}>信用卡</option>
          <option value={1}>貨到付款</option>
        </select>
      </div>
      {showCreditCard && (
        <>
          <div>
            <label className="block mb-1">信用卡號</label>
            <input
              className="w-full border rounded p-2"
              name="cardNum"
              value={creditCard.cardNum}
              onChange={handleCreditCardChange}
            />
          </div>
          <div>
            <label className="block mb-1">有效日期</label>
            <input
              className="w-full border rounded p-2"
              name="expirationDate"
              value={creditCard.expirationDate}
              onChange={handleCreditCardChange}
            />
          </div>
          <div>
            <label className="block mb-1">CCV</label>
            <input
              className="w-full border rounded p-2"
              name="ccv"
              value={creditCard.ccv}
              onChange={handleCreditCardChange}
            />
          </div>
        </>
      )}
      <div className="flex justify-between">
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={prevStep}>
          上一步
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>
          送出
        </button>
      </div>
    </div>
  );

export default OrderPage;
