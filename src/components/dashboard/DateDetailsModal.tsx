import { useState } from "react";
import AddEditTransaction from "./AddEditTransactionModal";
import ConfirmationModal from "../common/ConfirmationModal";
import {
    deleteTransaction,
    type Transaction,
} from "../../services/finance.service";

type DateDetailsModalProps = {
    date: string | null;
    balance: number | undefined;
    transactions: Transaction[];
    onClose: () => void;
};

function DateDetailsModal({
    date,
    balance,
    transactions,
    onClose,
}: DateDetailsModalProps) {
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [transactionToDelete, setTransactionToDelete] =
        useState<string | null>(null);
    const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

    if (!date) {
        return null;
    }

    const formattedDate = new Date(
        `${date}T00:00:00`
    ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const incomes = transactions.filter(
        (transaction) => transaction.type === "income"
    );

    const expenses = transactions.filter(
        (transaction) => transaction.type === "expense"
    );

    const handleDelete = async () => {
        if (!transactionToDelete) {
            return;
        }

        try {
            await deleteTransaction(transactionToDelete);

            setTransactionToDelete(null);
            onClose();
        } catch (error) {
            console.error("DELETE ERROR:", error);

            setTransactionToDelete(null);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() =>
                                setShowAddTransaction(true)
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            + Add
                        </button>

                        <button
                            onClick={onClose}
                            className="rounded-lg px-3 py-2 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-slate-800">
                        {formattedDate}
                    </h2>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">
                            Current Balance
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-800">
                            ₱
                            {(balance ?? 0).toLocaleString(
                                "en-PH"
                            )}
                        </p>
                    </div>

                    {incomes.length > 0 && (
                        <div className="mt-6">
                            <h3 className="mb-3 font-semibold text-green-600">
                                Income
                            </h3>

                            <div className="space-y-2">
                                {incomes.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                                    >
                                        <div>
                                            <p className="font-semibold text-green-600">
                                                +₱
                                                {transaction.amount.toLocaleString(
                                                    "en-PH"
                                                )}
                                            </p>

                                            {transaction.description && (
                                                <p className="text-sm text-slate-500">
                                                    {
                                                        transaction.description
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                    <button
    onClick={() => setTransactionToEdit(transaction)}
    className="text-sm font-medium text-blue-600 hover:underline"
>
    Edit
</button>

                                            <button
                                                onClick={() =>
                                                    setTransactionToDelete(
                                                        transaction.id
                                                    )
                                                }
                                                className="text-sm font-medium text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {expenses.length > 0 && (
                        <div className="mt-6">
                            <h3 className="mb-3 font-semibold text-red-600">
                                Expenses
                            </h3>

                            <div className="space-y-2">
                                {expenses.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                                    >
                                        <div>
                                            <p className="font-semibold text-red-600">
                                                -₱
                                                {transaction.amount.toLocaleString(
                                                    "en-PH"
                                                )}
                                            </p>

                                            {transaction.description && (
                                                <p className="text-sm text-slate-500">
                                                    {
                                                        transaction.description
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
<button
    onClick={() => setTransactionToEdit(transaction)}
    className="text-sm font-medium text-blue-600 hover:underline"
>
    Edit
</button>

                                            <button
                                                onClick={() =>
                                                    setTransactionToDelete(
                                                        transaction.id
                                                    )
                                                }
                                                className="text-sm font-medium text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {transactions.length === 0 && (
                        <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
                            <p className="text-slate-500">
                                No transactions recorded for this date.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showAddTransaction && (
    <AddEditTransaction
        date={date}
        onClose={() =>
            setShowAddTransaction(false)
        }
    />
)}

{transactionToEdit && (
    <AddEditTransaction
        date={date}
        transaction={transactionToEdit}
        transactionId={transactionToEdit.id}
        onClose={() =>
            setTransactionToEdit(null)
        }
    />
)}

            <ConfirmationModal
                isOpen={transactionToDelete !== null}
                title="Delete transaction?"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setTransactionToDelete(null)}
            />
        </>
    );
}

export default DateDetailsModal;