import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
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
            await API.post(
                "/users/register",
                formData
            );

            alert("Registration Successful");

            navigate("/login");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Create Account
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
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

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
                        autoComplete="new-password"
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    >
                        <option value="user">
                            User
                        </option>

                        <option value="manager">
                            Manager
                        </option>

                        <option value="admin">
                            Admin
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Register
                    </button>

                </form>

                <p className="text-center mt-5">
                    Already have an account?
                    <button
                        onClick={() => navigate("/login")}
                        className="text-blue-600 ml-2"
                    >
                        Login
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Register;