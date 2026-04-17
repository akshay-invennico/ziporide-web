import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAdminNotifications } from '@/context/useAdminNotifications';
import { routes } from '@/routes/routes';
import type { AdminNotification } from '@/types/notification.types';

const ICON_BY_TYPE: Record<string, string> = {
  new_ride_requested: '/icons/notifications/ride-req.svg',
  ride_completed: '/icons/notifications/ride-comp.svg',
  ride_cancelled: '/icons/notifications/ride-cancel.svg',
  ride_force_ended: '/icons/notifications/ride-force-cancel.svg',
  new_driver_registration: '/icons/notifications/driver-reg.svg',
  driver_verification_submitted: '/icons/notifications/driver-ver.svg',
  driver_approved: '/icons/notifications/driver-approved.svg',
  new_rider_signup: '/icons/notifications/rider-signup.svg',
  new_rating_received: '/icons/notifications/new-rating.svg',
  new_support_ticket: '/icons/notifications/support-ticket.svg',
  payment_successful: '/icons/notifications/payment-success.svg',
  payment_failed: '/icons/notifications/payment-fail.svg',
  pricing_updated: '/icons/notifications/pricing-updated.svg',
};

const DEFAULT_ICON = '/icons/notifications/ride-req.svg';

const getRelativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0) return 'now';
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.floor(days / 365)}y`;
};

const getNavigationTarget = (n: AdminNotification): string | null => {
  const m = n.metadata || {};
  switch (n.type) {
    case 'new_ride_requested':
    case 'ride_completed':
    case 'ride_cancelled':
    case 'ride_force_ended':
    case 'payment_successful':
    case 'new_rating_received':
      return routes.TRIPS;
    case 'new_driver_registration':
    case 'driver_approved':
      return m.driverId ? routes.DRIVER_DETAILS.replace(':id', String(m.driverId)) : routes.DRIVER;
    case 'driver_verification_submitted':
      return m.driverId
        ? routes.VERIFICATION_DETAILS.replace(':id', String(m.driverId))
        : routes.VERIFICATION;
    case 'new_rider_signup':
      return m.riderId ? routes.RIDER_DETAILS.replace(':id', String(m.riderId)) : routes.RIDER;
    case 'new_support_ticket':
      return routes.SUPPORT;
    case 'payment_failed':
      return routes.TRANSACTIONS;
    case 'pricing_updated':
      return routes.PRICING_LOGIC;
    default:
      return null;
  }
};

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { notifications, isLoading, markAsRead, markAllAsRead, clearAll } = useAdminNotifications();

  if (!isOpen) return null;

  const handleClick = async (n: AdminNotification) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }
    const target = getNavigationTarget(n);
    onClose();
    if (target) {
      navigate(target);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[500px] h-[550px] bg-white rounded-lg shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] z-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#DFE6E5]">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[18px] font-semibold text-[#000000] font-inter">Notifications</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              disabled={notifications.every((n) => n.isRead)}
              className="text-[12px] font-medium text-[#1DAFA1] cursor-pointer hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mark all as Read
            </button>
            <button
              onClick={clearAll}
              disabled={notifications.length === 0}
              className="text-[12px] font-medium text-[#FF5A5A] cursor-pointer hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Clear all
            </button>
          </div>
        </div>
        <p className="text-[12px] font-medium text-[#4E616A] font-inter">
          Your central hub for platform-wide alerts and operational updates.
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isLoading && notifications.length === 0 ? (
          <div className="p-6 text-center text-[14px] text-[#4E616A]">Loading…</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 h-[450px] flex items-center justify-center text-center text-[14px] text-[#4E616A]">
            You're all caught up. No notifications right now.
          </div>
        ) : (
          notifications.map((notif, index) => (
            <div
              key={notif.id}
              onClick={() => handleClick(notif)}
              className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                index !== notifications.length - 1 ? 'border-b border-[#DFE6E5]' : ''
              } ${!notif.isRead ? 'bg-[#F5FEFD]' : ''}`}
            >
              <img
                src={ICON_BY_TYPE[notif.type] || DEFAULT_ICON}
                alt={notif.title}
                className="w-[50px] h-[50px]"
              />

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-[16px] font-semibold text-[#000000] font-inter flex items-center gap-2">
                    {notif.title}
                    {!notif.isRead && (
                      <span className="w-[8px] h-[8px] rounded-full bg-[#1DAFA1] inline-block" />
                    )}
                  </h4>
                  <span className="text-[12px] font-medium text-[#4E616A] whitespace-nowrap">
                    {getRelativeTime(notif.createdAt)}
                  </span>
                </div>
                <p className="text-[14px] font-medium text-[#4E616A] font-inter line-clamp-2">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
