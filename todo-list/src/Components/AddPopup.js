import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { ApiPostRequest } from '../data/ApiPostRequest';

const AddPopup = ({ onClose }) => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            taskType: '',
            taskPriority: '',
            project: '',
            taskAssignee: '',
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

    const onSubmit = async (data) => {
        const taskData = {
            name: data.name,
            taskType: data.taskType,
            taskPriority: data.taskPriority,
            project: data.project,
            taskAssignee: data.taskAssignee,
            description: data.description,
            taskDueDate: data.taskDueDate,
            businessValue: data.businessValue,
            acceptanceCriteria: data.acceptanceCriteria
                .filter(c => c.value && c.value.trim() !== '')
                .map(c => ({ value: c.value })),
            subtasks: data.subtasks
                .filter(s => s.value && s.value.trim() !== '')
                .map(s => ({ value: s.value }))
        };

        try {
            await ApiPostRequest.addTask(taskData);
            console.log('Task Data:', taskData);
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
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
                        Create New Task
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
                            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Task Type
                            <select
                                {...register('taskType', { required: 'Task type is required' })}
                                className="border border-gray-300 p-2 rounded mt-1"
                            >
                                <option value="">Select Type</option>
                                <option value="Bug">Bug</option>
                                <option value="Feature">Feature</option>
                                <option value="Enhancement">Enhancement</option>
                                <option value="Research">Research</option>
                            </select>
                            {errors.taskType && <span className="text-red-500 text-xs mt-1">{errors.taskType.message}</span>}
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Priority
                            <select
                                {...register('taskPriority', { required: 'Priority is required' })}
                                className="border border-gray-300 p-2 rounded mt-1"
                            >
                                <option value="">Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                            {errors.taskPriority && <span className="text-red-500 text-xs mt-1">{errors.taskPriority.message}</span>}
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Project
                            <select
                                {...register('project', { required: 'Project is required' })}
                                className="border border-gray-300 p-2 rounded mt-1"
                            >
                                <option value="">Select Project</option>
                                <option value="E-commerce Platform">E-commerce Platform</option>
                                <option value="Mobile App">Mobile App</option>
                                <option value="Analytics Dashboard">Analytics Dashboard</option>
                            </select>
                            {errors.project && <span className="text-red-500 text-xs mt-1">{errors.project.message}</span>}
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Assignee
                            <select
                                {...register('taskAssignee', { required: 'Assignee is required' })}
                                className="border border-gray-300 p-2 rounded mt-1"
                            >
                                <option value="">Select Assignee</option>
                                <option value="John Doe">John Doe</option>
                                <option value="John Smith">John Smith</option>
                                <option value="Mike Johnson">Mike Johnson</option>
                                <option value="Sarah Willson">Sarah Willson</option>
                            </select>
                            {errors.taskAssignee && <span className="text-red-500 text-xs mt-1">{errors.taskAssignee.message}</span>}
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Description
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                placeholder="Enter task details"
                                className="border border-gray-300 p-2 rounded mt-1 resize-none"
                                rows="3"
                            ></textarea>
                            {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
                        </label>

                        <label className="flex flex-col text-sm font-semibold text-gray-700">
                            Due Date
                            <input
                                type="date"
                                {...register('taskDueDate', { required: 'Due date is required' })}
                                className="border border-gray-300 p-2 rounded mt-1"
                            />
                            {errors.taskDueDate && <span className="text-red-500 text-xs mt-1">{errors.taskDueDate.message}</span>}
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
                                    onClick={() => appendCriteria({ value: '' })}
                                    className="border border-2 text-black text-white px-4 py-2 rounded transition text-sm"
                                >
                                    Add Criteria
                                </button>
                            </div>

                            {criteriaFields.map((field, index) => (
                                <div key={field.id} className="flex flex-row items-center gap-3">
                                    <input
                                        type="text"
                                        {...register(`acceptanceCriteria.${index}.value`)}
                                        placeholder="Enter the acceptance criteria"
                                        className="border border-gray-300 p-2 rounded flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeCriteria(index)}
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
                                    onClick={() => appendSubtask({ value: '' })}
                                    className="border border-2 text-black text-white px-4 py-2 rounded transition text-sm"
                                >
                                    Add Subtask
                                </button>
                            </div>

                            {subtaskFields.map((field, index) => (
                                <div key={field.id} className="flex flex-row items-center gap-3">
                                    <input
                                        type="text"
                                        {...register(`subtasks.${index}.value`)}
                                        placeholder="Enter the subtask"
                                        className="border border-2 text-black p-2 rounded flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSubtask(index)}
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
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
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