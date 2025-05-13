"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white rounded-xl shadow-md p-4 mb-6 sticky top-0 z-10">
      <ul className="flex justify-center space-x-6">
        <li>
          <Link 
            href="/"
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              pathname === '/' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`}
          >
            홈
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard"
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              pathname === '/dashboard' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }`}
          >
            대시보드
          </Link>
        </li>
      </ul>
    </nav>
  );
} 