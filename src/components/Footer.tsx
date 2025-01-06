import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full bg-gray-50 py-8 px-8 shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.2)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700 text-sm text-left">
        {/* 第一列：圖標區塊 */}
        <div className="flex flex-col items-start justify-start w-full max-w-[400px] mx-auto">
          <p className="font-bold text-xl">星空下的夢想店</p>
          <p className="mt-2 text-gray-500">Your one-stop shop for all your needs.</p>
        </div>

        {/* 為什麼選擇我們區塊 */}
        <div className="flex flex-col items-start">
          <p className="font-bold">Why Choose Us</p>
          <ul>
            <li>High Quality Products</li>
            <li>Competitive Prices</li>
            <li>Excellent Customer Service</li>
            <li>Fast and Reliable Shipping</li>
          </ul>
        </div>

        {/* 我們的優勢區塊 */}
        <div className="flex flex-col items-start">
          <p className="font-bold">Our Advantages</p>
          <ul>
            <li>Wide Range of Products</li>
            <li>Easy and Secure Shopping</li>
            <li>Customer Satisfaction Guarantee</li>
            <li>Exclusive Offers and Discounts</li>
          </ul>
        </div>

        {/* 關於我們區塊 */}
        <div className="flex flex-col items-start">
          <p className="font-bold">Links</p>
          <ul>
            <li><a href="https://github.com/NTUT-Database-System-Course/ACW-Frontend" className="hover:underline">GitHub</a></li>
            <li><a href="mailto:support@yourcompany.com" className="hover:underline">Mail</a></li>
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
            <li><a href="tel:+1234567890" className="hover:underline">Phone</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500">
        © 2024 星空下的夢想店 All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;