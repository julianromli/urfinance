import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { formatIDR } from '@/utils/currency';

// Define the types for our financial data
type Transaction = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  walletId: string;
};

type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
};

type Wallet = {
  id: string;
  name: string;
  balance: number;
  type: 'cash' | 'bank' | 'credit' | 'investment';
  color: string;
};

type Transfer = {
  amount: number;
  description: string;
  date: string;
  fromWalletId: string;
  toWalletId: string;
  fee: number;
};

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  wallets: Wallet[];
  currency: string;
  currencySymbol: string;
  updateCurrency: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addWallet: (wallet: Omit<Wallet, 'id'>) => void;
  updateWallet: (wallet: Wallet) => void;
  deleteWallet: (id: string) => void;
  addTransfer: (transfer: Transfer) => void;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  formatCurrency: (amount: number) => string;
}

// Create the context
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Sample data for development
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    category: 'Salary',
    description: 'Monthly salary',
    date: '2023-06-01',
    type: 'income',
    walletId: '1',
  },
  {
    id: '2',
    amount: 45.99,
    category: 'Groceries',
    description: 'Weekly shopping',
    date: '2023-06-04',
    type: 'expense',
    walletId: '1',
  },
  {
    id: '3',
    amount: 120,
    category: 'Dining',
    description: 'Dinner with friends',
    date: '2023-06-08',
    type: 'expense',
    walletId: '1',
  },
  {
    id: '4',
    amount: 500,
    category: 'Freelance',
    description: 'Design project',
    date: '2023-06-15',
    type: 'income',
    walletId: '2',
  },
  {
    id: '5',
    amount: 89.99,
    category: 'Utilities',
    description: 'Electricity bill',
    date: '2023-06-10',
    type: 'expense',
    walletId: '1',
  },
  {
    id: '6',
    amount: 350,
    category: 'Rent',
    description: 'Monthly rent',
    date: '2023-06-01',
    type: 'expense',
    walletId: '1',
  },
];

const sampleBudgets: Budget[] = [
  {
    id: '1',
    category: 'Groceries',
    amount: 400,
    spent: 245.50,
    period: 'monthly',
  },
  {
    id: '2',
    category: 'Dining',
    amount: 300,
    spent: 220,
    period: 'monthly',
  },
  {
    id: '3',
    category: 'Entertainment',
    amount: 200,
    spent: 85.99,
    period: 'monthly',
  },
  {
    id: '4',
    category: 'Transportation',
    amount: 150,
    spent: 78.50,
    period: 'monthly',
  },
];

const sampleWallets: Wallet[] = [
  {
    id: '1',
    name: 'Main Account',
    balance: 3450.20,
    type: 'bank',
    color: '#4263EB',
  },
  {
    id: '2',
    name: 'Savings',
    balance: 8750.65,
    type: 'bank',
    color: '#0CA678',
  },
  {
    id: '3',
    name: 'Cash',
    balance: 250.0,
    type: 'cash',
    color: '#F59F00',
  },
  {
    id: '4',
    name: 'Credit Card',
    balance: -450.80,
    type: 'credit',
    color: '#FA5252',
  },
];

