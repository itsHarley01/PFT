import {
    get,
    ref,
    set,
} from "firebase/database";

import { auth, db } from "../lib/firebase";

export const usernameExists = async (
    username: string
): Promise<boolean> => {

    const snapshot = await get(
        ref(db, `pft_usernames/${username}`)
    );

    return snapshot.exists();
};

export const emailExists = async (
    email: string
): Promise<boolean> => {

    const snapshot = await get(
        ref(db, "pft_us3r4cc")
    );

    if (!snapshot.exists()) {
        return false;
    }

    const users = snapshot.val();

    return Object.values(users).some(
        (user: any) => user.email === email
    );
};

export const createUser = async (
    uid: string,
    username: string,
    email: string
) => {

    await set(
        ref(db, `pft_us3r4cc/${uid}`),
        {
            username,
            email,
            createdAt: Date.now(),
        }
    );

    await set(
        ref(db, `pft_usernames/${username}`),
        {
            uid,
            email,
        }
    );
};

export const getUsername = async (): Promise<string> => {
    const uid = auth.currentUser?.uid;

    if (!uid) {
        throw new Error("User is not logged in.");
    }

    const snapshot = await get(
        ref(db, `pft_us3r4cc/${uid}/username`)
    );

    if (!snapshot.exists()) {
        throw new Error("Username not found.");
    }

    return snapshot.val();
};