'use client';

import { useState, useEffect, useCallback } from 'react';
import AgilysysLogo from '@/components/AgilysysLogo';
import type { Invoice } from '@/types/invoice';
import type { Payment } from '@/types/payment';

type Tab = 'overview' | 'invoices' | 'payments' | 'new-ticket';

const PORTAL_CUSTOMER_NO = 'CUST-10234';

function recentInvoiceSubline(inv: Invoice) {
  if (inv.status === 'paid') return `Paid ${inv.dueDate}`;
  if (inv.overdueNote) return `Due ${inv.dueDate} · ${inv.overdueNote}`;
  return `Due ${inv.dueDate}`;
}

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [invModalOpen, setInvModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [caseId, setCaseId] = useState(47);
  const [toastMsg, setToastMsg] = useState('');
  const [toastIcon, setToastIcon] = useState('✓');
  const [toastVisible, setToastVisible] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  const loadInvoices = useCallback(async () => {
    setInvoicesLoading(true);
    setInvoicesError(null);
    try {
      const res = await fetch(
        `/api/invoices?customerNo=${encodeURIComponent(PORTAL_CUSTOMER_NO)}`,
        { cache: 'no-store' },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === 'string' ? body.error : res.statusText);
      }
      const data = (await res.json()) as { invoices: Invoice[] };
      setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
    } catch (e) {
      setInvoicesError(e instanceof Error ? e.message : 'Failed to load invoices');
      setInvoices([]);
    } finally {
      setInvoicesLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    setPaymentsLoading(true);
    setPaymentsError(null);
    try {
      const res = await fetch(
        `/api/payments?customerNo=${encodeURIComponent(PORTAL_CUSTOMER_NO)}`,
        { cache: 'no-store' },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === 'string' ? body.error : res.statusText);
      }
      const data = (await res.json()) as { payments: Payment[] };
      setPayments(Array.isArray(data.payments) ? data.payments : []);
    } catch (e) {
      setPaymentsError(e instanceof Error ? e.message : 'Failed to load payments');
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInvoices();
    void loadPayments();
  }, [loadInvoices, loadPayments]);

  let toastTimer: ReturnType<typeof setTimeout>;
  function showToast(icon: string, msg: string) {
    setToastIcon(icon);
    setToastMsg(msg);
    setToastVisible(true);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToastVisible(false), 3000);
  }

  function handleDownload(inv: string) {
    showToast('⬇', `Downloading ${inv}.pdf…`);
    setTimeout(() => showToast('✅', `${inv}.pdf downloaded!`), 2000);
  }

  function handleSubmitTicket() {
    const newId = caseId + 1;
    setCaseId(newId);
    setTicketModalOpen(true);
    setTicketSubject('');
    setTicketDesc('');
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'cleared':
        return 'paid';
      case 'pending':
        return 'open';
      case 'failed':
        return 'overdue';      
      default:
        return 'open';
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview',   label: 'Overview'   },
    { key: 'invoices',   label: 'Invoices'   },
    { key: 'payments',   label: 'Payments'   },
    { key: 'new-ticket', label: 'New Ticket' },
  ];

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', background: 'var(--dark-1)' }}>

      {/* ── Portal bar ─────────────────────────────── */}
      <div
        className="flex items-center px-6 flex-shrink-0"
        style={{
          height: 54,
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="mr-7">
          <AgilysysLogo size="sm" />
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-0.5 flex-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="transition-all duration-150"
              style={{
                padding: '7px 14px',
                border: 'none',
                background: tab === key ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: tab === key ? 'white' : 'rgba(255,255,255,0.5)',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: 8,
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Customer badge */}
        <div
          className="mono font-bold"
          style={{
            background: 'rgba(61,165,61,0.15)',
            border: '1px solid rgba(61,165,61,0.3)',
            borderRadius: 100,
            padding: '4px 12px',
            color: '#5CB85C',
            fontSize: 11,
          }}
        >
          {PORTAL_CUSTOMER_NO}
        </div>
      </div>

      {/* ── Portal content ───────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '22px 28px', background: 'var(--dark-1)' }}>

        {/* ═══ OVERVIEW TAB ═══ */}
        {tab === 'overview' && (
          <div>
            <div className="mb-5">
              <div className="font-black text-white" style={{ fontSize: 20, letterSpacing: '-0.5px' }}>
                Overview
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>
                ABC Manufacturing Corp · {PORTAL_CUSTOMER_NO}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
              {[
                { lbl: 'Total Outstanding', val: '$76,520', sub: '7 open invoices',   accent: 'var(--ag-blue)',  glow: 'rgba(30,111,204,0.15)' },
                { lbl: 'Due This Month',    val: '$31,450', sub: '3 invoices due soon', accent: 'var(--warning)', glow: 'rgba(255,214,10,0.15)'  },
                { lbl: 'Past Due',          val: '$22,870', sub: '2 overdue invoices',  accent: 'var(--danger)',  glow: 'rgba(255,69,58,0.15)'   },
                { lbl: '90+ Days',          val: '$8,200',  sub: 'Needs attention',     accent: '#FF6961',        glow: 'rgba(255,105,97,0.12)'  },
              ].map(({ lbl, val, sub, accent, glow }) => (
                <div
                  key={lbl}
                  className="relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0"
                    style={{ height: 2, background: accent }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, marginBottom: 6 }}>
                    {lbl}
                  </div>
                  <div
                    className="mono font-black"
                    style={{ fontSize: 26, letterSpacing: '-1px', color: accent }}
                  >
                    {val}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Cards row */}
            <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>

              {/* Aging Summary */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '20px 22px',
                }}
              >
                <div className="font-bold mb-5" style={{ fontSize: 13, color: 'white' }}>
                  📊 Aging Summary
                </div>
                {[
                  { lbl: 'Current',    pct: 75, color: 'linear-gradient(90deg,#3DA53D,#5CB85C)', val: '$30,000', txtColor: '#3DA53D' },
                  { lbl: '1–30 Days',  pct: 55, color: 'linear-gradient(90deg,#FFD60A,#FF9F0A)', val: '$23,250', txtColor: '#FF9F0A' },
                  { lbl: '31–60 Days', pct: 35, color: 'linear-gradient(90deg,#FF9F0A,#FF6B35)', val: '$14,670', txtColor: '#FF6B35' },
                  { lbl: '61–90 Days', pct: 20, color: 'linear-gradient(90deg,#FF453A,#FF6961)', val: '$8,200',  txtColor: '#FF453A' },
                ].map(({ lbl, pct, color, val, txtColor }) => (
                  <div key={lbl} className="flex items-center gap-3 mb-3">
                    <div style={{ width: 72, fontSize: 11, color: 'var(--text-3)', fontWeight: 500, flexShrink: 0 }}>
                      {lbl}
                    </div>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,0.08)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999 }} />
                    </div>
                    <div className="mono font-bold text-right" style={{ fontSize: 12, color: txtColor, minWidth: 60 }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Invoices */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '20px 22px',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold" style={{ fontSize: 13, color: 'white' }}>📄 Recent Invoices</div>
                  <span
                    className="cursor-pointer font-bold"
                    style={{ fontSize: 11, color: '#5CB85C' }}
                    onClick={() => setTab('invoices')}
                  >
                    View all →
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {invoicesLoading && (
                    <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '8px 0' }}>Loading invoices…</div>
                  )}
                  {invoicesError && !invoicesLoading && (
                    <div style={{ fontSize: 13, color: '#FF6961', padding: '8px 0' }}>{invoicesError}</div>
                  )}
                  {!invoicesLoading && !invoicesError && invoices.length === 0 && (
                    <div style={{ fontSize: 13, color: 'var(--text-3)', padding: '8px 0' }}>No invoices for this account.</div>
                  )}
                  {!invoicesLoading &&
                    invoices.slice(0, 4).map((inv) => (
                    <div
                      key={inv.id}
                      className="grid items-center cursor-pointer rounded-xl transition-all duration-150 hover:opacity-80"
                      style={{
                        gridTemplateColumns: '1fr auto auto auto',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                      onClick={() => inv.status !== 'paid' && setInvModalOpen(true)}
                    >
                      <div>
                        <div className="mono font-semibold" style={{ fontSize: 13, color: 'white' }}>{inv.id}</div>
                        <div style={{ fontSize: 11, color: inv.overdueNote ? '#FF6961' : 'var(--text-3)' }}>
                          {recentInvoiceSubline(inv)}
                        </div>
                      </div>
                      <span className={`bdg ${inv.status}`}>{inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span>
                      <div className="mono font-bold" style={{ fontSize: 13, color: inv.balanceColor || 'white' }}>
                        {inv.amount}
                      </div>
                      {inv.status !== 'paid' && (
                        <a
                          href="https://www.agilysys.com/en/paymentcenter/"
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 font-bold"
                          style={{
                            padding: '5px 10px',
                            background: 'var(--grad)',
                            borderRadius: 100,
                            fontSize: 11,
                            color: 'white',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          💳 Pay Now
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ INVOICES TAB ═══ */}
        {tab === 'invoices' && (
          <div>
            <div className="mb-5">
              <div className="font-black text-white" style={{ fontSize: 20, letterSpacing: '-0.5px' }}>Invoices</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>All invoices synced live from NetSuite</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Invoice #', 'Date', 'Due Date', 'Amount', 'Balance Due', 'Status', 'Actions', 'Payment'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '10px 16px',
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.6px',
                          color: 'var(--text-3)',
                          textAlign: 'left',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoicesLoading && (
                    <tr>
                      <td colSpan={8} style={{ padding: '20px 16px', fontSize: 13, color: 'var(--text-3)' }}>
                        Loading invoices…
                      </td>
                    </tr>
                  )}
                  {invoicesError && !invoicesLoading && (
                    <tr>
                      <td colSpan={8} style={{ padding: '20px 16px', fontSize: 13, color: '#FF6961' }}>
                        {invoicesError}
                      </td>
                    </tr>
                  )}
                  {!invoicesLoading && !invoicesError && invoices.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '20px 16px', fontSize: 13, color: 'var(--text-3)' }}>
                        No invoices for this account.
                      </td>
                    </tr>
                  )}
                  {!invoicesLoading && !invoicesError && invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="cursor-pointer"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' }}
                      onClick={() => inv.status !== 'paid' && setInvModalOpen(true)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <span className="mono font-semibold" style={{ fontSize: 13, color: 'white' }}>{inv.id}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{inv.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: inv.dueDateColor || 'var(--text-2)', fontWeight: inv.dueDateColor ? 600 : 400 }}>
                        {inv.dueDate}
                        {inv.overdueNote && <span style={{ display: 'block', fontSize: 10, color: '#FF6961' }}>{inv.overdueNote}</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="mono" style={{ fontSize: 13, color: 'var(--text-2)' }}>{inv.amount}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="mono font-semibold" style={{ fontSize: 13, color: inv.balanceColor || 'var(--text-2)' }}>{inv.balance}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`bdg ${inv.status}`}>{inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(inv.id)}
                            className="font-semibold"
                            style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, fontSize: 11, color: 'var(--text-2)', cursor: 'pointer' }}
                          >
                            ⬇ PDF
                          </button>
                          <button
                            onClick={() => setTab('new-ticket')}
                            style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, fontSize: 11, color: 'var(--text-2)', cursor: 'pointer' }}
                          >
                            🎫
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }} onClick={(e) => e.stopPropagation()}>
                        {inv.status !== 'paid' && (
                          <a
                            href="https://www.agilysys.com/en/paymentcenter/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 font-bold"
                            style={{ padding: '5px 12px', background: 'var(--grad)', borderRadius: 100, fontSize: 11, color: 'white', textDecoration: 'none', display: 'inline-flex', whiteSpace: 'nowrap' }}
                          >
                            💳 Pay Now
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ PAYMENTS TAB ═══ */}
        {tab === 'payments' && (
          <div>
            <div className="mb-5">
              <div className="font-black text-white" style={{ fontSize: 20, letterSpacing: '-0.5px' }}>Payments</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>Payment history and receipts</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Payment #', 'Date', 'Invoice', 'Method', 'Amount', 'Status'].map((h) => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-3)', textAlign: 'left' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentsLoading && (
                    <tr>
                      <td colSpan={6} style={{ padding: '20px 16px', fontSize: 13, color: 'var(--text-3)' }}>
                        Loading payments…
                      </td>
                    </tr>
                  )}
                  {paymentsError && !paymentsLoading && (
                    <tr>
                      <td colSpan={6} style={{ padding: '20px 16px', fontSize: 13, color: '#FF6961' }}>
                        {paymentsError}
                      </td>
                    </tr>
                  )}
                  {!paymentsLoading && !paymentsError && payments.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '20px 16px', fontSize: 13, color: 'var(--text-3)' }}>
                        No payments for this account.
                      </td>
                    </tr>
                  )}
                  {!paymentsLoading &&
                    !paymentsError &&
                    payments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 16px' }}><span className="mono font-semibold" style={{ fontSize: 13, color: 'white' }}>{p.id}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{p.date}</td>
                      <td style={{ padding: '12px 16px' }}><span className="mono" style={{ fontSize: 13, color: 'var(--text-2)' }}>{p.inv}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-2)' }}>{p.method}</td>
                      <td style={{ padding: '12px 16px' }}><span className="mono font-bold" style={{ fontSize: 13, color: '#30D158' }}>{p.amt}</span></td>
                      <td style={{ padding: '12px 16px' }}><span className={`bdg ${getStatusBadge(p.status)}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ NEW TICKET TAB ═══ */}
        {tab === 'new-ticket' && (
          <div style={{ maxWidth: 640 }}>
            <div className="mb-6">
              <div className="font-black text-white" style={{ fontSize: 20, letterSpacing: '-0.5px' }}>New Support Ticket</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3 }}>Submit a dispute, inquiry, or request to the AR team</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px 28px' }}>
              <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {/* Ticket Type */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>
                    Ticket Type
                  </label>
                  <select style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, fontSize: 13, color: 'white', outline: 'none', fontFamily: 'Inter, sans-serif' }}>
                    <option>Invoice Dispute</option>
                    <option>Payment Issue</option>
                    <option>General Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Invoice Reference */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>
                    Invoice Reference
                  </label>
                  <select style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, fontSize: 13, color: 'white', outline: 'none', fontFamily: 'Inter, sans-serif' }}>
                    {invoices.filter((i) => i.status !== 'paid').length === 0 ? (
                      <option value="">No open invoices</option>
                    ) : (
                      invoices
                        .filter((i) => i.status !== 'paid')
                        .map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.id} — {inv.amount}
                          </option>
                        ))
                    )}
                  </select>
                </div>

                {/* Subject - full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Price discrepancy on INV-10042"
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, fontSize: 13, color: 'white', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>
                    Priority
                  </label>
                  <select style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, fontSize: 13, color: 'white', outline: 'none', fontFamily: 'Inter, sans-serif' }}>
                    <option>Normal</option>
                    <option>Urgent</option>
                  </select>
                </div>

                {/* Attachment */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>
                    Attachment (optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    style={{ width: '100%', padding: '8px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, fontSize: 13, color: 'var(--text-2)', cursor: 'pointer', outline: 'none' }}
                  />
                </div>

                {/* Description - full width */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', display: 'block', marginBottom: 7 }}>
                    Description
                  </label>
                  <textarea
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    rows={4}
                    placeholder="Please describe your inquiry in detail..."
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, fontSize: 13, color: 'white', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setTab('overview')}
                  style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, fontSize: 14, color: 'var(--text-2)', fontFamily: 'Inter, sans-serif', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTicket}
                  style={{ padding: '12px 28px', background: 'var(--grad)', border: 'none', borderRadius: 100, fontSize: 14, color: 'white', fontFamily: 'Inter, sans-serif', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(61,165,61,0.3)' }}
                >
                  Submit Ticket →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Invoice Modal ──────────────────────── */}
      {invModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
          onClick={() => setInvModalOpen(false)}
        >
          <div
            style={{ background: '#1C1C1E', border: '1px solid var(--glass-border)', borderRadius: 28, maxWidth: 660, width: '90%', overflow: 'hidden', animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)', maxHeight: '88vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between" style={{ background: 'var(--grad)', padding: '28px 32px' }}>
              <div>
                <div className="font-extrabold text-white" style={{ fontSize: 20 }}>Invoice Detail</div>
                <div className="mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>INV-10042 · ABC Manufacturing Corp</div>
              </div>
              <button
                onClick={() => setInvModalOpen(false)}
                className="flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '28px 32px' }}>
              <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {[
                  { lbl: 'Bill To',       val: 'ABC Manufacturing Corp',  color: undefined },
                  { lbl: 'Customer #',    val: 'CUST-10234',              mono: true },
                  { lbl: 'Invoice Date',  val: 'January 15, 2026',        color: undefined },
                  { lbl: 'Due Date',      val: 'February 15, 2026',       color: '#FF453A' },
                  { lbl: 'Terms',         val: 'Net 30',                  color: undefined },
                ].map(({ lbl, val, color, mono }: any) => (
                  <div key={lbl}>
                    <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>{lbl}</label>
                    <span className={mono ? 'mono' : ''} style={{ fontSize: 14, fontWeight: 600, color: color || 'white' }}>{val}</span>
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Status</label>
                  <span className="bdg overdue">Overdue</span>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Description', 'Qty', 'Rate', 'Total'].map((h, i) => (
                      <th key={h} style={{ padding: '9px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-3)', textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { desc: 'Professional Services — January 2026', qty: '40 hrs', rate: '$225.00',   total: '$9,000.00' },
                    { desc: 'Project Management Fee',               qty: '1',      rate: '$2,500.00', total: '$2,500.00' },
                    { desc: 'Travel & Expenses',                    qty: '1',      rate: '$750.00',   total: '$750.00'   },
                    { desc: 'Software License Fee Q1',              qty: '1',      rate: '$250.00',   total: '$250.00'   },
                  ].map(({ desc, qty, rate, total }) => (
                    <tr key={desc} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '11px 12px', fontSize: 13, color: 'var(--text-2)' }}>{desc}</td>
                      <td className="mono" style={{ padding: '11px 12px', fontSize: 13, color: 'var(--text-2)', textAlign: 'center' }}>{qty}</td>
                      <td className="mono" style={{ padding: '11px 12px', fontSize: 13, color: 'var(--text-2)', textAlign: 'right' }}>{rate}</td>
                      <td className="mono font-bold" style={{ padding: '11px 12px', fontSize: 13, color: 'white', textAlign: 'right' }}>{total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-5">
                <div className="text-right">
                  <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount Due</div>
                  <div className="mono font-black grad-text" style={{ fontSize: 32, letterSpacing: '-1px' }}>$12,500.00</div>
                </div>
              </div>

              <div className="grid gap-3 mt-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <button
                  onClick={() => { setInvModalOpen(false); handleDownload('INV-10042'); }}
                  style={{ padding: 14, background: 'var(--grad)', color: 'white', border: 'none', borderRadius: 100, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  ⬇ Download PDF
                </button>
                <a
                  href="https://www.agilysys.com/en/paymentcenter/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: 'var(--grad)', color: 'white', borderRadius: 100, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(61,165,61,0.3)' }}
                >
                  💳 Pay Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Ticket Success Modal ──────────────── */}
      {ticketModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
          onClick={() => setTicketModalOpen(false)}
        >
          <div
            className="text-center"
            style={{ background: '#1C1C1E', border: '1px solid var(--glass-border)', borderRadius: 28, padding: 44, maxWidth: 440, width: '90%', animation: 'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <div className="font-extrabold" style={{ fontSize: 22, marginBottom: 8, letterSpacing: '-0.5px' }}>Ticket Submitted!</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 18 }}>Your support request has been received by the Agilysys AR team.</div>
            <div className="mono font-bold inline-block" style={{ background: 'var(--dark-3)', color: 'var(--ag-green)', fontSize: 20, letterSpacing: 3, padding: '14px 28px', borderRadius: 12, marginBottom: 14, border: '1px solid rgba(61,165,61,0.25)' }}>
              AR-2026-00{String(caseId).padStart(3, '0')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 24 }}>
              Confirmation email sent to address on file. Our team responds within 1–2 business days.
            </div>
            <button
              onClick={() => { setTicketModalOpen(false); setTab('overview'); }}
              style={{ width: '100%', padding: 14, background: 'var(--grad)', color: 'white', border: 'none', borderRadius: 100, fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              View My Tickets
            </button>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────── */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        <span>{toastIcon}</span>
        <span>{toastMsg}</span>
      </div>
    </div>
  );
}
