import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { toArray } from '../../services/response';
import { IconUsers, IconFilter, IconMail, IconPhone, IconShield } from '@tabler/icons-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/users');
        setUsers(toArray(res.data));
      } catch (err) {
        console.warn('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = roleFilter === 'ALL'
    ? users
    : users.filter((u) => u.role === roleFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Header */}
      <div className="border-b border-[#D8D1C3] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-port-gray block">
            System User Directory
          </span>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-port-dark">
            Platform Users & Operator Accounts
          </h1>
          <p className="text-xs text-port-gray font-mono mt-0.5">
            Master account registry for Exporters, Importers, and Logistics Carriers
          </p>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono uppercase text-port-gray mr-2 flex items-center gap-1">
          <IconFilter size={14} /> Filter Role:
        </span>
        {['ALL', 'TRADER', 'PROVIDER', 'ADMIN'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1 text-xs font-heading font-semibold uppercase tracking-wider rounded-[2px] transition-colors ${
              roleFilter === r
                ? 'bg-port-dark text-white'
                : 'bg-white text-port-gray hover:bg-[#FAF8F5] border border-port-gray/30'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#D8D1C3] rounded-[2px] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-port-gray">
            Querying platform user accounts...
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title="No Users Found"
            description={`No user accounts registered under ${roleFilter} role.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-port-gray font-mono uppercase text-[10px] border-b border-[#E7E2D6]">
                <tr>
                  <th className="px-4 py-3">Account ID / Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Corporate Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Vetting Status</th>
                  <th className="px-4 py-3">Account State</th>
                  <th className="px-4 py-3 text-right">Registration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D6] font-mono">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3 font-bold text-port-dark font-sans">
                      <div className="text-sm">{u.name || u.companyName}</div>
                      <div className="text-[10px] text-port-gray font-mono font-normal">{u.id}</div>
                    </td>
                    <td className="px-4 py-3 font-heading font-bold text-xs uppercase">
                      <span className={u.role === 'ADMIN' ? 'text-purple-700' : u.role === 'PROVIDER' ? 'text-port-teal' : 'text-port-orange'}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-port-dark font-sans">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-port-gray">
                      {u.phone || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {u.role === 'PROVIDER' ? (
                        <StatusBadge status={u.providerStatus || 'PENDING'} />
                      ) : (
                        <span className="text-[10px] text-port-gray">Self-Activated</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={u.status || 'ACTIVE'} />
                    </td>
                    <td className="px-4 py-3 text-right text-port-gray">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
