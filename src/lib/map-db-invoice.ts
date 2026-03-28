import type { Invoice as PrismaInvoice, InvoiceStatus } from '@prisma/client';
import type { Invoice } from '@/types/invoice';

function money(n: { toString(): string }) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n));
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusToUi(s: InvoiceStatus): Invoice['status'] {
  switch (s) {
    case 'OVERDUE':
      return 'overdue';
    case 'OPEN':
      return 'open';
    case 'PAID':
      return 'paid';
    case 'PARTIAL':
      return 'partial';
    default:
      return 'open';
  }
}

export function mapDbInvoiceToClient(inv: PrismaInvoice): Invoice {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(inv.dueDate);
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const balanceNum = Number(inv.balanceDue);
  const isPastDue = dueDay < startOfToday && balanceNum > 0 && inv.status !== 'PAID';
  const daysOverdue = isPastDue
    ? Math.max(0, Math.floor((startOfToday.getTime() - dueDay.getTime()) / 86_400_000))
    : 0;

  let overdueNote: string | undefined;
  let dueDateColor: string | undefined;
  if (inv.status === 'OVERDUE' || isPastDue) {
    dueDateColor = '#FF6961';
    overdueNote = `${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue`;
  }

  let balanceColor: string | undefined;
  if (inv.status === 'PAID' || balanceNum === 0) balanceColor = '#30D158';
  else if (inv.status === 'OVERDUE' || isPastDue) balanceColor = '#FF6961';

  return {
    id: inv.invoiceNo,
    date: fmtDate(new Date(inv.invoiceDate)),
    dueDate: fmtDate(due),
    dueDateColor,
    overdueNote,
    amount: money(inv.totalAmount),
    balance: money(inv.balanceDue),
    balanceColor,
    status: statusToUi(inv.status),
  };
}
