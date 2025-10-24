import React, { useState } from 'react';
import { ApiPostRequest } from '../data/ApiPostRequest';

const AddPopup = ({ onClose }) => {
    const [criteriaList, setCriteriaList] = useState([]);
    const [subtask, setSubtask] = useState([]);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [priority, setPriority] = useState('');
    const [project, setProject] = useState('');
    const [assignee, setAssignee] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [businessValue, setBusinessValue] = useState('');
    
    const handleSubmit = async (e) => {
  e.preventDefault();

  const taskData = {
    name: title, 
    taskType: type,
    taskPriority: priority,
    project,
    taskAssignee: assignee,
    description,
    taskDueDate: date,
    businessValue,
    acceptanceCriteria: criteriaList
      .filter(c => c.value.trim() !== '')
      .map(c => ({ id: c.id.toString(), value: c.value })), 
    subtasks: subtask
      .filter(s => s.value.trim() !== '')
      .map(s => ({ id: s.id.toString(), value: s.value }))  
  };

  try {
    await ApiPostRequest.addTask(taskData);
    console.log('Task Data:', taskData);
    onClose();
  } catch (error) {
    console.error('Error creating task:', error);
  }
};

    const addCriteria = () => {
        setCriteriaList([...criteriaList, { id: Date.now(), value: '' }]);
    };

    const removeCriteria = (id) => {
        setCriteriaList(criteriaList.filter(criteria => criteria.id !== id));
    };

    const addSubtask = () => {
        setSubtask([...subtask, { id: Date.now(), value: '' }]);
    };

    const removeSubTask = (id) => {
        setSubtask(subtask.filter(task => task.id !== id));
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                    >
                        ✕
                    </button>

                    <h2 className="text-2xl font-bold mb-6">
                        Create New Task
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Task Title
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter task title"
                                className="border border-gray-300 p-2 rounded mt-1"
                            />
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Task Type
                            <select 
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="border border-gray-300 p-2 rounded mt-1"
                            >
                                <option>Select Type</option>
                                <option>Bug</option>
                                <option>Feature</option>
                                <option>Enhancement</option>
                                <option>Research</option>
                            </select>
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Priority
                            <select 
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="border border-gray-300 p-2 rounded mt-1"
                            >
                                <option>Select Priority</option>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Project
                            <select 
                                value={project}
                                onChange={(e) => setProject(e.target.value)}
                                className="border border-gray-300 p-2 rounded mt-1"
                            >
                                <option>Select Project</option>
                                <option>E-commerce Platform</option>
                                <option>Mobile App</option>
                                <option>Analytics Dashboard</option>
                            </select>
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Assignee
                            <select 
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                                className="border border-gray-300 p-2 rounded mt-1"
                            >
                                <option>Select Assignee</option>
                                <option>John Doe</option>
                                <option>John Smith</option>
                                <option>Mike Johnson</option>
                                <option>Sarah Willson</option>
                            </select>
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Description
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter task details"
                                className="border border-gray-300 p-2 rounded mt-1 resize-none"
                                rows="3"
                            ></textarea>
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Date
                            <input 
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="Enter task details"
                                className="border border-gray-300 p-2 rounded mt-1"
                            />
                        </label>
                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Business value
                            <textarea
                                value={businessValue}
                                onChange={(e) => setBusinessValue(e.target.value)}
                                placeholder="Enter task details"
                                className="border border-gray-300 p-2 rounded mt-1 resize-none"
                                rows="3"
                            ></textarea>
                        </label>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-gray-700">
                                    Acceptance Criteria
                                </label>
                                <button
                                    type="button"
                                    onClick={addCriteria}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm"
                                >
                                    Add Criteria
                                </button>
                            </div>

                            {criteriaList.map((criteria) => (
                                <div key={criteria.id} className="flex flex-row items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Enter the acceptance criteria"
                                        className="border border-gray-300 p-2 rounded flex-1"
                                        value={criteria.value}
                                        onChange={(e) => {
                                            setCriteriaList(criteriaList.map(c => 
                                                c.id === criteria.id ? { ...c, value: e.target.value } : c
                                            ));
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeCriteria(criteria.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition whitespace-nowrap"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-gray-700">
                                    Subtasks
                                </label>
                                <button
                                    type="button"
                                    onClick={addSubtask}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition text-sm"
                                >
                                    Add subtask
                                </button>
                            </div>

                            {subtask.map((task) => (
                                <div key={task.id} className="flex flex-row items-center gap-3">
                                    <input
                                        type="text"
                                        placeholder="Enter the subtask"
                                        className="border border-gray-300 p-2 rounded flex-1"
                                        value={task.value}
                                        onChange={(e) => {
                                            setSubtask(subtask.map(t => 
                                                t.id === task.id ? { ...t, value: e.target.value } : t
                                            ));
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSubTask(task.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition whitespace-nowrap"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Add Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddPopup;