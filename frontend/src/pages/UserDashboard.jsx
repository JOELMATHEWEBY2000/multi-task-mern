import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import TaskTable from "../components/TaskTable";
import TaskFilters from "../components/TaskFilters";
import Pagination from "../components/Pagination";

import API from "../services/api";
import useDebounce from "../hooks/useDebounce";


function UserDashboard() {

    // =========================
    // Tasks
    // =========================

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);


    // =========================
    // Search & Filters
    // =========================

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [priority, setPriority] = useState("");


    // =========================
    // Pagination
    // =========================

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalTasks, setTotalTasks] =
        useState(0);

    const limit = 5;


    // =========================
    // Loading & Error
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
    // Fetch Tasks
    // =========================

    useEffect(() => {

        fetchTasks();

    }, [
        page,
        debouncedSearch,
        status,
        priority
    ]);


    // =========================
    // Get User Tasks
    // =========================

    const fetchTasks = async () => {

        try {

            setLoading(true);

            setError("");


            const response = await API.get(
                "/tasks",
                {
                    params: {

                        page,

                        limit,

                        search:
                            debouncedSearch,

                        status,

                        priority

                    }
                }
            );


            /*
             * Backend response:
             *
             * {
             *   tasks: [],
             *   pagination: {
             *      total,
             *      page,
             *      limit,
             *      totalPages
             *   }
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
                "Unable to load your tasks"
            );


            setTasks([]);


        } finally {

            setLoading(false);

        }

    };


    // =========================
    // Search
    // =========================

    const handleSearch = (value) => {

        setSearch(value);

        /*
         * Search should always
         * start from page 1.
         */

        setPage(1);

    };


    // =========================
    // Status Filter
    // =========================

    const handleStatus = (value) => {

        setStatus(value);

        setPage(1);

    };


    // =========================
    // Priority Filter
    // =========================

    const handlePriority = (value) => {

        setPriority(value);

        setPage(1);

    };

        // =========================
        // DELETE TASK
        // =========================
    
        const deleteTask = async (id) => {
    
            if (
                !window.confirm(
                    "Delete this task?"
                )
            ) {
                return;
            }
    
            try {
    
                await API.delete(
                    `/tasks/${id}`
                );
    
                fetchTasks();
    
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


            /*
             * Refresh current page
             */

            fetchTasks();


        } catch (error) {

            console.error(
                "Update Status Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to update task"
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

        setPage(1);

    };


    // =========================
    // Current Page Statistics
    // =========================

    const pending =
        tasks.filter(
            task =>
                task.status === "pending"
        ).length;


    const inProgress =
        tasks.filter(
            task =>
                task.status === "in progress"
        ).length;


    const completed =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;


    // =========================
    // Render
    // =========================

    return (

        <div className="min-h-screen bg-gray-100">


            {/* =========================
                NAVBAR
            ========================== */}

            <Navbar />


            <main className="max-w-7xl mx-auto p-4 sm:p-6">


                {/* =========================
                    HEADER
                ========================== */}

                <div className="mb-6">

                    <h1 className="text-3xl font-bold text-gray-800">
                        My Dashboard
                    </h1>


                    <p className="text-gray-500 mt-1">
                        View and update your assigned tasks.
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
                            {pending}
                        </h2>

                    </div>


                    {/* In Progress */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            In Progress
                        </p>


                        <h2 className="text-3xl font-bold mt-2">
                            {inProgress}
                        </h2>

                    </div>


                    {/* Completed */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <p className="text-gray-500">
                            Completed
                        </p>


                        <h2 className="text-3xl font-bold mt-2">
                            {completed}
                        </h2>

                    </div>

                </div>


                {/* =========================
                    TASK SECTION
                ========================== */}

                <section>


                    {/* Header */}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                My Tasks
                            </h2>


                            <p className="text-sm text-gray-500 mt-1">

                                Showing {tasks.length} of{" "}

                                {totalTasks} tasks

                            </p>

                        </div>


                        {/* Clear Filters */}

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
                        TASK TABLE
                    ========================== */}

                    {loading ? (

                        <div className="bg-white rounded-xl shadow p-10 text-center">

                            <p className="text-gray-500">
                                Loading your tasks...
                            </p>

                        </div>

                    ) : (

                        <TaskTable

                            tasks={tasks}
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


export default UserDashboard;
