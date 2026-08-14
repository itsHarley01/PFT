import { useEffect, useState } from "react";
import { getUsername } from "../../services/user.service";

import DashboardHeader from "../../components/dashboard/DashbaordHeader";
import FinanceCalendar from "../../components/dashboard/FinanceCalendar";

function Dashboard() {
    const [username, setUsername] = useState("User");

    useEffect(() => {
        getUsername().then(setUsername);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            <DashboardHeader username={username} />

            <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
                <FinanceCalendar />
            </main>
        </div>
    );
}

export default Dashboard;