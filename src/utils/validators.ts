export const validateUsername = (username: string): string => {
    if (!username.trim()) {
        return "Username is required.";
    }

    if (username.length < 4) {
        return "Username must be at least 4 characters.";
    }

    return "";
};

export const validateEmail = (email: string): string => {
    if (!email.trim()) {
        return "Email is required.";
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Invalid email address.";
    }

    return "";
};

export const validatePassword = (password: string): string => {
    if (!password) {
        return "Password is required.";
    }

    if (password.length < 8) {
        return "Password must be at least 8 characters.";
    }

    return "";
};
