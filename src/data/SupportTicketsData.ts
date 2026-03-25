export interface SupportTicket {
  id: string;
  cause: string;
  driver: {
    name: string;
    phone: string;
    avatar: string;
    initials: string;
    color: string;
  };
  raisedOn: string;
  status: 'Open' | 'Checking' | 'Resolved';
  tripId: string;
  description: string;
}

const COLORS = ['#1DAFA1', '#E9A90A', '#F87171', '#60A5FA', '#A78BFA', '#34D399'];

const DRIVERS = [
  { name: 'Mia Chen', phone: '+44 231 5623', initials: 'MC', color: COLORS[0], avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Amir Suleiman', phone: '+44 231 5632', initials: 'AS', color: COLORS[1], avatar: 'https://i.pravatar.cc/150?img=2' },
  { name: 'Ravi Kumar', phone: '+44 231 5641', initials: 'RK', color: COLORS[2], avatar: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Lara Brown', phone: '+44 231 5650', initials: 'LB', color: COLORS[3], avatar: 'https://i.pravatar.cc/150?img=4' },
  { name: 'Tommy Nguyen', phone: '+44 231 5669', initials: 'TN', color: COLORS[4], avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Nina Davis', phone: '+44 231 5678', initials: 'ND', color: COLORS[5], avatar: 'https://i.pravatar.cc/150?img=6' },
  { name: 'Sophia Smith', phone: '+44 231 5687', initials: 'SS', color: COLORS[0], avatar: 'https://i.pravatar.cc/150?img=7' },
  { name: 'David Patel', phone: '+44 231 5696', initials: 'DP', color: COLORS[1], avatar: 'https://i.pravatar.cc/150?img=8' },
  { name: 'Clara Kim', phone: '+44 231 5705', initials: 'CK', color: COLORS[2], avatar: 'https://i.pravatar.cc/150?img=9' },
];

const CAUSES = [
  'Incorrect Fare or Payment Issue',
  'Missing Receipt',
  'Charge Discrepancy',
  'Overpayment Alert',
  'Unrecognized Transaction',
  'Refund Request',
  'Billing Error',
  'Service Not Rendered',
  'Payment Declined',
  'Duplicate Charge',
  'Price Adjustment Needed',
  'Transaction Timeout',
];

const STATUSES: SupportTicket['status'][] = ['Open', 'Checking', 'Resolved'];

export const supportTicketsData: SupportTicket[] = Array.from({ length: 99 }, (_, i) => {
  const driver = DRIVERS[i % DRIVERS.length];
  const cause = CAUSES[i % CAUSES.length];
  const status = STATUSES[i % STATUSES.length];

  return {
    id: `HLP-28451${48 + i}`,
    cause,
    driver,
    raisedOn: `2026-03-${String(20 + (i % 12)).padStart(2, '0')}`,
    status,
    tripId: `ZPR-10645614${52 + i}`,
    description: "The rider, Elara, reported a discrepancy in the fare displayed at the end of her trip on February 21, 2026. Elara stated that the final charge of £22.50 did not align with the estimated fare range provided during booking. Upon investigation, it was found that the route taken by the driver, Jaxon, included an unexpected toll bridge, which was not factored into the initial fare calculation. Additionally, there was a system error that failed to automatically update the fare to reflect the toll charge. As a result, Elara was overcharged by £4.00. The payment system also experienced a temporary glitch, causing a delay in processing Elara's payment, leading to further confusion and concern. The support team has issued a partial refund of £4.00 to Elara's account to rectify the overcharge. We are also working to resolve the system error to prevent similar issues in the future and improve the accuracy of fare estimations. Furthermore, we are reviewing our communication protocols to ensure riders are promptly informed of any changes to their fare due to tolls or other unforeseen circumstances. We appreciate Elara's patience and understanding as we work to resolve this matter and enhance our services.",
  };
});