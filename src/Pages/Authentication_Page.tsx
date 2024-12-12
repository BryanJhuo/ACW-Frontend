import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Authentication_Page() {
  const [searchText, setSearchText] = useState(''); // 儲存搜尋文字
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('sign-in');

  // 當文字改變時更新 searchText
  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (activeTab === 'sign-in') handleSignIn();
    else handleSignUp();
  };

  const handleSignIn = () => {
    // TODO : Handle sign-in logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleSignUp = () => {
    // TODO : Handle sign-up logic here
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <>
      <Header searchText={searchText} onSearchChange={handleSearchChange} />
      <div className="flex flex-col min-h-min my-10">
        {/* 中間內容區域 */}
        <div className="flex flex-1 justify-center items-center flex-col">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow border-gray-300 border">
            <div className="font-funnel-sans text-6xl font-extrabold text-center mb-6">
              {activeTab === 'sign-in' ? 'Sign In' : 'Sign Up'}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'sign-up' && (
                <div className="fa fa-trash">
                  <label htmlFor="name" className="block font-bold text-gray-700">姓名：</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block font-bold text-gray-700">信箱：</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="password" className="block font-bold text-gray-700">密碼：</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 font-bold text-white bg-gray-900 rounded hover:bg-black focus:outline-none focus:ring"
              >
                {activeTab === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
          </div>

          {/* Tab 切換按鈕，放置在表單下方並加上適當的間距 */}
          <div className="flex justify-center w-full mt-6">
            <div className="flex items-center justify-between w-max border border-gray-400 rounded-full">
              {/* Sign In Button */}
              <button
                onClick={() => setActiveTab('sign-in')}
                className={`relative flex items-center px-6 py-3 rounded-l-full border-r border-gray-400 ${activeTab === 'sign-in'
                  ? 'bg-purple-100 text-black'
                  : 'text-gray-500 bg-transparent'
                  }`}
              >
                {activeTab === 'sign-in' && (
                  <span className="absolute left-2 text-purple-700 mx-1">✔</span>
                )}
                <span className="ml-4 font-funnel-sans">Sign In</span>
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => setActiveTab('sign-up')}
                className={`relative flex items-center px-6 py-3 rounded-r-full ${activeTab === 'sign-up'
                  ? 'bg-purple-100 text-black'
                  : 'text-gray-500 bg-transparent'
                  }`}
              >
                {activeTab === 'sign-up' && (
                  <span className="absolute left-2 text-purple-700 mx-1">✔</span>
                )}
                <span className="ml-4 font-funnel-sans">Sign Up</span>
              </button>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>

  );
}

export default Authentication_Page;
