import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { mapDbPaymentToClient } from '@/lib/map-db-payment';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const customerNo = req.nextUrl.searchParams.get('customerNo') ?? 'CUST-10234';

  try {
    // const customer = await prisma.customer.findUnique({
    //   where: { customerNo },
    //   include: {
    //     payments: {
    //       orderBy: { paidAt: 'desc' },
    //       include: {
    //         invoice: { select: { invoiceNo: true } },
    //       },
    //     },
    //   },
    // });

    // if (!customer) {
    //   return NextResponse.json({ payments: [] });
    // }

    // const payments = customer.payments.map(mapDbPaymentToClient);
    const payments = [
      { id: 'PAY-3041', date: 'Jan 15, 2026', inv: 'INV-10042', method: 'ACH', amt: '$12,500.00', status: 'cleared' },
      { id: 'PAY-3040', date: 'Jan 28, 2026', inv: 'INV-10039', method: 'Credit Card', amt: '$18,750.00', status: 'pending' },
      { id: 'PAY-3039', date: 'Jan 12, 2026', inv: 'INV-10036', method: 'Check', amt: '$9,200.00', status: 'failed' },
      { id: 'PAY-3038', date: 'Jan 5, 2026', inv: 'INV-10033', method: 'Wire', amt: '$22,400.00', status: 'cleared' },
      { id: 'PAY-3037', date: 'Dec 20, 2025', inv: 'INV-10029', method: 'ACH', amt: '$8,200.00', status: 'cleared' },
      { id: 'PAY-3036', date: 'Dec 10, 2025', inv: 'INV-10024', method: 'Credit Card', amt: '$15,600.00', status: 'cleared' },
    ];
    return NextResponse.json({ payments });
  } catch (e) {
    console.error('[api/payments]', e);
    return NextResponse.json({ error: 'Failed to load payments' }, { status: 500 });
  }
}
