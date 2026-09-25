import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProviderApplicationForm from '../../components/ProviderApplicationForm';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function ProviderRegister() {
  const { registerProvider } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleProviderSubmit = async (formData, onSuccess) => {
    setSubmitting(true);
    setApiError('');
    const res = await registerProvider(formData);
    setSubmitting(false);

    if (res.success) {
      onSuccess();
    } else {
      setApiError(res.message || 'Submission encountered an operational exception.');
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      {apiError && (
        <div className="max-w-3xl mx-auto mb-4 p-3 bg-red-50 border border-port-rust/30 rounded-[2px] text-xs text-port-rust flex items-center gap-2 font-mono">
          <IconAlertTriangle size={16} />
          <span>{apiError}</span>
        </div>
      )}

      <ProviderApplicationForm
        onSubmit={handleProviderSubmit}
        submitting={submitting}
      />
    </div>
  );
}
