import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import DataTable from '@/components/ui/DataTable';
import type { Column } from '@/components/ui/DataTable';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationRecord, TargetAudience } from '@/types/notification.types';

const audienceOptions: { label: string; value: TargetAudience }[] = [
  { label: 'Riders', value: 'riders' },
  { label: 'Drivers', value: 'drivers' },
  { label: 'All', value: 'all' },
];

const audienceBadgeColors: Record<TargetAudience, string> = {
  riders: 'bg-blue-100 text-blue-700',
  drivers: 'bg-orange-100 text-orange-700',
  all: 'bg-teal-100 text-teal-700',
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const columns: Column<NotificationRecord>[] = [
  {
    key: 'title',
    label: 'Title',
    render: (row) => (
      <span className="text-[14px] font-medium text-[#101828]">{row.title}</span>
    ),
  },
  {
    key: 'body',
    label: 'Message',
    render: (row) => (
      <span className="text-[14px] text-[#4E616A] max-w-[200px] truncate block">
        {row.body}
      </span>
    ),
  },
  {
    key: 'targetAudience',
    label: 'Audience',
    render: (row) => (
      <span
        className={`inline-block px-2.5 py-1 rounded-full text-[12px] font-medium capitalize ${audienceBadgeColors[row.targetAudience]}`}
      >
        {row.targetAudience}
      </span>
    ),
  },
  {
    key: 'sentBy',
    label: 'Sent By',
    render: (row) => (
      <span className="text-[14px] text-[#4E616A]">{row.sentBy?.name || '-'}</span>
    ),
  },
  {
    key: 'totalSent',
    label: 'Delivered',
    render: (row) => (
      <span className="text-[14px] font-medium text-green-600">{row.totalSent}</span>
    ),
  },
  {
    key: 'totalFailed',
    label: 'Failed',
    render: (row) => (
      <span className="text-[14px] font-medium text-red-500">{row.totalFailed}</span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Sent At',
    render: (row) => (
      <span className="text-[14px] text-[#4E616A]">{formatDate(row.createdAt)}</span>
    ),
  },
];

const PushNotificationsPage = () => {
  const {
    notifications,
    page,
    totalPages,
    isLoading,
    isSending,
    getNotifications,
    sendNotification,
  } = useNotifications();

  const [targetAudience, setTargetAudience] = useState<TargetAudience | ''>('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<{ targetAudience?: string; title?: string; body?: string }>(
    {},
  );

  useEffect(() => {
    getNotifications(1);
  }, [getNotifications]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!targetAudience) newErrors.targetAudience = 'Please select a target audience';
    if (!title.trim()) newErrors.title = 'Notification title is required';
    else if (title.length > 200) newErrors.title = 'Title must be 200 characters or less';
    if (!body.trim()) newErrors.body = 'Message is required';
    else if (body.length > 1000) newErrors.body = 'Message must be 1000 characters or less';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await sendNotification({
      title: title.trim(),
      body: body.trim(),
      targetAudience: targetAudience as TargetAudience,
    });

    if (success) {
      setTargetAudience('');
      setTitle('');
      setBody('');
      setErrors({});
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Send Custom Notification Card */}
      <div className="flex justify-center">
        <div className="w-[641px] border border-[#DFE6E5] bg-white rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 w-[40px] h-[40px] bg-[#F9F9F9] rounded-sm">
              <img src="/icons/settings/send.svg" alt="send" className="w-[22px] h-[22px]" />
            </div>
            <h2 className="text-[20px] font-inter font-semibold text-[#101828]">
              Send Custom Notification
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 font-inter">
            {/* Target Audience */}
            <div>
              <label className="block text-[14px] font-medium text-[#000000] mb-2">
                Target Audience
              </label>
              <div className="relative">
                <select
                  value={targetAudience}
                  onChange={(e) => {
                    setTargetAudience(e.target.value as TargetAudience | '');
                    if (errors.targetAudience) setErrors((prev) => ({ ...prev, targetAudience: undefined }));
                  }}
                  className={`w-full appearance-none bg-white cursor-pointer border rounded-md px-4 py-3 pr-10 text-[#000000] text-[14px] font-medium outline-none transition-colors ${
                    errors.targetAudience ? 'border-red-500' : 'border-[#DFE6E5] focus:border-[#1DAFA1]'
                  }`}
                >
                  <option value="">Select Audience</option>
                  {audienceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-[#000000]" />
                </div>
              </div>
              {errors.targetAudience && (
                <p className="mt-1 text-[12px] text-red-500">{errors.targetAudience}</p>
              )}
            </div>

            {/* Notification Title */}
            <div>
              <label className="block text-[14px] font-medium text-[#000000] mb-2">
                Notification Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Enter notification title"
                maxLength={200}
                className={`w-full bg-white border rounded-md px-4 py-3 text-[#000000] text-[14px] font-medium outline-none transition-colors placeholder:text-[#0A0A0A80] ${
                  errors.title ? 'border-red-500' : 'border-[#DFE6E5] focus:border-[#1DAFA1]'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-[12px] text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-[14px] font-medium text-[#000000] mb-2">Message</label>
              <textarea
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (errors.body) setErrors((prev) => ({ ...prev, body: undefined }));
                }}
                placeholder="Enter notification message"
                rows={5}
                maxLength={1000}
                className={`w-full bg-white border rounded-md px-4 py-3 text-[#000000] text-[14px] font-medium outline-none transition-colors placeholder:text-[#0A0A0A80] resize-none ${
                  errors.body ? 'border-red-500' : 'border-[#DFE6E5] focus:border-[#1DAFA1]'
                }`}
              />
              {errors.body && (
                <p className="mt-1 text-[12px] text-red-500">{errors.body}</p>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-[#1DAFA1] cursor-pointer font-inter text-white font-semibold py-4 rounded-md text-[14px] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Notifications'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white border border-[#DFE6E5] rounded-lg">
        <div className="px-6 py-4 border-b border-[#DFE6E5]">
          <h2 className="text-[18px] font-inter font-semibold text-[#101828]">
            Notification History
          </h2>
        </div>
        <DataTable<NotificationRecord>
          columns={columns}
          data={notifications}
          rowKey={(row) => row._id}
          loading={isLoading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => getNotifications(p)}
          emptyText="No notifications sent yet"
          minHeight="300px"
        />
      </div>
    </div>
  );
};

export default PushNotificationsPage;
