import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ApiPostRequest } from '../data/ApiPostRequest';

const EditPopup = ({ onClose, taskData = null, isEdit = false }) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            taskType: '',
            taskPriority: '',
            project: '',
            taskAssignee: '',
            status: 'Todo',
            description: '',
            taskDueDate: '',
            businessValue: '',
            acceptanceCriteria: [],
            subtasks: []
        }
    });

    const { fields: criteriaFields, append: appendCriteria, remove: removeCriteria } = useFieldArray({
        control,
        name: 'acceptanceCriteria'
    });

    const { fields: subtaskFields, append: appendSubtask, remove: removeSubtask } = useFieldArray({
        control,
        name: 'subtasks'
    });

    useEffect(() => {
        if (isEdit && taskData) {
            const formattedDate = taskData.taskDueDate 
                ? new Date(taskData.taskDueDate).toISOString().split('T')[0] 
                : '';

            const formattedCriteria = taskData.acceptanceCriteria?.map(c => ({
                id: c.criteriaId || c._id || Date.now() + Math.random(),
                value: c.value || '',
                isExisting: true
            })) || [];

            const formattedSubtasks = taskData.subtasks?.map(s => ({
                id: s.subtaskId || s._id || Date.now() + Math.random(),
                value: s.value || '',
                isExisting: true
            })) || [];

            reset({
                name: taskData.name || '',
                taskType: taskData.taskType || '',
                taskPriority: taskData.taskPriority || '',
                project: taskData.project || '',
                taskAssignee: taskData.taskAssignee || '',
                status: taskData.status || 'Todo',
                description: taskData.description || '',
                taskDueDate: formattedDate,
                businessValue: taskData.businessValue || '',
                acceptanceCriteria: formattedCriteria,
                subtasks: formattedSubtasks
            });
        }
    }, [isEdit, taskData, reset]);

    const onSubmit = async (data) => {
        const taskPayload = {
            name: data.name,
            taskType: data.taskType,
            taskPriority: data.taskPriority,
            project: data.project,
            taskAssignee: data.taskAssignee,
            status: data.status,
            description: data.description,
            taskDueDate: data.taskDueDate,
            businessValue: data.businessValue,
            acceptanceCriteria: data.acceptanceCriteria
                .filter(c => c.value?.trim() !== '')
                .map(c => ({ value: c.value })),
            subtasks: data.subtasks
                .filter(s => s.value?.trim() !== '')
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

    const handleDeleteCriteria = async (index, criteria) => {
        if (!criteria.isExisting) {
            removeCriteria(index);
            return;
        }

        try {
            const response = await ApiPostRequest.deleteCriteria(taskData.taskId, criteria.id);
            if (response.success) {
                removeCriteria(index);
                alert('Acceptance criteria deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting criteria:', error);
            alert('Failed to delete acceptance criteria');
        }
    };

    const handleDeleteSubTask = async (index, task) => {
        if (!task.isExisting) {
            removeSubtask(index);
            return;
        }

        try {
            const response = await ApiPostRequest.deleteSubTask(taskData.taskId, task.id);
            if (response.success) {
                removeSubtask(index);
                alert('Subtask deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting subtask:', error);
            alert('Failed to delete subtask');
        }
    };

    return (
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

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <label className="flex flex-col text-sm font-semibold text-gray-700">
                        Task Title
                        <input
                            type="text"
                            {...register('name', { required: 'Task title is required' })}
                            placeholder="Enter task title"
                            className="border border-gray-300 p-2 rounded mt-1"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
                        )}
                    </label>

                    <label className="flex flex-col text-sm font-semibold text-gray-700">
                        Task Type
                        <select
                            {...register('taskType', { required: 'Task type is required' })}
                            className="border border-gray-300 p-2 rounded mt-1"
                        >
                            <option value="">Select Type</option>
                            <option>Bug</option>
                            <option>Feature</option>
                            <option>Enhancement</option>
                            <option>Research</option>
                        </select>
                        {errors.taskType && (
                            <span className="text-red-500 text-xs mt-1">{errors.taskType.message}</span>
                        )}
                    </label>

                    <label className="flex flex-col text-sm font-semibold text-gray-700">
                        Priority
                        <select
                            {...register('taskPriority', { required: 'Priority is required' })}
                            className="border border-gray-300 p-2 rounded mt-1"
                        >
                            <option value="">Select Priority</option>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                        {errors.taskPriority && (
                            <span className="text-red-500 text-xs mt-1">{errors.taskPriority.message}</span>
                        )}
                    </label>

                    <label className="flex flex-col text-sm font-semibold text-gray-700">
                        Project
                        <select
                            {...register('project', { required: 'Project is required' })}
                            className="border border-gray-300 p-2 rounded mt-1"
                        >
                            <option value="">Select Project</option>
                            <option>E-commerce Platform</option>
                            <option>Mobile App</option>
                            <option>Analytics Dashboard</option>
                        </select>
                        {errors.project && (
                            <span className="text-red-500 text-xs mt-1">{errors.project.message}</span>
                        )}
                    </label>

                    <label className="flex flex-col text-sm font-semibold text-gray-700">
                        Assignee
                        <select
                            {...register('taskAssignee', { required: 'Assignee is required' })}
                            className="border border-gray-300 p-2 rounded mt-1"
                        >
                            <option value="">Select Assignee</option>
                            <option>John Doe</option>
                            <option>John Smith</option>
                            <option>Mike Johnson</option>
                            <option>Sarah Willson</option>
                        </select>
                        {errors.taskAssignee && (
                            <span className="text-red-500 text-xs mt-1">{errors.taskAssignee.message}</span>
                        )}
                    </label>

                    <label className="flex flex-col text-sm font-semibold text-gray-700">
                        Status
                        <select
                            {...register('status', { required: 'Status is required' })}
                            className="border border-gray-300 p-2 rounded mt-1"
                        >
                            <option>Todo</option>
                            <option>In Progress</option>
                            <option>Review</option>
                            <option>Done</option>
                        </select>
                        {errors.status && (
                            <span className="text-red-500 text-xs mt-1">{errors.status.message}</span>
                        )}
                    </label>

                    <label className="flex flex-col text-sm font-semibold text-gray-700">
                        Description
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            placeholder="Enter task details"
                            className="border border-gray-300 p-2 rounded mt-1 resize-none"
                            rows="3"
                        ></textarea>
                        {errors.description && (
                            <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>
                        )}
                    </label>

                    <label className="flex flex-col text-sm font-semibold text-gray-700">
                        Due Date
                        <input
                            type="date"
                            {...register('taskDueDate', { required: 'Due date is required' })}
                            className="border border-gray-300 p-2 rounded mt-1"
                        />
                        {errors.taskDueDate && (
                            <span className="text-red-500 text-xs mt-1">{errors.taskDueDate.message}</span>
                        )}
                    </label>

                    <label className="flex flex-col text-sm font-semibold text-gray-700">
                        Business Value
                        <textarea
                            {...register('businessValue')}
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
                                onClick={() => appendCriteria({ id: Date.now(), value: '', isExisting: false })}
                                className="border border-2 text-black px-4 py-2 rounded transition text-sm"
                            >
                                Add Criteria
                            </button>
                        </div>

                        {criteriaFields.map((field, index) => (
                            <div key={field.id} className="flex flex-row items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter the acceptance criteria"
                                    className="border border-gray-300 p-2 rounded flex-1"
                                    {...register(`acceptanceCriteria.${index}.value`)}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteCriteria(index, field)}
                                    className="border border-2 text-black px-4 py-2 rounded transition whitespace-nowrap"
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
                                onClick={() => appendSubtask({ id: Date.now(), value: '', isExisting: false })}
                                className="border border-2 text-black px-4 py-2 rounded transition text-sm"
                            >
                                Add Subtask
                            </button>
                        </div>

                        {subtaskFields.map((field, index) => (
                            <div key={field.id} className="flex flex-row items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter the subtask"
                                    className="border border-gray-300 p-2 rounded flex-1"
                                    {...register(`subtasks.${index}.value`)}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSubTask(index, field)}
                                    className="border border-2 text-black px-4 py-2 rounded transition whitespace-nowrap"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="border border-2 text-black px-4 py-2 rounded transition"
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
    );
};

export default EditPopup;