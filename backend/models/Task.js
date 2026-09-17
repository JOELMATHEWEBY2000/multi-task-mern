const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "in progress",
                "completed"
            ],
            default: "pending"
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high"
            ],
            default: "medium"
        },

        dueDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes
taskSchema.index({
    assignedTo: 1,
    status: 1
});

taskSchema.index({
    priority: 1,
    status: 1
});

taskSchema.index({
    createdAt: -1
});

module.exports = mongoose.model("Task", taskSchema);