export interface Payment {
  id: string;
  date: string;
  inv: string;
  method: string;
  amt: string;
  status: string;
  /** Suffix for `bdg ${statusBadge}` in globals.css */
  statusBadge: 'paid' | 'open' | 'overdue' | 'partial';
}
