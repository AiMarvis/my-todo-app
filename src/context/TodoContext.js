"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getTodos, addTodo as addTodoApi, toggleTodo as toggleTodoApi, deleteTodo as deleteTodoApi, getMonthlyStats } from '../lib/todoService';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadTodos() {
      try {
        setIsLoading(true);
        if (!user) {
          setTodos([]);
          return;
        }
        
        const todoData = await getTodos(user.id);
        setTodos(todoData);
        
        // 월별 통계 데이터 로드
        const statsData = await getMonthlyStats(user.id);
        setMonthlyStats(statsData);
        
        setError(null);
      } catch (err) {
        console.error("할 일 목록 로드 오류:", err);
        setError("할 일 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTodos();

    // 사용자가 로그인 상태일 때만 실시간 구독 설정
    if (user) {
      const subscription = supabase
        .channel('todos')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'todos',
          filter: `user_id=eq.${user.id}` 
        }, (payload) => {
          console.log('실시간 변경:', payload);
          loadTodos();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const addTodo = async (text) => {
    try {
      if (!user) {
        setError("로그인이 필요한 기능입니다.");
        return;
      }
      
      const newTodo = await addTodoApi(text, user.id);
      if (newTodo) {
        setTodos([newTodo, ...todos]);
      }
    } catch (err) {
      console.error("할 일 추가 오류:", err);
      setError("할 일을 추가하는데 실패했습니다.");
    }
  };

  const toggleTodo = async (id) => {
    try {
      if (!user) {
        setError("로그인이 필요한 기능입니다.");
        return;
      }
      
      const updatedTodo = await toggleTodoApi(id, user.id);
      if (updatedTodo) {
        setTodos(
          todos.map(todo =>
            todo.id === id ? updatedTodo : todo
          )
        );
      }
    } catch (err) {
      console.error("할 일 상태 변경 오류:", err);
      setError("할 일 상태를 변경하는데 실패했습니다.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      if (!user) {
        setError("로그인이 필요한 기능입니다.");
        return;
      }
      
      const success = await deleteTodoApi(id, user.id);
      if (success) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (err) {
      console.error("할 일 삭제 오류:", err);
      setError("할 일을 삭제하는데 실패했습니다.");
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        error,
        addTodo,
        toggleTodo,
        deleteTodo,
        activeTodos,
        completedTodos,
        monthlyStats,
        user
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
} 