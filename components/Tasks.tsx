import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Trash } from './Icons';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High';
}

interface TasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const priorityClasses = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

const inputStyle = "bg-white/50 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#0a2a43] placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none";

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      priority: newPriority,
      dueDate: newDueDate || undefined,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskText('');
    setNewDueDate('');
    setNewPriority('Medium');
  };

  const handleToggleComplete = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm col-span-2">
      <CardContent>
        <h2 className="text-sm font-semibold mb-3 text-[#0a2a43]">Tasks</h2>

        <div className="flex flex-col md:flex-row gap-2 mb-4 p-2 bg-white/20 rounded-lg">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="New task..."
            className={`flex-grow ${inputStyle}`}
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            className={inputStyle}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className={inputStyle}
          />
          <Button onClick={handleAddTask} size="sm" className="bg-indigo-500 text-white hover:bg-indigo-600 px-4">
            Add
          </Button>
        </div>

        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {tasks.length > 0 ? tasks.map(task => (
            <li key={task.id} className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${task.completed ? 'bg-gray-200 opacity-70' : 'bg-white/70'}`}>
              <div className="flex items-center gap-3 flex-grow min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 shrink-0"
                  aria-label={`Mark task ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
                />
                <span className={`text-sm text-[#0a2a43] truncate ${task.completed ? 'line-through' : ''}`} title={task.text}>{task.text}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {task.dueDate && <span className="text-xs text-gray-600 hidden sm:inline">{new Date(task.dueDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>}
                <span title={`Priority: ${task.priority}`} className={`w-3 h-3 rounded-full ${priorityClasses[task.priority]}`}></span>
                <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500" aria-label={`Delete task ${task.text}`}>
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </li>
          )) : (
              <p className="text-center text-sm text-gray-500 py-4">No tasks yet. Add one above!</p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Tasks;
