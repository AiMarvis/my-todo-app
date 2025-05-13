"use client"; // Next.js 클라이언트 컴포넌트 선언
import { useState } from 'react'; // React의 상태 관리 훅 가져오기
import Navbar from '../components/Navbar'; // 네비게이션 바 컴포넌트 가져오기
import TodoSection from '../components/TodoSection'; // 할 일 섹션 컴포넌트 가져오기
import Modal from '../components/Modal'; // 모달 컴포넌트 가져오기
import { useTodo } from '../context/TodoContext'; // Todo 컨텍스트 훅 가져오기
import AuthGuard from '../components/AuthGuard'; // 인증 보호 컴포넌트 가져오기
import { useAuth } from '../context/AuthContext'; // Auth 컨텍스트 훅 가져오기
import Link from 'next/link'; // Next.js 링크 컴포넌트 가져오기

export default function Home() { // 홈 페이지 컴포넌트 정의
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리
  const { isLoading: todoLoading } = useTodo(); // Todo 컨텍스트에서 로딩 상태 가져오기
  const { user, logout } = useAuth(); // 인증 컨텍스트에서 사용자 정보와 로그아웃 함수 가져오기
  
  const openModal = () => setIsModalOpen(true); // 모달 열기 함수
  const closeModal = () => setIsModalOpen(false); // 모달 닫기 함수

  return ( // 메인 UI 렌더링
    <AuthGuard> {/* 인증 보호 컴포넌트로 감싸기 */}
      {todoLoading ? ( // 로딩 중일 때 표시할 UI
        <div className="flex justify-center items-center h-screen">로딩 중...</div> // 로딩 화면 표시
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-50"> {/* 전체 화면 컨테이너 */}
          <div className="w-full max-w-md mx-auto px-4 py-5 overflow-y-auto max-h-screen"> {/* 내용 컨테이너 */}
            <Navbar /> {/* 네비게이션 바 컴포넌트 */}

            {/* 사용자 정보 및 로그아웃 버튼 */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">내 할 일 목록</h1> {/* 페이지 제목 */}
              
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
            
            {/* 고급 할 일 추가 페이지 링크 */}
            <div className="mb-4 flex justify-end">
              <Link 
                href="/advanced-todo" 
                className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                고급 할 일 추가
              </Link>
            </div>
            
            <TodoSection /> {/* 할 일 섹션 컴포넌트 */}
            
            <button
              onClick={openModal} // 버튼 클릭 시 모달 열기
              className="fixed bottom-4 right-4 bg-blue-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 focus:outline-none" // 플로팅 버튼 스타일
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* 플러스 아이콘 */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> {/* 아이콘 패스 */}
              </svg>
            </button>
            
            <Modal isOpen={isModalOpen} onClose={closeModal} title="도움말"> {/* 도움말 모달 컴포넌트 */}
              <div className="space-y-4"> {/* 모달 내용 컨테이너 */}
                <p>이 앱은 할 일을 관리하는 간단한 애플리케이션입니다.</p> {/* 설명 텍스트 */}
                <p>할 일을 추가하고, 완료했을 때 체크하고, 더 이상 필요없는 항목은 삭제할 수 있습니다.</p> {/* 사용법 설명 */}
                <p>모든 할 일은 Supabase에 저장됩니다.</p> {/* 저장 방식 설명 */}
                <div className="mt-6 pt-4 border-t"> {/* 버튼 컨테이너 */}
                  <button
                    onClick={closeModal} // 버튼 클릭 시 모달 닫기
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" // 버튼 스타일
                  >
                    확인 {/* 버튼 텍스트 */}
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      )}
    </AuthGuard>
  );
} 