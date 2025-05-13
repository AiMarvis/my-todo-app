"use client";
import { useState } from 'react';
import { createTodoWithSupabase, addMultipleTodos } from '../lib/todoService';
import { useTodo } from '../context/TodoContext';

export default function AdvancedTodoForm() {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('보통');
  const [bulkText, setBulkText] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useTodo();

  const priorities = ['낮음', '보통', '높음', '긴급'];

  // 단일 할 일 추가
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      setStatus({ type: 'info', message: '할 일을 추가하는 중...' });
      
      // 할 일 텍스트에 우선순위 정보 추가
      const todoText = priority !== '보통' ? `[${priority}] ${text}` : text;
      
      // Supabase를 통해 직접 할 일 추가
      const newTodo = await createTodoWithSupabase(todoText, user?.id);
      
      if (newTodo) {
        setStatus({ type: 'success', message: '할 일이 추가되었습니다.' });
        setText('');
        setDescription('');
        setPriority('보통');
        
        // 2초 후 상태 메시지 초기화
        setTimeout(() => {
          setStatus({ type: '', message: '' });
        }, 2000);
      }
    } catch (error) {
      setStatus({ type: 'error', message: `오류: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // 여러 할 일 일괄 추가
  const handleBulkAdd = async (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;
    
    try {
      setLoading(true);
      setStatus({ type: 'info', message: '할 일을 일괄 추가하는 중...' });
      
      // 줄바꿈으로 구분된 텍스트를 배열로 변환
      const todoItems = bulkText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      if (todoItems.length === 0) {
        setStatus({ type: 'warning', message: '추가할 할 일이 없습니다.' });
        setLoading(false);
        return;
      }
      
      // 일괄 추가 함수 호출
      const result = await addMultipleTodos(todoItems, user?.id);
      
      if (result) {
        setStatus({ 
          type: 'success', 
          message: `${result.length}개의 할 일이 추가되었습니다.` 
        });
        setBulkText('');
        
        // 2초 후 상태 메시지 초기화
        setTimeout(() => {
          setStatus({ type: '', message: '' });
        }, 2000);
      }
    } catch (error) {
      setStatus({ type: 'error', message: `오류: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // 사용자가 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
        <p className="text-yellow-700">할 일을 추가하려면 로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">고급 할 일 추가</h2>
      
      {/* 상태 메시지 표시 */}
      {status.message && (
        <div className={`p-3 rounded-md ${
          status.type === 'success' ? 'bg-green-50 text-green-700' :
          status.type === 'error' ? 'bg-red-50 text-red-700' :
          status.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {status.message}
        </div>
      )}
      
      {/* 단일 할 일 추가 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            할 일 내용
          </label>
          <input
            id="text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="할 일을 입력하세요"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={loading}
            required
          />
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            우선순위
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={loading}
          >
            {priorities.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
          disabled={loading || !text}
        >
          {loading ? '추가 중...' : '할 일 추가'}
        </button>
      </form>
      
      <div className="border-t border-gray-200 my-4 pt-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">일괄 추가</h3>
        
        <form onSubmit={handleBulkAdd} className="space-y-4">
          <div>
            <label htmlFor="bulkText" className="block text-sm font-medium text-gray-700 mb-1">
              여러 할 일 (줄바꿈으로 구분)
            </label>
            <textarea
              id="bulkText"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder="우유 사기&#10;빨래하기&#10;책 읽기"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px]"
              disabled={loading}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none disabled:bg-gray-400"
            disabled={loading || !bulkText}
          >
            {loading ? '추가 중...' : '일괄 추가'}
          </button>
        </form>
      </div>
    </div>
  );
} 