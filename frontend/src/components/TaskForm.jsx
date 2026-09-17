import { useEffect, useState } from "react";
import API from "../services/api";

function TaskForm({
    users = [],
    selectedTask,
    onTaskSaved,
    onCancel
}) {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        dueDate: ""
    });

    useEffect(() => {

        if (selectedTask) {

            setFormData({
                title: selectedTask.title || "",

                description:
                    selectedTask.description || "",

                assignedTo:
                    selectedTask.assignedTo?._id ||
                    selectedTask.assignedTo ||
                    "",

                priority:
                    selectedTask.priority || "medium",

                dueDate:
                    selectedTask.dueDate
                        ? selectedTask.dueDate.substring(0, 10)
                        : ""
            });

        } else {

            setFormData({
                title: "",
                description: "",
                assignedTo: "",
                priority: "medium",
                dueDate: ""
            });

        }

    }, [selectedTask]);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (selectedTask) {

                await API.put(
                    `/tasks/${selectedTask._id}`,
                    formData
                );

            } else {

                await API.post(
                    "/tasks",
                    formData
                );

            }

            setFormData({
                title: "",
                description: "",
                assignedTo: "",
                priority: "medium",
                dueDate: ""
            });

            onTaskSaved();

        } catch (error) {

            console.error(
                "Save Task Error:",
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Unable to save task"
            );
        }
    };


    return (
        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-5">

                {selectedTask
                    ? "Edit Task"
                    : "Create New Task"}

            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                {/* TASK TITLE */}

                <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                />


                {/* DESCRIPTION */}

                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border rounded-lg p-3"
                />


                {/* ASSIGN USER */}

                <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                >

                    <option value="">
                        Select User
                    </option>

                    {users
                        .filter(
                            user =>
                                user.role?.toLowerCase() === "user"
                        )
                        .map(user => (

                            <option
                                key={user._id}
                                value={user._id}
                            >
                                {user.name} 
                            </option>

                        ))}

                </select>


                {/* PRIORITY */}

                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >

                    <option value="low">
                        Low Priority
                    </option>

                    <option value="medium">
                        Medium Priority
                    </option>

                    <option value="high">
                        High Priority
                    </option>

                </select>


                {/* DUE DATE */}

                <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                    required
                />


                {/* BUTTONS */}

                <div className="flex gap-3">

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
                    >
                        {selectedTask
                            ? "Update Task"
                            : "Create Task"}
                    </button>

                    {selectedTask && (

                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg"
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </form>

        </div>
    );
}

export default TaskForm;