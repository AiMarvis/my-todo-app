"use client";
import { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import { useTodo } from '../../context/TodoContext';

// 최근 활동 컴포넌트
function RecentActivities({ todos }) {
  if (todos.length === 0) {
    return <p className="text-gray-500 italic text-center py-4">아직 기록이 없습니다.</p>;
  }

  return (
    <ul className="space-y-2">
      {todos.slice(0, 3).map(todo => (
        <li key={todo.id} className="p-3 border rounded-lg">
          <span className={todo.completed ? 'line-through text-gray-400' : ''}>{todo.text}</span>
          <span className="block text-xs text-gray-500 mt-1">
            {new Date(todo.created_at).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
}

// 통계 카드 컴포넌트
function StatCard({ title, count, bgColor, textColor }) {
  return (
    <div className={`${bgColor} p-4 rounded-lg text-center`}>
      <h3 className="text-gray-700 mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${textColor}`}>{count}</p>
    </div>
  );
}

// 월별 통계 컴포넌트
function MonthlyStats({ stats }) {
  if (!stats || stats.length === 0) {
    return <p className="text-gray-500 italic text-center py-4">월별 통계 데이터가 없습니다.</p>;
  }

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">월</th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전체</th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">완료</th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대기</th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">완료율</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stats.map((stat, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {new Date(stat.month).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {stat.total_todos}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600">
                {stat.completed_todos}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-blue-600">
                {stat.pending_todos}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                <span className={`inline-block w-12 text-center rounded-full px-2 py-1 text-xs ${
                  stat.completion_rate >= 75 ? 'bg-green-100 text-green-800' : 
                  stat.completion_rate >= 50 ? 'bg-blue-100 text-blue-800' : 
                  stat.completion_rate >= 25 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {stat.completion_rate}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 달력 컴포넌트
function Calendar({ todos, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showYearMonthSelector, setShowYearMonthSelector] = useState(false);
  
  // 연도 선택을 위한 범위 생성 (현재 연도 기준 전후 10년)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  
  // 월 선택을 위한 배열
  const months = [
    { value: 0, label: '1월' },
    { value: 1, label: '2월' },
    { value: 2, label: '3월' },
    { value: 3, label: '4월' },
    { value: 4, label: '5월' },
    { value: 5, label: '6월' },
    { value: 6, label: '7월' },
    { value: 7, label: '8월' },
    { value: 8, label: '9월' },
    { value: 9, label: '10월' },
    { value: 10, label: '11월' },
    { value: 11, label: '12월' }
  ];
  
  // 현재 달의 첫 날과 마지막 날 계산
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // 달력에 표시할 날짜 범위 (이전 달의 마지막 일부 + 현재 달 + 다음 달의 첫 일부)
  const startDay = firstDayOfMonth.getDay(); // 이번 달 1일의 요일 (0: 일요일)
  const totalDays = lastDayOfMonth.getDate(); // 이번 달의 총 일수
  
  // 각 날짜별 할 일 목록 생성
  const todosByDate = useMemo(() => {
    const result = {};
    
    todos.forEach(todo => {
      const todoDate = new Date(todo.created_at);
      const dateKey = `${todoDate.getFullYear()}-${todoDate.getMonth() + 1}-${todoDate.getDate()}`;
      
      if (!result[dateKey]) {
        result[dateKey] = [];
      }
      
      result[dateKey].push(todo);
    });
    
    return result;
  }, [todos]);

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 날짜 선택 핸들러
  const handleDateClick = (day) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDate);
    onSelectDate(selectedDate);
  };
  
  // 연도 변경 핸들러
  const handleYearChange = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
  };
  
  // 월 변경 핸들러
  const handleMonthChange = (month) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
  };
  
  // 연도 및 월 선택기 토글
  const toggleYearMonthSelector = () => {
    setShowYearMonthSelector(!showYearMonthSelector);
  };

  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 달력 날짜 생성
  const calendarDays = [];
  const totalCells = Math.ceil((startDay + totalDays) / 7) * 7;
  
  for (let i = 0; i < totalCells; i++) {
    // 이전 달의 날짜
    if (i < startDay) {
      const prevMonthDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() - (startDay - i - 1);
      calendarDays.push({ day: prevMonthDay, currentMonth: false });
    } 
    // 이번 달의 날짜
    else if (i < startDay + totalDays) {
      const day = i - startDay + 1;
      calendarDays.push({ day, currentMonth: true });
    } 
    // 다음 달의 날짜
    else {
      const nextMonthDay = i - (startDay + totalDays) + 1;
      calendarDays.push({ day: nextMonthDay, currentMonth: false });
    }
  }

  return (
    <div className="w-full">
      {/* 달력 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth} 
          className="p-2 rounded-full hover:bg-gray-100"
        >
          &lt;
        </button>
        <div className="relative">
          <button 
            onClick={toggleYearMonthSelector}
            className="text-lg font-semibold hover:bg-gray-100 px-3 py-1 rounded-md"
          >
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </button>
          
          {/* 연도 및 월 선택기 */}
          {showYearMonthSelector && (
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-md shadow-lg p-4 border w-64">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">연도 선택</h3>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearChange(year)}
                      className={`px-2 py-1 text-sm rounded-md ${
                        year === currentDate.getFullYear() 
                          ? 'bg-blue-500 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">월 선택</h3>
                <div className="grid grid-cols-4 gap-2">
                  {months.map(month => (
                    <button
                      key={month.value}
                      onClick={() => handleMonthChange(month.value)}
                      className={`px-2 py-1 text-sm rounded-md ${
                        month.value === currentDate.getMonth() 
                          ? 'bg-blue-500 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {month.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => setShowYearMonthSelector(false)}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
        <button 
          onClick={goToNextMonth} 
          className="p-2 rounded-full hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={`text-center py-2 font-medium text-sm ${index === 0 ? 'text-red-500' : ''}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 날짜 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((item, index) => {
          // 해당 날짜의 할 일 확인
          const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), item.currentMonth ? item.day : 0);
          const dateKey = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
          const hasTodos = todosByDate[dateKey] && todosByDate[dateKey].length > 0;
          
          // 선택된 날짜 확인
          const isSelected = item.currentMonth && 
            selectedDate.getDate() === item.day && 
            selectedDate.getMonth() === currentDate.getMonth() && 
            selectedDate.getFullYear() === currentDate.getFullYear();
          
          // 오늘 날짜 확인
          const today = new Date();
          const isToday = item.currentMonth && 
            today.getDate() === item.day && 
            today.getMonth() === currentDate.getMonth() && 
            today.getFullYear() === currentDate.getFullYear();
          
          return (
            <div
              key={index}
              onClick={() => item.currentMonth && handleDateClick(item.day)}
              className={`
                min-h-12 p-1 
                ${item.currentMonth ? 'cursor-pointer hover:bg-gray-100' : 'text-gray-300 cursor-default'} 
                ${isSelected ? 'bg-blue-100 rounded-lg' : ''}
                ${isToday ? 'font-bold' : ''}
                ${index % 7 === 0 ? 'text-red-500' : ''}
                flex flex-col items-center
              `}
            >
              <span className="text-sm">{item.day}</span>
              {/* 할 일이 있는 경우 점 표시 */}
              {item.currentMonth && hasTodos && (
                <div className="flex mt-1 space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 날짜별 할 일 목록 컴포넌트
function DailyTodoList({ todos, selectedDate }) {
  // 선택된 날짜의 할 일만 필터링
  const filteredTodos = useMemo(() => {
    if (!selectedDate) return [];
    
    return todos.filter(todo => {
      const todoDate = new Date(todo.created_at);
      return (
        todoDate.getDate() === selectedDate.getDate() &&
        todoDate.getMonth() === selectedDate.getMonth() &&
        todoDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [todos, selectedDate]);
  
  // 완료된 할 일과 진행 중인 할 일 구분
  const completedTodos = filteredTodos.filter(todo => todo.completed);
  const activeTodos = filteredTodos.filter(todo => !todo.completed);
  
  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}에는 할 일이 없습니다.
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="font-medium text-lg mb-2">
        {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 할 일
      </h3>
      
      {activeTodos.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-blue-600 mb-2">진행 중 ({activeTodos.length})</h4>
          <ul className="space-y-2">
            {activeTodos.map(todo => (
              <li key={todo.id} className="p-3 border rounded-lg bg-blue-50">
                {todo.text}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {completedTodos.length > 0 && (
        <div>
          <h4 className="font-medium text-green-600 mb-2">완료됨 ({completedTodos.length})</h4>
          <ul className="space-y-2">
            {completedTodos.map(todo => (
              <li key={todo.id} className="p-3 border rounded-lg bg-green-50 line-through text-gray-500">
                {todo.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { isLoading, todos, activeTodos, completedTodos, monthlyStats } = useTodo();
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto px-4 py-5 overflow-y-auto max-h-screen">
        <Navbar />

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">할 일 통계</h1>
        
        <div className="bg-white rounded-xl shadow-md p-5 mb-5">
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              title="할 일" 
              count={activeTodos.length} 
              bgColor="bg-blue-50" 
              textColor="text-blue-600" 
            />
            <StatCard 
              title="완료됨" 
              count={completedTodos.length} 
              bgColor="bg-green-50" 
              textColor="text-green-600" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">달력</h2>
            <Calendar 
              todos={todos} 
              onSelectDate={setSelectedDate} 
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">일별 할 일</h2>
            <DailyTodoList 
              todos={todos} 
              selectedDate={selectedDate} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-5 mb-5">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">월별 통계</h2>
          <MonthlyStats stats={monthlyStats} />
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">최근 활동</h2>
          <RecentActivities todos={todos} />
        </div>
      </div>
    </div>
  );
} 