import React from 'react';

const notifications = [
  {
    id: 1,
    title: 'New Ride Requested',
    message: 'James Walker successfully created an account.',
    time: '2m',
    icon: '/icons/notifications/ride-req.svg'
  },
  {
    id: 2,
    title: 'Ride Completed',
    message: 'Emily Chen accepted your ride request.',
    time: '1m',
    icon: '/icons/notifications/ride-comp.svg',
  },
  {
    id: 3,
    title: 'Ride Cancelled',
    message: 'A ride has been cancelled. Check details for reason and party involved.',
    time: '30s',
    icon: '/icons/notifications/ride-cancel.svg',
  },
  {
    id: 4,
    title: 'Ride Force Ended',
    message: 'A ride was forcefully ended by an admin due to an issue.',
    time: '0m',
    icon: '/icons/notifications/ride-force-cancel.svg',
  },
  {
    id: 5,
    title: 'SOS Alert Triggered',
    message: 'A rider has triggered an emergency SOS during an active trip.',
    time: '15m',
    icon: '/icons/notifications/sos.svg',
  },
  {
    id: 6,
    title: 'New Driver Registration',
    message: 'A new driver has registered and is awaiting verification.',
    time: '1m',
    icon: '/icons/notifications/driver-reg.svg',
  },
  {
    id: 7,
    title: 'Driver Verification Submitted',
    message: 'A driver has submitted documents for verification review.',
    time: '2d',
    icon: '/icons/notifications/driver-ver.svg',
  },
  {
    id: 8,
    title: 'Driver Approved',
    message: 'A driver has been approved and is now active on the platform.',
    time: '3d',
    icon: '/icons/notifications/driver-approved.svg',
  },
  {
    id: 9,
    title: 'New Rider Signup',
    message: 'A new rider has successfully signed up on the platform.',
    time: '4d',
    icon: '/icons/notifications/rider-signup.svg',
  },
  {
    id: 10,
    title: 'New Rating Received',
    message: 'A new rating has been submitted for a completed ride.',
    time: '4d',
    icon: '/icons/notifications/new-rating.svg',
  },
  {
    id: 11,
    title: 'New Support Ticket',
    message: 'A new support request has been raised by a driver.',
    time: '4d',
    icon: '/icons/notifications/support-ticket.svg',
  },
  {
    id: 12,
    title: 'Payment Successful',
    message: 'A ride payment has been successfully processed.',
    time: '4d',
    icon: '/icons/notifications/payment-success.svg',
  },
  {
    id: 13,
    title: 'Payment Failed',
    message: 'A payment attempt has failed. Review transaction details.',
    time: '4d',
    icon: '/icons/notifications/payment-fail.svg',
  },
  {
    id: 14,
    title: ' Pricing Updated',
    message: 'Pricing logic has been updated by an admin.',
    time: '4d',
    icon: '/icons/notifications/pricing-updated.svg',
  },
];

interface NotificationDropdownProps {
  isOpen: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-[500px] h-[550px] bg-white rounded-lg shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] z-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#DFE6E5]">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[18px] font-semibold text-[#000000] font-inter">Notifications</h3>
          <button className="text-[12px] font-medium text-[#1DAFA1] cursor-pointer hover:underline">
            Mark all as Read
          </button>
        </div>
        <p className="text-[12px] font-medium text-[#4E616A] font-inter">
          Your central hub for platform-wide alerts and operational updates.
        </p>
      </div>

      {/* List */}
      <div className="max-h-[580px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {notifications.map((notif, index) => (
          <div
            key={notif.id}
            className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${index !== notifications.length - 1 ? 'border-b border-[#DFE6E5]' : ''
              }`}
          >
            <img src={notif.icon} alt={notif.title} className="w-[50px] h-[50px]" />

            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[16px] font-semibold text-[#000000] font-inter">{notif.title}</h4>
                <span className="text-[12px] font-medium text-[#4E616A] whitespace-nowrap">{notif.time}</span>
              </div>
              <p className="text-[14px] font-medium text-[#4E616A] font-inter line-clamp-2">
                {notif.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;
