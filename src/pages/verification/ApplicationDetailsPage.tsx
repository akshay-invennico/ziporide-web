import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Info, CheckCircle2, XCircle, X, Check } from "lucide-react";
import DocumentViewModal from "../../components/ui/DocumentViewModal";
import RejectDocumentModal from "../../components/ui/RejectDocumentModal";
import { verificationRequestsData } from "../../data/VerificationData";

const ApplicationDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDocumentName, setCurrentDocumentName] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingDocument, setRejectingDocument] = useState("");

  const request = verificationRequestsData.find(r => r.id === id) || {
    id: "0",
    driverName: "Mike Smith",
    phone: "+44 1321 65456",
    email: "mike.smith@email.com",
    appliedOn: "2023-05-12",
    status: "Pending",
    avatar: "MS"
  };

  const isApproved = request.status === "Approved";
  const isRejected = request.status === "Rejected";
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
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors w-fit"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-[14px] font-medium">Back</span>
        </button>
        
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-bold text-gray-900">Application Details</h1>
          <p className="text-[14px] text-gray-500 font-medium">Review applications and manage driver profile.</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-[12px] p-6 border border-[#DFE6E5] flex flex-col gap-8 drop-shadow-sm">
        <div className="text-[13px] font-medium text-gray-400">Personal Information</div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] rounded-full bg-[#1DAFA1] flex items-center justify-center text-white text-lg font-bold shrink-0 overflow-hidden">
               {request.avatar.length <= 2 ? (
                  <span>{request.avatar}</span>
               ) : (
                  <img src={request.avatar} alt={request.driverName} className="w-full h-full object-cover" />
               )}
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-bold text-gray-900">{request.driverName}</span>
              <span className="text-[14px] font-bold text-[#1DAFA1]">DRVR-2001</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {isRejected && (
              <div className="bg-[#F3F4F6] px-3 py-1.5 rounded-full flex items-center gap-2">
                 <Info className="w-4 h-4 text-[#6B7280]" />
                 <span className="text-[13px] font-medium text-[#4B5563]">Vehicle information is incorrect or incomplete</span>
              </div>
            )}
            
            {isRejected && (
              <div className="px-4 py-1.5 rounded-full flex items-center gap-2 bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444]">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></div>
                 <span className="text-[13px] font-bold">Rejected</span>
              </div>
            )}

            {isApproved && (
              <div className="px-5 py-2 rounded-full flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981]">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                 <span className="text-[13px] font-bold">Approved</span>
              </div>
            )}

            {isPending && (
              <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] font-semibold text-[14px] hover:bg-red-50 transition-colors">
                    <XCircle className="w-4 h-4" />
                    Reject
                 </button>
                 <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] font-semibold text-[14px] hover:bg-emerald-50 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                 </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="flex gap-3">
              <div className="mt-0.5"><img src="/icons/rider/phone.svg" alt="phone" className="w-[20px] h-[20px] opacity-60" /></div>
              <div className="flex flex-col">
                 <span className="text-[12px] text-gray-500 font-medium">Phone Number</span>
                 <span className="text-[14px] font-semibold text-gray-900">{request.phone}</span>
              </div>
           </div>
           <div className="flex gap-3">
              <div className="mt-0.5"><img src="/icons/rider/email.svg" alt="email" className="w-[20px] h-[20px] opacity-60" /></div>
              <div className="flex flex-col">
                 <span className="text-[12px] text-gray-500 font-medium">Email</span>
                 <span className="text-[14px] font-semibold text-gray-900">{request.email}</span>
              </div>
           </div>
           <div className="flex gap-3">
              <div className="mt-0.5"><img src="/icons/rider/person.svg" alt="gender" className="w-[20px] h-[20px] opacity-60" /></div>
              <div className="flex flex-col">
                 <span className="text-[12px] text-gray-500 font-medium">Gender</span>
                 <span className="text-[14px] font-semibold text-gray-900">Male</span>
              </div>
           </div>
           <div className="flex gap-3">
              <div className="mt-0.5"><img src="/icons/rider/calendar.svg" alt="dob" className="w-[20px] h-[20px] opacity-60" /></div>
              <div className="flex flex-col">
                 <span className="text-[12px] text-gray-500 font-medium">Date of Birth</span>
                 <span className="text-[14px] font-semibold text-gray-900">1988-03-25</span>
              </div>
           </div>
           <div className="flex gap-3">
              <div className="mt-0.5"><img src="/icons/rider/calendar.svg" alt="joined" className="w-[20px] h-[20px] opacity-60" /></div>
              <div className="flex flex-col">
                 <span className="text-[12px] text-gray-500 font-medium">Joined on</span>
                 <span className="text-[14px] font-semibold text-gray-900">{request.appliedOn}</span>
              </div>
           </div>
        </div>
        
        <div className="flex flex-col gap-2">
           <span className="text-[12px] text-gray-500 font-medium">Address</span>
           <div className="flex gap-3 items-center">
             <div className="shrink-0"><img src="/icons/rider/location.svg" alt="location" className="w-[20px] h-[20px] opacity-60" /></div>
             <div className="flex flex-col">
                 <span className="text-[14px] font-semibold text-gray-900">Downtown Community Center, 45, Maple Avenue, Greater Landon</span>
                 <span className="text-[12px] text-gray-400 font-medium">HKJ54 54185</span>
             </div>
           </div>
        </div>
      </div>

      {/* License Information */}
      <div className="bg-white rounded-[12px] p-6 border border-[#DFE6E5] flex flex-col gap-6 drop-shadow-sm">
        <div className="text-[13px] font-medium text-gray-400">License Information</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">PAN License Number</span>
                    <span className="text-[14px] font-bold text-gray-900">+1 234-567-9001</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">Expiry Date</span>
                    <span className="text-[14px] font-bold text-gray-900">2027-03-15</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">Issuing Authority</span>
                    <span className="text-[14px] font-bold text-gray-900">New York DMV</span>
                </div>
            </div>
            
            <div className="border border-dashed border-gray-300 rounded-[12px] p-4 flex justify-between items-center bg-[#FAFAFA]">
               <div className="flex gap-4 items-center">
                 <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                   <img src="/icons/rider/export.svg" alt="pdf" className="w-[24px] h-[24px]" />
                 </div>
                 <div className="flex flex-col gap-1 items-start">
                     <span className="text-[14px] font-bold text-gray-900">license.pdf</span>
                     <button 
                       onClick={() => handleOpenDocument("license.pdf")}
                       className="text-[12px] font-semibold text-[#1DAFA1] hover:underline"
                     >
                       Click to View
                     </button>
                     <div className="mt-1">
                        {isRejected ? (
                          <div className="px-3 py-1 rounded-full bg-[#FEF2F2] text-[#EF4444] text-[11px] font-bold">Rejected</div>
                        ) : isApproved ? (
                          <div className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] text-[11px] font-bold">Verified</div>
                        ) : (
                          <div className="px-3 py-1 rounded-full bg-[#FFF8ED] text-[#F59E0B] text-[11px] font-bold">Pending Verification</div>
                        )}
                     </div>
                 </div>
               </div>

               {isPending && (
                  <div className="flex items-center gap-2">
                     <button className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] hover:bg-red-50 transition-colors">
                        <X className="w-4 h-4 font-bold" />
                     </button>
                     <button className="p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] hover:bg-emerald-50 transition-colors">
                        <Check className="w-4 h-4 font-bold" />
                     </button>
                  </div>
               )}
            </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-white rounded-[12px] p-6 border border-[#DFE6E5] flex flex-col gap-6 drop-shadow-sm">
        <div className="text-[13px] font-medium text-gray-400">Vehicle Information</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">Registration Number</span>
                    <span className="text-[14px] font-bold text-gray-900">AB12 CDE</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">Make</span>
                    <span className="text-[14px] font-bold text-gray-900">Toyota</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">Model</span>
                    <span className="text-[14px] font-bold text-gray-900">Camry</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">Year</span>
                    <span className="text-[14px] font-bold text-gray-900">2022</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">Color</span>
                    <span className="text-[14px] font-bold text-gray-900">Silver</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-gray-500">Vehicle Type</span>
                    <span className="text-[14px] font-bold text-gray-900">Sedan</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="border border-dashed border-gray-300 rounded-[12px] p-4 flex justify-between items-center bg-[#FAFAFA]">
                   <div className="flex gap-4 items-center">
                     <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                       <img src="/icons/rider/export.svg" alt="pdf" className="w-[24px] h-[24px]" />
                     </div>
                     <div className="flex flex-col items-start gap-1">
                         <span className="text-[14px] font-bold text-gray-900">Insurance Certificate</span>
                         <button 
                           onClick={() => handleOpenDocument("Insurance Certificate")}
                           className="text-[12px] font-semibold text-[#1DAFA1] hover:underline"
                         >
                           Click to View
                         </button>
                         <div className="flex items-center gap-3 mt-1">
                             {isRejected ? (
                               <>
                                 <div className="px-3 py-1 rounded-full bg-[#FEF2F2] text-[#EF4444] text-[11px] font-bold">Rejected</div>
                                 <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2 py-1">
                                     <Info className="w-3.5 h-3.5 text-gray-500" />
                                     <span className="text-[11px] font-medium text-gray-600">Document is expired</span>
                                 </div>
                               </>
                             ) : isApproved ? (
                               <div className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] text-[11px] font-bold">Verified</div>
                             ) : (
                               <div className="px-3 py-1 rounded-full bg-[#FFF8ED] text-[#F59E0B] text-[11px] font-bold">Pending Verification</div>
                             )}
                         </div>
                     </div>
                   </div>

                   {isPending && (
                      <div className="flex items-center gap-2">
                         <button className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] hover:bg-red-50 transition-colors">
                            <X className="w-4 h-4 font-bold" />
                         </button>
                         <button className="p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] hover:bg-emerald-50 transition-colors">
                            <Check className="w-4 h-4 font-bold" />
                         </button>
                      </div>
                   )}
                </div>

                <div className="border border-dashed border-gray-300 rounded-[12px] p-4 flex justify-between items-center bg-[#FAFAFA]">
                   <div className="flex gap-4 items-center">
                     <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                       <img src="/icons/rider/export.svg" alt="pdf" className="w-[24px] h-[24px]" />
                     </div>
                     <div className="flex flex-col items-start gap-1">
                         <span className="text-[14px] font-bold text-gray-900">MOT Certificate</span>
                         <button 
                           onClick={() => handleOpenDocument("MOT Certificate")}
                           className="text-[12px] font-semibold text-[#1DAFA1] hover:underline"
                         >
                           Click to View
                         </button>
                         <div className="flex items-center gap-3 mt-1">
                             {isRejected ? (
                               <>
                                <div className="px-3 py-1 rounded-full bg-[#FEF2F2] text-[#EF4444] text-[11px] font-bold">Rejected</div>
                                <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2 py-1">
                                    <Info className="w-3.5 h-3.5 text-gray-500" />
                                    <span className="text-[11px] font-medium text-gray-600">Incorrect document uploaded</span>
                                </div>
                               </>
                             ) : isApproved ? (
                               <div className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] text-[11px] font-bold">Verified</div>
                             ) : (
                               <div className="px-3 py-1 rounded-full bg-[#FFF8ED] text-[#F59E0B] text-[11px] font-bold">Pending Verification</div>
                             )}
                         </div>
                     </div>
                   </div>

                   {isPending && (
                      <div className="flex items-center gap-2">
                         <button className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] hover:bg-red-50 transition-colors">
                            <X className="w-4 h-4 font-bold" />
                         </button>
                         <button className="p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] hover:bg-emerald-50 transition-colors">
                            <Check className="w-4 h-4 font-bold" />
                         </button>
                      </div>
                   )}
                </div>
            </div>
        </div>
      </div>

      {/* Background Check */}
      <div className="bg-white rounded-[12px] p-6 border border-[#DFE6E5] flex justify-between items-center drop-shadow-sm border-l-4 border-l-transparent">
         <div className="flex gap-4 items-center">
             <div className="w-[80px] h-[60px] bg-gray-200 rounded shrink-0 overflow-hidden flex items-center justify-center text-[#1DAFA1] text-[10px] font-bold">
                 <img src="/icons/rider/export.svg" alt="pdf" className="w-[24px] h-[24px]" />
             </div>
             <div className="flex flex-col">
                 <span className="text-[14px] font-bold text-gray-900">Background Check</span>
                 <span className="text-[12px] font-medium text-gray-500 mb-2">Criminal & driving record verification</span>
                 <div className="flex items-center gap-3">
                     {isRejected ? (
                       <>
                         <div className="px-3 py-1 rounded-full bg-[#FEF2F2] text-[#EF4444] text-[11px] font-bold">Rejected</div>
                         <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-2 py-1">
                             <Info className="w-3.5 h-3.5 text-gray-500" />
                             <span className="text-[11px] font-medium text-gray-600">Criminal record unclear</span>
                         </div>
                       </>
                     ) : isApproved ? (
                       <div className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] text-[11px] font-bold">Verified</div>
                     ) : (
                       <div className="px-3 py-1 rounded-full bg-[#FFF8ED] text-[#F59E0B] text-[11px] font-bold">Pending Verification</div>
                     )}
                 </div>
             </div>
         </div>

         {isPending && (
             <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenRejectModal("Background Check")}
                  className="p-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] hover:bg-red-50 transition-colors"
                >
                   <X className="w-4 h-4 font-bold" />
                </button>
                <button className="p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] hover:bg-emerald-50 transition-colors">
                   <Check className="w-4 h-4 font-bold" />
                </button>
             </div>
         )}
      </div>

      {/* Warning Alert */}
      <div className="bg-[#F8F9FA] rounded-[8px] p-4 flex items-center gap-3 border border-gray-200">
         <CheckCircle2 className="w-5 h-5 text-gray-800" />
         <span className="text-[14px] font-medium text-gray-600">Complete all document verifications and background check before approving the driver.</span>
      </div>

      {/* Legal Agreements */}
      <div className="bg-white rounded-[12px] p-6 border border-[#DFE6E5] flex flex-col gap-6 drop-shadow-sm mb-10">
        <div className="text-[13px] font-medium text-gray-400">Legal Agreements</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <span className="text-[14px] font-semibold text-gray-700">Terms of Service</span>
                <div className="px-4 py-1.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-[12px] font-bold">Agreed</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <span className="text-[14px] font-semibold text-gray-700">Privacy Policy</span>
                <div className="px-4 py-1.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-[12px] font-bold">Agreed</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <span className="text-[14px] font-semibold text-gray-700">Data Processing Consent</span>
                <div className="px-4 py-1.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-[12px] font-bold">Agreed</div>
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

    </div>
  );
};

export default ApplicationDetailsPage;
