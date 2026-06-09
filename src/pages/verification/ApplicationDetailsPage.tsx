import { CheckCircle2, XCircle, X, Check, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/context/useToast';
import { usePermissions } from '@/hooks/usePermissions';

import DocumentViewerModal from '../../components/ui/DocumentViewerModal';
import RejectDocumentModal from '../../components/ui/RejectDocumentModal';
import RejectVerificationModal from '../../components/ui/RejectVerificationModal';
import { useDriverDetails, useVerifyDriverDocument } from '../../hooks/useVerificationDriver';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif', 'heic'];

const isImageUrl = (url?: string): boolean => {
  if (!url) return false;
  if (url.startsWith('data:image/')) return true;
  let pathname = url;
  try {
    pathname = new URL(url, window.location.origin).pathname;
  } catch {
    // ignore — use raw url
  }
  const ext = pathname.split('.').pop()?.toLowerCase();
  return !!ext && IMAGE_EXTENSIONS.includes(ext);
};

const DocumentThumbnail = ({ url, alt }: { url?: string; alt: string }) => {
  if (url && isImageUrl(url)) {
    return <img src={url} alt={alt} className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF6F6] gap-0.5">
      <img src="/icons/pdf.svg" alt={url ? 'PDF document' : 'No document'} className="w-6 h-6" />
      <span className="text-[9px] font-semibold text-[#FF0707]">{url ? 'PDF' : 'N/A'}</span>
    </div>
  );
};

const ApplicationDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocumentName, setCurrentDocumentName] = useState('');
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState<string | undefined>(undefined);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingDocument, setRejectingDocument] = useState('');
  const [rejectingDocumentType, setRejectingDocumentType] = useState<string>('');
  const [isRejectVerificationModalOpen, setIsRejectVerificationModalOpen] = useState(false);
  const { showToast } = useToast();
  const { canEditModule } = usePermissions();
  const canEditVerification = canEditModule('verification');
  const { driver: request, loading, error, refetch } = useDriverDetails(id);
  const { verifyDocument, updateDriverStatus, isVerifying } = useVerifyDriverDocument(id);

  const handleVerifyDocument = async (docType: string, isApproved: boolean, reason?: string) => {
    if (!canEditVerification) return;
    try {
      await verifyDocument(docType, isApproved, reason);
      showToast(`Document ${isApproved ? 'approved' : 'rejected'} successfully`, 'success');
      refetch(); // Reload data to show updated status
    } catch (err: unknown) {
      const error = err as Error;
      showToast(`Failed to update status: ${error.message}`, 'error');
    }
  };

  const handleOverallStatusUpdate = async (action: 'approve' | 'reject', reason?: string) => {
    if (!request || !canEditVerification) return;
    // Validation: Check if any document is still pending
    const isLicensePending =
      !request.licence?.document?.isVerified && !request.licence?.document?.rejectedReason;
    const isInsurancePending =
      !request.vehicle?.insurance?.isVerified && !request.vehicle?.insurance?.rejectedReason;
    const isMOTPending = !request.vehicle?.mot?.isVerified && !request.vehicle?.mot?.rejectedReason;
    const isBackgroundPending =
      !request.backgroundCheck?.isVerified && !request.backgroundCheck?.rejectedReason;

    if (isLicensePending || isInsurancePending || isMOTPending || isBackgroundPending) {
      showToast(
        'Please review and verify or reject all documents before updating the overall driver status.',
        'error',
      );
      return;
    }

    try {
      await updateDriverStatus(action, reason);
      showToast(`Driver ${action === 'approve' ? 'approved' : 'rejected'} successfully`, 'success');
      refetch(); // Reload data to show updated status
    } catch (err: unknown) {
      const error = err as Error;
      showToast(`Failed to update driver status: ${error.message}`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen p-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="w-full min-h-screen p-1 flex items-center justify-center">
        <div className="text-center text-red-500">{error || 'Driver not found'}</div>
      </div>
    );
  }

  const isApproved =
    request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'active';
  const isRejected =
    request.status?.toLowerCase() === 'rejected' || request.status?.toLowerCase() === 'suspended';
  const isPending = request.status?.toLowerCase() === 'pending';

  const handleOpenDocument = (docName: string, url?: string) => {
    setCurrentDocumentName(docName);
    setCurrentDocumentUrl(url);
    setIsModalOpen(true);
  };

  const handleOpenRejectModal = (docName: string, docType: string) => {
    if (!canEditVerification) return;
    setRejectingDocument(docName);
    setRejectingDocumentType(docType);
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
              {!request.profilePhotoUrl && (!request.avatar || request.avatar.length <= 2) ? (
                <span>
                  {request.avatar && request.avatar.length <= 2
                    ? request.avatar
                    : (request.driverName || request.name)
                        ?.trim()
                        .split(/\s+/)
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2) || 'DR'}
                </span>
              ) : (
                <img
                  src={request.profilePhotoUrl || request.avatar}
                  alt={request.name || 'Driver'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-semibold text-[#101828]">
                {request.name || 'Unknown'}
              </span>
              <span className="text-[14px] font-medium text-[#1DAFA1]">ID: {request.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {isRejected && (
              <div className="bg-[#F9F9F9] px-3 py-1.5 rounded-[600px] flex items-center gap-2">
                <img src="/icons/verification/info.svg" alt="info" className="w-[15px] h-[15px]" />
                <span className="text-[14px] font-medium text-[#4E616A]">
                  {request.rejectedReason || 'unknown'}
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

            {isPending && canEditVerification && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRejectVerificationModalOpen(true)}
                  disabled={isVerifying}
                  className="flex cursor-pointer items-center gap-1 px-6 py-2 rounded-[500px] bg-[#FFF6F6]   text-[#FF0707] font-medium text-[14px] disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={() => handleOverallStatusUpdate('approve')}
                  disabled={isVerifying}
                  className="flex cursor-pointer items-center gap-1 px-6 py-2 rounded-[500px] bg-[#EAFFF2]  text-[#00A63E] font-medium text-[14px] disabled:opacity-50"
                >
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
              <span className="text-[14px] font-medium text-[#101828]">
                {request.countryCode
                  ? `${request.countryCode} ${request.phone}`
                  : request.phone || '-'}
              </span>
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
              <span className="text-[14px] font-medium text-[#101828]">{request.email || '-'}</span>
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
              <span className="text-[14px] font-medium text-[#101828]">
                {request.gender
                  ? request.gender.charAt(0).toUpperCase() + request.gender.slice(1)
                  : '-'}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5 bg-[#F9F9F9] w-[41px] h-[41px] rounded-full flex items-center justify-center">
              <img src="/icons/verification/cale.svg" alt="dob" className="w-[20px] h-[20px] " />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#4E616A] font-medium">Date of Birth</span>
              <span className="text-[14px] font-medium text-[#101828]">
                {request.dateOfBirth
                  ? new Date(request.dateOfBirth as string).toISOString().split('T')[0]
                  : '-'}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5 bg-[#F9F9F9] w-[41px] h-[41px] rounded-full flex items-center justify-center">
              <img src="/icons/verification/cale.svg" alt="joined" className="w-[20px] h-[20px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-[#4E616A] font-medium">Joined on</span>
              <span className="text-[14px] font-medium text-[#101828]">
                {request.consents?.acceptedAt || request.createdAt
                  ? new Date((request.consents?.acceptedAt || request.createdAt) as string)
                      .toISOString()
                      .split('T')[0]
                  : '-'}
              </span>
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
              <span className="text-[14px] font-semibold text-[#000000]">
                {request.address
                  ? typeof request.address === 'string'
                    ? request.address
                    : [
                        request.address.line1,
                        request.address.city,
                        request.address.postcode,
                        request.address.country,
                      ]
                        .filter(Boolean)
                        .join(', ')
                  : '-'}
              </span>
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
              <span className="text-[14px] font-medium text-[#4E616A]">PHV License Number</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.licence?.number || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Expiry Date</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.licence?.expiryDate
                  ? new Date(request.licence.expiryDate as string).toISOString().split('T')[0]
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Issuing Authority</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.licence?.issuingAuthority || '-'}
              </span>
            </div>
          </div>

          <div className="border border-dashed border-[#DFE6E5] rounded-lg p-4 flex justify-between items-center bg-white">
            <div className="flex gap-4 items-center">
              <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                <DocumentThumbnail url={request.licence?.document?.url} alt="License" />
              </div>
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[14px] font-medium text-[#000000]">license.pdf</span>
                <button
                  onClick={() =>
                    handleOpenDocument('License Document', request.licence?.document?.url)
                  }
                  className="text-[12px] cursor-pointer font-semibold text-[#1DAFA1] hover:underline"
                >
                  Click to View
                </button>
                <div className="mt-1 flex items-center gap-2">
                  {request.licence?.document?.rejectedReason ? (
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
                          {request.licence.document.rejectedReason}
                        </span>
                      </div>
                    </>
                  ) : request.licence?.document?.isVerified ? (
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

            {!request.licence?.document?.isVerified &&
              !request.licence?.document?.rejectedReason &&
              canEditVerification && (
                <div className="flex items-center gap-2 ">
                  <button
                    onClick={() => handleOpenRejectModal('License', 'licence')}
                    disabled={isVerifying}
                    className="p-2 rounded-md bg-[#FFF6F6] text-[#FF0707] cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-5 h-5 font-bold" />
                  </button>
                  <button
                    onClick={() => handleVerifyDocument('licence', true)}
                    disabled={isVerifying}
                    className="p-2 rounded-md bg-[#EAFFF2] text-[#00A63E] cursor-pointer disabled:opacity-50"
                  >
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
                {request.vehicle?.registrationNumber || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Make</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.vehicle?.make || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Model</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.vehicle?.model || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Year</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.vehicle?.year || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-medium text-[#4E616A]">Vehicle Type</span>
              <span className="text-[14px] font-medium text-[#000000]">
                {request.vehicle?.category?.name
                  ? request.vehicle?.category?.name.charAt(0).toUpperCase() +
                    request.vehicle?.category?.name.slice(1)
                  : '-'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="border border-dashed border-[#DFE6E5] rounded-lg p-4 flex justify-between items-center bg-white">
              <div className="flex gap-4 items-center">
                <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                  <DocumentThumbnail url={request.vehicle?.insurance?.url} alt="Insurance" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[14px] font-medium text-[#000000]">
                    Insurance Certificate
                  </span>
                  <button
                    onClick={() =>
                      handleOpenDocument('Insurance Certificate', request.vehicle?.insurance?.url)
                    }
                    className="text-[12px] cursor-pointer font-semibold text-[#1DAFA1] hover:underline"
                  >
                    Click to View
                  </button>
                  <div className="flex items-center gap-3 mt-1">
                    {request.vehicle?.insurance?.rejectedReason ? (
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
                            {request.vehicle.insurance.rejectedReason}
                          </span>
                        </div>
                      </>
                    ) : request.vehicle?.insurance?.isVerified ? (
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

              {!request.vehicle?.insurance?.isVerified &&
                !request.vehicle?.insurance?.rejectedReason &&
                canEditVerification && (
                  <div className="flex items-center gap-2 ">
                    <button
                      onClick={() => handleOpenRejectModal('Insurance', 'insurance')}
                      disabled={isVerifying}
                      className="p-2 rounded-md bg-[#FFF6F6] text-[#FF0707] cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-5 h-5 font-bold" />
                    </button>
                    <button
                      onClick={() => handleVerifyDocument('insurance', true)}
                      disabled={isVerifying}
                      className="p-2 rounded-md bg-[#EAFFF2] text-[#00A63E] cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-5 h-5 font-bold" />
                    </button>
                  </div>
                )}
            </div>

            <div className="border border-dashed border-[#DFE6E5] rounded-lg p-4 flex justify-between items-center bg-white">
              <div className="flex gap-4 items-center">
                <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                  <DocumentThumbnail url={request.vehicle?.mot?.url} alt="MOT" />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[14px] font-medium text-[#000000]">MOT Certificate</span>
                  <button
                    onClick={() => handleOpenDocument('MOT Certificate', request.vehicle?.mot?.url)}
                    className="text-[12px] cursor-pointer font-semibold text-[#1DAFA1] hover:underline"
                  >
                    Click to View
                  </button>
                  <div className="flex items-center gap-3 mt-1">
                    {request.vehicle?.mot?.rejectedReason ? (
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
                            {request.vehicle.mot.rejectedReason}
                          </span>
                        </div>
                      </>
                    ) : request.vehicle?.mot?.isVerified ? (
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

              {!request.vehicle?.mot?.isVerified &&
                !request.vehicle?.mot?.rejectedReason &&
                canEditVerification && (
                  <div className="flex items-center gap-2 ">
                    <button
                      onClick={() => handleOpenRejectModal('MOT', 'mot')}
                      disabled={isVerifying}
                      className="p-2 rounded-md bg-[#FFF6F6] text-[#FF0707] cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-5 h-5 font-bold" />
                    </button>
                    <button
                      onClick={() => handleVerifyDocument('mot', true)}
                      disabled={isVerifying}
                      className="p-2 rounded-md bg-[#EAFFF2] text-[#00A63E] cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-5 h-5 font-bold" />
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Check */}
      <div className="bg-white rounded-lg p-4 border border-[#DFE6E5]">
        <div className="flex flex-row items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img
              src="/icons/verification/backgroundCheck.svg"
              alt="background check"
              className="w-[88px] h-[88px]"
            />
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <span className="text-[16px] font-semibold text-[#101828]">Background Check</span>
              <div className="flex items-center gap-x-8 gap-y-1 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[13px] font-medium text-[#4E616A] shrink-0">
                    Certificate Number:
                  </span>
                  <span
                    className="text-[13px] font-medium text-[#1DAFA1] truncate"
                    title={request.vehicle?.dbsCertificateNumber || ''}
                  >
                    {request.vehicle?.dbsCertificateNumber
                      ? `#${request.vehicle.dbsCertificateNumber}`
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#4E616A]">Code:</span>
                  <span className="text-[13px] font-semibold text-[#1DAFA1]">
                    {request.vehicle?.dbsShareCode || '-'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {request.backgroundCheck?.rejectedReason ? (
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
                        {request.backgroundCheck.rejectedReason}
                      </span>
                    </div>
                  </>
                ) : request.backgroundCheck?.isVerified ? (
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

          {!request.backgroundCheck?.isVerified &&
            !request.backgroundCheck?.rejectedReason &&
            canEditVerification && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenRejectModal('Background Check', 'backgroundCheck')}
                  disabled={isVerifying}
                  className="p-2 rounded-md bg-[#FFF6F6] text-[#FF0707] cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5 font-bold" />
                </button>
                <button
                  onClick={() => handleVerifyDocument('backgroundCheck', true)}
                  disabled={isVerifying}
                  className="p-2 rounded-md bg-[#EAFFF2] text-[#00A63E] cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-5 h-5 font-bold" />
                </button>
              </div>
            )}
        </div>
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

      <DocumentViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentName={currentDocumentName}
        documentSrc={currentDocumentUrl}
      />

      <RejectDocumentModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        documentName={rejectingDocument}
        onConfirm={(reasons) => {
          handleVerifyDocument(rejectingDocumentType, false, reasons.join(', '));
        }}
      />

      <RejectVerificationModal
        isOpen={isRejectVerificationModalOpen}
        onClose={() => setIsRejectVerificationModalOpen(false)}
        onConfirm={(reasons) => {
          handleOverallStatusUpdate('reject', reasons.join(', '));
        }}
      />
    </div>
  );
};

export default ApplicationDetailsPage;
