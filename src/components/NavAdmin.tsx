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
             <Link href="/admin/blog">
                <p
                  onClick={() => handleClick('blog')}
                  className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    activeLink === 'blog' ? 'bg-gray-700' : ''
                  }`}
                >
                  Blogs
                </p>
              </Link>
          
            </div>
          </div>
        </div>
      

  
    </nav>
  );
};

export default NavAdmin;
