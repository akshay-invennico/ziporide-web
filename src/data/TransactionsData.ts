export interface TransactionRecord {
  id: string;
  type:
    | 'Ride Payment'
    | 'Driver Payout'
    | 'Subscription Payment'
    | 'Refund'
    | 'Cancellation Fee'
    | 'No-Show Fee'
    | 'Driver Incentive';
  amount: number;
  date: string;
  time: string;
  status: 'Paid' | 'In Process' | 'Refunded';
  paymentMethod?: string;
  externalId?: string;
  tripId?: string;
  driver?: {
    name: string;
    id: string;
    avatar: string;
  };
}

export const transactionsData: TransactionRecord[] = [
  {
    id: 'TXN-56445641',
    type: 'Ride Payment',
    amount: 12.5,
    date: '2026-03-20',
    time: '02:59',
    status: 'Paid',
    paymentMethod: 'Stripe',
    externalId: 'STRP4654',
    tripId: 'ZPR-1064561452',
  },
  {
    id: 'TXN-56445642',
    type: 'Driver Payout',
    amount: -12.5,
    date: '2026-03-20',
    time: '02:59',
    status: 'In Process',
    paymentMethod: 'Bank Transfer',
    externalId: 'BANK7782',
    tripId: 'ZPR-1064561453',
    driver: {
      name: 'Will Turner',
      id: 'DRVR-2001',
      avatar: '/icons/driver/avatar1.png',
    },
  },
  {
    id: 'TXN-56445643',
    type: 'Subscription Payment',
    amount: 12.5,
    date: '2026-03-21',
    time: '03:15',
    status: 'Paid',
    paymentMethod: 'PayPal',
    externalId: 'PP-9901',
    driver: {
      name: 'Will Turner',
      id: 'DRVR-2001',
      avatar: '/icons/driver/avatar1.png',
    },
  },
  {
    id: 'TXN-56445644',
    type: 'Refund',
    amount: -12.5,
    date: '2026-03-22',
    time: '04:01',
    status: 'Refunded',
    paymentMethod: 'Stripe',
    externalId: 'STRP8821',
    tripId: 'ZPR-1064561454',
    driver: {
      name: 'Will Turner',
      id: 'DRVR-2001',
      avatar: '/icons/driver/avatar1.png',
    },
  },
  {
    id: 'TXN-56445645',
    type: 'Cancellation Fee',
    amount: 12.5,
    date: '2026-03-23',
    time: '05:45',
    status: 'Paid',
    paymentMethod: 'Wallet',
    externalId: 'WLT-221',
    tripId: 'ZPR-1064561455',
  },
  {
    id: 'TXN-56445646',
    type: 'No-Show Fee',
    amount: 15.0,
    date: '2026-03-24',
    time: '06:30',
    status: 'Paid',
    paymentMethod: 'Stripe',
    externalId: 'STRP1122',
    tripId: 'ZPR-1064561456',
  },
  {
    id: 'TXN-56445647',
    type: 'Driver Incentive',
    amount: 20.0,
    date: '2026-03-25',
    time: '07:10',
    status: 'Paid',
    paymentMethod: 'System',
    externalId: 'INC-445',
    tripId: 'N/A',
  },
  {
    id: 'TXN-56445648',
    type: 'Driver Incentive',
    amount: -20.0,
    date: '2026-03-26',
    time: '08:00',
    status: 'Paid',
    paymentMethod: 'System',
    externalId: 'INC-446',
    tripId: 'N/A',
  },
  {
    id: 'TXN-56445649',
    type: 'Ride Payment',
    amount: 12.5,
    date: '2026-03-27',
    time: '09:15',
    status: 'Paid',
    tripId: 'ZPR-1064561457',
  },
  {
    id: 'TXN-56445650',
    type: 'Driver Payout',
    amount: -12.5,
    date: '2026-03-28',
    time: '10:20',
    status: 'Paid',
    tripId: 'ZPR-1064561458',
  },
  {
    id: 'TXN-56445651',
    type: 'Subscription Payment',
    amount: 12.5,
    date: '2026-03-29',
    time: '11:05',
    status: 'Paid',
  },
  {
    id: 'TXN-56445652',
    type: 'Refund',
    amount: -12.5,
    date: '2026-03-30',
    time: '12:00',
    status: 'Refunded',
  },
  {
    id: 'TXN-56445653',
    type: 'Cancellation Fee',
    amount: 12.5,
    date: '2026-03-27',
    time: '09:15',
    status: 'Paid',
  },
  {
    id: 'TXN-56445654',
    type: 'No-Show Fee',
    amount: 15.0,
    date: '2026-03-28',
    time: '10:20',
    status: 'Paid',
  },
  {
    id: 'TXN-56445655',
    type: 'Driver Incentive',
    amount: 20.0,
    date: '2026-03-29',
    time: '11:05',
    status: 'Paid',
  },
  {
    id: 'TXN-56445656',
    type: 'Driver Incentive',
    amount: -20.0,
    date: '2026-03-30',
    time: '12:00',
    status: 'Paid',
  },
];
