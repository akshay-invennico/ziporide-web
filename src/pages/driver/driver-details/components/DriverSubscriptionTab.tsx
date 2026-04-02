import { useState } from 'react';
import { useParams } from 'react-router-dom';

import DataTable, { type Column } from '@/components/ui/DataTable';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useDriverSubscriptions } from '@/hooks/useDriver';

const ITEMS_PER_PAGE = 12;

interface BillingHistoryRow {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  currency: string;
  createdAt: string;
  status: string;
  pdfUrl?: string;
  invoiceUrl?: string;
}

export default function DriverSubscriptionTab() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useDriverSubscriptions(id);
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-10 text-center">{error}</div>;
  }

  const billingHistory = data?.billingHistory || [];
  const currentSubscription = data?.currentSubscription;
  const paymentMethod = data?.paymentMethod;

  const totalPages = Math.ceil(billingHistory.length / ITEMS_PER_PAGE);

  const currentData = billingHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ✅ Updated formatDate (YYYY-MM-DD)
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';

    const d = new Date(dateStr);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const columns: Column<BillingHistoryRow>[] = [
    {
      key: 'invoiceNumber',
      label: 'TRANSACTION ID',
      sortable: true,
      render: (row) => (
        <span className="text-[14px] font-medium text-[#1DAFA1] hover:underline cursor-pointer">
          {row.invoiceNumber}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Plan',
      sortable: false,
      render: (row) => (
        <span className="text-[14px] font-medium text-[#4E616A]">{row.description}</span>
      ),
    },
    {
      key: 'amount',
      label: 'AMOUNT',
      type: 'number',
      sortable: true,
      render: (row) => (
        <span className="text-[14px] font-medium text-[#4E616A]">
          {row.currency === 'GBP' ? '£' : '$'}
          {row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'DATE',
      type: 'date',
      sortable: true,
      render: (row) => (
        <span className="text-[14px] font-medium text-[#4E616A] text-nowrap">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      key: 'method',
      label: 'METHOD',
      sortable: false,
      render: () => (
        <div className="flex items-center gap-2 text-nowrap">
          <img
            src={`/icons/driver/${paymentMethod?.brand?.toLowerCase() === 'visa' ? 'visa' : 'card'}.svg`}
            alt="card"
            onError={(e) => (e.currentTarget.src = '/icons/driver/card.svg')}
          />
          <span className="text-[14px] font-medium text-[#4E616A] uppercase">
            {paymentMethod?.brand || 'Card'} •••• {paymentMethod?.last4 || '****'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${row.status.toLowerCase() === 'paid' ? 'bg-[#00A63E]' : 'bg-[#FF0707]'}`}
          />
          <span
            className={`text-[12px] font-semibold capitalize ${row.status.toLowerCase() === 'paid' ? 'text-[#00A63E]' : 'text-[#FF0707]'}`}
          >
            {row.status}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'ACTION',
      sortable: false,
      render: (row) => (
        <a
          href={row.pdfUrl || row.invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer inline-block"
          title="Download Receipt"
        >
          <img src="/icons/driver/Download.svg" alt="download" className="w-[22px] h-[22px]" />
        </a>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Current Plan */}
      <div className="border border-[#DFE6E5] rounded-lg p-5 mb-5">
        <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Current Plan</h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          {/* Plan Card */}
          <div
            style={{
              width: '353px',
              minHeight: '152px',
              borderRadius: '12px',
              padding: '18px 20px',

              background:
                'linear-gradient(to bottom, #1DAFA1 0%, #29b89a 35%, #d4880a 100%, #FD8800 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '18px',
            }}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    background: 'white',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#2DAD96',
                    flexShrink: 0,
                  }}
                >
                  Z
                </div>
                <div>
                  <p className="text-white font-bold text-[20px] m-0 leading-tight">
                    {currentSubscription ? 'Zipo Subscription' : 'No Active Plan'}
                  </p>
                  <p className="text-white text-[12px] font-medium m-0 mt-0.5">
                    Subscribe on :{' '}
                    {currentSubscription?.subscribedOn
                      ? new Date(currentSubscription.subscribedOn).toISOString().split('T')[0]
                      : '-'}
                  </p>
                </div>
              </div>
              {currentSubscription && (
                <span
                  className="text-white text-[12px] font-semibold px-3 py-1 rounded-full shrink-0 first-letter:uppercase"
                  style={{ background: '#F6921E', backdropFilter: 'blur(4px)' }}
                >
                  {currentSubscription.status}
                </span>
              )}
            </div>

            {/* Price Row */}
            <div style={{ paddingTop: '12px' }}>
              <span className="text-white font-bold text-[24px]">
                {currentSubscription?.currency === 'GBP' ? '£' : '$'}
                {currentSubscription?.amount || 0}
              </span>
              <span className="text-white font-medium text-[12px]"> /month</span>
            </div>
          </div>

          {/* Next Billing / Card Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-[36px] h-[36px] rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                <img src="/icons/rider/dates.svg" alt="" />
              </div>
              <div>
                <p className="text-[12px] text-[#4E616A] font-medium">Next Billing</p>
                <p className="text-[14px] font-medium text-[#101828]">
                  {formatDate(currentSubscription?.currentPeriodEnd)}
                </p>
              </div>
            </div>

            {paymentMethod && (
              <div className="flex items-start gap-3">
                <div className="w-[36px] h-[36px] rounded-full bg-[#F9F9F9] flex items-center justify-center shrink-0">
                  <img src="/icons/driver/visa.svg" alt="visa" className="w-[20px]" />
                </div>
                <div>
                  <p className="text-[12px] text-[#4E616A] font-medium">Payment Method</p>
                  <p className="text-[14px] font-medium text-[#101828] uppercase">
                    {paymentMethod.brand} •••• {paymentMethod.last4}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="p-1">
        <div className="border border-[#DFE6E5] rounded-lg overflow-hidden bg-white">
          <div className="px-4 py-4 border-b border-[#DFE6E5] bg-white">
            <span className="text-[20px] font-semibold text-[#000000]">Billing History</span>
          </div>
          <DataTable<BillingHistoryRow>
            columns={columns}
            data={currentData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            emptyText="No billing history found."
          />
        </div>
      </div>
    </div>
  );
}
