import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard
    from "./pages/AdminDashboard";

import ManagerDashboard
    from "./pages/ManagerDashboard";

import UserDashboard
    from "./pages/UserDashboard";

import NotFound
    from "./pages/NotFound";

import ProtectedRoute
    from "./components/ProtectedRoute";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "admin",
                                "manager"
                            ]}
                        >
                            <ManagerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "user"
                            ]}
                        >
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/unauthorized"
                    element={<NotFound />}
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;