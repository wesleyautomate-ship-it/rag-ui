import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Trash, ArrowLeft, Bell } from './Icons';

/**
 * Defines the structure of a single task object, including an optional reminder.
 */
export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High';
  reminder?: string; // ISO string for date and time (e.g., "2024-08-15T10:30")
}

/**
 * Props for the TasksPage component.
 */
interface TasksPageProps {
  onBack: () => void;
}

// Maps task priority to a prominent left border color.
const priorityBorderClasses: Record<Task['priority'], string> = {
  High: 'border-l-red-500',
  Medium: 'border-l-yellow-500',
  Low: 'border-l-green-500',
};

// Reusable styling for input elements on this page.
const inputStyle = "bg-white/50 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-[#0a2a43] placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none";

/**
 * A full-page component for managing tasks with reminders and notifications.
 * It includes visual feedback for setting reminders and differentiating past vs. upcoming reminders.
 * @param {TasksPageProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered TasksPage component.
 */
const TasksPage: React.FC<TasksPageProps> = ({ onBack }) => {
    // --- Helper functions for generating mock dates ---
    const today = new Date();
    const getFutureDate = (days: number) => {
        const future = new Date();
        future.setDate(today.getDate() + days);
        return future.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    const getFutureDateTime = (minutes: number) => {
        const future = new Date(Date.now() + minutes * 60000);
        return future.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
    }

    // --- State Management ---
    // State for the list of tasks, initialized with mock data.
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, text: 'Finalize deal with Mr. Khan', completed: false, priority: 'High', dueDate: getFutureDate(2), reminder: getFutureDateTime(1) },
        { id: 2, text: 'Submit RERA paperwork', completed: false, priority: 'Medium', dueDate: getFutureDate(5), reminder: getFutureDateTime(-60) }, // Past reminder
        { id: 3, text: 'Call back new lead from Dubai Marina', completed: true, priority: 'High', dueDate: getFutureDate(-1) },
        { id: 4, text: 'Prepare weekly market report', completed: false, priority: 'Low', reminder: getFutureDateTime(5) },
    ]);
    // State for the new task input fields.
    const [newTaskText, setNewTaskText] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [newReminder, setNewReminder] = useState('');
    // State to manage the confirmation modal for deleting a task.
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    // State to hold tasks that are currently being shown as notifications.
    const [activeNotifications, setActiveNotifications] = useState<Task[]>([]);
    // Ref to store timeout IDs for scheduled reminders.
    // FIX: Use `ReturnType<typeof setTimeout>` for cross-environment compatibility (browser/Node).
    const reminderTimeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    // State to provide visual feedback by tracking the ID of a newly added task.
    const [recentlyUpdatedTaskId, setRecentlyUpdatedTaskId] = useState<number | null>(null);

    /**
     * Effect hook to schedule and clean up reminder notifications.
     * This runs whenever the `tasks` array changes.
     */
    useEffect(() => {
        // First, clear all existing timeouts to prevent duplicates or stale reminders.
        Object.values(reminderTimeouts.current).forEach(clearTimeout);
        reminderTimeouts.current = {};

        // Iterate over tasks to set new timeouts for reminders.
        tasks.forEach(task => {
            if (task.reminder && !task.completed) {
                const reminderTime = new Date(task.reminder).getTime();
                const now = Date.now();
                const delay = reminderTime - now;

                if (delay > 0) { // Only schedule reminders for the future.
                    const timeoutId = setTimeout(() => {
                        showNotification(task);
                    }, delay);
                    reminderTimeouts.current[task.id] = timeoutId;
                }
            }
        });

        // Cleanup function: runs when the component unmounts or before the effect runs again.
        return () => {
            Object.values(reminderTimeouts.current).forEach(clearTimeout);
        };
    }, [tasks]);

    /**
     * Adds a task to the active notifications list to be displayed.
     * @param {Task} task - The task to show a notification for.
     */
    const showNotification = (task: Task) => {
        setActiveNotifications(prev => [...prev.filter(n => n.id !== task.id), task]);
        // Automatically dismiss the notification after 10 seconds.
        setTimeout(() => {
            removeNotification(task.id);
        }, 10000);
    };

    /**
     * Removes a notification from the screen.
     * @param {number} taskId - The ID of the task's notification to remove.
     */
    const removeNotification = (taskId: number) => {
        setActiveNotifications(prev => prev.filter(n => n.id !== taskId));
    };

    /**
     * Handles creating and adding a new task to the list.
     */
    const handleAddTask = () => {
        if (newTaskText.trim() === '') return;
        const newId = Date.now(); // Generate ID before setting state to use it for feedback.
        const newTask: Task = {
            id: newId,
            text: newTaskText,
            completed: false,
            priority: newPriority,
            dueDate: newDueDate || undefined,
            reminder: newReminder || undefined,
        };
        setTasks([newTask, ...tasks]);
        
        // If a reminder was set, provide visual feedback by highlighting the new task briefly.
        if (newReminder) {
            setRecentlyUpdatedTaskId(newId);
            setTimeout(() => {
                setRecentlyUpdatedTaskId(null);
            }, 2500); // Remove highlight after 2.5 seconds.
        }

        // Reset form fields
        setNewTaskText('');
        setNewDueDate('');
        setNewPriority('Medium');
        setNewReminder('');
    };

    /**
     * Toggles the completion status of a task.
     * @param {number} id - The ID of the task to update.
     */
    const handleToggleComplete = (id: number) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    /**
     * Initiates the deletion process by setting the task ID and showing the confirmation modal.
     * @param {number} id - The ID of the task to be deleted.
     */
    const requestDeleteTask = (id: number) => {
        setTaskToDelete(id);
    };

    /**
     * Confirms and executes the deletion of the task.
     */
    const confirmDeleteTask = () => {
        if (taskToDelete === null) return;
        setTasks(tasks.filter(task => task.id !== taskToDelete));
        setTaskToDelete(null); // Close the modal
    };

    /**
     * Cancels the deletion process and closes the modal.
     */
    const cancelDeleteTask = () => {
        setTaskToDelete(null);
    };
    
    /**
     * Formats an ISO datetime string into a local time string (e.g., "10:30 AM").
     * @param {string} isoString - The ISO datetime string from the task reminder.
     * @returns {string} A formatted time string.
     */
    const formatReminderTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }

  return (
    <div className="flex-1 text-white flex flex-col animate-slide-in overflow-y-auto">
       {/* CSS animations for the page and its elements */}
       <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.4s ease-in-out; }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-in-out; }

        @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-up { animation: scale-up 0.2s ease-in-out; }
        
        @keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>

      {/* Notifications Area (Toast container) */}
      <div aria-live="assertive" className="fixed inset-0 flex items-start justify-end p-4 space-y-3 pointer-events-none z-[100]">
        <div className="w-full max-w-sm space-y-3">
            {activeNotifications.map(task => (
                <div key={task.id} className="bg-white/95 backdrop-blur-sm text-[#0a2a43] p-4 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 pointer-events-auto animate-slide-in-right">
                    <div className="flex items-start">
                        <div className="shrink-0 pt-0.5">
                            <Bell className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-semibold">Task Reminder</p>
                            <p className="mt-1 text-sm">{task.text}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button onClick={() => removeNotification(task.id)} className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Page Header */}
      <header className="p-4 flex items-center justify-between shadow-md bg-white/10 backdrop-blur-md rounded-b-2xl shrink-0">
        <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="w-10"></div> {/* Spacer to center the title */}
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent>
                {/* New Task Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mb-4 p-2 bg-white/20 rounded-lg">
                    <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="New task..."
                        className={`lg:col-span-2 ${inputStyle}`}
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
                        className={`${inputStyle} text-gray-500`}
                        title="Due Date"
                    />
                    <input
                        type="datetime-local"
                        value={newReminder}
                        onChange={(e) => setNewReminder(e.target.value)}
                        className={`${inputStyle} text-gray-500`}
                        title="Set Reminder"
                    />
                    <Button onClick={handleAddTask} size="sm" className="bg-indigo-500 text-white hover:bg-indigo-600 px-4 md:col-span-2 lg:col-span-5">
                        Add Task
                    </Button>
                </div>

                {/* Task List */}
                <ul className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                    {tasks.length > 0 ? tasks.map(task => {
                        // Determine if the reminder is in the past for specific styling.
                        const isReminderPast = task.reminder ? new Date(task.reminder) < new Date() : false;

                        return (
                            <li 
                                key={task.id} 
                                className={`flex items-center justify-between p-2.5 rounded-lg transition-colors duration-1000 ease-out border-l-4 
                                    ${recentlyUpdatedTaskId === task.id
                                        ? 'bg-indigo-100 ring-2 ring-indigo-300 border-indigo-300' // Highlight class for new tasks with reminders
                                        : task.completed
                                            ? 'bg-gray-200 opacity-70 border-gray-300' // Completed task style
                                            : `bg-white/70 ${priorityBorderClasses[task.priority]}` // Default task style with priority border
                                    }`}
                                >
                                <div className="flex items-center gap-3 flex-grow min-w-0">
                                    <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleToggleComplete(task.id)}
                                    className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 shrink-0"
                                    aria-label={`Mark task ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
                                    />
                                    <div className="min-w-0">
                                        <span className={`text-sm text-[#0a2a43] block truncate ${task.completed ? 'line-through' : ''}`} title={task.text}>{task.text}</span>
                                        {/* Reminder display with feedback for past and upcoming reminders. */}
                                        {task.reminder && !task.completed && (
                                            <div className={`flex items-center text-xs mt-1 ${isReminderPast ? 'text-gray-500' : 'text-indigo-600'}`}>
                                                <Bell className="w-3 h-3 mr-1" />
                                                <span>{formatReminderTime(task.reminder)}</span>
                                                {isReminderPast && <span className="ml-1 font-semibold">(Past)</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 ml-4">
                                    {task.dueDate && <span className="text-xs text-gray-600 hidden sm:inline">{new Date(task.dueDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>}
                                    <button onClick={() => requestDeleteTask(task.id)} className="text-gray-400 hover:text-red-500" aria-label={`Delete task ${task.text}`}>
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </li>
                        )
                    }) : (
                        <p className="text-center text-sm text-gray-500 py-4">No tasks yet. Add one above!</p>
                    )}
                </ul>
            </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Modal */}
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