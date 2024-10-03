"use client"
import { useState } from 'react';
import Link from 'next/link';

const NavAdmin = () => {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <nav className="bg-gray-800 w-[100%] relative ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard">
              <p
                onClick={() => handleClick('dashboard')}
                className={`text-white font-bold text-xl cursor-pointer ${
                  activeLink === 'dashboard' ? 'bg-gray-700' : ''
                }`}
              >
                Dashboard
              </p>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/admin/brandlist">
                <p
                  onClick={() => handleClick('brandlist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'brandlist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Brands
                </p>
              </Link>
              <Link href="/admin/categorylist">
                <p
                  onClick={() => handleClick('categorylist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'categorylist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Categories
                </p>
              </Link>
              <Link href="/admin/productlist">
                <p
                  onClick={() => handleClick('productlist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'productlist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Products
                </p>
              </Link>
              <Link href="/admin/reviewlist">
                <p
                  onClick={() => handleClick('reviewlist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'reviewlist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Reviews
                </p>
              </Link>
              <Link href="/admin/orderlist">
                <p
                  onClick={() => handleClick('orderlist')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'orderlist' ? 'bg-gray-700' : ''
                  }`}
                >
                  Orders
                </p>
              </Link>
              <Link href="/admin/company">
                <p
                  onClick={() => handleClick('company')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'company' ? 'bg-gray-700' : ''
                  }`}
                >
                  Company
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, shown when isOpen is true */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/admin/brandlist">
            <p
              onClick={() => handleClick('brandlist')}
              className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                activeLink === 'brandlist' ? 'bg-gray-700' : ''
              }`}
            >
              Brands
            </p>
          </Link>
          <Link href="/admin/categorylist">
            <p
              onClick={() => handleClick('categorylist')}
              className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                activeLink === 'categorylist' ? 'bg-gray-700' : ''
              }`}
            >
              Categories
            </p>
          </Link>
          <Link href="/admin/productlist">
            <p
              onClick={() => handleClick('productlist')}
              className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                activeLink === 'productlist' ? 'bg-gray-700' : ''
              }`}
            >
              Products
            </p>
          </Link>
          <Link href="/admin/reviewlist">
            <p
              onClick={() => handleClick('reviewlist')}
              className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                activeLink === 'reviewlist' ? 'bg-gray-700' : ''
              }`}
            >
              Reviews
            </p>orderlist
          </Link>
          <Link href="/admin/orderlist">
            <p
              onClick={() => handleClick('orderlist')}
              className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                activeLink === 'orderlist' ? 'bg-gray-700' : ''
              }`}
            >
              Orders
            </p>
          </Link>
          <Link href="/admin/company">
            <p
              onClick={() => handleClick('company')}
              className={`text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                activeLink === 'company' ? 'bg-gray-700' : ''
              }`}
            >
              Company
            </p>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavAdmin;
