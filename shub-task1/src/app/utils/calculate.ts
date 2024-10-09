import { Transaction } from "../types/Trasaction";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractTransactions = (data: any[][]): Transaction[] => {
    const transactions: Transaction[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((row: any[], index: number) => {
        if (index === 0) return;
        const date = row[1];
        const time = row[2];
        const amount = row[8];

        if (date && time && amount) {
            transactions.push({
                date,
                time,
                amount: Number(amount),
            });
        }
    });
    return transactions;
};

export const calculateTotalAmount = (
    transactions: Transaction[],
    startTime: string,
    endTime: string
): number => {
    const start = new Date(`2024-03-21T${startTime}`);
    const end = new Date(`2024-03-21T${endTime}`);
    let total = 0;
    transactions.forEach((transaction) => {
        const transactionTime = new Date(`2024-03-21T${transaction.time}`);
        if (transactionTime >= start && transactionTime < end) {
            total += transaction.amount;
        }
    });
    return total;
};
