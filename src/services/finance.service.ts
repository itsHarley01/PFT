import {
    get,
    push,
    ref,
    set,
    update,
    remove,
} from "firebase/database";

import { auth, db } from "../lib/firebase";


export type TransactionType = "income" | "expense";


export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
    createdAt: number;
    updatedAt: number;
}


export interface TransactionChanges {
    type?: TransactionType;
    amount?: number;
    description?: string;
    date?: string;
}


export interface Checkpoint {
    totalIncome: number;
    totalExpense: number;
    balance: number;
}


const getUid = (): string => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not logged in.");
    }

    return user.uid;
};


const getMonthKey = (date: string): string => {
    return date.substring(0, 7);
};


const getPreviousMonthKey = (month: string): string => {
    const [year, monthNumber] = month.split("-").map(Number);

    const date = new Date(year, monthNumber - 2, 1);

    return `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}`;
};


export const createTransaction = async (
    type: TransactionType,
    amount: number,
    description: string,
    date: string
) => {
    const uid = getUid();

    const month = getMonthKey(date);
    const timestamp = Date.now();

    const transactionsRef = ref(
        db,
        `pft_finances/${uid}/transactions/${month}`
    );

    const transactionRef = push(transactionsRef);

    const transaction: Transaction = {
        id: transactionRef.key,
        type,
        amount,
        description,
        date,
        createdAt: timestamp,
        updatedAt: timestamp,
    };

    await set(transactionRef, transaction);

    await updateCheckpoint(month);

    return transactionRef.key;
};


export const editTransaction = async (
    transactionId: string,
    changes: TransactionChanges
) => {
    const uid = getUid();

    /*
     * Find the transaction first so we know
     * its current month and current values.
     */
    let oldMonth: string | null = null;
    let oldTransaction: Transaction | null = null;

    const transactionsRef = ref(
        db,
        `pft_finances/${uid}/transactions`
    );

    const snapshot = await get(transactionsRef);

    if (!snapshot.exists()) {
        throw new Error("Transaction not found.");
    }

    const months = snapshot.val();

    for (const month of Object.keys(months)) {
        if (months[month]?.[transactionId]) {
            oldMonth = month;
            oldTransaction = months[month][transactionId];
            break;
        }
    }

    if (!oldTransaction || !oldMonth) {
        throw new Error("Transaction not found.");
    }

    const updatedTransaction: Transaction = {
        ...oldTransaction,
        ...changes,
        updatedAt: Date.now(),
    };

    const newMonth = getMonthKey(updatedTransaction.date);

    /*
     * If the date moved to another month,
     * remove it from the old month and create
     * it in the new month.
     */
    if (oldMonth !== newMonth) {
        await remove(
            ref(
                db,
                `pft_finances/${uid}/transactions/${oldMonth}/${transactionId}`
            )
        );

        await set(
            ref(
                db,
                `pft_finances/${uid}/transactions/${newMonth}/${transactionId}`
            ),
            updatedTransaction
        );

        await updateCheckpoint(oldMonth);
        await updateCheckpoint(newMonth);

        return;
    }

    await update(
        ref(
            db,
            `pft_finances/${uid}/transactions/${oldMonth}/${transactionId}`
        ),
        updatedTransaction
    );

    await updateCheckpoint(oldMonth);
};


export const deleteTransaction = async (
    transactionId: string
) => {
    const uid = getUid();

    const transactionsRef = ref(
        db,
        `pft_finances/${uid}/transactions`
    );

    const snapshot = await get(transactionsRef);

    if (!snapshot.exists()) {
        throw new Error("Transaction not found.");
    }

    const months = snapshot.val();

    let transactionMonth: string | null = null;

    for (const month of Object.keys(months)) {
        if (months[month]?.[transactionId]) {
            transactionMonth = month;
            break;
        }
    }

    if (!transactionMonth) {
        throw new Error("Transaction not found.");
    }

    await remove(
        ref(
            db,
            `pft_finances/${uid}/transactions/${transactionMonth}/${transactionId}`
        )
    );

    await updateCheckpoint(transactionMonth);
};


export const updateCheckpoint = async (
    month: string
) => {
    const uid = getUid();

    /*
     * Get all transactions for this month.
     */
    const transactionsRef = ref(
        db,
        `pft_finances/${uid}/transactions/${month}`
    );

    const snapshot = await get(transactionsRef);

    let totalIncome = 0;
    let totalExpense = 0;

    if (snapshot.exists()) {
        const transactions = snapshot.val();

        for (const transaction of Object.values(
            transactions
        ) as Transaction[]) {

            if (transaction.type === "income") {
                totalIncome += transaction.amount;
            }

            if (transaction.type === "expense") {
                totalExpense += transaction.amount;
            }
        }
    }

    /*
     * Get previous month's closing balance.
     */
    const previousMonth = getPreviousMonthKey(month);

    const previousCheckpointRef = ref(
        db,
        `pft_finances/${uid}/checkpoints/${previousMonth}`
    );

    const previousCheckpointSnapshot =
        await get(previousCheckpointRef);

    let openingBalance = 0;

    if (previousCheckpointSnapshot.exists()) {
        const previousCheckpoint =
            previousCheckpointSnapshot.val() as Checkpoint;

        openingBalance = previousCheckpoint.balance;
    }

    /*
     * Calculate this month's closing balance.
     */
    const balance =
        openingBalance +
        totalIncome -
        totalExpense;

    const checkpoint: Checkpoint = {
        totalIncome,
        totalExpense,
        balance,
    };

    /*
     * Save checkpoint.
     */
    await set(
        ref(
            db,
            `pft_finances/${uid}/checkpoints/${month}`
        ),
        checkpoint
    );

    return checkpoint;
};

export const getTransactionsByMonth = async (
    month: string
): Promise<Record<string, Transaction>> => {
    const uid = getUid();

    const snapshot = await get(
        ref(
            db,
            `pft_finances/${uid}/transactions/${month}`
        )
    );

    if (!snapshot.exists()) {
        return {};
    }

    const data = snapshot.val();

    return Object.fromEntries(
        Object.entries(data).map(
            ([id, transaction]) => [
                id,
                {
                    id,
                    ...(transaction as Omit<Transaction, "id">),
                },
            ]
        )
    );
};

export const getCheckpoint = async (
    month: string
): Promise<Checkpoint | null> => {
    const uid = getUid();

    const snapshot = await get(
        ref(
            db,
            `pft_finances/${uid}/checkpoints/${month}`
        )
    );

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val() as Checkpoint;
};