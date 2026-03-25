import { CheckCircle2, XCircle, X, Check, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import DocumentViewModal from '../../components/ui/DocumentViewModal';
import RejectDocumentModal from '../../components/ui/RejectDocumentModal';
import RejectVerificationModal from '../../components/ui/RejectVerificationModal';
import { verificationRequestsData } from '../../data/VerificationData';

const ApplicationDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocumentName, setCurrentDocumentName] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingDocument, setRejectingDocument] = useState('');
  const [isRejectVerificationModalOpen, setIsRejectVerificationModalOpen] = useState(false);

  const request = verificationRequestsData.find((r) => r.id === id) || {
    id: '0',
    driverName: 'Mike Smith',
    driverId: 'DRVR-2001',
    phone: '+44 1321 65456',
    email: 'mike.smith@email.com',
    gender: 'Male',
    dob: '1990-01-01',
    appliedOn: '2023-05-12',
    status: 'Pending',
    avatar: 'MS',
    address: '123 Main ST. Anytown, USA',
    licenceNumber: 'ASAN9011278KA2WX',
    licenceExpiry: '2028-11-26',
    issuingAuthority: 'DVLA Lincoln',
    vehicle: {
      registrationNumber: 'LN22 EFG',
      make: 'Ford',
      model: 'Mustang',
      year: 2022,
      color: 'Grabber Blue',
      vehicleType: 'Executive',
    },
  };

  const isApproved = request.status === 'Approved';
  const isRejected = request.status === 'Rejected';
  const isPending = !isApproved && !isRejected;

  const handleOpenDocument = (docName: string) => {
    setCurrentDocumentName(docName);
    setIsModalOpen(true);
  };

  const handleOpenRejectModal = (docName: string) => {
    setRejectingDocument(docName);
    setIsRejectModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen p-1 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#4E616A] cursor-pointer  w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[14px] font-medium">Back</span>
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg p-4 border border-[#DFE6E5] flex flex-col gap-3 h-[328px]">
        <div className="text-[12px] font-medium text-[#4E616A]">Personal Information</div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-[72px] h-[72px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white text-lg font-bold shrink-0 overflow-hidden">
              {request.avatar.length <= 2 ? (
                <span>{request.avatar}</span>
              ) : (
                <img
                  src={request.avatar}
                  alt={request.driverName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-semibold text-[#101828]">{request.driverName}</span>
              <span className="text-[14px] font-medium text-[#1DAFA1]">{request.driverId}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {isRejected && (
              <div className="bg-[#F9F9F9] px-3 py-1.5 rounded-[600px] flex items-center gap-2">
                <img src="/icons/verification/info.svg" alt="info" className="w-[15px] h-[15px]" />
                <span className="text-[14px] font-medium text-[#4E616A]">
                  Vehicle information is incorrect or incomplete
                </span>
              </div>
            )}

            {isRejected && (
              <div className="px-4 py-1.5 rounded-[500px] flex items-center gap-2 bg-[#FFF6F6]  text-[#FF0707]">
                <div className="w-[5px] h-[5px] rounded-full bg-[#FF0707]"></div>
                <span className="text-[14px] font-medium">Rejected</span>
              </div>
            )}

            {isApproved && (
              <div className="px-5 py-2 rounded-full flex items-center gap-2 bg-[#EAFFF2]  text-[#00A63E]">
                <div className="w-[5px] h-[5px] rounded-[500px] bg-[#00A63E]"></div>
                <span className="text-[14px] font-medium">Approved</span>
              </div>
            )}

            {isPending && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRejectVerificationModalOpen(true)}
                  className="flex cursor-pointer items-center gap-1 px-6 py-2 rounded-[500px] bg-[#FFF6F6]   text-[#FF0707] font-medium text-[14px] "
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
                <button className="flex items-center gap-1 px-6 py-2 rounded-[500px] bg-[#EAFFF2]  text-[#00A63E] font-medium text-[14px] ">
                  <CheckCircle2 className="w-5 h-5" />
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 p-3">
          <div className="flex gap-3">
            <div className="mt-0.5 bg-[#F9F9F9] w-[41px] h-[41px] rounded-full flex items-center justify-center">
              <img
                src="/icons/verification/callIcon.svg"
                alt="phone"
                className="w-[20px] h-[20px] "
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#4E616A] font-medium">Phone Number</span>
              <span className="text-[14px] font-medium text-[#101828]">{request.phone}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5 bg-[#F9F9F9] w-[41px] h-[41px] rounded-full flex items-center justify-center">
              <img
                src="/icons/verification/mailIcon.svg"
                alt="email"
                className="w-[20px] h-[20px] "
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#4E616A] font-medium">Email</span>
              <span className="text-[14px] font-medium text-[#101828]">{request.email}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5 bg-[#F9F9F9] w-[41px] h-[41px] rounded-full flex items-center justify-center">
              <img
                src="/icons/verification/gender.svg"
                alt="gender"
                className="w-[20px] h-[20px] "
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#4E616A] font-medium">Gender</span>
              <span className="text-[14px] font-medium text-[#101828]">{request.gender}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5 bg-[#F9F9F9] w-[41px] h-[41px] rounded-full flex items-center justify-center">
              <img src="/icons/verification/cale.svg" alt="dob" className="w-[20px] h-[20px] " />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#4E616A] font-medium">Date of Birth</span>
              <span className="text-[14px] font-medium text-[#101828]">{request.dob}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5 bg-[#F9F9F9] w-[41px] h-[41px] rounded-full flex items-center justify-center">
              <img src="/icons/verification/cale.svg" alt="joined" className="w-[20px] h-[20px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#4E616A] font-medium">Joined on</span>
              <span className="text-[14px] font-medium text-[#101828]">{request.appliedOn}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-3 gap-2">
          <span className="text-[12px] text-[#4E616A] font-medium">Address</span>
          <div className="flex gap-3 items-center">
            <div className="mt-0.5 bg-[#F9F9F9] w-[41px] h-[41px] rounded-full flex items-center justify-center">
              <img
                src="/icons/verification/location.svg"
                alt="location"
                className="w-[20px] h-[20px]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#000000]">{request.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* License Information */}
      <div className="bg-white rounded-lg p-6 border h-[200px] border-[#DFE6E5] flex flex-col gap-6 ">
        <div className="text-[12px] font-medium text-[#4E616A]">License Information</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">PAN License Number</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.licenceNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Expiry Date</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.licenceExpiry}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Issuing Authority</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.issuingAuthority}
              </span>
            </div>
          </div>

          <div className="border border-dashed border-[#DFE6E5] rounded-lg p-4 flex justify-between items-center bg-white">
            <div className="flex gap-4 items-center">
              <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                <img src="/icons/rider/export.svg" alt="pdf" className="w-[24px] h-[24px]" />
              </div>
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[14px] font-medium text-[#000000]">license.pdf</span>
                <button
                  onClick={() => handleOpenDocument('license.pdf')}
                  className="text-[12px] cursor-pointer font-semibold text-[#1DAFA1] hover:underline"
                >
                  Click to View
                </button>
                <div className="mt-1">
                  {isRejected ? (
                    <div className="px-3 py-2 rounded-[500px] bg-[#FFF6F6] text-[#FF0707] text-[12px] font-medium">
                      Rejected
                    </div>
                  ) : isApproved ? (
                    <div className="px-3 py-2 rounded-[500px] bg-[#EAFFF2] text-[#00A63E] text-[12px] font-medium">
                      Verified
                    </div>
                  ) : (
                    <div className="px-3 py-2 rounded-[500px] bg-[#FFF3D4] text-[#F6921E] text-[12px] font-medium">
                      Pending Verification
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isPending && (
              <div className="flex items-center gap-2 ">
                <button
                  onClick={() => handleOpenRejectModal('license.pdf')}
                  className="p-2 rounded-md bg-[#FFF6F6] text-[#FF0707] cursor-pointer"
                >
                  <X className="w-5 h-5 font-bold" />
                </button>
                <button className="p-2 rounded-md bg-[#EAFFF2] text-[#00A63E] cursor-pointer">
                  <Check className="w-5 h-5 font-bold" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-white rounded-lg p-6 border h-[330px] border-[#DFE6E5] flex flex-col gap-3 ">
        <div className="text-[12px] font-medium text-[#4E616A]">Vehicle Information</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Registration Number</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.vehicle.registrationNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Make</span>
              <span className="text-[14px] font-medium text-[#000000]">{request.vehicle.make}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Model</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.vehicle.model}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Year</span>
              <span className="text-[14px] font-medium text-[#000000]">{request.vehicle.year}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Color</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.vehicle.color}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Vehicle Type</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.vehicle.vehicleType}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="border border-dashed border-[#DFE6E5] rounded-lg p-4 flex justify-between items-center bg-white">
              <div className="flex gap-4 items-center">
                <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                  <img src="/icons/rider/export.svg" alt="pdf" className="w-[24px] h-[24px]" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[14px] font-medium text-[#000000]">
                    Insurance Certificate
                  </span>
                  <button
                    onClick={() => handleOpenDocument('Insurance Certificate')}
                    className="text-[12px] cursor-pointer font-semibold text-[#1DAFA1] hover:underline"
                  >
                    Click to View
                  </button>
                  <div className="flex items-center gap-3 mt-1">
                    {isRejected ? (
                      <>
                        <div className="px-3 py-2 rounded-[500px] bg-[#FFF6F6] text-[#FF0707] text-[12px] font-medium">
                          Rejected
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#F9F9F9] rounded-[400px] px-2 py-1">
                          <img
                            src="/icons/verification/info.svg"
                            alt="info"
                            className="w-[15px] h-[15px]"
                          />
                          <span className="text-[12px] font-medium text-[#4E616A]">
                            Document is expired
                          </span>
                        </div>
                      </>
                    ) : isApproved ? (
                      <div className="px-3 py-2 rounded-[500px] bg-[#EAFFF2] text-[#00A63E] text-[12px] font-medium">
                        Verified
                      </div>
                    ) : (
                      <div className="px-3 py-2 rounded-[500px] bg-[#FFF3D4] text-[#F6921E] text-[12px] font-medium">
                        Pending Verification
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isPending && (
                <div className="flex items-center gap-2 ">
                  <button
                    onClick={() => handleOpenRejectModal('Insurance Certificate')}
                    className="p-2 rounded-md bg-[#FFF6F6] text-[#FF0707] cursor-pointer"
                  >
                    <X className="w-5 h-5 font-bold" />
                  </button>
                  <button className="p-2 rounded-md bg-[#EAFFF2] text-[#00A63E] cursor-pointer">
                    <Check className="w-5 h-5 font-bold" />
                  </button>
                </div>
              )}
            </div>

            <div className="border border-dashed border-[#DFE6E5] rounded-lg p-4 flex justify-between items-center bg-white">
              <div className="flex gap-4 items-center">
                <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                  <img src="/icons/rider/export.svg" alt="pdf" className="w-[24px] h-[24px]" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[14px] font-medium text-[#000000]">MOT Certificate</span>
                  <button
                    onClick={() => handleOpenDocument('MOT Certificate')}
                    className="text-[12px] cursor-pointer font-semibold text-[#1DAFA1] hover:underline"
                  >
                    Click to View
                  </button>
                  <div className="flex items-center gap-3 mt-1">
                    {isRejected ? (
                      <>
                        <div className="px-3 py-2 rounded-[500px] bg-[#FFF6F6] text-[#FF0707] text-[12px] font-medium">
                          Rejected
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#F9F9F9] rounded-[400px] px-2 py-1">
                          <img
                            src="/icons/verification/info.svg"
                            alt="info"
                            className="w-[15px] h-[15px]"
                          />
                          <span className="text-[12px] font-medium text-[#4E616A]">
                            Criminal record unclear
                          </span>
                        </div>
                      </>
                    ) : isApproved ? (
                      <div className="px-3 py-2 rounded-[500px] bg-[#EAFFF2] text-[#00A63E] text-[12px] font-medium">
                        Verified
                      </div>
                    ) : (
                      <div className="px-3 py-2 rounded-[500px] bg-[#FFF3D4] text-[#F6921E] text-[12px] font-medium">
                        Pending Verification
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isPending && (
                <div className="flex items-center gap-2 ">
                  <button
                    onClick={() => handleOpenRejectModal('MOT Certificate')}
                    className="p-2 rounded-md bg-[#FFF6F6] text-[#FF0707] cursor-pointer"
                  >
                    <X className="w-5 h-5 font-bold" />
                  </button>
                  <button className="p-2 rounded-md bg-[#EAFFF2] text-[#00A63E] cursor-pointer">
                    <Check className="w-5 h-5 font-bold" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Check */}
      <div className="bg-white rounded-lg p-6 border h-[130px] border-[#DFE6E5] flex flex-row justify-between gap-6 ">
        <div className="flex gap-4 items-center">
          <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
            <img src="/icons/rider/export.svg" alt="pdf" className="w-[24px] h-[24px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-[#101828] mb-1">Background Check</span>
            <span className="text-[12px] font-semibold text-[#4E616A] mb-2">
              Criminal & driving record verification
            </span>
            <div className="flex items-center gap-3">
              {isRejected ? (
                <>
                  <div className="px-3 py-1 rounded-full bg-[#FFF6F6] text-[#FF0707] text-[12px] font-medium">
                    Rejected
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F9F9F9] rounded-[400px] px-2 py-1">
                    <img
                      src="/icons/verification/info.svg"
                      alt="info"
                      className="w-[15px] h-[15px]"
                    />
                    <span className="text-[12px] font-medium text-[#4E616A]">
                      Criminal record unclear
                    </span>
                  </div>
                </>
              ) : isApproved ? (
                <div className="px-3 py-1 rounded-full bg-[#EAFFF2] text-[#00A63E] text-[12px] font-medium">
                  Verified
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full bg-[#FFF3D4] text-[#F6921E] text-[12px] font-medium">
                  Pending Verification
                </div>
              )}
            </div>
          </div>
        </div>

        {isPending && (
          <div className="flex items-center gap-2 ">
            <button
              onClick={() => handleOpenRejectModal('Background Check')}
              className="p-2 rounded-md bg-[#FFF6F6] text-[#FF0707] cursor-pointer"
            >
              <X className="w-5 h-5 font-bold" />
            </button>
            <button className="p-2 rounded-md bg-[#EAFFF2] text-[#00A63E] cursor-pointer">
              <Check className="w-5 h-5 font-bold" />
            </button>
          </div>
        )}
      </div>

      {/* Warning Alert */}
      <div className="bg-[#F9F9F9] rounded-lg p-4 flex items-center gap-3 ">
        <img src="/icons/verification/docs.svg" alt="docs" className="w-[24px] h-[24px]" />
        <span className="text-[14px] font-medium text-[#4E616A]">
          Complete all document verifications and background check before approving the driver.
        </span>
      </div>

      {/* Legal Agreements */}
      <div className="bg-white rounded-lg p-6 border border-[#DFE6E5] flex flex-col gap-6  mb-3">
        <div className="text-[12px] font-medium text-[#4E616A]">Legal Agreements</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#DFE6E5] rounded-lg p-4 flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#4E616A]">Terms of Service</span>
            <div className="px-4 py-1.5 rounded-[500px] bg-[#EAFFF2] text-[#00A63E] text-[12px] font-medium">
              Agreed
            </div>
          </div>
          <div className="border border-[#DFE6E5] rounded-lg p-4 flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#4E616A]">Privacy Policy</span>
            <div className="px-4 py-1.5 rounded-[500px] bg-[#EAFFF2] text-[#00A63E] text-[12px] font-medium">
              Agreed
            </div>
          </div>
          <div className="border border-[#DFE6E5] rounded-lg p-4 flex items-center justify-between">
            <span className="text-[14px] font-medium text-[#4E616A]">Data Processing Consent</span>
            <div className="px-4 py-1.5 rounded-[500px] bg-[#EAFFF2] text-[#00A63E] text-[12px] font-medium">
              Agreed
            </div>
          </div>
        </div>
      </div>

      <DocumentViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentTitle={currentDocumentName}
      />

      <RejectDocumentModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        documentName={rejectingDocument}
      />

      <RejectVerificationModal
        isOpen={isRejectVerificationModalOpen}
        onClose={() => setIsRejectVerificationModalOpen(false)}
        onConfirm={(reasons, note) => {
          console.warn('Rejected with reasons:', reasons, 'and note:', note);
        }}
      />
    </div>
  );
};

export default ApplicationDetailsPage;
