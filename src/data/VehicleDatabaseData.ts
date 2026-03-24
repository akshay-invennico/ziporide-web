export interface VehicleDatabaseRow {
  id: string;
  name: string;
  year: number;
  color: string;
  image: string;
  category: 'Electric' | 'Standard' | 'XL' | 'Executive (Premium)' | 'Executive XL (Premium)';
  licencePlate: string;
  driver: {
    name: string;
    phone: string;
    image: string;
  };
  status: 'Active' | 'Suspended';
}

export const vehicleDatabaseData: VehicleDatabaseRow[] = [
  {
    id: '1',
    name: 'Toyota Camry',
    year: 2022,
    color: 'Silver',
    image: '/icons/vehicle/1.png',
    category: 'Electric',
    licencePlate: 'ABA 6161',
    driver: {
      name: 'Mia Chen',
      phone: '+44 231 5623',
      image: 'https://i.pravatar.cc/150?u=mia_chen',
    },
    status: 'Active',
  },
  {
    id: '2',
    name: 'Honda Accord',
    year: 2023,
    color: 'Blue',
    image: '/icons/vehicle/2.png',
    category: 'Standard',
    licencePlate: 'ABA 6162',
    driver: {
      name: 'Amir Suleiman',
      phone: '+44 231 5632',
      image: 'https://i.pravatar.cc/150?u=amir',
    },
    status: 'Suspended',
  },
  {
    id: '3',
    name: 'Ford Fusion',
    year: 2021,
    color: 'Red',
    image: '/icons/vehicle/3.png',
    category: 'XL',
    licencePlate: 'ABA 6163',
    driver: {
      name: 'Ravi Kumar',
      phone: '+44 231 5641',
      image: 'https://i.pravatar.cc/150?u=ravi',
    },
    status: 'Active',
  },
  {
    id: '4',
    name: 'Chevrolet Malibu',
    year: 2023,
    color: 'Black',
    image: '/icons/vehicle/4.png',
    category: 'Executive (Premium)',
    licencePlate: 'ABA 6164',
    driver: {
      name: 'Lara Brown',
      phone: '+44 231 5650',
      image: 'https://i.pravatar.cc/150?u=lara',
    },
    status: 'Active',
  },
  {
    id: '5',
    name: 'Nissan Altima',
    year: 2022,
    color: 'White',
    image: '/icons/vehicle/5.png',
    category: 'Executive XL (Premium)',
    licencePlate: 'ABA 6165',
    driver: {
      name: 'Amir Suleiman',
      phone: '+44 231 5632',
      image: 'https://i.pravatar.cc/150?u=amir',
    },
    status: 'Active',
  },
  {
    id: '6',
    name: 'Hyundai Sonata',
    year: 2023,
    color: 'Gray',
    image: '/icons/vehicle/1.png',
    category: 'Electric',
    licencePlate: 'ABA 6166',
    driver: {
      name: 'Ravi Kumar',
      phone: '+44 231 5641',
      image: 'https://i.pravatar.cc/150?u=ravi',
    },
    status: 'Suspended',
  },
  {
    id: '7',
    name: 'Kia K5',
    year: 2022,
    color: 'Green',
    image: '/icons/vehicle/2.png',
    category: 'Standard',
    licencePlate: 'ABA 6167',
    driver: {
      name: 'Lara Brown',
      phone: '+44 231 5650',
      image: 'https://i.pravatar.cc/150?u=lara',
    },
    status: 'Active',
  },
  {
    id: '8',
    name: 'Subaru Legacy',
    year: 2021,
    color: 'Brown',
    image: '/icons/vehicle/3.png',
    category: 'XL',
    licencePlate: 'ABA 6168',
    driver: {
      name: 'Tommy Nguyen',
      phone: '+44 231 5669',
      image: 'https://i.pravatar.cc/150?u=tommy',
    },
    status: 'Active',
  },
  {
    id: '9',
    name: 'Volkswagen Passat',
    year: 2023,
    color: 'Yellow',
    image: '/icons/vehicle/4.png',
    category: 'Executive (Premium)',
    licencePlate: 'ABA 6169',
    driver: {
      name: 'Nina Davis',
      phone: '+44 231 5678',
      image: 'https://i.pravatar.cc/150?u=nina',
    },
    status: 'Active',
  },
  {
    id: '10',
    name: 'Mazda6',
    year: 2022,
    color: 'Teal',
    image: '/icons/vehicle/5.png',
    category: 'Executive XL (Premium)',
    licencePlate: 'ABA 6170',
    driver: {
      name: 'Sophia Smith',
      phone: '+44 231 5687',
      image: 'https://i.pravatar.cc/150?u=sophia',
    },
    status: 'Suspended',
  },
  {
    id: '11',
    name: 'Chrysler 300',
    year: 2023,
    color: 'Burgundy',
    image: '/icons/vehicle/1.png',
    category: 'XL',
    licencePlate: 'ABA 6171',
    driver: {
      name: 'David Patel',
      phone: '+44 231 5696',
      image: 'https://i.pravatar.cc/150?u=david',
    },
    status: 'Active',
  },
  {
    id: '12',
    name: 'Buick Regal',
    year: 2021,
    color: 'Copper',
    image: '/icons/vehicle/2.png',
    category: 'Executive (Premium)',
    licencePlate: 'ABA 6172',
    driver: {
      name: 'Clara Kim',
      phone: '+44 231 5705',
      image: 'https://i.pravatar.cc/150?u=clara',
    },
    status: 'Active',
  },
  {
    id: '13',
    name: 'Dodge Charger',
    year: 2022,
    color: 'Silver',
    image: '/icons/vehicle/3.png',
    category: 'Electric',
    licencePlate: 'ABA 6173',
    driver: {
      name: 'Mia Chen',
      phone: '+44 231 5623',
      image: 'https://i.pravatar.cc/150?u=mia_chen',
    },
    status: 'Suspended',
  },
  {
    id: '14',
    name: 'Honda Civic',
    year: 2023,
    color: 'Blue',
    image: '/icons/vehicle/4.png',
    category: 'Standard',
    licencePlate: 'ABA 6174',
    driver: {
      name: 'Amir Suleiman',
      phone: '+44 231 5632',
      image: 'https://i.pravatar.cc/150?u=amir',
    },
    status: 'Active',
  },
  {
    id: '15',
    name: 'Toyota Corolla',
    year: 2021,
    color: 'White',
    image: '/icons/vehicle/5.png',
    category: 'Electric',
    licencePlate: 'ABA 6175',
    driver: {
      name: 'Ravi Kumar',
      phone: '+44 231 5641',
      image: 'https://i.pravatar.cc/150?u=ravi',
    },
    status: 'Active',
  },
];
