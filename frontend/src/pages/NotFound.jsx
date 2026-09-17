import { useNavigate } from "react-router-dom";

function NotFound() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="text-center">

                <h1 className="text-5xl font-bold text-red-600">
                    403
                </h1>

                <h2 className="text-2xl font-bold mt-3">
                    Access Denied
                </h2>

                <p className="text-gray-600 mt-2">
                    You don't have permission to access this page.
                </p>

                <button
                    onClick={() => navigate("/login")}
                    className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg"
                >
                    Go to Login
                </button>

            </div>

        </div>
    );
}

export default NotFound;