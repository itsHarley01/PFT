import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-200">
      {/* Sidebar */}
      {/* Navbar */}

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;