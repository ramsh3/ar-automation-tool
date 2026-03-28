import type { Payment as PrismaPayment, PaymentMethod, PaymentStatus } from '@prisma/client';
import type { Payment } from '@/types/payment';

function money(n: { toString(): string }) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n));
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function methodLabel(m: PaymentMethod): string {
  switch (m) {
    case 'ACH':
      return 'ACH Transfer';
    case 'CREDIT_CARD':
      return 'Credit Card';
    case 'CHECK':
      return 'Check';
    case 'WIRE':
      return 'Wire';
    default:
      return m;
  }
}

function statusLabel(s: PaymentStatus): string {
  switch (s) {
    case 'CLEARED':
      return 'Cleared';
    case 'PENDING':
      return 'Pending';
    case 'FAILED':
      return 'Failed';
    default:
      return s;
  }
}

function statusBadge(s: PaymentStatus): Payment['statusBadge'] {
  switch (s) {
    case 'CLEARED':
      return 'paid';
    case 'PENDING':
      return 'open';
    case 'FAILED':
      return 'overdue';
    default:
      return 'open';
  }
}

type PaymentWithInvoice = PrismaPayment & { invoice: { invoiceNo: string } };

export function mapDbPaymentToClient(p: PaymentWithInvoice): Payment {
  return {
    id: p.paymentNo,
    date: fmtDate(new Date(p.paidAt)),
    inv: p.invoice.invoiceNo,
    method: methodLabel(p.method),
    amt: money(p.amount),
    status: statusLabel(p.status),
    statusBadge: statusBadge(p.status),
  };
}
