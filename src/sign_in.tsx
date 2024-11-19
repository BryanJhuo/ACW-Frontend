import React, { useState } from 'react';

function Sign_in() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle sign-in logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-4xl font-extrabold text-center mb-6">Sign in</div>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow border-gray-300 border">
                <form onSubmit={handleSubmit} className="space-y-4">
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
        </div>
    );
}

export default Sign_in;