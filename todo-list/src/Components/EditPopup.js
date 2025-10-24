import React, { useState, useEffect } from 'react';
import { ApiPostRequest } from '../data/ApiPostRequest';
import { ApiGetRequset } from '../data/ApiGetRequest';

const EditPopup = ({ onClose, taskData = null, isEdit = false }) => {
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
    const [status, setStatus] = useState('Todo');

    useEffect(() => {
        if (isEdit && taskData) {
            setTitle(taskData.name || '');
            setType(taskData.taskType || '');
            setPriority(taskData.taskPriority || '');
            setProject(taskData.project || '');
            setAssignee(taskData.taskAssignee || '');
            setDescription(taskData.description || '');
            setStatus(taskData.status || 'Todo');
            setBusinessValue(taskData.businessValue || '');

            if (taskData.taskDueDate) {
                const dateObj = new Date(taskData.taskDueDate);
                const formattedDate = dateObj.toISOString().split('T')[0];
                setDate(formattedDate);
            }

            if (taskData.acceptanceCriteria && taskData.acceptanceCriteria.length > 0) {
                setCriteriaList(taskData.acceptanceCriteria.map(c => ({
                    id: c.criteriaId || c._id || Date.now() + Math.random(),  
                    value: c.value || '',
                    isExisting: true  
                })));
            }

            if (taskData.subtasks && taskData.subtasks.length > 0) {
                setSubtask(taskData.subtasks.map(s => ({
                    id: s.subtaskId || s._id || Date.now() + Math.random(),  
                    value: s.value || '',
                    isExisting: true  
                })));
            }
        }
    }, [isEdit, taskData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const taskPayload = {
            name: title,
            taskType: type,
            taskPriority: priority,
            project,
            taskAssignee: assignee,
            status: status,
            description,
            taskDueDate: date,
            businessValue,
            acceptanceCriteria: criteriaList
                .filter(c => c.value.trim() !== '')
                .map(c => ({ value: c.value })),  
            subtasks: subtask
                .filter(s => s.value.trim() !== '')
                .map(s => ({ value: s.value }))
        };

        try {
            if (isEdit) {
                const response = await ApiPostRequest.updateTask(taskPayload, taskData.taskId);
                if (response.success) {
                    alert('Task updated successfully!');
                    onClose();
                }
            }
        } catch (error) {
            console.error(`Error ${isEdit ? 'updating' : 'creating'} task:`, error);
            alert(`Failed to ${isEdit ? 'update' : 'create'} task. Please try again.`);
        }
    };

    const addCriteria = () => {
        setCriteriaList([...criteriaList, { id: Date.now(), value: '', isExisting: false }]);
    };

    const removeCriteria = (criteria) => {
         setCriteriaList(criteriaList.filter(c => c.id !== criteria.id));
    };

    const addSubtask = () => {
        setSubtask([...subtask, { id: Date.now(), value: '', isExisting: false }]);
    };

    const removeSubTask = (task) => {
         setSubtask(subtask.filter(t => t.id !== task.id));
    };

     const handleDeleteCriteria = async (criteria) => {
        if (!criteria.isExisting) {
             removeCriteria(criteria);
            return;
        }

        try {
            const response = await ApiPostRequest.deleteCriteria(taskData.taskId, criteria.id);
            if (response.success) {
                setCriteriaList(criteriaList.filter(c => c.id !== criteria.id));
                alert('Acceptance criteria deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting criteria:', error);
            alert('Failed to delete acceptance criteria');
        }
    };

    const handleDeleteSubTask = async (task) => {
        if (!task.isExisting) {
             removeSubTask(task);
            return;
        }

        try {
            const response = await ApiPostRequest.deleteSubTask(taskData.taskId, task.id);
            if (response.success) {
                setSubtask(subtask.filter(t => t.id !== task.id));
                alert('Subtask deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting subtask:', error);
            alert('Failed to delete subtask');
        }
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
                        {isEdit ? 'Edit Task' : 'Create New Task'}
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
                                required
                            />
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Task Type
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="border border-gray-300 p-2 rounded mt-1"
                                required
                            >
                                <option value="">Select Type</option>
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
                                required
                            >
                                <option value="">Select Priority</option>
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
                                required
                            >
                                <option value="">Select Project</option>
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
                                required
                            >
                                <option value="">Select Assignee</option>
                                <option>John Doe</option>
                                <option>John Smith</option>
                                <option>Mike Johnson</option>
                                <option>Sarah Willson</option>
                            </select>
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Status
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-gray-300 p-2 rounded mt-1"
                                required
                            >
                                <option>Todo</option>
                                <option>In Progress</option>
                                <option>Review</option>
                                <option>Done</option>
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
                                required
                            ></textarea>
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Due Date
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border border-gray-300 p-2 rounded mt-1"
                                required
                            />
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Business Value
                            <textarea
                                value={businessValue}
                                onChange={(e) => setBusinessValue(e.target.value)}
                                placeholder="Describe the business value"
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
                                    className="border border-2  text-black   px-4 py-2 rounded transition text-sm"
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
                                        onClick={() => handleDeleteCriteria(criteria)}
                                        className="border border-2  text-black px-4 py-2 rounded transition whitespace-nowrap"
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
                                    className="border border-2  text-black px-4 py-2 rounded transition text-sm"
                                >
                                    Add Subtask
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
                                        onClick={() => handleDeleteSubTask(task)}
                                        className="border border-2  text-black px-4 py-2 rounded transition whitespace-nowrap"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                className="border border-2  text-black px-4 py-2 rounded transition"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                            >
                                {isEdit ? 'Update Task' : 'Add Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditPopup;