import { useNavigate } from "react-router-dom";

import { logout } from "../../services/auth.service";

type UserProfileMenuProps = {
    username: string;
    isOpen: boolean;
    onClose: () => void;
};

function UserProfileMenu({
    username,
    isOpen,
    // onClose,
}: UserProfileMenuProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            
            <div className="mb-4">
                <p className="text-sm text-slate-500">
                    Logged in as
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                    {username}
                </p>
            </div>

            <div className="border-t border-slate-200 pt-3">
                <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-4 py-2 text-left font-medium text-red-600 transition hover:bg-red-50"
                >
                    Logout
                </button>
            </div>

        </div>
    );
}

export default UserProfileMenu;