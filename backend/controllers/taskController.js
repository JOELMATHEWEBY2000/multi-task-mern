const Task = require("../models/Task");

const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            assignedTo,
            priority,
            dueDate
        } = req.body;

        const task = await Task.create({
            title,
            description,
            assignedTo,
            priority,
            dueDate,
            createdBy: req.user._id
        });

        const populatedTask = await Task.findById(task._id)
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role");

        res.status(201).json(populatedTask);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = "",
            priority = "",
            assignedTo = ""
        } = req.query;

        const pageNumber = Math.max(
            parseInt(page)||1,
            1
        );

        const limitNumber = Math.min(
            Math.max(parseInt(limit) ||5, 1),
            50
        );

        const skip =
            (pageNumber - 1) * limitNumber;

        // Build query
        const query = {};

        // Role-based filtering
        if (req.user.role === "user") {
            query.assignedTo = req.user._id;
        }

        // Assigned user filter
        if (
            assignedTo &&
            (req.user.role === "admin" ||
                req.user.role === "manager")
        ) {
            query.assignedTo = assignedTo;
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        // Priority filter
        if (priority) {
            query.priority = priority;
        }

        // Search filter
        if (search.trim()) {
            query.$or = [
                {
                    title: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                }
            ];
        }

        // Run count and data query together
        const [total, tasks] = await Promise.all([
            Task.countDocuments(query),

            Task.find(query)
                .populate(
                    "assignedTo",
                    "name email role"
                )
                .populate(
                    "createdBy",
                    "name email role"
                )
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limitNumber)
                .lean()
        ]);

        const totalPages = Math.ceil(
            total / limitNumber
        );

        res.json({
            tasks,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages,
                hasNextPage:
                    pageNumber < totalPages,
                hasPreviousPage:
                    pageNumber > 1
            }
        });

    } catch (error) {

        console.error(
            "Get Tasks Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(
            req.params.id
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (
            req.user.role === "user" &&
            task.assignedTo.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role");

        res.json(updatedTask);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(
            req.params.id
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (
            req.user.role !== "admin" &&
            task.createdBy.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        await task.deleteOne();

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};