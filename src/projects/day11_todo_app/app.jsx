import React, { useState, useEffect } from 'react';
import './app.css';

// Custom hook to handle local storage and state synchronization
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue];
};

const App = () => {
  // Use the custom hook for the tasks list
  const [tasks, setTasks] = useLocalStorage('minimal-todo-tasks', []);
  const [newTask, setNewTask] = useState('');

  // Function to add a new task
  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newTodo = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
      };
      setTasks([newTodo, ...tasks]); // Add new task to the top
      setNewTask('');
    }
  };

  // Function to toggle task completion status
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filter tasks into active and completed lists for clear separation
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>TASK.</h1>
      </header>

      <div className="main-card-focus">
        {/* Task Input Form - THE FOCUS */}
        <form onSubmit={addTask} className="task-input-form">
          <input
            type="text"
            className="task-input"
            placeholder={
              activeTasks.length > 0
                ? "What's the next step?"
                : 'Add your first task...'
            }
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            autoFocus
          />
          <button type="submit" className="add-button" aria-label="Add Task">
            +
          </button>
        </form>

        {/* Active Tasks List - THE CURRENT FOCUS */}
        <div className="active-tasks-list">
          {activeTasks.length > 0 ? (
            activeTasks.map((task) => (
              <div
                key={task.id}
                className="task-item active"
                onClick={() => toggleTask(task.id)}
                role="checkbox"
                aria-checked="false"
                tabIndex="0"
              >
                <div className="checkbox-ring"></div>
                <p className="task-text">{task.text}</p>
                <span className="complete-prompt">Done</span>
              </div>
            ))
          ) : (
            <p className="no-tasks-message">
              You're all caught up! Add a new task above.
            </p>
          )}
        </div>
      </div>

      {/* Completed Tasks List - THE HISTORY (Subtle and minimal) */}
      {completedTasks.length > 0 && (
        <div className="completed-tasks-history">
          <h2>Completed ({completedTasks.length})</h2>
          <div className="completed-list">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="task-item completed"
                onClick={() => toggleTask(task.id)}
                role="checkbox"
                aria-checked="true"
                tabIndex="0"
              >
                <p className="task-text">{task.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
