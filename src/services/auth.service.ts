import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

import {
    get,
    ref,
} from "firebase/database";

import { auth } from "../lib/firebase";
import { db } from "../lib/firebase";

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

export const loginByUsername = async (
    username: string,
    password: string
) => {

    const snapshot = await get(
        ref(db, `pft_usernames/${username}`)
    );

    if (!snapshot.exists()) {
        throw new Error("LOGIN_FAILED");
    }

    const userData = snapshot.val();

    return await signInWithEmailAndPassword(
        auth,
        userData.email,
        password
    );
};