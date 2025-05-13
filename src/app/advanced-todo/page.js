"use client";
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import AdvancedTodoForm from '../../components/AdvancedTodoForm';
import { useTodo } from '../../context/TodoContext';
import AuthGuard from '../../components/AuthGuard';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function AdvancedTodo() {
  const { isLoading: todoLoading } = useTodo();
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      {todoLoading ? (
        <div className="flex justify-center items-center h-screen">로딩 중...</div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md mx-auto px-4 py-5 overflow-y-auto max-h-screen">
            <Navbar />

            {/* 사용자 정보 및 로그아웃 버튼 */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">고급 할 일 추가</h1>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{user?.email}</span>
                <button 
                  onClick={logout}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  로그아웃
                </button>
              </div>
            </div>
            
            {/* 백버튼 */}
            <div className="mb-4">
              <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                할 일 목록으로 돌아가기
              </Link>
            </div>
            
            <AdvancedTodoForm />
          </div>
        </div>
      )}
    </AuthGuard>
  );
} 