function TaskTable({
    tasks,
    onEdit,
    onDelete,
    onStatusChange
}) {

    const getStatusClass = (status) => {

        if (status === "completed") {
            return "bg-green-100 text-green-700";
        }

        if (status === "in progress") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-gray-100 text-gray-700";
    };

    const getPriorityClass = (priority) => {

        if (priority === "high") {
            return "text-red-600 font-bold";
        }

        if (priority === "medium") {
            return "text-orange-600 font-semibold";
        }

        return "text-green-600";
    };

    if (tasks.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-8 text-center">
                <p className="text-gray-500">
                    No tasks found.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="w-full min-w-[900px]">

                <thead className="bg-gray-100">

                    <tr>
                        <th className="p-4 text-left">
                            Title
                        </th>

                        <th className="p-4 text-left">
                            Assigned To
                        </th>

                        <th className="p-4 text-left">
                            Priority
                        </th>

                        <th className="p-4 text-left">
                            Due Date
                        </th>

                        <th className="p-4 text-left">
                            Status
                        </th>

                        <th className="p-4 text-left">
                            Actions
                        </th>
                    </tr>

                </thead>

                <tbody>

                    {tasks.map((task) => (

                        <tr
                            key={task._id}
                            className="border-t hover:bg-gray-50"
                        >

                            <td className="p-4">
                                <div className="font-semibold">
                                    {task.title}
                                </div>

                                <div className="text-sm text-gray-500">
                                    {task.description}
                                </div>
                            </td>

                            <td className="p-4">
                                {task.assignedTo?.name}
                            </td>

                            <td
                                className={`p-4 capitalize ${getPriorityClass(
                                    task.priority
                                )}`}
                            >
                                {task.priority}
                            </td>

                            <td className="p-4">
                                {new Date(
                                    task.dueDate
                                ).toLocaleDateString()}
                            </td>

                            <td className="p-4">

                                <select
                                    value={task.status}
                                    onChange={(e) =>
                                        onStatusChange(
                                            task._id,
                                            e.target.value
                                        )
                                    }
                                    className={`px-3 py-2 rounded-lg capitalize ${getStatusClass(
                                        task.status
                                    )}`}
                                >

                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="in progress">
                                        In Progress
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>

                                </select>

                            </td>

                            <td className="p-4">

                                <div className="flex gap-2">

                                    {onEdit && (
                                        <button
                                            onClick={() =>
                                                onEdit(task)
                                            }
                                            className="bg-blue-600 text-white px-3 py-2 rounded-lg"
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {onDelete && (
                                        <button
                                            onClick={() =>
                                                onDelete(task._id)
                                            }
                                            className="bg-red-600 text-white px-3 py-2 rounded-lg"
                                        >
                                            Delete
                                        </button>
                                    )}

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default TaskTable;