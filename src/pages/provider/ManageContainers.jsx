import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import CapacityBar from '../../components/CapacityBar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { toArray } from '../../services/response';
import {
  IconPlus,
  IconEdit,
  IconCheck,
  IconX,
  IconShip,
  IconTrain,
  IconTruck,
  IconPlane,
  IconBolt
} from '@tabler/icons-react';

export default function ManageContainers() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editingContainer, setEditingContainer] = useState(null);
  const [editAvailable, setEditAvailable] = useState('');
  const [editStatus, setEditStatus] = useState('AVAILABLE');
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchContainers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/provider/dashboard');
      setContainers(toArray(res.data?.containers));
    } catch (err) {
      console.warn('Failed to load fleet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const openEdit = (c) => {
    setEditingContainer(c);
    setEditAvailable(c.availableCapacity);
    setEditStatus(c.status);
    setEditPrice(c.pricePerCbm);
  };

  const closeEdit = () => {
    setEditingContainer(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingContainer) return;

    setSaving(true);
    try {
      const payload = {
        availableCapacity: parseFloat(editAvailable),
        status: editStatus,
        pricePerCbm: parseFloat(editPrice),
      };

      const res = await api.put(`/containers/${editingContainer.id}/update`, payload);
      setContainers((prev) =>
        prev.map((item) => (item.id === editingContainer.id ? res.data : item))
      );
      closeEdit();
    } catch (err) {
      alert('Failed to update container manifest: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            Operational Asset Control
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Manage Container Fleet Capacity
          </h1>
        </div>

        <Link
          to="/provider/containers/new"
          className="px-4 py-2 bg-port-teal hover:bg-port-tealDark text-white font-heading font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-sm flex items-center gap-1.5 transition-colors self-start"
        >
          <IconPlus size={15} />
          <span>Publish New Container</span>
        </Link>
      </div>

      {/* Containers Fleet Table */}
      <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-port-gray">
            Querying active container assets...
          </div>
        ) : containers.length === 0 ? (
          <EmptyState
            title="No Containers in Fleet"
            description="Your operating fleet currently has no registered containers."
            actionText="Publish Container Space"
            actionLink="/provider/containers/new"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                <tr>
                  <th className="px-4 py-3">Unit ID / Container #</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Route Lane</th>
                  <th className="px-4 py-3 w-64">Live Capacity Allocation</th>
                  <th className="px-4 py-3">Rate / CBM</th>
                  <th className="px-4 py-3">Departure</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D6] font-mono">
                {containers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-port-dark text-sm">{c.containerNumber}</div>
                      <div className="text-[10px] text-port-grayLight">{c.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-port-dark font-sans">{c.mode}</span>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <div className="font-medium text-port-dark">{c.origin}</div>
                      <div className="text-[10px] text-port-gray">→ {c.destination}</div>
                    </td>
                    <td className="px-4 py-3">
                      <CapacityBar
                        total={c.totalCapacity}
                        available={c.availableCapacity}
                        height="h-3"
                      />
                    </td>
                    <td className="px-4 py-3 font-heading font-bold text-port-dark text-sm tabular-nums">
                      ${c.pricePerCbm.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-port-gray">
                      {new Date(c.departureDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(c)}
                        className="px-3 py-1 bg-port-dark hover:bg-port-darker text-white font-heading font-bold text-[10px] uppercase tracking-wider rounded-[2px] transition-colors flex items-center gap-1 ml-auto"
                      >
                        <IconEdit size={12} />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Container Modal */}
      {editingContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-port-dark max-w-md w-full rounded-[2px] shadow-2xl p-6 text-left font-body">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8D1C3]">
              <div>
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-port-dark">
                  Adjust Container Capacity & Status
                </h3>
                <span className="font-mono text-xs text-port-gray">
                  Unit: {editingContainer.containerNumber}
                </span>
              </div>
              <button onClick={closeEdit} className="text-port-gray hover:text-port-dark">
                <IconX size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="py-4 space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
                  Available Capacity (CBM)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={editingContainer.totalCapacity}
                  value={editAvailable}
                  onChange={(e) => setEditAvailable(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
                  required
                />
                <span className="text-[10px] text-port-gray font-mono mt-0.5 block">
                  Max container capacity: {editingContainer.totalCapacity} CBM
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
                  Rate per CBM (USD)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-port-gray mb-1 font-semibold">
                  Container Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full text-xs p-2 border border-port-gray/40 rounded-[2px] focus:border-port-teal focus:outline-none bg-[#FAF8F5]"
                >
                  <option value="AVAILABLE">AVAILABLE (Open for bookings)</option>
                  <option value="FULL">FULL (No remaining space)</option>
                  <option value="DEPARTED">DEPARTED (En route)</option>
                  <option value="CLOSED">CLOSED (Archived / cancelled)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D8D1C3]">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-3 py-1.5 text-xs font-heading font-semibold text-port-gray hover:text-port-dark border border-port-gray/30 rounded-[2px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-port-teal hover:bg-port-tealDark text-white text-xs font-heading font-bold uppercase tracking-wider rounded-[2px] flex items-center gap-1"
                >
                  <IconCheck size={14} />
                  <span>{saving ? 'Transmitting...' : 'Save Updates'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
