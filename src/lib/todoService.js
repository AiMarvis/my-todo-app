import { supabase } from './supabase'; // Supabase 클라이언트 가져오기

// 사용자의 모든 할 일 가져오기
export async function getTodos(userId) {
  try {
    // 사용자 ID가 없으면 빈 배열 반환
    if (!userId) {
      console.warn('getTodos: 사용자 ID가 제공되지 않았습니다.');
      return [];
    }

    // Supabase에서 사용자의 todos 테이블의 모든 데이터를 최신순으로 조회
    const query = supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    
    // 사용자 ID로 필터링
    query.eq('user_id', userId);
    
    const { data, error } = await query;
    
    // 에러 발생 시 빈 배열 반환
    if (error) {
      console.error('할 일 목록 가져오기 오류:', error);
      return [];
    }
    
    return data || []; // 데이터 반환 또는 빈 배열 반환
  } catch (error) {
    console.error('할 일 목록 가져오기 오류:', error);
    return [];
  }
}

// 월별 할 일 통계 가져오기
export async function getMonthlyStats(userId) {
  try {
    // 사용자 ID가 없으면 빈 배열 반환
    if (!userId) {
      console.warn('getMonthlyStats: 사용자 ID가 제공되지 않았습니다.');
      return [];
    }

    // Supabase에서 monthly_todo_stats view 조회
    const { data, error } = await supabase
      .from('monthly_todo_stats')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false });
    
    // 에러 발생 시 빈 배열 반환
    if (error) {
      console.error('월별 통계 가져오기 오류:', error);
      return [];
    }
    
    return data || []; // 데이터 반환 또는 빈 배열 반환
  } catch (error) {
    console.error('월별 통계 가져오기 오류:', error);
    return [];
  }
}

// 새 할 일 추가
export async function addTodo(text, userId) {
  try {
    // 사용자 ID가 없으면 오류 반환
    if (!userId) {
      console.error('addTodo: 사용자 ID가 제공되지 않았습니다.');
      throw new Error('사용자 ID가 필요합니다.');
    }

    console.log('할 일 추가 시도:', { text, userId });

    // 새 할 일 항목 추가
    const { data, error } = await supabase
      .from('todos')
      .insert([
        { 
          text, 
          completed: false,
          user_id: userId, // 사용자 ID 추가
        }
      ])
      .select(); // 삽입된 데이터 반환
    
    if (error) {
      console.error('할 일 추가 오류 상세:', error);
      return null;
    }
    
    return data?.[0] || null; // 추가된 데이터 반환
  } catch (error) {
    console.error('할 일 추가 오류 (예외):', error);
    throw error; // 오류를 상위로 전달
  }
}

// 할 일 완료 상태 토글
export async function toggleTodo(id, userId) {
  try {
    // 사용자 ID가 없으면 오류 반환
    if (!userId) {
      console.error('toggleTodo: 사용자 ID가 제공되지 않았습니다.');
      throw new Error('사용자 ID가 필요합니다.');
    }

    // 먼저 현재 할 일 항목 조회 (해당 사용자의 항목인지 확인)
    const query = supabase
      .from('todos')
      .select('completed')
      .eq('id', id)
      .eq('user_id', userId);
    
    const { data: todo, error: fetchError } = await query.single();
    
    if (fetchError) {
      console.error('할 일 조회 오류 상세:', fetchError);
      return null;
    }
    
    // 완료 상태 반전 업데이트
    const updateQuery = supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id)
      .eq('user_id', userId);
    
    const { data, error } = await updateQuery.select();
    
    if (error) {
      console.error('할 일 상태 변경 오류 상세:', error);
      return null;
    }
    
    return data?.[0] || null; // 업데이트된 데이터 반환
  } catch (error) {
    console.error('할 일 상태 변경 오류 (예외):', error);
    throw error; // 오류를 상위로 전달
  }
}

// 할 일 삭제
export async function deleteTodo(id, userId) {
  try {
    // 사용자 ID가 없으면 오류 반환
    if (!userId) {
      console.error('deleteTodo: 사용자 ID가 제공되지 않았습니다.');
      throw new Error('사용자 ID가 필요합니다.');
    }

    // ID로 할 일 항목 삭제
    const query = supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    const { error } = await query;
    
    if (error) {
      console.error('할 일 삭제 오류 상세:', error);
      return false;
    }
    
    return true; // 삭제 성공
  } catch (error) {
    console.error('할 일 삭제 오류 (예외):', error);
    throw error; // 오류를 상위로 전달
  }
}

// 여러 할 일 한번에 추가하기
export async function addMultipleTodos(todoItems, userId) {
  try {
    // 사용자 ID가 없으면 오류 반환
    if (!userId) {
      console.error('addMultipleTodos: 사용자 ID가 제공되지 않았습니다.');
      throw new Error('사용자 ID가 필요합니다.');
    }

    // 할 일 항목 배열 확인
    if (!Array.isArray(todoItems) || todoItems.length === 0) {
      throw new Error('유효한 할 일 항목 배열이 필요합니다.');
    }

    // 할 일 항목 형식 준비
    const todos = todoItems.map(text => ({
      text,
      completed: false,
      user_id: userId,
    }));

    // 여러 할 일 항목 한번에 추가
    const { data, error } = await supabase
      .from('todos')
      .insert(todos)
      .select();
    
    if (error) {
      console.error('할 일 일괄 추가 오류:', error);
      return null;
    }
    
    return data || []; // 추가된 데이터 배열 반환
  } catch (error) {
    console.error('할 일 일괄 추가 오류 (예외):', error);
    throw error; // 오류를 상위로 전달
  }
}

// 직접 Supabase 인스턴스로 할 일 추가하기
export async function createTodoWithSupabase(text, userId) {
  try {
    if (!text || !userId) {
      throw new Error('할 일 내용과 사용자 ID가 필요합니다.');
    }
    
    // Supabase 직접 호출로 할 일 추가
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          text,
          completed: false,
          user_id: userId,
          created_at: new Date().toISOString() // 현재 시간 추가
        }
      ])
      .select();
      
    if (error) {
      console.error('할 일 추가 오류:', error);
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('할 일 추가 실패:', error.message);
    throw error;
  }
} 