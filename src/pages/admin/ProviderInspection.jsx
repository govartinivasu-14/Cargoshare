import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  IconArrowLeft,
  IconCheck,
  IconX,
  IconBuildingStore,
  IconShieldCheck,
  IconFileText,
  IconMapPin,
  IconPhone,
  IconMail
} from '@tabler/icons-react';

export default function ProviderInspection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inspectionCompleted, setInspectionCompleted] = useState(false);
  const [dataQualityVerified, setDataQualityVerified] = useState(false);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/providers');
        const found = (res.data || []).find((u) => u.id === id);
        if (found) {
          setProvider(found);
          setInspectionCompleted(found.inspectionCompleted);
          setDataQualityVerified(found.dataQualityVerified);
        } else {
          setError('Provider application record not found.');
        }
      } catch (err) {
        setError('Error fetching application dossier.');
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  const handleDecision = async (notes) => {
    if (isApproving && (!inspectionCompleted || !dataQualityVerified)) {
      setError('Complete both inspection checks before approving this application.');
      setDialogOpen(false);
      return;
    }
    try {
      const res = await api.post(`/admin/providers/${id}/inspect`, {
        approve: isApproving,
        notes, inspectionCompleted, dataQualityVerified,
      });

      setProvider(res.data);
      setActionSuccess(
        isApproving
          ? 'Provider application APPROVED. Container publishing rights are now enabled for this carrier.'
          : 'Provider application REJECTED. Carrier has been barred from publishing containers.'
      );
      setDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error updating provider status.');
      setDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-port-gray">
        Opening carrier compliance dossier for inspection...
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="max-w-md mx-auto py-16 text-left">
        <div className="bg-red-50 border border-port-rust/30 p-4 rounded-[2px] text-xs font-mono text-port-rust">
          {error || 'Application record not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Breadcrumb */}
      <div className="border-b border-[#D8D1C3] pb-3 flex items-center justify-between">
        <Link to="/admin/applications" className="text-xs font-mono text-port-gray hover:underline flex items-center gap-1">
          <IconArrowLeft size={13} /> Back to Applications Queue
        </Link>
        <StatusBadge status={provider.providerStatus} />
      </div>

      {actionSuccess && (
        <div className="p-4 bg-teal-50 border border-port-teal rounded-[2px] text-xs font-mono text-port-tealDark flex items-center gap-2">
          <IconCheck size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="bg-white border p-4 space-y-3">
        <label className="block"><input type="checkbox" checked={inspectionCompleted} onChange={e => setInspectionCompleted(e.target.checked)} /> Physical / operational inspection completed</label>
        <label className="block"><input type="checkbox" checked={dataQualityVerified} onChange={e => setDataQualityVerified(e.target.checked)} /> Company, routes and capacity data verified for quality</label>
        <p className="text-xs">Record inspection findings in the decision notes. Both checks are required for approval.</p>
      </div>
      {/* Main Dossier Card */}
      <div className="bg-white border border-[#D8D1C3] p-6 rounded-[2px] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E7E2D6] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <IconBuildingStore size={22} className="text-port-teal" />
              <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
                {provider.companyName}
              </h1>
            </div>
            <p className="text-xs font-mono text-port-gray mt-1">
              Carrier ID: {provider.id} • Registered: {new Date(provider.registeredAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => { setIsApproving(false); setDialogOpen(true); }}
              className="px-4 py-2 bg-port-rust hover:bg-red-800 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <IconX size={15} />
              <span>Reject Application</span>
            </button>
            <button
              onClick={() => { setIsApproving(true); setDialogOpen(true); }}
              className="px-5 py-2 bg-port-teal hover:bg-port-tealDark text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <IconCheck size={15} />
              <span>Approve Carrier</span>
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Representative Information */}
          <div className="bg-[#FAF8F5] p-4 rounded-[2px] border border-port-gray/20 space-y-2">
            <div className="font-heading font-bold uppercase text-port-dark text-xs pb-1 border-b border-port-gray/20">
              Authorized Representative
            </div>
            <div>
              <span className="text-port-gray block text-[10px]">Contact Person:</span>
              <span className="font-bold text-port-dark font-sans text-sm">{provider.contactPerson}</span>
            </div>
            <div>
              <span className="text-port-gray block text-[10px]">Corporate Email:</span>
              <span className="font-bold text-port-dark">{provider.email}</span>
            </div>
            <div>
              <span className="text-port-gray block text-[10px]">Phone Line:</span>
              <span className="font-bold text-port-dark">{provider.phone}</span>
            </div>
          </div>

          {/* Operating Scope */}
          <div className="bg-[#FAF8F5] p-4 rounded-[2px] border border-port-gray/20 space-y-2">
            <div className="font-heading font-bold uppercase text-port-dark text-xs pb-1 border-b border-port-gray/20">
              Freight Operations Profile
            </div>
            <div>
              <span className="text-port-gray block text-[10px]">Multimodal Mode:</span>
              <span className="font-bold text-port-teal font-sans text-sm">{provider.serviceType} Freight</span>
            </div>
            <div>
              <span className="text-port-gray block text-[10px]">Operating Hubs / Terminals:</span>
              <span className="font-bold text-port-dark font-sans">{provider.operatingLocations}</span>
            </div>
            <div>
              <span className="text-port-gray block text-[10px]">Primary Serviced Lanes:</span>
              <span className="font-bold text-port-dark font-sans">{provider.routes}</span>
            </div>
          </div>

          {/* Company Background */}
          <div className="md:col-span-2 bg-white p-4 rounded-[2px] border border-port-gray/20 space-y-1">
            <div className="font-heading font-bold uppercase text-port-dark text-xs pb-1 border-b border-port-gray/20">
              Company Background & Consolidation Infrastructure
            </div>
            <p className="text-xs font-sans text-port-dark leading-relaxed pt-1">
              {provider.companyDetails || 'No additional corporate profile narrative provided.'}
            </p>
          </div>

          {/* Regulatory Accreditation */}
          <div className="md:col-span-2 bg-white p-4 rounded-[2px] border border-port-gray/20 space-y-1">
            <div className="font-heading font-bold uppercase text-port-dark text-xs pb-1 border-b border-port-gray/20 flex items-center justify-between">
              <span>Supporting Licensing & Vetting Credentials</span>
              <IconShieldCheck size={16} className="text-port-teal" />
            </div>
            <p className="text-xs font-mono text-port-dark leading-relaxed pt-1">
              {provider.supportingInfo || 'No supporting regulatory license documentation noted.'}
            </p>
          </div>

          {/* Previous Admin Inspection Notes if already reviewed */}
          {provider.adminNotes && (
            <div className="md:col-span-2 bg-amber-50 p-4 rounded-[2px] border border-port-amber/40">
              <span className="font-heading font-bold uppercase text-port-dark text-xs block mb-1">
                Audit Review Log:
              </span>
              <p className="text-xs font-mono text-port-gray">{provider.adminNotes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Approve / Reject Dialog */}
      <ConfirmDialog
        isOpen={dialogOpen}
        title={isApproving ? 'Authorize Carrier Accreditation' : 'Reject Logistics Provider Application'}
        message={
          isApproving
            ? `Confirming this authorization will verify ${provider.companyName} and unlock container capacity publishing privileges across all multimodal routes.`
            : `Rejecting this application will prevent ${provider.companyName} from publishing container inventory. Audit regulations mandate providing a specific operational reason for rejection.`
        }
        confirmLabel={isApproving ? 'Authorize Carrier' : 'Submit Rejection Decision'}
        confirmVariant={isApproving ? 'teal' : 'rust'}
        requiresReason={true} // Prompt requirement: "reject requires a short reason"
        reasonPlaceholder="e.g. Incomplete NVOCC licensing documents, unverifiable CMR insurance policy..."
        onConfirm={handleDecision}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
