import React, { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface DropdownProps {
  username: string;
  role: string;
}

const Dropdown: React.FC<DropdownProps> = ({ username, role }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(true); // Initially open when rendered

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return isOpen ? (
    <div ref={dropdownRef} className="origin-top-right absolute right-0 z-50 mt-2 w-[269px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        <div className="px-4 py-2 text-sm text-gray-900">
          <div className="font-bold">{username}</div>
          <div className="text-gray-500">Role: {role}</div>
        </div>
        <div className="border-t border-gray-100"></div>
        {(role === 'Admin' || role === 'SuperAdmin') && (
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
        )}
        <Link
          href="/settings"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Settings
        </Link>
        <Link
          href="/orderhistory"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Purchase History
        </Link>
        <Link
          href="#"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Sign out
        </Link>
      </div>
    </div>
  ) : null;
};

export default Dropdown;
