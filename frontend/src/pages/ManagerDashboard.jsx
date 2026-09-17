import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";
import TaskFilters from "../components/TaskFilters";
import Pagination from "../components/Pagination";

import API from "../services/api";
import useDebounce from "../hooks/useDebounce";

function ManagerDashboard() {

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [selectedTask, setSelectedTask] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [priority, setPriority] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalTasks, setTotalTasks] =
        useState(0);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const debouncedSearch =
        useDebounce(search, 500);


    // Fetch users only once
    useEffect(() => {
        fetchUsers();
    }, []);


    // Fetch tasks whenever filters/page change
    useEffect(() => {
        fetchTasks();
    }, [
        page,
        debouncedSearch,
        status,
        priority
    ]);


    // =========================
    // FETCH USERS
    // =========================

    const fetchUsers = async () => {

        try {

            setError("");

            const response =
                await API.get("/users");

            console.log(
                "USERS RESPONSE:",
                response.data
            );

            const userList =
                response.data.users ||
                response.data;

            console.log(
                "USERS LIST:",
                userList
            );

            setUsers(userList);

        } catch (error) {

            console.error(
                "Fetch Users Error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to fetch users"
            );
        }
    };


    // =========================
    // FETCH TASKS
    // =========================

    const fetchTasks = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                "/tasks",
                {
                    params: {
                        page,
                        limit: 5,
                        search: debouncedSearch,
                        status,
                        priority
                    }
                }
            );

            console.log(
                "TASKS RESPONSE:",
                response.data
            );

            setTasks(
                response.data.tasks || []
            );

            setTotalPages(
                response.data.pagination?.totalPages || 1
            );

            setTotalTasks(
                response.data.pagination?.total || 0
            );

        } catch (error) {

            console.error(
                "Fetch Tasks Error:",
                error.response?.data ||
                error.message
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // SEARCH
    // =========================

    const handleSearch = (value) => {

        setSearch(value);
        setPage(1);

    };


    // =========================
    // STATUS FILTER
    // =========================

    const handleStatus = (value) => {

        setStatus(value);
        setPage(1);

    };


    // =========================
    // PRIORITY FILTER
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
    // UPDATE STATUS
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
                error.response?.data ||
                error.message
            );

        }
    };


    // =========================
    // TASK SAVED
    // =========================

    const handleTaskSaved = () => {

        setSelectedTask(null);

        fetchTasks();

    };


    return (
        <div className="min-h-screen bg-gray-100">

            <Navbar />

            <main className="max-w-7xl mx-auto p-4 sm:p-6">

                <h1 className="text-3xl font-bold mb-6">
                    Manager Dashboard
                </h1>


                {/* USER FETCH ERROR */}

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}


                {/* TASK FORM */}

                <TaskForm
                    users={users}
                    selectedTask={selectedTask}
                    onTaskSaved={handleTaskSaved}
                    onCancel={() =>
                        setSelectedTask(null)
                    }
                />


                {/* TASKS */}

                <div className="mt-8">

                    <div className="flex justify-between items-center mb-4">

                        <h2 className="text-2xl font-bold">
                            Tasks
                        </h2>

                        <span className="text-gray-600">
                            {totalTasks} total
                        </span>

                    </div>


                    {/* FILTERS */}

                    <TaskFilters
                        search={search}
                        setSearch={handleSearch}
                        status={status}
                        setStatus={handleStatus}
                        priority={priority}
                        setPriority={handlePriority}
                    />


                    {/* TASK TABLE */}

                    {loading ? (

                        <div className="bg-white p-10 rounded-xl text-center">
                            Loading tasks...
                        </div>

                    ) : (

                        <TaskTable
                            tasks={tasks}
                            onEdit={setSelectedTask}
                            onDelete={deleteTask}
                            onStatusChange={
                                updateStatus
                            }
                        />

                    )}


                    {/* PAGINATION */}

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />

                </div>

            </main>

        </div>
    );
}

export default ManagerDashboard;