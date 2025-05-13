"use client";
import { useState } from 'react';
import { resetPassword } from '../../../lib/auth';
import Link from 'next/link';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error('비밀번호 재설정 오류:', err);
      setError('비밀번호 재설정 이메일 전송에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">비밀번호 재설정</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success ? (
          <div className="space-y-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.
            </div>
            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-blue-500 hover:text-blue-600">
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="가입한 이메일 주소를 입력하세요"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? '처리 중...' : '비밀번호 재설정 이메일 보내기'}
            </button>
            
            <div className="mt-4 text-center">
              <Link href="/auth/login" className="text-blue-500 hover:text-blue-600">
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 