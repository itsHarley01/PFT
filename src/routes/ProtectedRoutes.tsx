import { useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../lib/firebase";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import { Outlet } from "react-router-dom";

const ProtectedRoutes = (
    <Route
        element={
            <ProtectedRoute />
        }
    >
        <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
        </Route>
    </Route>
);

function ProtectedRoute() {
    const [user, setUser] = useState(auth.currentUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoutes;