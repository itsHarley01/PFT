import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

import { auth } from "../lib/firebase";

export const register = async (
    email: string,
    password: string
) => {
    return await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
};

export const login = async (
    email: string,
    password: string
) => {
    return await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
};

export const forgotPassword = async (
    email: string
) => {
    return await sendPasswordResetEmail(
        auth,
        email
    );
};

export const logout = async () => {
    return await signOut(auth);
};