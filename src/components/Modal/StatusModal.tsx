import { CheckCircle, XCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatusModalProps {
    type: "success" | "failed";
    title?: string;
    message?: string;
    route?: string;
    buttonName?: string;
    onClose: () => void;
}

const StatusModal = ({
    type,
    title,
    message,
    route,
    buttonName,
    onClose,
}: StatusModalProps) => {

    const navigate = useNavigate();

    const isSuccess = type === "success";

    const handleButtonClick = () => {
        if (route) {
            navigate(route);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

            <div className="relative flex min-h-[300px] w-full max-w-md flex-col items-center justify-center rounded-xl bg-white p-8 shadow-xl">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-500 hover:text-slate-800"
                >
                    <X size={22} />
                </button>


                {/* Icon */}
                {isSuccess ? (
                    <CheckCircle
                        size={80}
                        className="mb-5 text-green-500"
                    />
                ) : (
                    <XCircle
                        size={80}
                        className="mb-5 text-red-500"
                    />
                )}


                {/* Title */}
                {title && (
                    <h2 className="mb-3 text-center text-2xl font-bold">
                        {title}
                    </h2>
                )}


                {/* Message */}
                {message && (
                    <p className="mb-6 text-center text-sm text-slate-600">
                        {message}
                    </p>
                )}


                {/* Optional Button */}
                {route && buttonName && (
                    <button
                        onClick={handleButtonClick}
                        className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        {buttonName}
                    </button>
                )}

            </div>

        </div>
    );
};

export default StatusModal;