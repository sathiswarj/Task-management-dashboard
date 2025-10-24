const express = require("express")
const taskModel = require("../model/taskModel");

const router = express.Router();

 router.post("/", async (req, res) => {
    const {
        name,
        taskDetails,
        taskType,
        taskPriority,
        project,
        taskAssignee,
        status,
        description,
        businessValue,
        taskDueDate,
        acceptanceCriteria,
        subtasks
    } = req.body;

    try {
        const task = new taskModel({
            name,
            taskDetails,
            taskType,
            taskPriority,
            project,
            taskAssignee,
            status,
            description,
            businessValue,
            taskDueDate,
            acceptanceCriteria,
            subtasks
        });

        await task.save();

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create task",
            error: error.message
        });
    }
});

 router.get("/", async(req, res) => {
    try {
        const task = await taskModel.find();
        res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
            error: error.message
        });
    }
});

 router.get("/:taskId", async(req, res) => {
    try {
        const task = await taskModel.findOne({ taskId: req.params.taskId });
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task fetched successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch task",
            error: error.message
        });
    }
});

 router.put("/:taskId", async(req, res) => {
    const {
        name,
        taskDetails,
        taskType,
        taskPriority,
        project,
        taskAssignee,
        status,
        description,
        businessValue,
        taskDueDate,
        acceptanceCriteria,
        subtasks
    } = req.body;

    try {
        const task = await taskModel.findOneAndUpdate(
            { taskId: req.params.taskId },
            {
                name,
                taskDetails,
                taskType,
                taskPriority,
                project,
                taskAssignee,
                status,
                description,
                businessValue,
                taskDueDate,
                acceptanceCriteria,
                subtasks
            },
            { new: true, runValidators: true }  
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update task",
            error: error.message
        });
    }
});

 router.delete("/:taskId", async(req, res) => {
    try {
        const task = await taskModel.findOneAndDelete({ taskId: req.params.taskId });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete task",
            error: error.message
        });
    }
});

 router.delete("/:taskId/acceptance-criteria/:criteriaId", async(req, res) => {
    try {
        const { taskId, criteriaId } = req.params;

        const task = await taskModel.findOneAndUpdate(
            { taskId: taskId },
            { 
                $pull: { 
                    acceptanceCriteria: { criteriaId: criteriaId } 
                } 
            },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Acceptance criteria deleted successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete acceptance criteria",
            error: error.message
        });
    }
});

 router.delete("/:taskId/subtasks/:subtaskId", async(req, res) => {
    try {
        const { taskId, subtaskId } = req.params;

        const task = await taskModel.findOneAndUpdate(
            { taskId: taskId },
            { 
                $pull: { 
                    subtasks: { subtaskId: subtaskId } 
                } 
            },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subtask deleted successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete subtask",
            error: error.message
        });
    }
});
module.exports = router;