import { Star } from 'lucide-react';

import type { Rider } from '@/types/rider.types';

interface Props {
  rider: Rider;
}

export default function RiderInfoTab({ rider }: Props) {
  return (
    <>
      <div className="flex flex-col">
        <h3 className="text-[12px] font-medium text-[#4E616A] capitalize mb-3 flex items-center gap-1">
          Rider Details
        </h3>

        <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            {rider.profilePhotoUrl || rider.avatar ? (
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0 border border-gray-200">
                <img
                  src={rider.profilePhotoUrl || rider.avatar}
                  alt={rider.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-[#14B8A6] flex items-center justify-center text-white text-xl font-bold shrink-0">
                {rider.initials ||
                  rider.name
                    ?.trim()
                    .split(/\s+/)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) ||
                  'R'}
              </div>
            )}
            <div className="flex flex-col justify-center">
              <h2 className="text-[20px] font-semibold text-[#101828] mb-1">{rider.name}</h2>
              <span className="text-[14px] font-medium text-[#1DAFA1]">{rider.riderId}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEFCE8] text-[#000000] rounded-[600px] text-[14px] font-medium border border-yellow-100/50">
              <Star className="w-[18px] h-[18px] fill-[#E9A90A] text-[#E9A90A]" />
              {Number(rider.rating || rider.avgRating || 0).toFixed(1)}
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[600px] text-[14px] font-medium border ${
                rider.status?.toLowerCase() === 'active'
                  ? 'bg-[#EAFFF2] text-[#00A63E] border-green-100/50'
                  : 'bg-[#FFF1F1] text-[#FF0707] border-red-100/50'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${rider.status?.toLowerCase() === 'active' ? 'bg-[#00A63E]' : 'bg-[#FF0707]'}`}
              ></div>
              {rider.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-5">
          <div className="flex items-start gap-4">
            <div className="mt-1  bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="/icons/rider/callIcon.svg" alt="call" className="w-[20px] h-[20px]" />
            </div>
            <div>
              <p className="text-[12px] text-[#4E616A] font-medium mb-1">Phone Number</p>
              <p className="text-[14px] font-medium text-[#101828] whitespace-nowrap">
                {rider.countryCode || ''} {rider.phone || '-'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="/icons/rider/mailIcon.svg" alt="call" className="w-[20px] h-[20px]" />
            </div>
            <div>
              <p className="text-[12px] text-[#4E616A] font-medium mb-1">Email</p>
              <p className="text-[14px] font-medium text-[#101828]">{rider.email || '-'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center ">
              <img src="/icons/rider/gender.svg" alt="call" className="w-[20px] h-[20px]" />
            </div>
            <div>
              <p className="text-[12px] text-[#4E616A] font-medium mb-1">Gender</p>
              <p className="text-[14px] font-medium text-[#101828]">{rider.gender || '-'}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="/icons/rider/dates.svg" alt="call" className="w-[20px] h-[20px]" />
            </div>
            <div>
              <p className="text-[12px] text-[#4E616A] font-medium mb-1">Joined on</p>
              <p className="text-[14px] font-medium text-[#101828]">
                {rider.joinedOn || rider.createdAt
                  ? new Date(rider.joinedOn || rider.createdAt || '').toLocaleDateString('en-CA')
                  : '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <h4 className="text-[12px] font-medium text-[#4E616A] capitalize mb-6">
            Saved Addresses
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['home', 'work', 'other'].map((label) => {
              const addr = rider.addresses?.find((a) => a.label?.toLowerCase() === label);
              const icon =
                label === 'home'
                  ? '/icons/rider/homeIcon.svg'
                  : label === 'work'
                    ? '/icons/rider/work.svg'
                    : '/icons/rider/address.svg';

              return (
                <div key={label} className="flex items-start gap-3">
                  <div className="mt-0.5 bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center shrink-0">
                    <img src={icon} alt={label} className="w-[18px] h-[20px]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#000000] mb-1 capitalize">
                      {label}
                    </p>
                    <p className="text-[12px] text-[#747C84] leading-relaxed font-medium">
                      {addr?.address || '-'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
