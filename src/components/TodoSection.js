"use client";
import { useTodo } from '../context/TodoContext';
import { useState } from 'react';

// TodoItem 컴포넌트
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="flex items-center p-3 border rounded-lg bg-white shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-6 h-6 mr-3 cursor-pointer accent-blue-500"
      />
      <span 
        className={`flex-grow ${todo.completed ? 'line-through text-gray-400' : ''} break-words`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="ml-2 px-3 py-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors duration-150"
        aria-label="할 일 삭제"
      >
        삭제
      </button>
    </li>
  );
}

// TodoList 컴포넌트
function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="text-gray-500 italic text-center py-4">항목이 없습니다.</p>;
  }

  return (
    <ul className="space-y-3">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

// TodoForm 컴포넌트
function TodoForm({ onAddTodo }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
        className="flex-grow px-4 py-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button 
        type="submit"
        className="bg-blue-500 text-white px-4 py-3 rounded-r-lg hover:bg-blue-600 focus:outline-none"
      >
        추가
      </button>
    </form>
  );
}

export default function TodoSection() {
  const { addTodo, toggleTodo, deleteTodo, activeTodos, completedTodos } = useTodo();
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-5 mb-5">
        <TodoForm onAddTodo={addTodo} />
      </div>
      
      <div className="bg-gray-50 rounded-xl p-5 mb-5">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-700 flex items-center">
          할 일 <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{activeTodos.length}</span>
        </h2>
        <TodoList 
          todos={activeTodos} 
          onToggle={toggleTodo} 
          onDelete={deleteTodo} 
        />
      </div>
      
      {completedTodos.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-700 flex items-center">
            완료됨 <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">{completedTodos.length}</span>
          </h2>
          <TodoList 
            todos={completedTodos} 
            onToggle={toggleTodo} 
            onDelete={deleteTodo} 
          />
        </div>
      )}
    </>
  );
} 