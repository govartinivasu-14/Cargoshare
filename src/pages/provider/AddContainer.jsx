import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ContainerForm from '../../components/ContainerForm';
import { IconArrowLeft, IconAlertTriangle } from '@tabler/icons-react';

export default function AddContainer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleAddContainer = async (formData) => {
    setSubmitting(true);
    setApiError('');

    try {
      const payload = {
        ...formData,
        providerId: user?.id,
        providerName: user?.name,
      };

      await api.post('/containers/add', payload);
      navigate('/provider/containers');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to list container on network.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      <div className="text-xs font-mono text-port-gray pb-2 border-b border-[#D8D1C3]">
        <Link to="/provider" className="hover:underline flex items-center gap-1">
          <IconArrowLeft size={14} /> Back to Provider Fleet Operations
        </Link>
      </div>

      {apiError && (
        <div className="p-3 bg-red-50 border border-port-rust/40 rounded-[2px] text-xs text-port-rust font-mono flex items-center gap-2">
          <IconAlertTriangle size={18} />
          <span>{apiError}</span>
        </div>
      )}

      <ContainerForm
        onSubmit={handleAddContainer}
        providerStatus={user?.providerStatus || 'APPROVED'}
        submitting={submitting}
      />
    </div>
  );
}
