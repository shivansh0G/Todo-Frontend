import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch('http://localhost:3006/todos');
      const data = await res.json();
      setTodos(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch todos');
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    
    try {
      const res = await fetch('http://localhost:3006/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setText('');
    } catch (err) {
      alert('Failed to add todo');
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`http://localhost:3006/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      const updated = await res.json();
      setTodos(todos.map(t => t._id === id ? updated : t));
    } catch (err) {
      alert('Failed to toggle todo');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333' }}>Jaldi Karo - Todo App</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          value={text} 
          onChange={e => setText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
          style={{ 
            padding: '10px', 
            width: '400px', 
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={addTodo} 
          style={{ 
            padding: '10px 20px', 
            marginLeft: '10px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.length === 0 ? (
          <li style={{ color: '#999', fontStyle: 'italic' }}>No todos yet. Add one above!</li>
        ) : (
          todos.map(todo => (
            <li 
              key={todo._id} 
              style={{ 
                padding: '12px', 
                marginBottom: '8px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                border: '1px solid #eee'
              }}
            >
              <input 
                type="checkbox" 
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id, todo.completed)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ 
                marginLeft: '10px',
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#999' : '#333',
                fontSize: '16px'
              }}>
                {todo.text}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;