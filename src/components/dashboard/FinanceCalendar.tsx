import { useEffect, useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import DateDetailsModal from "./DateDetailsModal";
import {
    getTransactionsByMonth,
    getCheckpoint,
    type Transaction,
} from "../../services/finance.service";

function FinanceCalendar() {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState("");

    const [transactions, setTransactions] = useState<
        Record<string, Transaction>
    >({});

    const [dailyBalances, setDailyBalances] = useState<
        Record<string, number>
    >({});

    const handleDateClick = (info: { dateStr: string }) => {
        setSelectedDate(info.dateStr);
    };

    const handleCloseModal = () => {
        setSelectedDate(null);
    };

    useEffect(() => {
        if (!currentMonth) {
            return;
        }

        const fetchMonthData = async () => {
            try {
                const [year, month] = currentMonth
                    .split("-")
                    .map(Number);

                const previousMonthDate = new Date(
                    year,
                    month - 2,
                    1
                );

                const previousYear =
                    previousMonthDate.getFullYear();

                const previousMonth = String(
                    previousMonthDate.getMonth() + 1
                ).padStart(2, "0");

                const previousMonthKey =
                    `${previousYear}-${previousMonth}`;

                const [
                    transactionData,
                    checkpoint,
                ] = await Promise.all([
                    getTransactionsByMonth(currentMonth),
                    getCheckpoint(previousMonthKey),
                ]);

                setTransactions(transactionData);

                const balances: Record<string, number> = {};

                const daysInMonth = new Date(
                    year,
                    month,
                    0
                ).getDate();

                let balance = checkpoint?.balance ?? 0;

                for (
                    let day = 1;
                    day <= daysInMonth;
                    day++
                ) {
                    const date =
                        `${currentMonth}-${String(day).padStart(
                            2,
                            "0"
                        )}`;

                    const dayTransactions =
                        Object.values(
                            transactionData
                        ).filter(
                            (transaction) =>
                                transaction.date === date
                        );

                    for (
                        const transaction of dayTransactions
                    ) {
                        if (
                            transaction.type ===
                            "income"
                        ) {
                            balance +=
                                transaction.amount;
                        } else if (
                            transaction.type ===
                            "expense"
                        ) {
                            balance -=
                                transaction.amount;
                        }
                    }

                    balances[date] = balance;
                }

                setDailyBalances(balances);

            } catch (error) {
                console.error(
                    "Failed to fetch month data:",
                    error
                );

                setTransactions({});
                setDailyBalances({});
            }
        };

        fetchMonthData();
    }, [currentMonth]);

    return (
        <>
            <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        interactionPlugin,
                    ]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                    datesSet={(info) => {
                        const date =
                            info.view.currentStart;

                        const year =
                            date.getFullYear();

                        const month =
                            String(
                                date.getMonth() + 1
                            ).padStart(2, "0");

                        setCurrentMonth(
                            `${year}-${month}`
                        );
                    }}
                    dayCellContent={(info) => {
                        const date =
                            `${info.date.getFullYear()}-` +
                            `${String(
                                info.date.getMonth() + 1
                            ).padStart(2, "0")}-` +
                            `${String(
                                info.date.getDate()
                            ).padStart(2, "0")}`;

                        const balance =
                            dailyBalances[date];

                        const dayTransactions =
                            Object.values(
                                transactions
                            ).filter(
                                (transaction) =>
                                    transaction.date ===
                                    date
                            );

                        const incomeCount =
                            dayTransactions.filter(
                                (transaction) =>
                                    transaction.type ===
                                    "income"
                            ).length;

                        const expenseCount =
                            dayTransactions.filter(
                                (transaction) =>
                                    transaction.type ===
                                    "expense"
                            ).length;

                        return (
                            <div className="flex w-full flex-col gap-1 p-1">
                                <div>
                                    {
                                        info.dayNumberText
                                    }
                                </div>

                                {balance !==
                                    undefined &&
                                    balance !== 0 && (
                                        <div className="font-bold text-slate-800">
                                            ₱
                                            {balance.toLocaleString(
                                                "en-PH"
                                            )}
                                        </div>
                                    )}

                                {(incomeCount >
                                    0 ||
                                    expenseCount >
                                        0) && (
                                    <div className="flex flex-wrap gap-1">
                                        {Array.from(
                                            {
                                                length:
                                                    incomeCount,
                                            }
                                        ).map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <span
                                                    key={`income-${index}`}
                                                    className="h-4 w-4 rounded-full bg-green-500"
                                                />
                                            )
                                        )}

                                        {Array.from(
                                            {
                                                length:
                                                    expenseCount,
                                            }
                                        ).map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <span
                                                    key={`expense-${index}`}
                                                    className="h-4 w-4 rounded-full bg-red-500"
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    }}
                    height="auto"
                />
            </div>

<DateDetailsModal
    date={selectedDate}
    balance={
        selectedDate
            ? dailyBalances[selectedDate]
            : undefined
    }
    transactions={
        selectedDate
            ? Object.values(transactions).filter(
                  (transaction) =>
                      transaction.date === selectedDate
              )
            : []
    }
    onClose={handleCloseModal}
/>
        </>
    );
}

export default FinanceCalendar;