import { useState } from 'react'

function Authentication_Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [activeTab, setActiveTab] = useState("sign-in")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (activeTab == 'sign-in')
      handleSignIn()
    else
      habdleSignUp()
  }

  const handleSignIn = () => {
    // TODO : Handle sign-in logic here
    console.log('Email:', email)
    console.log('Password:', password)
  }

  const habdleSignUp = () => {
    // TODO : Handle sign-up logic here
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Password:', password)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="font-funnel-sans text-6xl font-extrabold text-center mb-6">{activeTab === "sign-in" ? "Sign In" : "Sign Up"}</div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow border-gray-300 border">
        <form onSubmit={handleSubmit} className="space-y-4">
          {
            activeTab === "sign-up" ? (
              <div className='fa fa-trash' style={{ visibility: activeTab == "sign-up" ? 'visible' : 'hidden' }}>
                <label htmlFor="name" className="block font-bold text-gray-700">姓名：</label>
                <input
                  type="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring"
                />
              </div>
            ) :
              (<></>)
          }
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
            className="w-full px-4 py-2 font-bold text-white bg-gray-900 rounded hover:bg-black focus:outline-none focus:ring "
          >
            Sign in
          </button>
        </form>
      </div>
      <div className="flex items-center justify-between w-max mt-6 border border-gray-400 rounded-full">
        {/* Sign In Button */}
        <button
          onClick={() => setActiveTab("sign-in")}
          className={`relative flex items-center px-6 py-3 rounded-l-full border-r border-gray-400 ${activeTab === "sign-in"
            ? "bg-purple-100 text-black"
            : "text-gray-500 bg-transparent"
            }`}
        >
          {activeTab === "sign-in" && (
            <span className="absolute left-2 text-purple-700 mx-1">✔</span>
          )}
          <span className="ml-4 font-funnel-sans">Sign In</span>
        </button>

        {/* Sign Up Button */}
        <button
          onClick={() => setActiveTab("sign-up")}
          className={`relative flex items-center px-6 py-3 rounded-r-full ${activeTab === "sign-up"
            ? "bg-purple-100 text-black"
            : "text-gray-500 bg-transparent"
            }`}
        >
          {activeTab === "sign-up" && (
            <span className="absolute left-2 text-purple-700 mx-1">✔</span>
          )}
          <span className="ml-4 font-funnel-sans">Sign Up</span>
        </button>
      </div>
    </div>
  )
}

export default Authentication_Page