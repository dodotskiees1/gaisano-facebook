"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleCreateAccount = () => {
    router.push('./registration');
  };

 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
            
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-auto">
      <div className="hidden md:flex md:w-1/2 relative">
        <Image
          src="/assets/images/1.jpg"
          alt="image"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl">
          <h2 className="text-blue-700 text-center font-bold text-xl">Log in</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <input
            className="focus:outline-none focus:ring-2 focus:ring-blue-300 mt-6 w-full p-4 border border-gray-300 rounded-md"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            className="focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4 w-full p-4 border border-gray-300 rounded-md"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button
            type="submit"
            className="text-white w-full py-3 bg-blue-700 shadow-lg rounded-md mt-6 cursor-pointer hover:bg-blue-500 font-semibold"
          >
            Log in
          </button>

          <div className="text-center mt-4">
            <Link href="" className="text-blue-600 font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <div className="my-6 border-t border-gray-300"></div>

          <button
            type="button"
            onClick={handleCreateAccount}
            className="text-white w-full py-3 bg-green-600 shadow-lg rounded-md cursor-pointer hover:bg-green-500 font-semibold"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;