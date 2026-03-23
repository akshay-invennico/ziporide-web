import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BillingRecord {
    id: string;
    plan: string;
    amount: number;
    date: string;
    method: string;
    cardLast4: string;
    status: 'Paid' | 'Failed' | 'Pending';
}

// Generate mock billing history
const billingHistory: BillingRecord[] = Array.from({ length: 99 }, (_, i) => ({
    id: `TRN321651${321 + i}`,
    plan: 'Zipo Subscription',
    amount: 79.99,
    date: `2023-10-${String((i % 28) + 1).padStart(2, '0')}`,
    method: 'Visa',
    cardLast4: '8956',
    status: 'Paid',
}));

const ITEMS_PER_PAGE = 12;

export default function DriverSubscriptionTab() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(billingHistory.length / ITEMS_PER_PAGE);

    const currentData = billingHistory.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getPageNumbers = () => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
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
            <div className="p-5 border-b border-[#DFE6E5]">
                <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Current Plan</h3>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                    {/* Plan Card */}
                    <div style={{
                        width: '320px',
                        borderRadius: '16px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #1DAFA1 0%, #2ab896 40%, #e8a020 100%)',
                    }}>
                        {/* Top Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div className="flex items-center gap-3">
                                <div style={{
                                    width: '40px', height: '40px',
                                    background: 'rgba(255,255,255,0.25)',
                                    borderRadius: '10px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px', fontWeight: 700, color: 'white',
                                }}>Z</div>
                                <div>
                                    <p className="text-white font-semibold text-[15px] m-0">Zipo Subscription</p>
                                    <p className="text-white/80 text-[12px] m-0">Subscribe on : 2025-01-05</p>
                                </div>
                            </div>
                            <span className="text-white text-[12px] font-semibold px-3 py-1 rounded-full"
                                style={{ background: '#FD8800' }}>
                                Active
                            </span>
                        </div>

                        {/* Price Row */}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '14px' }}>
                            <span className="text-white font-bold text-[28px]">£79.99</span>
                            <span className="text-white/80 text-[14px]"> /month</span>
                        </div>
                    </div>
                    {/* Next Billing */}
                    <div className="flex items-center gap-3">
                        <div className="w-[36px] h-[36px] rounded-lg bg-[#F9F9F9] flex items-center justify-center shrink-0">
                            <img src="/icons/rider/dates.svg" alt="" />
                        </div>
                        <div>
                            <p className="text-[11px] text-[#4E616A] font-medium">Next Billing</p>
                            <p className="text-[15px] font-semibold text-[#101828]">2023-05-12</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing History */}
            <div className="p-5">
                <h3 className="text-[18px] font-bold text-[#101828] mb-4">Billing History</h3>

                <div className="border border-[#DFE6E5] rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F8F9FA] border-b border-[#DFE6E5] text-[12px] font-medium uppercase tracking-wider text-[#4E616A]">
                                    <th className="px-4 py-3.5">
                                        <div className="flex items-center gap-1">
                                            TRANSACTION ID
                                            <img src="/icons/rider/updown.svg" alt="sort" className="w-3 h-3 opacity-60" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3.5">Plan</th>
                                    <th className="px-4 py-3.5">
                                        <div className="flex items-center gap-1">
                                            AMOUNT
                                            <img src="/icons/rider/updown.svg" alt="sort" className="w-3 h-3 opacity-60" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3.5">
                                        <div className="flex items-center gap-1">
                                            DATE
                                            <img src="/icons/rider/updown.svg" alt="sort" className="w-3 h-3 opacity-60" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3.5">METHOD</th>
                                    <th className="px-4 py-3.5">
                                        <div className="flex items-center gap-1">
                                            STATUS
                                            <img src="/icons/rider/updown.svg" alt="sort" className="w-3 h-3 opacity-60" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3.5">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((row) => (
                                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        {/* Transaction ID */}
                                        <td className="px-4 py-3">
                                            <span className="text-[13px] font-medium text-[#1DAFA1] hover:underline cursor-pointer">
                                                {row.id}
                                            </span>
                                        </td>

                                        {/* Plan */}
                                        <td className="px-4 py-3 text-[13px] font-medium text-[#4E616A]">
                                            {row.plan}
                                        </td>

                                        {/* Amount */}
                                        <td className="px-4 py-3 text-[13px] font-medium text-[#4E616A]">
                                            £{row.amount.toFixed(2)}
                                        </td>

                                        {/* Date */}
                                        <td className="px-4 py-3 text-[13px] font-medium text-[#4E616A]">
                                            {row.date}
                                        </td>

                                        {/* Method */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {/* Visa logo */}
                                                <div className="flex items-center justify-center bg-[#1A1F71] rounded px-1.5 py-0.5">
                                                    <span className="text-white font-bold text-[10px] tracking-wider italic">VISA</span>
                                                </div>
                                                <span className="text-[13px] font-medium text-[#4E616A]">
                                                    Visa •••• {row.cardLast4}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Paid' ? 'bg-[#00A63E]' : row.status === 'Failed' ? 'bg-[#FF0707]' : 'bg-yellow-400'}`} />
                                                <span className={`text-[13px] font-semibold ${row.status === 'Paid' ? 'text-[#00A63E]' : row.status === 'Failed' ? 'text-[#FF0707]' : 'text-yellow-500'}`}>
                                                    {row.status}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Action — Download */}
                                        <td className="px-4 py-3">
                                            <button className="cursor-pointer hover:opacity-70 transition-opacity" title="Download Receipt">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1DAFA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="7 10 12 15 17 10" />
                                                    <line x1="12" y1="15" x2="12" y2="3" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-3 border-t border-[#DFE6E5] flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-full border border-gray-200 text-black hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-[20px] h-[20px]" />
                        </button>

                        {getPageNumbers().map((page, idx) =>
                            page === '...' ? (
                                <span key={`dots-${idx}`} className="px-1 text-[#4E616A] text-[13px]">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page as number)}
                                    className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors border ${currentPage === page
                                        ? 'bg-teal-50 text-[#1DAFA1] border-[#1DAFA1]'
                                        : 'text-[#4E616A] border-transparent hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
