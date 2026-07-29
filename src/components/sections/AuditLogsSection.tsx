import { useState, useEffect, useMemo } from 'react';
import { getLoginLogs, getAllUsers, createUser, deleteUser } from '@/store/authStore';

interface LoginLog {
  id: string;
  username: string;
  email: string;
  role: string | null;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
}

interface UserAccount {
  username: string;
  email: string;
  role: string | null;
  createdAt: string;
}

function parseUserAgent(ua: string): string {
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return 'Other';
}

export function AuditLogsSection() {
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filterEmail, setFilterEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);

  // New user form
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const pageSize = 15;

  useEffect(() => {
    setLogs(getLoginLogs());
    setUsers(getAllUsers());
  }, []);

  const filteredLogs = useMemo(() => {
    if (!filterEmail.trim()) return logs;
    return logs.filter(l => l.email.toLowerCase().includes(filterEmail.toLowerCase()) || l.username.toLowerCase().includes(filterEmail.toLowerCase()));
  }, [logs, filterEmail]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCSV = () => {
    const headers = 'Username,Email,Role,Login Time,IP Address,Browser\n';
    const rows = filteredLogs.map(l =>
      `"${l.username}","${l.email}","${l.role || ''}","${l.loginTime}","${l.ipAddress}","${parseUserAgent(l.userAgent)}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `login_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareDashboardLink = () => {
    navigator.clipboard.writeText(window.location.origin).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!newUsername.trim() || !newPassword.trim()) {
      setFormError('Username and password are required.');
      return;
    }
    if (newUsername.includes(' ') || newUsername.includes('@')) {
      setFormError('Username should not contain spaces or @.');
      return;
    }
    const result = createUser(newUsername.trim(), newPassword.trim(), newRole);
    if (result.success) {
      setFormSuccess(`✓ User "${newUsername}@icicilombard.com" created as ${newRole}.`);
      setNewUsername('');
      setNewPassword('');
      setUsers(getAllUsers());
      setTimeout(() => setFormSuccess(''), 3000);
    } else {
      setFormError(result.error || 'Failed to create user.');
    }
  };

  const handleDeleteUser = (username: string) => {
    if (username === 'admin' || username === 'user') return; // Can't delete defaults
    deleteUser(username);
    setUsers(getAllUsers());
  };

  return (
    <div className="space-y-5">
      {/* Share Dashboard Card */}
      <div className="icici-card p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-icici-navy via-icici-maroon to-icici-orange" />
        <div className="flex items-center justify-between mt-1">
          <div>
            <h2 className="text-lg font-black text-gray-800">🔗 Share Dashboard</h2>
            <p className="text-xs text-gray-500">Share with authorized users only</p>
          </div>
          <button
            onClick={shareDashboardLink}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              copied ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gradient-to-r from-icici-maroon to-icici-navy text-white hover:opacity-90'
            }`}
          >
            {copied ? '✓ Link Copied!' : '📋 Copy Link'}
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-icici-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}>
          👥 User Management
        </button>
        <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'logs' ? 'bg-icici-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}>
          📋 Login Audit Logs
        </button>
      </div>

      {/* USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="space-y-5">
          {/* Create User Form */}
          <div className="icici-card p-5">
            <h3 className="text-sm font-black text-gray-800 mb-4">➕ Create New User</h3>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 laptop:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Username</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="firstname.lastname"
                    className="w-full px-3 py-2.5 rounded-l-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-icici-navy"
                  />
                  <span className="px-2 py-2.5 bg-gray-100 border border-l-0 border-gray-200 rounded-r-xl text-xs font-bold text-gray-500 whitespace-nowrap">@icicilombard.com</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Password</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Set password"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-icici-navy"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-icici-navy"
                >
                  <option value="user">👤 User</option>
                  <option value="admin">🔑 Admin</option>
                </select>
              </div>
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all">
                ✓ Create User
              </button>
            </form>
            {formError && <p className="mt-2 text-xs font-bold text-red-600">🚫 {formError}</p>}
            {formSuccess && <p className="mt-2 text-xs font-bold text-green-600">{formSuccess}</p>}
          </div>

          {/* Users List */}
          <div className="icici-card p-5">
            <h3 className="text-sm font-black text-gray-800 mb-3">👥 All Users ({users.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">Username</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">Email</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">Role</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">Created</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.username} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-xs font-bold text-gray-800">{u.username}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-600">{u.email}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role === 'admin' ? '🔑 Admin' : '👤 User'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-gray-500">{u.createdAt}</td>
                      <td className="py-2.5 px-3">
                        {u.username !== 'admin' && u.username !== 'user' ? (
                          <button onClick={() => handleDeleteUser(u.username)} className="text-xs font-bold text-red-500 hover:text-red-700">🗑️ Delete</button>
                        ) : (
                          <span className="text-[10px] text-gray-400">Default</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="icici-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-gray-800">📋 Login Activity</h3>
              <p className="text-xs text-gray-500">{filteredLogs.length} records</p>
            </div>
            <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold text-xs hover:bg-green-700 transition-all">
              📥 Export CSV
            </button>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={filterEmail}
              onChange={(e) => { setFilterEmail(e.target.value); setCurrentPage(1); }}
              placeholder="🔍 Filter by username or email..."
              className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-icici-navy"
            />
          </div>

          {paginatedLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">User</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">Email</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">Role</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">Login Time</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">IP</th>
                    <th className="text-left py-2 px-3 font-bold text-gray-600 text-xs uppercase">Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map(log => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-xs font-bold text-gray-800">{log.username}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-600">{log.email}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${log.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {log.role === 'admin' ? '🔑' : '👤'} {log.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-gray-600">{log.loginTime}</td>
                      <td className="py-2.5 px-3 text-xs font-mono text-gray-500">{log.ipAddress}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-500">{parseUserAgent(log.userAgent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 text-sm text-gray-400">No login records yet.</p>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Page {currentPage} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 disabled:opacity-30">← Prev</button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 disabled:opacity-30">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
