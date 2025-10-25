import React from "react";
import { Link } from "@inertiajs/react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Wallet
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Link
              href="/"
              disabled
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link href="/assets" className="text-gray-600 hover:text-gray-900">
              Assets
            </Link>
            <Link
              href="/transactions"
              className="text-gray-600 hover:text-gray-900"
            >
              Transactions
            </Link>
            <Link href="/income" className="text-gray-600 hover:text-gray-900">
              Income
            </Link>
          </nav>
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
