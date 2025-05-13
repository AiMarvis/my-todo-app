"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function DebugSession() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        setLoading(true);
        
        // 세션 정보 가져오기
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        // 사용자 정보 가져오기
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        setSession(currentSession);
        setUser(currentUser);
      } catch (err) {
        console.error('세션 정보 로드 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  // 세션 정보를 보기 좋게 표시하는 함수
  const formatJSON = (data) => {
    return JSON.stringify(data, null, 2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supabase 세션 디버그</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">로그인 상태</h2>
          <div className="p-4 bg-gray-100 rounded-lg">
            {user ? (
              <p className="text-green-600 font-medium">✅ 로그인됨</p>
            ) : (
              <p className="text-red-600 font-medium">❌ 로그인되지 않음</p>
            )}
          </div>
        </div>
        
        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">사용자 정보</h2>
            <div className="p-4 bg-gray-100 rounded-lg overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">ID</td>
                    <td className="py-2">{user.id}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">이메일</td>
                    <td className="py-2">{user.email}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">이메일 확인됨</td>
                    <td className="py-2">{user.email_confirmed_at ? '✅ 확인됨' : '❌ 확인되지 않음'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">마지막 로그인</td>
                    <td className="py-2">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {session && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">세션 상세 정보</h2>
            <div className="p-4 bg-gray-100 rounded-lg overflow-x-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm">{formatJSON(session)}</pre>
            </div>
          </div>
        )}
        
        <div className="mt-8 space-x-4">
          <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            홈으로
          </Link>
          <Link href="/auth/login" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            로그인 페이지
          </Link>
        </div>
      </div>
    </div>
  );
} 