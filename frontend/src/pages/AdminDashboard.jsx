import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import TaskTable from "../components/TaskTable";
import TaskFilters from "../components/TaskFilters";
import Pagination from "../components/Pagination";

import API from "../services/api";
import useDebounce from "../hooks/useDebounce";

function AdminDashboard() {

    // =========================
    // Users and Tasks
    // =========================

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [selectedTask, setSelectedTask] =
        useState(null);

    // =========================
    // Search and Filters
    // =========================

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [priority, setPriority] =
        useState("");

    const [assignedTo, setAssignedTo] =
        useState("");

    // =========================
    // Pagination
    // =========================

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalTasks, setTotalTasks] =
        useState(0);

    const [limit] =
        useState(5);

    // =========================
    // Loading / Error
    // =========================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =========================
    // Debounced Search
    // =========================

    const debouncedSearch =
        useDebounce(search, 500);


    // =========================
    // Initial API Calls
    // =========================

    useEffect(() => {
        fetchUsers();
    }, []);


    // =========================
    // Fetch Tasks when
    // filters / page changes
    // =========================

    useEffect(() => {
        fetchTasks();
    }, [
        page,
        debouncedSearch,
        status,
        priority,
        assignedTo
    ]);


    // =========================
    // Fetch Users
    // =========================

    const fetchUsers = async () => {

        try {

            const response =
                await API.get("/users");

            setUsers(response.data);

        } catch (error) {

            console.error(
                "Fetch Users Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to fetch users"
            );
        }
    };


    // =========================
    // Fetch Tasks
    // =========================

    const fetchTasks = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await API.get(
                    "/tasks",
                    {
                        params: {
                            page,
                            limit,
                            search: debouncedSearch,
                            status,
                            priority,
                            assignedTo
                        }
                    }
                );

            /*
             * Backend response:
             *
             * {
             *   tasks: [],
             *   pagination: {}
             * }
             */

            setTasks(
                response.data.tasks || []
            );

            setTotalTasks(
                response.data.pagination?.total || 0
            );

            setTotalPages(
                response.data.pagination?.totalPages || 1
            );

        } catch (error) {

            console.error(
                "Fetch Tasks Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to fetch tasks"
            );

            setTasks([]);

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // Search Handler
    // =========================

    const handleSearch = (value) => {

        setSearch(value);

        /*
         * Whenever search changes,
         * start from page 1.
         */

        setPage(1);
    };


    // =========================
    // Status Handler
    // =========================

    const handleStatus = (value) => {

        setStatus(value);

        setPage(1);
    };


    // =========================
    // Priority Handler
    // =========================

    const handlePriority = (value) => {

        setPriority(value);

        setPage(1);
    };


    // =========================
    // Assigned User Handler
    // =========================

    const handleAssignedTo = (value) => {

        setAssignedTo(value);

        setPage(1);
    };


    // =========================
    // Edit Task
    // =========================

    const handleEdit = (task) => {

        setSelectedTask(task);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =========================
    // Delete Task
    // =========================

    const deleteTask = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await API.delete(
                `/tasks/${id}`
            );

            /*
             * If the last task on the
             * current page is deleted,
             * go back one page.
             */

            if (
                tasks.length === 1 &&
                page > 1
            ) {

                setPage(page - 1);

            } else {

                fetchTasks();
            }

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Delete failed"
            );
        }
    };


    // =========================
    // Update Task Status
    // =========================

    const updateStatus = async (
        id,
        newStatus
    ) => {

        try {

            await API.put(
                `/tasks/${id}`,
                {
                    status: newStatus
                }
            );

            fetchTasks();

        } catch (error) {

            console.error(
                "Update Status Error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update status"
            );
        }
    };


    // =========================
    // Clear Filters
    // =========================

    const clearFilters = () => {

        setSearch("");
        setStatus("");
        setPriority("");
        setAssignedTo("");

        setPage(1);
    };


    // =========================
    // Dashboard Statistics
    // =========================

    const completedTasks =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;

    const pendingTasks =
        tasks.filter(
            task =>
                task.status === "pending"
        ).length;

    const inProgressTasks =
        tasks.filter(
            task =>
                task.status === "in progress"
        ).length;


    // =========================
    // Render
    // =========================

    return (

        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <main className="max-w-7xl mx-auto p-4 sm:p-6">

                {/* =========================
                    HEADER
                ========================== */}

                <div className="mb-6">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage users, tasks and task progress.
                    </p>

                </div>


                {/* =========================
                    ERROR MESSAGE
                ========================== */}

                {error && (

                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">

                        {error}

                    </div>

                )}


                {/* =========================
                    STATISTICS
                ========================== */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                    {/* Users */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Total Users
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {users.filter((user) => user.role === "user").length}
                        </h2>

                    </div>


                    {/* Total Tasks */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Total Tasks
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {totalTasks}
                        </h2>

                    </div>


                    {/* Pending */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Pending
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {pendingTasks}
                        </h2>

                    </div>


                    {/* Completed */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Completed
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {completedTasks}
                        </h2>

                    </div>

                </div>


                {/* =========================
                    TASK SECTION
                ========================== */}

                <section>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                All Tasks
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Showing {tasks.length} of {totalTasks} tasks
                            </p>

                        </div>


                        <button
                            onClick={clearFilters}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
                        >
                            Clear Filters
                        </button>

                    </div>


                    {/* =========================
                        SEARCH + FILTERS
                    ========================== */}

                    <TaskFilters
                        search={search}
                        setSearch={handleSearch}

                        status={status}
                        setStatus={handleStatus}

                        priority={priority}
                        setPriority={handlePriority}
                    />


                    {/* =========================
                        ASSIGNED USER FILTER
                    ========================== */}

                    <div className="bg-white rounded-xl shadow p-4 mb-6">

                        <label className="block text-sm font-medium text-gray-700 mb-2">

                            Assigned User

                        </label>

                        <select
                            value={assignedTo}
                            onChange={(e) =>
                                handleAssignedTo(
                                    e.target.value
                                )
                            }
                            className="w-full md:w-1/3 border border-gray-300 rounded-lg p-3"
                        >

                            <option value="">
                                All Users
                            </option>

                            {users
                                .filter(
                                    user =>
                                        user.role === "user"
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

                    </div>


                    {/* =========================
                        TASK TABLE
                    ========================== */}

                    {loading ? (

                        <div className="bg-white rounded-xl shadow p-10 text-center">

                            <p className="text-gray-500">
                                Loading tasks...
                            </p>

                        </div>

                    ) : (

                        <TaskTable
                            tasks={tasks}

                            onEdit={handleEdit}

                            onDelete={deleteTask}

                            onStatusChange={
                                updateStatus
                            }
                        />

                    )}


                    {/* =========================
                        PAGINATION
                    ========================== */}

                    {!loading && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;
