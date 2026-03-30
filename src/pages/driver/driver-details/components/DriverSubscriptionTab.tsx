import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDriverSubscriptions } from '@/hooks/useDriver';

const ITEMS_PER_PAGE = 12;

interface BillingTableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

const billingTableColumns: BillingTableColumn[] = [
  { key: 'transactionId', label: 'TRANSACTION ID', sortable: true },
  { key: 'plan', label: 'Plan', sortable: false },
  { key: 'amount', label: 'AMOUNT', sortable: true },
  { key: 'date', label: 'DATE', sortable: true },
  { key: 'method', label: 'METHOD', sortable: false },
  { key: 'status', label: 'STATUS', sortable: true },
  { key: 'action', label: 'ACTION', sortable: false },
];

export default function DriverSubscriptionTab() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useDriverSubscriptions(id);
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-[#1DAFA1]">Loading subscription details...</div>
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric',
    });
  };

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 1) return [1];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

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
                'linear-gradient(145deg, #1DAFA1 0%, #29b89a 35%, #d4880a 80%, #e09010 100%)',
              border: '1.5px solid rgba(255,255,255,0.18)',
              boxShadow: '0 4px 24px 0 rgba(29,175,161,0.18)',
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
                    Subscribe on : {formatDate(currentSubscription?.subscribedOn)}
                  </p>
                </div>
              </div>
              {currentSubscription && (
                <span
                  className="text-white text-[12px] font-semibold px-3 py-1 rounded-full shrink-0 uppercase"
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
        <div className="border border-[#DFE6E5] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {/* Billing History title row */}
                <tr className="border-b border-[#DFE6E5]">
                  <th colSpan={billingTableColumns.length} className="px-4 py-4 bg-white">
                    <span className="text-[20px] font-semibold text-[#000000]">
                      Billing History
                    </span>
                  </th>
                </tr>

                {/* Column headers via map */}
                <tr className="bg-[#F9F9F9] border-b border-[#DFE6E5] text-[14px] font-medium uppercase tracking-wider text-[#4E616A]">
                  {billingTableColumns.map((col) => (
                    <th key={col.key} className="px-4 py-3.5">
                      {col.sortable ? (
                        <div className="flex justify-between gap-1">
                          {col.label}
                          <img
                            src="/icons/rider/updown.svg"
                            alt="sort"
                            className="w-[18px] h-[18px]"
                          />
                        </div>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Transaction ID */}
                    <td className="px-4 py-3">
                      <span className="text-[14px] font-medium text-[#1DAFA1] hover:underline cursor-pointer">
                        {row.invoiceNumber}
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3 text-[14px] font-medium text-[#4E616A]">
                      {row.description}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 text-[14px] font-medium text-[#4E616A]">
                      {row.currency === 'GBP' ? '£' : '$'}
                      {row.amount.toFixed(2)}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-[14px] font-medium text-[#4E616A]">
                      {formatDate(row.createdAt)}
                    </td>

                    {/* Method */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`/icons/driver/${paymentMethod?.brand?.toLowerCase() === 'visa' ? 'visa' : 'card'}.svg`}
                          alt="card"
                          onError={(e) => (e.currentTarget.src = '/icons/driver/card.svg')}
                        />
                        <span className="text-[14px] font-medium text-[#4E616A] uppercase">
                          {paymentMethod?.brand || 'Card'} •••• {paymentMethod?.last4 || '****'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
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
                    </td>

                    {/* Action — Download */}
                    <td className="px-4 py-3">
                      <a
                        href={row.pdfUrl || row.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer inline-block"
                        title="Download Receipt"
                      >
                        <img
                          src="/icons/driver/Download.svg"
                          alt="download"
                          className="w-[22px] h-[22px]"
                        />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-[#DFE6E5] flex items-center justify-end gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-[20px] h-[20px]" />
            </button>

            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-1 text-[#4E616A] text-[13px]">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors border ${
                    currentPage === page
                      ? 'bg-teal-50 text-[#1DAFA1] border-[#1DAFA1]'
                      : 'text-[#4E616A] border-transparent hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
