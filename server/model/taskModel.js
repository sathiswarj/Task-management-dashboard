const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const taskSchema = new mongoose.Schema({
    taskId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    taskDetails: {
        type: String,
        trim: true
    },
    taskType: {
        type: String,
        enum: ['Bug', 'Feature', 'Enhancement', 'Research'],
        required: false
    },
    taskPriority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        required: false
    },
    project: {
        type: String,
        required: false
    },
    taskAssignee: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Review', 'Done'],
        default: 'Todo'
    },
    description: {
        type: String,
        required: false
    },
    businessValue: {
        type: String,
        required: false
    },
    taskDueDate: {
        type: Date,
        required: false
    },
    acceptanceCriteria: [{
        criteriaId: {
            type: String,
            default: uuidv4,
            unique: false
        },
        value: {
            type: String,
            required: true
        }
    }],
    subtasks: [{
        subtaskId: {
            type: String,
            default: uuidv4,
            unique: false
        },
        value: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);