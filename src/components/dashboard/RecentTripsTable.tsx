const dummyTrips = [
  {
    id: "ZPT-2845148",
    rider: { name: "Mia Chen", phone: "+44 231 5623", initials: "MC", },
    driver: { name: "Jasmine Lee", phone: "+44 987 6543", img: "https://i.pravatar.cc/150?img=1" },
    route: { from: "Uptown", to: "Station" },
    amount: "£12.50",
    status: "In Progress",
    time: "2min ago"
  },
  {
    id: "ZPT-2845149",
    rider: { name: "Amir Suleiman", phone: "+44 231 5632", initials: "AS", },
    driver: { name: "David Thompson", phone: "+44 564 7381", img: "https://i.pravatar.cc/150?img=11" },
    route: { from: "Midtown", to: "Mall" },
    amount: "£22.00",
    status: "In Progress",
    time: "3min ago"
  },
  {
    id: "ZPT-2845150",
    rider: { name: "Ravi Kumar", phone: "+44 231 5641", initials: "RK", },
    driver: { name: "Aisha Patel", phone: "+44 123 4567", img: "https://i.pravatar.cc/150?img=5" },
    route: { from: "Seaside", to: "Resort" },
    amount: "£18.00",
    status: "Completed",
    time: "4min ago"
  },
  {
    id: "ZPT-2845151",
    rider: { name: "Lara Brown", phone: "+44 231 5650", initials: "LB", },
    driver: { name: "Oliver Smith", phone: "+44 246 6103", img: "https://i.pravatar.cc/150?img=8" },
    route: { from: "Lakeside", to: "Park" },
    amount: "£30.00",
    status: "Cancelled",
    time: "5min ago"
  },
  {
    id: "ZPT-2845152",
    rider: { name: "Tommy Nguyen", phone: "+44 231 5669", initials: "TN", },
    driver: { name: "Sophie Wright", phone: "+44 753 1594", img: "https://i.pravatar.cc/150?img=9" },
    route: { from: "Hilltop", to: "Observatory" },
    amount: "£21.50",
    status: "In Progress",
    time: "6min ago"
  },
  {
    id: "ZPT-2845153",
    rider: { name: "Nina Davis", phone: "+44 231 5678", initials: "ND", },
    driver: { name: "Liam Johnson", phone: "+44 321 9876", img: "https://i.pravatar.cc/150?img=12" },
    route: { from: "Riverside", to: "Cafe" },
    amount: "£16.00",
    status: "In Progress",
    time: "7min ago"
  }
];

export default function RecentTripsTable() {
  return (
    <div className="bg-white rounded-lg border border-[#DFE6E5] col-span-1 lg:col-span-2 xl:col-span-4 overflow-hidden mt-6">
      <div className="p-5 lg:p-6 border-b border-gray-100">
        <h3 className="text-[20px] font-semibold text-[#000000]">Recent Trips</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left  whitespace-nowrap">
          <thead className="bg-white font-medium  text-[#4E616A] uppercase text-[14px]">
            <tr>
              <th className="px-6 py-4">TRIP ID <span className="ml-1 inline-block">↕</span></th>
              <th className="px-6 py-4">RIDER <span className="ml-1 inline-block">↕</span></th>
              <th className="px-6 py-4">DRIVER <span className="ml-1 inline-block">↕</span></th>
              <th className="px-6 py-4">ROUTE <span className="ml-1 inline-block">↕</span></th>
              <th className="px-6 py-4">AMOUNT <span className="ml-1 inline-block">↕</span></th>
              <th className="px-6 py-4">STATUS <span className="ml-1 inline-block">↕</span></th>
              <th className="px-6 py-4">TIME <span className="ml-1 inline-block">↕</span></th>
              <th className="px-6 py-4">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dummyTrips.map((trip) => (
              <tr key={trip.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-[14px] font-medium text-[#14B8A6]">{trip.id}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-[14px] bg-[#1DAFA1]`}>
                      {trip.rider.initials}
                    </div>
                    <div>
                      <p className="font-medium text-[14px] text-[#1DAFA1]">{trip.rider.name}</p>
                      <p className="text-[12px] font-medium text-[#4E616A]">{trip.rider.phone}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={trip.driver.img} alt={trip.driver.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-gray-900">{trip.driver.name}</p>
                      <p className="text-xs text-gray-500">{trip.driver.phone}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {trip.route.from} <span className="text-gray-400 mx-1">→</span> {trip.route.to}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">{trip.amount}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${trip.status === 'Completed' ? 'bg-green-500' :
                      trip.status === 'Cancelled' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`} />
                    <span className={`text-xs font-semibold ${trip.status === 'Completed' ? 'text-green-600' :
                      trip.status === 'Cancelled' ? 'text-red-600' :
                        'text-orange-600'
                      }`}>
                      {trip.status}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-500">{trip.time}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <img src="/icons/trips/view.svg" alt="view" />
                    <img src="/icons/trips/cancel.svg" alt="cancel" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
