'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AgilysysLogo from '@/components/AgilysysLogo';

type Step = 'customer-number' | 'otp' | 'success';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('customer-number');
  const [customerNum, setCustomerNum] = useState('CUST-10234');
  const [otp, setOtp] = useState<string[]>(['4', '8', '2', '9', '1', '5']);
  const [toastVisible, setToastVisible] = useState(false);

  function showToast() {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }

  function handleContinue() {
    setStep('otp');
    showToast();
  }

  function handleVerify() {
    setStep('success');
  }

  function handleSuccess(){
    setStep('success');
    setTimeout(() => router.push('/dashboard'), 1000);
  }

  function handleOtpChange(index: number, value: string) {
    const cleaned = value.replace(/\D/, '').slice(-1);
    const updated = [...otp];
    updated[index] = cleaned;
    setOtp(updated);
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--dark-1)' }}
    >
      {/* Background effects */}
      <div className="bg-glow-green" style={{ width: 500, height: 500, top: -150, left: -150, opacity: 0.5 }} />
      <div className="bg-glow-blue"  style={{ width: 400, height: 400, bottom: -100, right: -100, opacity: 0.4 }} />
      <div className="bg-mesh" />

      {/* Logo watermark top-left */}
      <div className="absolute top-5 left-7 z-10 pointer-events-none">
        <AgilysysLogo size="sm" />
      </div>

      {/* Main content */}
      <div
        className="relative z-10 grid gap-14 w-full items-center px-6"
        style={{
          gridTemplateColumns: '1fr 1fr',
          maxWidth: 1040,
          gap: 56,
        }}
      >
        {/* LEFT — description panel */}
        <div className="au d1">
          <div className="chip mb-5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ag-green)', boxShadow: '0 0 6px var(--ag-green-glow)' }} />
            Live Portal Demo
          </div>

          <h2
            className="font-black mb-4"
            style={{ fontSize: 44, letterSpacing: '-2px', lineHeight: 1.05 }}
          >
            Customer Login<br />
            <span className="grad-text">Experience</span>
          </h2>

          <p className="mb-7" style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.7 }}>
            Customers visit{' '}
            <strong style={{ color: '#5CB85C' }}>ar.agilysys.com</strong>, enter their
            Customer Number, receive a one-time code by email, and are instantly inside
            their account.
          </p>

          <div className="flex flex-col gap-3">
            {[
              { n: 1, text: 'Enter Customer Number (e.g. CUST-10234)' },
              { n: 2, text: '6-digit OTP will be sent to your registered email ID with Agilysys' },
              { n: 3, text: 'Instant access to dashboard — no password stored' },
            ].map(({ n, text }) => (
              <div
                key={n}
                className="flex items-center gap-4"
                style={{
                  background: 'var(--glass)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 14,
                  padding: '14px 18px',
                }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center font-bold text-sm"
                  style={{
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: 'var(--grad)',
                  }}
                >
                  {n}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Login card */}
        <div
          className="au d2"
          style={{
            background: 'rgba(28,28,30,0.95)',
            border: '1px solid var(--glass-border)',
            borderRadius: 28,
            padding: 36,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Brand row */}
          <div
            className="flex items-center gap-3 mb-7 pb-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <AgilysysLogo size="md" />
          </div>

          {/* ── STEP 1: Customer Number ── */}
          {step === 'customer-number' && (
            <div>
              <div className="font-extrabold mb-1" style={{ fontSize: 20, letterSpacing: '-0.5px' }}>
                Welcome back
              </div>
              <div className="mb-6" style={{ fontSize: 13, color: 'var(--text-3)' }}>
                Enter your Customer Number to access your account
              </div>

              <div className="mb-4">
                <div
                  className="mb-2"
                  style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)' }}
                >
                  Customer Number
                </div>
                <input
                  type="text"
                  value={customerNum}
                  onChange={(e) => setCustomerNum(e.target.value)}
                  className="w-full mono font-semibold"
                  style={{
                    padding: '13px 16px',
                    border: '1.5px solid rgba(61,165,61,0.5)',
                    borderRadius: 10,
                    fontSize: 15,
                    color: 'white',
                    background: 'rgba(61,165,61,0.08)',
                    boxShadow: '0 0 0 3px rgba(61,165,61,0.12)',
                    outline: 'none',
                  }}
                  placeholder="e.g. CUST-10234"
                />
              </div>

              <button onClick={handleContinue} className="btn-grad">
                Continue →
              </button>

              <div
                className="mt-3 flex items-center gap-2"
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 10,
                }}
              >
                <span>🔒</span>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  Secured with email OTP · No password required
                </span>
              </div>
            </div>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === 'otp' && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 5 }}>
              Check your email
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>
              6-digit code sent to
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 22 }}>
              a***@agilysys.com
            </div>
        
            {/* ✅ FIX: use fixed width per box + justify-between instead of flex:1 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',   // ← spreads 6 boxes evenly
                gap: 8,
                marginBottom: 20,
              }}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="mono"
                  style={{
                    width: 44,          // ✅ FIX: fixed width, not flex:1
                    flexShrink: 0,
                    textAlign: 'center',
                    padding: '13px 0',
                    border: i === 0
                      ? '1.5px solid rgba(61,165,61,0.5)'
                      : '1.5px solid rgba(255,255,255,0.1)',
                    borderRadius: 9,
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'white',
                    background: i === 0
                      ? 'rgba(61,165,61,0.08)'
                      : 'rgba(255,255,255,0.04)',
                    boxShadow: i === 0 ? '0 0 0 3px rgba(61,165,61,0.1)' : 'none',
                    outline: 'none',
                  }}
                />
              ))}
            </div>
        
            <button onClick={() => setStep('success')} className="btn-grad">
              Verify &amp; Sign In ✓
            </button>
        
            <div
              style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--text-3)', cursor: 'pointer' }}
              onClick={handleSuccess}
            >
              ← Different customer number
            </div>
          </div>
        )}

          {/* ── STEP 3: Success ── */}
          {step === 'success' && (
            <div className="text-center">
              <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
              <div className="font-extrabold mb-2" style={{ fontSize: 20, letterSpacing: '-0.5px' }}>
                Signed in!
              </div>
              <div className="mb-5" style={{ fontSize: 13, color: 'var(--text-3)' }}>
                Welcome, ABC Manufacturing Corp
              </div>
              <div
                className="mb-4 font-semibold"
                style={{
                  padding: '11px 16px',
                  background: 'rgba(48,209,88,0.12)',
                  border: '1px solid rgba(48,209,88,0.25)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: '#30D158',
                }}
              >
                ✓ Redirecting to dashboard...
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-grad"
              >
                → View Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        <span>📧</span>
        <span>Verification code sent to your email</span>
      </div>
    </div>
  );
}
