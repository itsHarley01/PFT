import { useState } from "react";

import UserProfileMenu from "./UserProfileMenu";

type DashboardHeaderProps = {
    username: string;
};

function DashboardHeader({
    username,
}: DashboardHeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                <div>
                    <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                        ProPFT
                    </h1>
                </div>

                <div className="relative">
                    <button
                        onClick={toggleProfile}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-slate-100"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                            {username.charAt(0).toUpperCase()}
                        </div>

                        <span className="max-w-32 truncate font-medium text-slate-700">
                            {username}
                        </span>
                    </button>

                    <UserProfileMenu
                        username={username}
                        isOpen={isProfileOpen}
                        onClose={() => setIsProfileOpen(false)}
                    />
                </div>

            </div>
        </header>
    );
}

export default DashboardHeader;