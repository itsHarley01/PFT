import { Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/dashboard/Dashboard";

const ProtectedRoutes = (
    <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
    </Route>
);

export default ProtectedRoutes;