import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Driver } from '../../../../data/DriverData';
import DocumentViewerModal from '../../../../components/ui/DocumentViewerModal';

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
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
                <div className="w-[40px] h-[40px] rounded-lg bg-[#F9F9F9] flex items-center justify-center shrink-0">
                    <img src="/icons/driver/DOC.svg" alt="doc" className='w-[20px] h-[20px]' />
                </div>
                <div>
                    <p className="text-[13px] font-medium text-[#101828]">{name}</p>
                    <button
                        onClick={() => onView(name, src)}
                        className="text-[12px] text-[#1DAFA1] font-medium cursor-pointer hover:underline bg-transparent border-none p-0"
                    >
                        Click to View
                    </button>
                </div>
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

                {/* Personal Information */}
                <div className="p-5 border border-[#DFE6E5]">
                    <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Personal Information</h3>

                    {/* Avatar + Name + Status */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-[64px] h-[64px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden">
                                {driver.avatar
                                    ? <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                                    : driver.initials
                                }
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="text-[18px] font-semibold text-[#101828] mb-0.5">{driver.name}</h2>
                                <span className="text-[13px] font-medium text-[#1DAFA1]">{driver.driverId}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEFCE8] text-[#000000] rounded-lg text-[13px] font-medium border border-yellow-100/50">
                                <Star className="w-[16px] h-[16px] fill-[#E9A90A] text-[#E9A90A]" />
                                {driver.rating.toFixed(1)}
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium border ${driver.status === 'Active' ? 'bg-[#EAFFF2] text-[#00A63E] border-green-100/50' : 'bg-red-50 text-[#FF0707] border-red-100/50'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${driver.status === 'Active' ? 'bg-[#00A63E]' : 'bg-[#FF0707]'}`}></div>
                                {driver.status}
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                                <img src="/icons/rider/callIcon.svg" alt="phone" className="w-[18px] h-[18px]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#4E616A] font-medium mb-0.5">Phone Number</p>
                                <p className="text-[13px] font-medium text-[#101828]">{driver.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                                <img src="/icons/rider/mailIcon.svg" alt="email" className="w-[18px] h-[18px]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#4E616A] font-medium mb-0.5">Email</p>
                                <p className="text-[13px] font-medium text-[#101828]">{driver.email || '-'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                                <img src="/icons/rider/gender.svg" alt="gender" className="w-[18px] h-[18px]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#4E616A] font-medium mb-0.5">Gender</p>
                                <p className="text-[13px] font-medium text-[#101828]">{driver.gender || '-'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                                <img src="/icons/rider/dates.svg" alt="dob" className="w-[18px] h-[18px]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#4E616A] font-medium mb-0.5">Date of Birth</p>
                                <p className="text-[13px] font-medium text-[#101828]">{driver.dateOfBirth || '-'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                                <img src="/icons/rider/dates.svg" alt="joined" className="w-[18px] h-[18px]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#4E616A] font-medium mb-0.5">Joined on</p>
                                <p className="text-[13px] font-medium text-[#101828]">{driver.joinedOn || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="p-5 border  border-[#DFE6E5]">
                    <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Address</h3>
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                            <img src="/icons/rider/address.svg" alt="address" className="w-[20px] h-[20px]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-medium text-[#101828]">{driver.address || '-'}</p>
                            {driver.postalCode && (
                                <p className="text-[12px] text-[#4E616A] font-medium mt-0.5">{driver.postalCode}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* License Information */}
                <div className="p-5 border mt-4 border-[#DFE6E5]">
                    <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">License Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: License Fields */}
                        <div className="flex flex-col gap-4">
                            {driver.license ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#4E616A] font-medium">PAN License Number</span>
                                        <span className="text-[13px] font-semibold text-[#101828]">{driver.license.panNumber}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#4E616A] font-medium">Expiry Date</span>
                                        <span className="text-[13px] font-semibold text-[#101828]">{driver.license.expiryDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#4E616A] font-medium">Issuing Authority</span>
                                        <span className="text-[13px] font-semibold text-[#101828]">{driver.license.issuingAuthority}</span>
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
                                <DocumentCard
                                    name={driver.license.documentName}
                                    onView={handleView}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Vehicle Information */}
                <div className="p-5 border mt-4 border-[#DFE6E5]">
                    <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Vehicle Fields */}
                        <div className="flex flex-col gap-4">
                            {driver.vehicle ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#4E616A] font-medium">Registration Number</span>
                                        <span className="text-[13px] font-semibold text-[#101828]">{driver.vehicle.registrationNumber}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#4E616A] font-medium">Make</span>
                                        <span className="text-[13px] font-semibold text-[#101828]">{driver.vehicle.make}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#4E616A] font-medium">Model</span>
                                        <span className="text-[13px] font-semibold text-[#101828]">{driver.vehicle.model}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#4E616A] font-medium">Year</span>
                                        <span className="text-[13px] font-semibold text-[#101828]">{driver.vehicle.year}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#4E616A] font-medium">Color</span>
                                        <span className="text-[13px] font-semibold text-[#101828]">{driver.vehicle.color}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#4E616A] font-medium">Vehicle Type</span>
                                        <span className="text-[13px] font-semibold text-[#101828]">{driver.vehicle.vehicleType}</span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-[13px] text-[#4E616A]">No vehicle information available.</p>
                            )}
                        </div>

                        {/* Right: Insurance & MOT Documents */}
                        <div className="flex flex-col gap-5">
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

                {/* Legal Agreements */}
                <div className="p-5">
                    <h3 className="text-[12px] font-medium text-[#4E616A] mb-4">Legal Agreements</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between border border-[#DFE6E5] rounded-lg px-4 py-3">
                            <span className="text-[13px] font-medium text-[#101828]">Terms of Service</span>
                            {driver.legalAgreements?.termsOfService ? (
                                <span className="text-[12px] font-semibold text-[#00A63E] bg-[#EAFFF2] px-3 py-1 rounded-lg">Agreed</span>
                            ) : (
                                <span className="text-[12px] font-semibold text-[#FF0707] bg-red-50 px-3 py-1 rounded-lg">Not Agreed</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between border border-[#DFE6E5] rounded-lg px-4 py-3">
                            <span className="text-[13px] font-medium text-[#101828]">Privacy Policy</span>
                            {driver.legalAgreements?.privacyPolicy ? (
                                <span className="text-[12px] font-semibold text-[#00A63E] bg-[#EAFFF2] px-3 py-1 rounded-lg">Agreed</span>
                            ) : (
                                <span className="text-[12px] font-semibold text-[#FF0707] bg-red-50 px-3 py-1 rounded-lg">Not Agreed</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between border border-[#DFE6E5] rounded-lg px-4 py-3">
                            <span className="text-[13px] font-medium text-[#101828]">Data Processing Consent</span>
                            {driver.legalAgreements?.dataProcessingConsent ? (
                                <span className="text-[12px] font-semibold text-[#00A63E] bg-[#EAFFF2] px-3 py-1 rounded-lg">Agreed</span>
                            ) : (
                                <span className="text-[12px] font-semibold text-[#FF0707] bg-red-50 px-3 py-1 rounded-lg">Not Agreed</span>
                            )}
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
