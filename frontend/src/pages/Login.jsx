import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await API.post(
                "/users/login",
                formData
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            const role = response.data.user.role;

            if (role === "admin") {
                navigate("/admin");
            } else if (role === "manager") {
                navigate("/manager");
            } else {
                navigate("/user");
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Task Manager
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center mt-5">
                    Don't have an account?
                    <button
                        onClick={() => navigate("/register")}
                        className="text-blue-600 ml-2"
                    >
                        Register
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Login;