// Provider component
export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Try to load from localStorage first
    const savedTransactions = localStorage.getItem('finance_transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : sampleTransactions;
  });
  
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const savedBudgets = localStorage.getItem('finance_budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : sampleBudgets;
  });
  
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const savedWallets = localStorage.getItem('finance_wallets');
    return savedWallets ? JSON.parse(savedWallets) : sampleWallets;
  });

  // Always use IDR
  const [currency] = useState('IDR');
  const [currencySymbol] = useState('Rp');

  // Format currency function - now uses our formatIDR utility
  const formatCurrency = (amount: number) => {
    return formatIDR(amount);
  };

  // We don't need to load currency from settings anymore
  // but we'll keep the effect to load other settings if needed
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Force the currency to IDR in settings if it's not already
        if (parsedSettings.currency !== 'IDR') {
          parsedSettings.currency = 'IDR';
          localStorage.setItem('settings', JSON.stringify(parsedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Listen for settings changes, but always keep currency as IDR
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'settings') {
        try {
          const newSettings = JSON.parse(e.newValue || '{}');
          // Force the currency to IDR if it's changed
          if (newSettings.currency !== 'IDR') {
            newSettings.currency = 'IDR';
            localStorage.setItem('settings', JSON.stringify(newSettings));
          }
        } catch (error) {
          console.error('Error handling storage changes:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    localStorage.setItem('finance_budgets', JSON.stringify(budgets));
    localStorage.setItem('finance_wallets', JSON.stringify(wallets));
  }, [transactions, budgets, wallets]);

  // Calculate totals
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Add new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
    };
    setTransactions([newTransaction, ...transactions]);
    
    // Update wallet balance
    setWallets(wallets.map(wallet => {
      if (wallet.id === transaction.walletId) {
        return {
          ...wallet,
          balance: transaction.type === 'income' 
            ? wallet.balance + transaction.amount 
            : wallet.balance - transaction.amount
        };
      }
      return wallet;
    }));
  };

  // Delete transaction
  const deleteTransaction = (id: string) => {
    // Find the transaction to get its details before deleting it
    const transactionToDelete = transactions.find(t => t.id === id);
    
    if (!transactionToDelete) return; // Transaction not found
    
    // Remove the transaction
    setTransactions(transactions.filter(t => t.id !== id));
    
    // Update wallet balance to revert the transaction
    setWallets(wallets.map(wallet => {
      if (wallet.id === transactionToDelete.walletId) {
        return {
          ...wallet,
          balance: transactionToDelete.type === 'income' 
            ? wallet.balance - transactionToDelete.amount // Subtract the income
            : wallet.balance + transactionToDelete.amount // Add back the expense
        };
      }
      return wallet;
    }));
  };

  // Add new transfer
  const addTransfer = (transfer: Transfer) => {
    // Create two transactions for the transfer
    const transferId = Math.random().toString(36).substring(2, 9);
    
    // 1. Outgoing transaction (from source wallet)
    const outgoingTransaction = {
      id: `transfer-out-${transferId}`,
      amount: transfer.amount + transfer.fee,
      category: 'Transfer',
      description: `Transfer to ${wallets.find(w => w.id === transfer.toWalletId)?.name} - ${transfer.description}`,
      date: transfer.date,
      type: 'expense' as const,
      walletId: transfer.fromWalletId,
    };
    
    // 2. Incoming transaction (to destination wallet)
    const incomingTransaction = {
      id: `transfer-in-${transferId}`,
      amount: transfer.amount,
      category: 'Transfer',
      description: `Transfer from ${wallets.find(w => w.id === transfer.fromWalletId)?.name} - ${transfer.description}`,
      date: transfer.date,
      type: 'income' as const,
      walletId: transfer.toWalletId,
    };
    
    // Add both transactions
    setTransactions([incomingTransaction, outgoingTransaction, ...transactions]);
    
    // Update wallet balances
    setWallets(wallets.map(wallet => {
      if (wallet.id === transfer.fromWalletId) {
        return {
          ...wallet,
          balance: wallet.balance - (transfer.amount + transfer.fee)
        };
      }
      if (wallet.id === transfer.toWalletId) {
        return {
          ...wallet,
          balance: wallet.balance + transfer.amount
        };
      }
      return wallet;
    }));
  };

  // Add new budget
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = {
      ...budget,
      id: Math.random().toString(36).substring(2, 9),
    };
    setBudgets([...budgets, newBudget]);
  };

  // Update existing budget
  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(budgets.map(budget => 
      budget.id === updatedBudget.id ? updatedBudget : budget
    ));
  };

  // Delete budget
  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  // Add new wallet
  const addWallet = (wallet: Omit<Wallet, 'id'>) => {
    const newWallet = {
      ...wallet,
      id: Math.random().toString(36).substring(2, 9),
    };
    setWallets([...wallets, newWallet]);
  };

  // Update existing wallet
  const updateWallet = (updatedWallet: Wallet) => {
    setWallets(wallets.map(wallet => 
      wallet.id === updatedWallet.id ? updatedWallet : wallet
    ));
  };

  // Delete wallet
  const deleteWallet = (id: string) => {
    // Check if there are transactions associated with this wallet
    const hasTransactions = transactions.some(t => t.walletId === id);
    
    if (hasTransactions) {
      // In a real app, you might want to show a confirmation dialog
      // For now, we'll just delete the wallet and its transactions
      setTransactions(transactions.filter(t => t.walletId !== id));
    }
    
    setWallets(wallets.filter(wallet => wallet.id !== id));
  };

  // Update function now only exists for compatibility but doesn't change the currency
  const updateCurrency = () => {
    // Currency is always IDR, no need to update
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        wallets,
        currency,
        currencySymbol,
        updateCurrency,
        addTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addWallet,
        updateWallet,
        deleteWallet,
        addTransfer,
        totalBalance,
        monthlyIncome,
        monthlyExpense,
        formatCurrency
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to use the finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
