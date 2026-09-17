import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="bg-gray-900 text-white px-4 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">

                <h1 className="text-xl font-bold">
                    Task Management System
                </h1>

                <div className="flex items-center gap-4">

                    {user && (
                        <div className="text-sm">
                            <span>{user.name}</span>

                            <span className="ml-2 bg-blue-600 px-2 py-1 rounded capitalize">
                                {user.role}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;
