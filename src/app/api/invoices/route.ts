import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { mapDbInvoiceToClient } from '@/lib/map-db-invoice';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const customerNo = req.nextUrl.searchParams.get('customerNo') ?? 'CUST-10234';

  try {
    // const customer = await prisma.customer.findUnique({
    //   where: { customerNo },
    //   include: {
    //     invoices: {
    //       orderBy: { invoiceDate: 'desc' },
    //     },
    //   },
    // });

    // if (!customer) {
    //   return NextResponse.json({ invoices: [] });
    // }

    // const invoices = customer.invoices.map(mapDbInvoiceToClient);
    const invoices =  [
      { id: 'INV-10042', date: 'Jan 15, 2026', dueDate: 'Feb 15, 2026', dueDateColor: '#FF6961', overdueNote: '11 days overdue', amount: '$12,500.00', balance: '$12,500.00', balanceColor: '#FF6961', status: 'overdue' },
      { id: 'INV-10039', date: 'Jan 28, 2026', dueDate: 'Mar 30, 2026', amount: '$18,750.00', balance: '$18,750.00', status: 'open' },
      { id: 'INV-10036', date: 'Jan 12, 2026', dueDate: 'Feb 11, 2026', amount: '$9,200.00', balance: '$0.00', balanceColor: '#30D158', status: 'paid' },
      { id: 'INV-10033', date: 'Jan 5, 2026',  dueDate: 'Apr 5, 2026',  amount: '$22,400.00', balance: '$22,400.00', status: 'open' },
      { id: 'INV-10029', date: 'Dec 20, 2025', dueDate: 'Jan 19, 2026', dueDateColor: '#FF6961', overdueNote: '28 days overdue', amount: '$8,200.00', balance: '$8,200.00', balanceColor: '#FF6961', status: 'overdue' },
      { id: 'INV-10024', date: 'Dec 10, 2025', dueDate: 'Jan 9, 2026',  amount: '$15,600.00', balance: '$7,800.00', status: 'partial' },
    ];
    return NextResponse.json({ invoices });
  } catch (e) {
    console.error('[api/invoices]', e);
    return NextResponse.json({ error: 'Failed to load invoices' }, { status: 500 });
  }
}
