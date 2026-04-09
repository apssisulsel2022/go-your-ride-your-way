import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { PaymentMethodType, TransactionStatus } from "@/types/models";

// Re-export types for backward compat
export type { PaymentMethodType, TransactionStatus };

export interface Transaction {
  id: string;
  amount: number;
  method: PaymentMethodType;
  status: TransactionStatus;
  description: string;
  createdAt: Date;
  returnPath?: string;
}

interface PaymentContextType {
  transactions: Transaction[];
  activeTransaction: Transaction | null;
  walletBalance: number;
  createTransaction: (data: { amount: number; description: string; returnPath?: string }) => string;
  processPayment: (id: string, method: PaymentMethodType) => Promise<void>;
  getTransaction: (id: string) => Transaction | undefined;
  setActiveTransaction: (id: string) => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTransaction, setActiveTransactionState] = useState<Transaction | null>(null);
  const [walletBalance, setWalletBalance] = useState(180000);

  const createTransaction = useCallback((data: { amount: number; description: string; returnPath?: string }) => {
    const id = "TXN-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    const tx: Transaction = {
      id,
      amount: data.amount,
      method: "cash",
      status: "pending",
      description: data.description,
      createdAt: new Date(),
      returnPath: data.returnPath,
    };
    setTransactions((prev) => [tx, ...prev]);
    setActiveTransactionState(tx);
    return id;
  }, []);

  const processPayment = useCallback(async (id: string, method: PaymentMethodType) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, method, status: "processing" as TransactionStatus } : tx))
    );
    setActiveTransactionState((prev) => prev?.id === id ? { ...prev, method, status: "processing" } : prev);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let success = true;

    if (method === "wallet") {
      if (walletBalance >= (transactions.find((t) => t.id === id)?.amount || 0)) {
        const amt = transactions.find((t) => t.id === id)?.amount || 0;
        setWalletBalance((prev) => prev - amt);
      } else {
        success = false;
      }
    }

    if (method !== "wallet" && method !== "cash" && Math.random() < 0.05) {
      success = false;
    }

    const finalStatus: TransactionStatus = success ? "success" : "failed";
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, status: finalStatus } : tx))
    );
    setActiveTransactionState((prev) => prev?.id === id ? { ...prev, status: finalStatus } : prev);
  }, [walletBalance, transactions]);

  const getTransaction = useCallback((id: string) => transactions.find((tx) => tx.id === id), [transactions]);

  const setActiveTransaction = useCallback((id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) setActiveTransactionState(tx);
  }, [transactions]);

  return (
    <PaymentContext.Provider value={{ transactions, activeTransaction, walletBalance, createTransaction, processPayment, getTransaction, setActiveTransaction }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used within PaymentProvider");
  return ctx;
}
