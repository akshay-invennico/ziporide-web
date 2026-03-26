import { Star } from 'lucide-react';
import { useState } from 'react';

import DocumentViewerModal from '../../../../components/ui/DocumentViewerModal';
import type { Driver } from '../../../../data/DriverData';

interface Props {
  driver: Driver;
}

interface DocumentCardProps {
  name: string;
  src?: string;
  onView: (name: string, src?: string) => void;
}

function DocumentCard({ name, src, onView }: DocumentCardProps) {
  return (
    <div className="flex items-center justify-between border-2 w-[353px] h-[92px] border-dashed border-[#DFE6E5] rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="w-[60px] h-[60px] rounded-lg bg-[#F9F9F9] flex items-center justify-center shrink-0">
          <img src="/icons/driver/DOC.svg" alt="doc" className="w-[32px] h-[32px]" />
        </div>
        <div>
          <p className="text-[14px] font-medium text-[#000000]">{name}</p>
          <button
            onClick={() => onView(name, src)}
            className="text-[12px] text-[#1DAFA1] font-semibold cursor-pointer hover:underline bg-transparent border-none p-0 mt-0.5"
          >
            Click to View
          </button>
        </div>
      </div>
      <div>
        <img src="/icons/rider/vector.svg" alt="arrow" className="w-[20px] h-[20px] cursor-pointer" />
      </div>
    </div>
  );
}


export default function DriverInfoTab({ driver }: Props) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<{ name: string; src?: string }>({ name: '' });

  const handleView = (name: string, src?: string) => {
    setViewerDoc({ name, src });
    setViewerOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-0">
        {/* Personal Information & Address Container */}
        <div className="border border-[#DFE6E5] rounded-lg overflow-hidden mb-4">
          {/* Personal Information */}
          <div className="p-5">
            <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Personal Information</h3>

            {/* Avatar + Name + Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-[64px] h-[64px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden">
                  {driver.avatar ? (
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    driver.initials
                  )}
                </div>
                <div className="flex flex-col justify-center gap-0.5">
                  <h2 className="text-[20px] font-semibold text-[#101828]">{driver.name}</h2>
                  <span className="text-[14px] font-medium text-[#1DAFA1]">{driver.driverId}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEFCE8] text-[#000000] rounded-[600px] text-[14px] font-medium">
                  <Star className="w-[14px] h-[14px] fill-[#E9A90A] text-[#E9A90A]" />
                  {driver.rating.toFixed(1)}
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[600px] text-[14px] font-medium ${driver.status === 'Active' ? 'bg-[#EAFFF2] text-[#00A63E]' : 'bg-red-50 text-[#FF0707]'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${driver.status === 'Active' ? 'bg-[#00A63E]' : 'bg-[#FF0707]'}`}
                  ></div>
                  {driver.status}
                </div>
              </div>
            </div>

            {/* Contact Info Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0  bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                  <img src="/icons/rider/callIcon.svg" alt="phone" className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <p className="text-[12px] text-[#4E616A] font-medium mb-0.5">Phone Number</p>
                  <p className="text-[14px] font-semibold text-[#101828]">{driver.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                  <img src="/icons/rider/mailIcon.svg" alt="email" className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <p className="text-[12px] text-[#4E616A] font-medium mb-0.5">Email</p>
                  <p className="text-[14px] font-semibold text-[#101828]">{driver.email || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                  <img src="/icons/rider/gender.svg" alt="gender" className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <p className="text-[12px] text-[#4E616A] font-medium mb-0.5">Gender</p>
                  <p className="text-[14px] font-semibold text-[#101828]">{driver.gender || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                  <img src="/icons/rider/dates.svg" alt="dob" className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <p className="text-[12px] text-[#4E616A] font-medium mb-0.5">Date of Birth</p>
                  <p className="text-[14px] font-semibold text-[#101828]">
                    {driver.dateOfBirth || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                  <img src="/icons/rider/dates.svg" alt="joined" className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <p className="text-[12px] text-[#4E616A] font-medium mb-0.5">Joined on</p>
                  <p className="text-[14px] font-semibold text-[#101828]">{driver.joinedOn || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="p-5 ">
            <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Address</h3>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0 bg-[#F9F9F9] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                <img src="/icons/rider/address.svg" alt="address" className="w-[20px] h-[20px]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#000000]">{driver.address || '-'}</p>
                {driver.postalCode && (
                  <p className="text-[12px] text-[#747C84] font-medium mt-0.5">{driver.postalCode}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* License Information */}
        <div className="border border-[#DFE6E5] rounded-lg overflow-hidden mb-4">
          <div className="p-5">
            <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">License Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
              {/* Left: License Fields */}
              <div className="flex flex-col gap-4">
                {driver.license ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#4E616A] font-medium">
                        PAN License Number
                      </span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {driver.license.panNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#4E616A] font-medium">Expiry Date</span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {driver.license.expiryDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#4E616A] font-medium">
                        Issuing Authority
                      </span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {driver.license.issuingAuthority}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-[13px] text-[#4E616A]">No license information available.</p>
                )}
              </div>

              {/* Right: License Document */}
              <div className="flex flex-col gap-2">
                <p className="text-[12px] font-medium text-[#4E616A] mb-1">License Document</p>
                {driver.license && (
                  <DocumentCard name={driver.license.documentName} onView={handleView} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="border border-[#DFE6E5] rounded-lg overflow-hidden mb-4">
          <div className="p-5">
            <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
              {/* Left: Vehicle Fields */}
              <div className="flex flex-col gap-4">
                {driver.vehicle ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#4E616A] font-medium">
                        Registration Number
                      </span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {driver.vehicle.registrationNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#4E616A] font-medium">Make</span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {driver.vehicle.make}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#4E616A] font-medium">Model</span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {driver.vehicle.model}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#4E616A] font-medium">Year</span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {driver.vehicle.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#4E616A] font-medium">Color</span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {driver.vehicle.color}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#4E616A] font-medium">Vehicle Type</span>
                      <span className="text-[14px] font-medium text-[#000000]">
                        {driver.vehicle.vehicleType}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-[13px] text-[#4E616A]">No vehicle information available.</p>
                )}
              </div>

              {/* Right: Insurance & MOT Documents */}
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-[12px] font-medium text-[#4E616A] mb-2">Insurance Certificate</p>
                  <DocumentCard name="Insurance Certificate" onView={handleView} />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-[#4E616A] mb-2">MOT Certificate</p>
                  <DocumentCard name="MOT Certificate" onView={handleView} />
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Legal Agreements */}
        <div className="border border-[#DFE6E5] rounded-xl overflow-hidden mb-4">
          <div className="p-5">
            <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Legal Agreements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between border border-[#DFE6E5] rounded-lg px-4 py-3 bg-white">
                <span className="text-[14px] font-medium text-[#4E616A]">Terms of Service</span>
                {driver.legalAgreements?.termsOfService ? (
                  <span className="text-[12px] font-medium text-[#00A63E] bg-[#EAFFF2] px-3 py-1 rounded-[500px]">
                    Agreed
                  </span>
                ) : (
                  <span className="text-[12px] font-medium text-[#FF0707] bg-red-50 px-3 py-1 rounded-[500px]">
                    Not Agreed
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border border-[#DFE6E5] rounded-lg px-4 py-3 bg-white">
                <span className="text-[14px] font-medium text-[#4E616A]">Privacy Policy</span>
                {driver.legalAgreements?.privacyPolicy ? (
                  <span className="text-[11px] font-medium text-[#00A63E] bg-[#EAFFF2] px-3 py-1 rounded-[500px]">
                    Agreed
                  </span>
                ) : (
                  <span className="text-[12px] font-medium text-[#FF0707] bg-red-50 px-3 py-1 rounded-[500px]">
                    Not Agreed
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border border-[#DFE6E5] rounded-lg px-4 py-3 bg-white">
                <span className="text-[14px] font-medium text-[#4E616A]">
                  Data Processing Consent
                </span>
                {driver.legalAgreements?.dataProcessingConsent ? (
                  <span className="text-[12px] font-medium text-[#00A63E] bg-[#EAFFF2] px-3 py-1 rounded-[500px]">
                    Agreed
                  </span>
                ) : (
                  <span className="text-[12px] font-medium text-[#FF0707] bg-red-50 px-3 py-1 rounded-[500px]">
                    Not Agreed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        documentName={viewerDoc.name}
        documentSrc={viewerDoc.src}
      />
    </>
  );
}
