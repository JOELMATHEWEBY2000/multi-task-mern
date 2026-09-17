function TaskFilters({
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority
}) {

    return (
        <div className="bg-white p-4 rounded-xl shadow mb-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="border p-3 rounded-lg"
                />

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                    className="border p-3 rounded-lg"
                >
                    <option value="">
                        All Status
                    </option>

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

                {/* Priority */}
                <select
                    value={priority}
                    onChange={(e) =>
                        setPriority(e.target.value)
                    }
                    className="border p-3 rounded-lg"
                >
                    <option value="">
                        All Priority
                    </option>

                    <option value="low">
                        Low
                    </option>

                    <option value="medium">
                        Medium
                    </option>

                    <option value="high">
                        High
                    </option>

                </select>

            </div>

        </div>
    );
}

export default TaskFilters;