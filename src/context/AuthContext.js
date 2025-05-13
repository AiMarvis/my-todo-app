"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import { signIn, signUp, signOut, getCurrentUser } from '../lib/auth';

// 인증 컨텍스트 생성
const AuthContext = createContext();

// 인증 제공자 컴포넌트
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 사용자 세션 초기화 및 이벤트 리스너 설정
  useEffect(() => {
    // 현재 세션 가져오기
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const user = await getCurrentUser();
        setUser(user);
      } catch (err) {
        console.error('세션 로드 오류:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // 인증 상태 변경 리스너 설정
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);

        // 로그인 또는 로그아웃 상태에 따른 리다이렉션
        if (event === 'SIGNED_IN') {
          router.push('/');
        } else if (event === 'SIGNED_OUT') {
          router.push('/auth/login');
        }
      }
    );

    // 컴포넌트 언마운트 시 리스너 정리
    return () => subscription.unsubscribe();
  }, [router]);

  // 회원가입 함수
  const register = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user: newUser } = await signUp(email, password);
      if (newUser) {
        setUser(newUser);
        return true;
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 함수
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user: loggedInUser } = await signIn(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut();
      setUser(null);
    } catch (err) {
      console.error('로그아웃 오류:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 인증 컨텍스트 훅
export function useAuth() {
  return useContext(AuthContext);
} 