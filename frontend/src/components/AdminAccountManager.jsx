import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  User, 
  Trash2, 
  Mail, 
  Phone, 
  Building, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  X
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AdminAccountManager() {
  const { user: currentAdmin } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // New User Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    company: '',
    phone: ''
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (targetUser) => {
    if (targetUser.id === currentAdmin?.id) {
      alert('You cannot change your own role while logged in.');
      return;
    }

    const nextRole = targetUser.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!window.confirm(`Change role of "${targetUser.name}" to ${nextRole}?`)) return;

    try {
      await api.updateUser(targetUser.id, { role: nextRole });
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === currentAdmin?.id) {
      alert('You cannot delete your own active administrator account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user account "${targetUser.name}" (${targetUser.email}) from MongoDB?`)) {
      return;
    }

    try {
      await api.deleteUser(targetUser.id);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user account');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);

    try {
      await api.createUser(formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'CUSTOMER', company: '', phone: '' });
      fetchUsers();
    } catch (err) {
      setModalError(err.message || 'Failed to create user account.');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.company?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const customerCount = users.filter(u => u.role === 'CUSTOMER').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Account KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Registered Accounts</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {users.length}
          </div>
          <p className="text-[11px] text-slate-500">
            Stored in cloud MongoDB Atlas database
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-purple-700 text-xs font-bold uppercase tracking-wider">
            <span>Administrator Seats</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-950 font-mono">
            {adminCount}
          </div>
          <p className="text-[11px] text-purple-700">
            Full management and booking override privileges
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold uppercase tracking-wider">
            <span>Client / Customer Accounts</span>
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-950 font-mono">
            {customerCount}
          </div>
          <p className="text-[11px] text-blue-700">
            Clients placing holds and event reservations
          </p>
        </div>
      </div>

      {/* Main Ledger Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  roleFilter === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Accounts ({users.length})
              </button>
              <button
                onClick={() => setRoleFilter('ADMIN')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  roleFilter === 'ADMIN' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admins ({adminCount})
              </button>
              <button
                onClick={() => setRoleFilter('CUSTOMER')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  roleFilter === 'CUSTOMER' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customers ({customerCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, company..."
                className="w-full bg-white pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-5">User Profile</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Role / Permissions</th>
                <th className="p-3.5">Company & Organization</th>
                <th className="p-3.5">Phone Number</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentAdmin?.id;
                  const isAdminRole = u.role === 'ADMIN';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isAdminRole ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.name?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">ID: #{u.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-800">
                        {u.email}
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isAdminRole
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {isAdminRole ? <ShieldCheck className="w-3 h-3 text-purple-600" /> : <User className="w-3 h-3 text-blue-600" />}
                          <span>{u.role}</span>
                        </span>
                      </td>

                      <td className="p-3.5 text-slate-600">
                        {u.company || <span className="text-slate-400 italic">Individual Client</span>}
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-600">
                        {u.phone || <span className="text-slate-400 italic">Not set</span>}
                      </td>

                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRoleToggle(u)}
                            disabled={isCurrent}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
                            title="Toggle role between ADMIN and CUSTOMER"
                          >
                            {isAdminRole ? 'Demote to Client' : 'Make Admin'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={isCurrent}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-40 cursor-pointer"
                            title="Delete user from MongoDB"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400">
                    No accounts found matching current query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Create New Account
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add new administrator or client account into MongoDB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jonathan Pierce"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900 cursor-pointer"
                  >
                    <option value="CUSTOMER">Client / Customer</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Global"
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{modalLoading ? 'Creating in MongoDB...' : 'Create Account'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
