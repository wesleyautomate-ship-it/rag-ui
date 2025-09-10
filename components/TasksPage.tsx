import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Trash, ArrowLeft } from './Icons';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High';
}

interface TasksPageProps {
  onBack: () => void;
}

const priorityClasses = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

const inputStyle = "bg-white/50 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#0a2a43] placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none";


const TasksPage: React.FC<TasksPageProps> = ({ onBack }) => {
    const today = new Date();
    const getFutureDate = (days: number) => {
        const future = new Date();
        future.setDate(today.getDate() + days);
        return future.toISOString().split('T')[0];
    }

    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, text: 'Finalize deal with Mr. Khan', completed: false, priority: 'High', dueDate: getFutureDate(2) },
        { id: 2, text: 'Submit RERA paperwork', completed: false, priority: 'Medium', dueDate: getFutureDate(5) },
        { id: 3, text: 'Call back new lead from Dubai Marina', completed: true, priority: 'High', dueDate: getFutureDate(-1) },
        { id: 4, text: 'Prepare weekly market report', completed: false, priority: 'Low' },
    ]);
    
    const [newTaskText, setNewTaskText] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

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

    const requestDeleteTask = (id: number) => {
        setTaskToDelete(id);
    };

    const confirmDeleteTask = () => {
        if (taskToDelete === null) return;
        setTasks(tasks.filter(task => task.id !== taskToDelete));
        setTaskToDelete(null);
    };

    const cancelDeleteTask = () => {
        setTaskToDelete(null);
    };

  return (
    <div className="flex-1 text-white flex flex-col animate-slide-in overflow-y-auto">
       <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.4s ease-in-out; }
        
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-in-out; }

        @keyframes scale-up {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up { animation: scale-up 0.2s ease-in-out; }
      `}</style>
      <header className="p-4 flex items-center justify-between shadow-md bg-white/10 backdrop-blur-md rounded-b-2xl shrink-0">
        <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="w-10"></div> {/* Spacer to balance the header */}
      </header>
      
      <main className="flex-1 overflow-y-auto p-6">
        <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent>
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

                <ul className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
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
                            <button onClick={() => requestDeleteTask(task.id)} className="text-gray-400 hover:text-red-500" aria-label={`Delete task ${task.text}`}>
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
      </main>

      {taskToDelete !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <Card className="bg-white text-[#0a2a43] w-full max-w-sm m-4 animate-scale-up">
                <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Confirm Deletion</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to delete this task? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={cancelDeleteTask} className="text-gray-700 hover:bg-gray-100">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteTask}>
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
};

export default TasksPage;