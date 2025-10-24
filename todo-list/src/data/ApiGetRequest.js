import {ApiEndPoint} from './ApiEndPoint'

export const ApiGetRequset = {
    getAllTasks: async()=>{
         try {
            const response = await fetch(
                `${ApiEndPoint.corePath}/`,
                {
                    method: 'GET',
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
            console.error("Error adding task:", error);
            throw error.message;
        }
    }
}