import { useEffect, useState } from "react";
import {
    createTransaction,
    editTransaction,
    type Transaction,
    type TransactionType,
} from "../../services/finance.service";

type AddEditTransactionProps = {
    date: string;
    transaction?: Transaction | null;
    transactionId?: string | null;
    onClose: () => void;
    onTransactionChanged: () => void;
};

function AddEditTransaction({
    date,
    transaction = null,
    transactionId = null,
    onClose,
    onTransactionChanged,
}: AddEditTransactionProps) {
    const [type, setType] = useState<TransactionType>("income");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isEditMode = transaction !== null;

    useEffect(() => {
        if (transaction) {
            setType(transaction.type);
            setAmount(String(transaction.amount));
            setDescription(transaction.description);
        } else {
            setType("income");
            setAmount("");
            setDescription("");
        }

        setError("");
    }, [transaction, date]);

    if (!date) {
        return null;
    }

    const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        }
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const numericAmount = Number(amount);

        if (!amount || numericAmount <= 0) {
            setError("Enter a valid amount.");
            return;
        }

        setIsLoading(true);
        try {
    if (isEditMode && transactionId) {
        await editTransaction(transactionId, {
            type,
            amount: numericAmount,
            description: description.trim(),
        });
    } else {
        await createTransaction(
            type,
            numericAmount,
            description.trim(),
            date
        );
    }

    onTransactionChanged();

    onClose();
} catch (error) {
    console.error("CRUD ERROR:", error);

    setError(
        isEditMode
            ? "Failed to update transaction."
            : "Failed to add transaction."
    );
} finally {
    setIsLoading(false);
}
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
            onClick={() => {
                if (!isLoading) {
                    onClose();
                }
            }}
        >
            <div
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {isEditMode
                            ? "Edit Transaction"
                            : "Add Transaction"}
                    </h2>

                    <button
                        type="button"
                        onClick={() => {
                            if (!isLoading) {
                                onClose();
                            }
                        }}
                        disabled={isLoading}
                        className="rounded-lg px-3 py-2 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >
                    <div>
                        <label className="mb-3 block text-sm font-medium text-slate-700">
                            Type
                        </label>

                        <div className="flex gap-6">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="transactionType"
                                    value="income"
                                    checked={type === "income"}
                                    onChange={() => setType("income")}
                                    disabled={isLoading}
                                    className="h-4 w-4"
                                />
                                <span>Income</span>
                            </label>

                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="radio"
                                    name="transactionType"
                                    value="expense"
                                    checked={type === "expense"}
                                    onChange={() => setType("expense")}
                                    disabled={isLoading}
                                    className="h-4 w-4"
                                />
                                <span>Expense</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            disabled={isLoading}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter a description"
                            rows={3}
                            disabled={isLoading}
                            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Date
                        </label>

                        <div className="rounded-lg bg-slate-50 px-4 py-3 text-slate-700">
                            {formattedDate}
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="rounded-lg px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-100"
                        >
                            Cancel
                        </button>

<button
    type="submit"
    disabled={isLoading}
    className="flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
>
    {isLoading ? (
        <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {isEditMode ? "Saving..." : "Adding..."}
        </>
    ) : (
        isEditMode ? "Save" : "Add"
    )}
</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEditTransaction;