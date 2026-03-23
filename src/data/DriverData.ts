export interface Driver {
  id: string;
  driverId: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  totalTrips: number;
  totalEarned: number;
  rating: number;
  status: 'Active' | 'Suspended';
  avatar?: string;
  // Extended fields for detail page
  gender?: string;
  dateOfBirth?: string;
  joinedOn?: string;
  address?: string;
  postalCode?: string;
  license?: {
    panNumber: string;
    expiryDate: string;
    issuingAuthority: string;
    documentName: string;
  };
  vehicle?: {
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    color: string;
    vehicleType: string;
  };
  legalAgreements?: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    dataProcessingConsent: boolean;
  };
}

export const driversData: Driver[] = [
  {
    id: '1',
    driverId: 'DRVR-2001',
    name: 'Mike Smith',
    initials: 'MS',
    phone: '+44 1321 65456',
    email: 'mike.smith@email.com',
    totalTrips: 160,
    totalEarned: 1205.5,
    rating: 4.9,
    status: 'Active',
    gender: 'Male',
    dateOfBirth: '1988-03-25',
    joinedOn: '2023-05-12',
    address: 'Downtown Community Center, 45, Maple Avenue, Greater Landon',
    postalCode: 'HK34 54160',
    license: {
      panNumber: '+1 234-567-9001',
      expiryDate: '2027-03-15',
      issuingAuthority: 'New York DMV',
      documentName: 'license.pdf',
    },
    vehicle: {
      registrationNumber: 'A812 CDE',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      vehicleType: 'Sedan',
    },
    legalAgreements: { termsOfService: true, privacyPolicy: true, dataProcessingConsent: true },
  },
  {
    id: '2',
    driverId: 'DVR-2002',
    name: 'Amir Suleiman',
    initials: 'AS',
    phone: '+44 231 5632',
    email: 'john.doe@email.com',
    totalTrips: 161,
    totalEarned: 1500.75,
    rating: 4.9,
    status: 'Suspended',
    gender: 'Male',
    dateOfBirth: '1990-07-14',
    joinedOn: '2022-11-03',
    address: '22 Baker Street, London, Greater London',
    postalCode: 'NW1 6XE',
    license: {
      panNumber: '+1 234-567-0002',
      expiryDate: '2026-08-10',
      issuingAuthority: 'London DVLA',
      documentName: 'license.pdf',
    },
    vehicle: {
      registrationNumber: 'B345 FGH',
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      color: 'Black',
      vehicleType: 'Sedan',
    },
    legalAgreements: { termsOfService: true, privacyPolicy: true, dataProcessingConsent: false },
  },
  {
    id: '3',
    driverId: 'DVR-2003',
    name: 'Ravi Kumar',
    initials: 'RK',
    phone: '+44 231 5641',
    email: 'sarah.connor@email.com',
    totalTrips: 162,
    totalEarned: 980.4,
    rating: 5.0,
    status: 'Active',
    gender: 'Male',
    dateOfBirth: '1985-12-01',
    joinedOn: '2021-06-20',
    address: '5 Oak Lane, Manchester, Greater Manchester',
    postalCode: 'M1 2AB',
    license: {
      panNumber: '+1 234-567-0003',
      expiryDate: '2028-01-22',
      issuingAuthority: 'Manchester DVLA',
      documentName: 'license.pdf',
    },
    vehicle: {
      registrationNumber: 'C456 IJK',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      color: 'White',
      vehicleType: 'Sedan',
    },
    legalAgreements: { termsOfService: true, privacyPolicy: true, dataProcessingConsent: true },
  },
  {
    id: '4',
    driverId: 'DVR-2004',
    name: 'Lara Brown',
    initials: 'LB',
    phone: '+44 231 5650',
    email: 'sarah.connor@email.com',
    totalTrips: 163,
    totalEarned: 2345.1,
    rating: 5.0,
    status: 'Active',
  },
  {
    id: '5',
    driverId: 'DVR-2005',
    name: 'Amir Suleiman',
    initials: 'AS',
    phone: '+44 231 5632',
    email: 'lucy.brown@email.com',
    totalTrips: 164,
    totalEarned: 760.3,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: '6',
    driverId: 'DVR-2006',
    name: 'Ravi Kumar',
    initials: 'RK',
    phone: '+44 231 5641',
    email: 'kevin.smith@email.com',
    totalTrips: 165,
    totalEarned: 890.0,
    rating: 4.9,
    status: 'Suspended',
  },
  {
    id: '7',
    driverId: 'DVR-2007',
    name: 'Lara Brown',
    initials: 'LB',
    phone: '+44 231 5650',
    email: 'sarah.connor@email.com',
    totalTrips: 166,
    totalEarned: 432.2,
    rating: 5.0,
    status: 'Active',
  },
  {
    id: '8',
    driverId: 'DVR-2008',
    name: 'Tommy Nguyen',
    initials: 'TN',
    phone: '+44 231 5669',
    email: 'david.lee@email.com',
    totalTrips: 167,
    totalEarned: 1675.85,
    rating: 5.0,
    status: 'Active',
  },
  {
    id: '9',
    driverId: 'DVR-2009',
    name: 'Nina Davis',
    initials: 'ND',
    phone: '+44 231 5678',
    email: 'hana.kim@email.com',
    totalTrips: 168,
    totalEarned: 1200.6,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: '10',
    driverId: 'DVR-2010',
    name: 'Sophia Smith',
    initials: 'SS',
    phone: '+44 231 5687',
    email: 'robert.white@email.com',
    totalTrips: 169,
    totalEarned: 543.15,
    rating: 4.9,
    status: 'Active',
  },
  {
    id: '11',
    driverId: 'DVR-2011',
    name: 'David Patel',
    initials: 'DP',
    phone: '+44 231 5698',
    email: 'anna.martinez@email.com',
    totalTrips: 170,
    totalEarned: 310.25,
    rating: 5.0,
    status: 'Active',
  },
  {
    id: '12',
    driverId: 'DVR-2012',
    name: 'Clara Kim',
    initials: 'CK',
    phone: '+44 231 5705',
    email: 'james.jones@email.com',
    totalTrips: 171,
    totalEarned: 999.99,
    rating: 5.0,
    status: 'Active',
  },
];
