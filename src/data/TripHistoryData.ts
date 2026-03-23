export type TripStatus = "Assigned" | "In Progress" | "Completed" | "Cancelled";

export interface TripRecord {
  id: string;
  rider: {
    name: string;
    phone: string;
    avatar: string; // initials or image url
  };
  driver: {
    name: string;
    phone: string;
    avatar: string; // image url or initials
  };
  route: {
    from: string;
    to: string;
  };
  amount: number;
  date: string;
  time: string;
  status: TripStatus;
}

export const tripHistoryData: TripRecord[] = [
  {
    id: "ZPT-2845148",
    rider: { name: "Mia Chen", phone: "+44 231 5623", avatar: "MC" },
    driver: { name: "Mia Chen", phone: "+44 231 5623", avatar: "/icons/driver/avatar1.png" },
    route: { from: "Uptown", to: "Station" },
    amount: 12.50,
    date: "2026-03-20",
    time: "02:59",
    status: "Assigned",
  },
  {
    id: "ZPT-2845149",
    rider: { name: "Amir Suleiman", phone: "+44 231 5632", avatar: "AS" },
    driver: { name: "Amir Suleiman", phone: "+44 231 5632", avatar: "/icons/driver/avatar2.png" },
    route: { from: "Midtown", to: "Mall" },
    amount: 22.00,
    date: "2026-03-20",
    time: "02:59",
    status: "Assigned",
  },
  {
    id: "ZPT-2845150",
    rider: { name: "Ravi Kumar", phone: "+44 231 5841", avatar: "RK" },
    driver: { name: "Ravi Kumar", phone: "+44 231 5841", avatar: "/icons/driver/avatar3.png" },
    route: { from: "Seaside", to: "Resort" },
    amount: 18.00,
    date: "2026-03-21",
    time: "03:15",
    status: "In Progress",
  },
  {
    id: "ZPT-2845151",
    rider: { name: "Lara Brown", phone: "+44 231 5650", avatar: "LB" },
    driver: { name: "Lara Brown", phone: "+44 231 5650", avatar: "/icons/driver/avatar4.png" },
    route: { from: "Lakeside", to: "Park" },
    amount: 30.00,
    date: "2026-03-22",
    time: "04:01",
    status: "Completed",
  },
  {
    id: "ZPT-2845152",
    rider: { name: "Tommy Nguyen", phone: "+44 231 5669", avatar: "TN" },
    driver: { name: "Amir Suleiman", phone: "+44 231 5632", avatar: "/icons/driver/avatar2.png" },
    route: { from: "Hilltop", to: "Observatory" },
    amount: 21.50,
    date: "2026-03-23",
    time: "05:45",
    status: "Cancelled",
  },
  {
    id: "ZPT-2845153",
    rider: { name: "Nina Davis", phone: "+44 231 5678", avatar: "ND" },
    driver: { name: "Ravi Kumar", phone: "+44 231 5841", avatar: "/icons/driver/avatar3.png" },
    route: { from: "Riverside", to: "Cafe" },
    amount: 16.00,
    date: "2026-03-24",
    time: "06:30",
    status: "In Progress",
  },
  {
    id: "ZPT-2845154",
    rider: { name: "Sophia Smith", phone: "+44 231 5687", avatar: "SS" },
    driver: { name: "Lara Brown", phone: "+44 231 5650", avatar: "/icons/driver/avatar4.png" },
    route: { from: "Forestview", to: "Lodge" },
    amount: 28.50,
    date: "2026-03-25",
    time: "07:10",
    status: "Completed",
  },
  {
    id: "ZPT-2845155",
    rider: { name: "David Patel", phone: "+44 231 5696", avatar: "DP" },
    driver: { name: "Tommy Nguyen", phone: "+44 231 5669", avatar: "/icons/driver/avatar5.png" },
    route: { from: "Suburban", to: "Plaza" },
    amount: 24.00,
    date: "2026-03-26",
    time: "08:00",
    status: "Completed",
  },
  {
    id: "ZPT-2845156",
    rider: { name: "Nina Davis", phone: "+44 231 5678", avatar: "ND" },
    driver: { name: "Nina Davis", phone: "+44 231 5678", avatar: "/icons/driver/avatar6.png" },
    route: { from: "Industrial", to: "Complex" },
    amount: 19.00,
    date: "2026-03-27",
    time: "09:15",
    status: "In Progress",
  },
  {
    id: "ZPT-2845151",
    rider: { name: "Sophia Smith", phone: "+44 231 5687", avatar: "SS" },
    driver: { name: "Sophia Smith", phone: "+44 231 5687", avatar: "/icons/driver/avatar7.png" },
    route: { from: "Uptown", to: "Station" },
    amount: 12.50,
    date: "2026-03-28",
    time: "10:20",
    status: "Completed",
  },
  {
    id: "ZPT-2845152",
    rider: { name: "David Patel", phone: "+44 231 5696", avatar: "DP" },
    driver: { name: "David Patel", phone: "+44 231 5696", avatar: "/icons/driver/avatar8.png" },
    route: { from: "Midtown", to: "Mall" },
    amount: 22.00,
    date: "2026-03-29",
    time: "11:05",
    status: "Completed",
  },
  {
    id: "ZPT-2845153",
    rider: { name: "Clara Kim", phone: "+44 231 5705", avatar: "CK" },
    driver: { name: "Clara Kim", phone: "+44 231 5705", avatar: "/icons/driver/avatar9.png" },
    route: { from: "Seaside", to: "Resort" },
    amount: 18.00,
    date: "2026-03-30",
    time: "12:00",
    status: "In Progress",
  },
];

export const TRIP_ITEMS_PER_PAGE = 12;
export const TRIP_TOTAL_PAGES = 99;
