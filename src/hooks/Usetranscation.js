import { useFinanceStore } from '../store/useFinanceStore';

export const useTransactions = () => {
  const transactions = useFinanceStore((state) => state.transactions);

  const getExpensesTotal = () => 
    transactions
      .filter(t => t.type === 'debit')
      .reduce((acc, curr) => acc + curr.amount, 0);

  const getIncomeTotal = () => 
    transactions
      .filter(t => t.type === 'credit')
      .reduce((acc, curr) => acc + curr.amount, 0);

  return { transactions, getExpensesTotal, getIncomeTotal };
};