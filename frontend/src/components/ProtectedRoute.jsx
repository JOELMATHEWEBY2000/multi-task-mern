import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children, allowedRoles }) {
    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    const role = user.role;

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoutes;