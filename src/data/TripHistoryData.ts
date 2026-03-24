export type TripStatus = 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';

export type VehicleCategory =
  | 'Electric'
  | 'Standard'
  | 'XL'
  | 'Executive'
  | 'Executive XL';

// Vehicle category → photo mapping
// Electric      → /icons/vehicle/vehicle1.svg
// Standard      → /icons/vehicle/vehicle2.svg
// XL            → /icons/vehicle/vehicle3.svg
// Executive     → /icons/vehicle/vehicle4.svg
// Executive XL  → /icons/vehicle/vehicle5.svg

export interface VehicleInfo {
  name: VehicleCategory;
  photo: string;
  color: string;
  registrationNumber: string;
}

export interface TripRecord {
  id: string;
  rider: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    rating: number;
  };
  driver: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    rating: number;
    vehicle: VehicleInfo;
  };
  route: {
    pickupLocation: string;
    stop1Location: string;
    destination: string;
    /** @deprecated use pickupLocation */
    from: string;
    /** @deprecated use destination */
    to: string;
  };
  distance: number;      // km
  estimatedTime: number; // minutes
  totalFare: number;
  amount: number;
  date: string;
  time: string;
  status: TripStatus;
  payment?: {
    method: string;
    last4: string;
  };
  riderFeedback?: {
    rating: number;
    note: string;
  };
  driverFeedback?: {
    rating: number;
    note: string;
  };
  cancellationDetails?: {
    cancelledBy: 'rider' | 'driver';
    tripStage: string;
    reason: string;
    fee: number;
    waitingCharge: number;
  };
}

export const tripHistoryData: TripRecord[] = [

  // ─── 1. ASSIGNED ─────────────────────────────────────────────────────────────
  {
    id: 'ZPT-2845148',
    rider: {
      id: 'RDR-1001',
      name: 'Mia Chen',
      phone: '+44 231 5623',
      avatar: 'MC',
      rating: 4.7,
    },
    driver: {
      id: 'DRV-2001',
      name: 'James Hartley',
      phone: '+44 231 5623',
      avatar: '/icons/driver/avatar1.png',
      rating: 4.9,
      vehicle: {
        name: 'Standard',
        photo: '/icons/vehicle/vehicle2.svg',
        color: 'Pearl White',
        registrationNumber: 'LK21 MNX',
      },
    },
    route: {
      pickupLocation: '14 Uptown Ave, London',
      stop1Location: '5 King Street, London',
      destination: 'Victoria Station, London',
      from: 'Uptown',
      to: 'Station',
    },
    distance: 6.4,
    estimatedTime: 18,
    totalFare: 12.5,
    amount: 12.5,
    date: '2026-03-20',
    time: '02:59',
    status: 'Assigned',
    payment: {
      method: 'Mastercard',
      last4: '8821',
    },
    riderFeedback: undefined,
    driverFeedback: undefined,
    cancellationDetails: undefined,
  },

  // ─── 2. IN PROGRESS ──────────────────────────────────────────────────────────
  {
    id: 'ZPT-2845149',
    rider: {
      id: 'RDR-1002',
      name: 'Amir Suleiman',
      phone: '+44 231 5632',
      avatar: 'AS',
      rating: 4.5,
    },
    driver: {
      id: 'DRV-2002',
      name: 'Priya Nair',
      phone: '+44 231 5632',
      avatar: '/icons/driver/avatar2.png',
      rating: 4.8,
      vehicle: {
        name: 'Electric',
        photo: '/icons/vehicle/vehicle1.svg',
        color: 'Midnight Blue',
        registrationNumber: 'MR70 BCX',
      },
    },
    route: {
      pickupLocation: '22 Midtown Blvd, London',
      stop1Location: '88 Oxford Street, London',
      destination: "Westfield Mall, Shepherd's Bush",
      from: 'Midtown',
      to: 'Mall',
    },
    distance: 9.1,
    estimatedTime: 24,
    totalFare: 22.0,
    amount: 22.0,
    date: '2026-03-20',
    time: '03:45',
    status: 'In Progress',
    payment: {
      method: 'Visa',
      last4: '3310',
    },
    riderFeedback: undefined,
    driverFeedback: undefined,
    cancellationDetails: undefined,
  },

  // ─── 3. COMPLETED ────────────────────────────────────────────────────────────
  {
    id: 'ZPT-2845150',
    rider: {
      id: 'RDR-1003',
      name: 'Lara Brown',
      phone: '+44 231 5650',
      avatar: 'LB',
      rating: 4.8,
    },
    driver: {
      id: 'DRV-2003',
      name: 'Sophie Turner',
      phone: '+44 231 5650',
      avatar: '/icons/driver/avatar4.png',
      rating: 5.0,
      vehicle: {
        name: 'Executive',
        photo: '/icons/vehicle/vehicle4.svg',
        color: 'Obsidian Black',
        registrationNumber: 'TE22 LKS',
      },
    },
    route: {
      pickupLocation: '9 Lakeside Drive, Manchester',
      stop1Location: '200 Deansgate, Manchester',
      destination: 'Heaton Park, Manchester',
      from: 'Lakeside',
      to: 'Park',
    },
    distance: 12.3,
    estimatedTime: 31,
    totalFare: 30.0,
    amount: 30.0,
    date: '2026-03-21',
    time: '04:01',
    status: 'Completed',
    payment: {
      method: 'Visa',
      last4: '4245',
    },
    riderFeedback: {
      rating: 5,
      note: 'Professional and punctual',
    },
    driverFeedback: {
      rating: 5,
      note: 'Humble and easy-going',
    },
    cancellationDetails: undefined,
  },

  // ─── 4. CANCELLED BY RIDER ───────────────────────────────────────────────────
  {
    id: 'ZPT-2845151',
    rider: {
      id: 'RDR-1004',
      name: 'Tommy Nguyen',
      phone: '+44 231 5669',
      avatar: 'TN',
      rating: 4.1,
    },
    driver: {
      id: 'DRV-2002',
      name: 'Priya Nair',
      phone: '+44 231 5632',
      avatar: '/icons/driver/avatar2.png',
      rating: 4.8,
      vehicle: {
        name: 'Electric',
        photo: '/icons/vehicle/vehicle1.svg',
        color: 'Midnight Blue',
        registrationNumber: 'MR70 BCX',
      },
    },
    route: {
      pickupLocation: '47 Hilltop Road, Edinburgh',
      stop1Location: 'Calton Hill Viewpoint, Edinburgh',
      destination: 'Royal Observatory, Edinburgh',
      from: 'Hilltop',
      to: 'Observatory',
    },
    distance: 7.2,
    estimatedTime: 20,
    totalFare: 21.5,
    amount: 21.5,
    date: '2026-03-22',
    time: '05:45',
    status: 'Cancelled',
    payment: {
      method: 'Mastercard',
      last4: '9910',
    },
    riderFeedback: undefined,
    driverFeedback: undefined,
    cancellationDetails: {
      cancelledBy: 'rider',
      tripStage: 'Before Pickup',
      reason: 'Changed plans',
      fee: 2.5,
      waitingCharge: 0.0,
    },
  },

  // ─── 5. CANCELLED BY DRIVER ──────────────────────────────────────────────────
  {
    id: 'ZPT-2845152',
    rider: {
      id: 'RDR-1005',
      name: 'Nina Davis',
      phone: '+44 231 5678',
      avatar: 'ND',
      rating: 4.6,
    },
    driver: {
      id: 'DRV-2003',
      name: 'Carlos Rivera',
      phone: '+44 231 5841',
      avatar: '/icons/driver/avatar3.png',
      rating: 4.6,
      vehicle: {
        name: 'XL',
        photo: '/icons/vehicle/vehicle3.svg',
        color: 'Flame Red',
        registrationNumber: 'EF19 SRT',
      },
    },
    route: {
      pickupLocation: '31 Riverside Lane, Bristol',
      stop1Location: '12 Harbourside, Bristol',
      destination: 'The River Cafe, Bristol',
      from: 'Riverside',
      to: 'Cafe',
    },
    distance: 4.5,
    estimatedTime: 13,
    totalFare: 16.0,
    amount: 16.0,
    date: '2026-03-22',
    time: '06:30',
    status: 'Cancelled',
    payment: {
      method: 'Visa',
      last4: '6621',
    },
    riderFeedback: undefined,
    driverFeedback: undefined,
    cancellationDetails: {
      cancelledBy: 'driver',
      tripStage: 'After Pickup',
      reason: 'Vehicle breakdown',
      fee: 0.0,
      waitingCharge: 3.0,
    },
  },

  // ─── 6. COMPLETED ────────────────────────────────────────────────────────────
  {
    id: 'ZPT-2845153',
    rider: {
      id: 'RDR-1006',
      name: 'Sophia Smith',
      phone: '+44 231 5687',
      avatar: 'SS',
      rating: 4.9,
    },
    driver: {
      id: 'DRV-2004',
      name: 'Sophie Turner',
      phone: '+44 231 5650',
      avatar: '/icons/driver/avatar4.png',
      rating: 5.0,
      vehicle: {
        name: 'Executive',
        photo: '/icons/vehicle/vehicle4.svg',
        color: 'Obsidian Black',
        registrationNumber: 'TE22 LKS',
      },
    },
    route: {
      pickupLocation: '8 Forestview Close, Oxford',
      stop1Location: '25 Woodstock Road, Oxford',
      destination: 'Foxcombe Lodge, Oxford',
      from: 'Forestview',
      to: 'Lodge',
    },
    distance: 11.0,
    estimatedTime: 28,
    totalFare: 28.5,
    amount: 28.5,
    date: '2026-03-23',
    time: '07:10',
    status: 'Completed',
    payment: {
      method: 'Amex',
      last4: '0047',
    },
    riderFeedback: {
      rating: 4,
      note: 'Great ride, very smooth',
    },
    driverFeedback: {
      rating: 5,
      note: 'Polite and on time',
    },
    cancellationDetails: undefined,
  },

  // ─── 7. COMPLETED ────────────────────────────────────────────────────────────
  {
    id: 'ZPT-2845154',
    rider: {
      id: 'RDR-1007',
      name: 'David Patel',
      phone: '+44 231 5696',
      avatar: 'DP',
      rating: 4.4,
    },
    driver: {
      id: 'DRV-2005',
      name: 'Liam Okafor',
      phone: '+44 231 5669',
      avatar: '/icons/driver/avatar5.png',
      rating: 4.7,
      vehicle: {
        name: 'Executive XL',
        photo: '/icons/vehicle/vehicle5.svg',
        color: 'Metallic Silver',
        registrationNumber: 'VW21 OKF',
      },
    },
    route: {
      pickupLocation: '60 Suburban Street, Leeds',
      stop1Location: '15 Headrow, Leeds',
      destination: 'Trinity Leeds Plaza, Leeds',
      from: 'Suburban',
      to: 'Plaza',
    },
    distance: 8.7,
    estimatedTime: 22,
    totalFare: 24.0,
    amount: 24.0,
    date: '2026-03-24',
    time: '08:00',
    status: 'Completed',
    payment: {
      method: 'Mastercard',
      last4: '1133',
    },
    riderFeedback: {
      rating: 5,
      note: 'Excellent service',
    },
    driverFeedback: {
      rating: 4,
      note: 'Good passenger',
    },
    cancellationDetails: undefined,
  },

  // ─── 8. IN PROGRESS ──────────────────────────────────────────────────────────
  {
    id: 'ZPT-2845155',
    rider: {
      id: 'RDR-1008',
      name: 'Ravi Kumar',
      phone: '+44 231 5841',
      avatar: 'RK',
      rating: 4.3,
    },
    driver: {
      id: 'DRV-2006',
      name: 'Grace Mensah',
      phone: '+44 231 5678',
      avatar: '/icons/driver/avatar6.png',
      rating: 4.5,
      vehicle: {
        name: 'Standard',
        photo: '/icons/vehicle/vehicle2.svg',
        color: 'Steel Grey',
        registrationNumber: 'HY20 GRM',
      },
    },
    route: {
      pickupLocation: '5 Industrial Way, Birmingham',
      stop1Location: '40 Digbeth High St, Birmingham',
      destination: 'Eastside Business Complex, Birmingham',
      from: 'Industrial',
      to: 'Complex',
    },
    distance: 6.9,
    estimatedTime: 19,
    totalFare: 19.0,
    amount: 19.0,
    date: '2026-03-25',
    time: '09:15',
    status: 'In Progress',
    payment: {
      method: 'Visa',
      last4: '7782',
    },
    riderFeedback: undefined,
    driverFeedback: undefined,
    cancellationDetails: undefined,
  },

  // ─── 9. CANCELLED BY RIDER ───────────────────────────────────────────────────
  {
    id: 'ZPT-2845156',
    rider: {
      id: 'RDR-1009',
      name: 'Clara Kim',
      phone: '+44 231 5705',
      avatar: 'CK',
      rating: 4.2,
    },
    driver: {
      id: 'DRV-2007',
      name: 'Ethan Walsh',
      phone: '+44 231 5687',
      avatar: '/icons/driver/avatar7.png',
      rating: 4.3,
      vehicle: {
        name: 'XL',
        photo: '/icons/vehicle/vehicle3.svg',
        color: 'Aurora White',
        registrationNumber: 'KA23 ETW',
      },
    },
    route: {
      pickupLocation: '14 Uptown Ave, London',
      stop1Location: '5 King Street, London',
      destination: 'Victoria Station, London',
      from: 'Uptown',
      to: 'Station',
    },
    distance: 6.4,
    estimatedTime: 18,
    totalFare: 12.5,
    amount: 12.5,
    date: '2026-03-26',
    time: '10:20',
    status: 'Cancelled',
    payment: {
      method: 'Visa',
      last4: '4499',
    },
    riderFeedback: undefined,
    driverFeedback: undefined,
    cancellationDetails: {
      cancelledBy: 'rider',
      tripStage: 'Before Pickup',
      reason: 'Found alternative transport',
      fee: 2.5,
      waitingCharge: 1.5,
    },
  },

  // ─── 10. CANCELLED BY DRIVER ─────────────────────────────────────────────────
  {
    id: 'ZPT-2845157',
    rider: {
      id: 'RDR-1001',
      name: 'Mia Chen',
      phone: '+44 231 5623',
      avatar: 'MC',
      rating: 4.7,
    },
    driver: {
      id: 'DRV-2008',
      name: 'Noah Blackwood',
      phone: '+44 231 5696',
      avatar: '/icons/driver/avatar8.png',
      rating: 4.6,
      vehicle: {
        name: 'Executive XL',
        photo: '/icons/vehicle/vehicle5.svg',
        color: 'Sapphire Blue',
        registrationNumber: 'BM22 NWB',
      },
    },
    route: {
      pickupLocation: '22 Midtown Blvd, London',
      stop1Location: '88 Oxford Street, London',
      destination: "Westfield Mall, Shepherd's Bush",
      from: 'Midtown',
      to: 'Mall',
    },
    distance: 9.1,
    estimatedTime: 24,
    totalFare: 22.0,
    amount: 22.0,
    date: '2026-03-27',
    time: '11:05',
    status: 'Cancelled',
    payment: {
      method: 'Mastercard',
      last4: '2256',
    },
    riderFeedback: undefined,
    driverFeedback: undefined,
    cancellationDetails: {
      cancelledBy: 'driver',
      tripStage: 'En Route to Pickup',
      reason: 'Personal emergency',
      fee: 0.0,
      waitingCharge: 0.0,
    },
  },

  // ─── 11. ASSIGNED ────────────────────────────────────────────────────────────
  {
    id: 'ZPT-2845158',
    rider: {
      id: 'RDR-1004',
      name: 'Tommy Nguyen',
      phone: '+44 231 5669',
      avatar: 'TN',
      rating: 4.1,
    },
    driver: {
      id: 'DRV-2009',
      name: 'Isla Crawford',
      phone: '+44 231 5705',
      avatar: '/icons/driver/avatar9.png',
      rating: 4.9,
      vehicle: {
        name: 'Electric',
        photo: '/icons/vehicle/vehicle1.svg',
        color: 'Electric Orange',
        registrationNumber: 'RZ21 ICW',
      },
    },
    route: {
      pickupLocation: '3 Seaside Walk, Brighton',
      stop1Location: '101 Marine Parade, Brighton',
      destination: 'The Grand Resort, Brighton',
      from: 'Seaside',
      to: 'Resort',
    },
    distance: 5.8,
    estimatedTime: 15,
    totalFare: 18.0,
    amount: 18.0,
    date: '2026-03-28',
    time: '12:00',
    status: 'Assigned',
    payment: {
      method: 'Visa',
      last4: '3387',
    },
    riderFeedback: undefined,
    driverFeedback: undefined,
    cancellationDetails: undefined,
  },

  // ─── 12. COMPLETED ───────────────────────────────────────────────────────────
  {
    id: 'ZPT-2845159',
    rider: {
      id: 'RDR-1006',
      name: 'Sophia Smith',
      phone: '+44 231 5687',
      avatar: 'SS',
      rating: 4.9,
    },
    driver: {
      id: 'DRV-2005',
      name: 'Liam Okafor',
      phone: '+44 231 5669',
      avatar: '/icons/driver/avatar5.png',
      rating: 4.7,
      vehicle: {
        name: 'Executive XL',
        photo: '/icons/vehicle/vehicle5.svg',
        color: 'Metallic Silver',
        registrationNumber: 'VW21 OKF',
      },
    },
    route: {
      pickupLocation: '3 Seaside Walk, Brighton',
      stop1Location: '101 Marine Parade, Brighton',
      destination: 'The Grand Resort, Brighton',
      from: 'Seaside',
      to: 'Resort',
    },
    distance: 5.8,
    estimatedTime: 15,
    totalFare: 18.0,
    amount: 18.0,
    date: '2026-03-29',
    time: '13:30',
    status: 'Completed',
    payment: {
      method: 'Visa',
      last4: '5574',
    },
    riderFeedback: {
      rating: 5,
      note: 'Smooth and comfortable',
    },
    driverFeedback: {
      rating: 5,
      note: 'Great passenger, no issues',
    },
    cancellationDetails: undefined,
  },
];

export const TRIP_ITEMS_PER_PAGE = 12;
export const TRIP_TOTAL_PAGES = 99;
