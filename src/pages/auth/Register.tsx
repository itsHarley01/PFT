import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { validateUsername, validateEmail, validatePassword } from "../../utils/validators";
import { register } from "../../services/auth.service";
import {
    usernameExists,
    emailExists,
    createUser,
} from "../../services/user.service";
import StatusModal from "../../components/Modal/StatusModal";

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [modal, setModal] = useState({
        show: false,
        type: "success" as "success" | "failed",
        title: "",
        message: "",
        route: "",
        buttonName: "",
    });
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const passwordError = validatePassword(password);
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);

    const passwordMismatch =
        password.trim() !== "" &&
        confirmPassword.trim() !== "" &&
        password !== confirmPassword;

    const isFormValid =
        username.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        confirmPassword.trim() !== "" &&
        usernameError === "" &&
        emailError === "" &&
        passwordError === "" &&
        !passwordMismatch;

    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
        ) => {
            e.preventDefault();
            try {
                setLoading(true);
            
                // Check username
                const usernameTaken = await usernameExists(username);
            
                if (usernameTaken) {
                    setMessage("Username already exists.");
                    return;
                }
            
            
                // Check email
                const emailTaken = await emailExists(email);
            
                if (emailTaken) {
                    setMessage("Email already exists.");
                    return;
                }
            
            
                // Create Firebase Authentication user
                const userCredential = await register(
                    email,
                    password
                );
            
            
                // Firebase generated UID
                const uid = userCredential.user.uid;
            
            
                // Create user profile in Realtime Database
                await createUser(
                    uid,
                    username,
                    email
                );
            
                console.log("Registration successful");
                setModal({
                    show: true,
                    type: "success",
                    title: "Registration Successful",
                    message: "You have been registered successfully.",
                    route: "/",
                    buttonName: "Go to Login"
                });
            
            
            } catch (error) {
                console.error("Registration failed:", error);
                setModal({
                    show: true,
                    type: "failed",
                    title: "Registration Failed",
                    message: error instanceof Error ? error.message : "An error occurred during registration.",
                    route: "",
                    buttonName: ""
                });
            
            } finally {
                setLoading(false);
            }
        };


    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">

            <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 p-8">

                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-bold text-slate-800">
                        PFT
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Create your account
                    </p>

                </div>

                <form className="space-y-5" onSubmit={handleRegister}>

                    {/* Username */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Username
                        </label>

                            <input
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                    onBlur={() =>
                                    setTouched((prev) => ({
                                        ...prev,
                                        username: true,
                                    }))
                                }
                                type="text"
                                placeholder="Enter your username"
                                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                                    touched.username && usernameError
                                        ? "border-red-500"
                                        : username
                                }`}
                            />
                            {touched.username && usernameError && (
                                <p className="mt-1 text-sm text-red-500">
                                    {usernameError}
                                </p>
                            )}

                    </div>

                    {/* Email */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email
                        </label>

                            <input
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() =>
                                    setTouched((prev) => ({
                                        ...prev,
                                        email: true,
                                    }))
                                }
                                type="email"
                                placeholder="Enter your email"
                                className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                                    touched.email && emailError
                                        ? "border-red-500"
                                        : email
    
                                }`}
                            />
                            {touched.email && emailError && (
                                <p className="mt-1 text-sm text-red-500">
                                    {emailError}
                                </p>
                            )}

                    </div>

                    {/* Password */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() =>
                                    setTouched((prev) => ({
                                        ...prev,
                                        password: true,
                                    }))
                                }
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={`w-full rounded-lg border px-4 py-3 pr-12 outline-none transition ${
                                    touched.password && passwordError
                                        ? "border-red-500"
                                        : password
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>

                        </div>

                            {touched.password && passwordError && (
                                <p className="mt-1 text-sm text-red-500">
                                    {passwordError}
                                </p>
                            )}

                    </div>

                    {/* Confirm Password */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <input
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() =>
                                    setTouched((prev) => ({
                                        ...prev,
                                        confirmPassword: true,
                                    }))
                                }
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={`w-full rounded-lg border px-4 py-3 pr-12 outline-none transition ${
                                    touched.confirmPassword && passwordMismatch
                                        ? "border-red-500"
                                        : confirmPassword
                                        
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>

                        </div>
                            {touched.confirmPassword && passwordMismatch && (
                                <p className="mt-1 text-sm text-red-500">
                                    Passwords do not match.
                                </p>
                            )}

                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`w-full rounded-lg py-3 font-semibold text-white transition ${
                            loading
                                ? "bg-slate-400 cursor-not-allowed"
                                : isFormValid
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-slate-400 cursor-not-allowed"
                        }`}
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>

                    {message && (
                        <p className="text-center text-sm text-red-500">
                            {message}
                        </p>
                    )}

                </form>

                <div className="mt-6 text-center text-sm">

                    Already have an account?{" "}

                    <Link
                        to="/"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Login
                    </Link>

                </div>

            </div>

            {modal.show && (
                <StatusModal
                    type={modal.type}
                    title={modal.title}
                    message={modal.message}
                    route={modal.route}
                    buttonName={modal.buttonName}
                    onClose={() =>
                        setModal((prev) => ({
                            ...prev,
                            show: false,
                        }))
                    }
                />
            )}

        </div>
    );
}

export default Register;