export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  dueDateColor?: string;
  overdueNote?: string;
  amount: string;
  balance: string;
  balanceColor?: string;
  status: 'overdue' | 'open' | 'paid' | 'partial';
}
