import { ApiEndPoint } from "./ApiEndPoint";

export const ApiPostRequest = {
    addTask: async (taskData) => {
        try {
            const response = await fetch(
                `${ApiEndPoint.corePath}/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(taskData)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error adding task:", error);
            throw error.message;
        }
    },
    updateTask: async (taskData, taskId) => {
        try {
            const response = await fetch(
                `${ApiEndPoint.corePath}/${taskId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(taskData),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    },

    deleteTask: async (taskId) => {
        try {
            const response = await fetch(
                `${ApiEndPoint.corePath}/${taskId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    },

     deleteCriteria: async (taskId, criteriaId) => {
    try {
        const response = await fetch(
            `${ApiEndPoint.corePath}/${taskId}/acceptance-criteria/${criteriaId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error deleting acceptance criteria:", error);
        throw error;
    }
},

deleteSubTask: async (taskId, subtaskId) => {
    try {
        const response = await fetch(
            `${ApiEndPoint.corePath}/${taskId}/subtasks/${subtaskId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error deleting subtask:", error);
        throw error;
    }
},
};


