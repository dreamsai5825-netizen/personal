import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, Filter, Shield, Edit, Trash2, Settings, DollarSign, Users } from 'lucide-react';

interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

const DEMO_LOGS: AuditLog[] = [
  { id: '1', adminName: 'Rahul Sharma', action: 'Updated Food Commission to 20%', module: 'Commission', timestamp: '2026-06-18 14:32:10', ipAddress: '192.168.1.42', status: 'success' },
  { id: '2', adminName: 'Priya Singh', action: 'Created new admin: Vikram Nair', module: 'Admin Management', timestamp: '2026-06-18 13:15:44', ipAddress: '192.168.1.18', status: 'success' },
  { id: '3', adminName: 'Amit Kumar', action: 'Disabled vendor: Spice Garden', module: 'Vendors', timestamp: '2026-06-18 12:08:22', ipAddress: '10.0.0.55', status: 'success' },
  { id: '4', adminName: 'Rahul Sharma', action: 'Updated Platform Settings', module: 'Platform', timestamp: '2026-06-18 11:45:00', ipAddress: '192.168.1.42', status: 'success' },
  { id: '5', adminName: 'Sneha Patel', action: 'Failed login attempt', module: 'Auth', timestamp: '2026-06-18 10:30:15', ipAddress: '10.0.0.78', status: 'failed' },
  { id: '6', adminName: 'Vikram Nair', action: 'Enabled Maintenance Mode', module: 'Platform', timestamp: '2026-06-17 22:15:30', ipAddress: '192.168.2.10', status: 'success' },
  { id: '7', adminName: 'Rahul Sharma', action: 'Disabled Maintenance Mode', module: 'Platform', timestamp: '2026-06-17 23:00:00', ipAddress: '192.168.1.42', status: 'success' },
  { id: '8', adminName: 'Amit Kumar', action: 'Exported Revenue Report', module: 'Analytics', timestamp: '2026-06-17 17:22:11', ipAddress: '10.0.0.55', status: 'success' },
  { id: '9', adminName: 'Priya Singh', action: 'Updated Ride Commission to 15%', module: 'Commission', timestamp: '2026-06-17 15:10:05', ipAddress: '192.168.1.18', status: 'success' },
  { id: '10', adminName: 'Rahul Sharma', action: 'Deleted admin: Old Admin', module: 'Admin Management', timestamp: '2026-06-17 14:05:55', ipAddress: '192.168.1.42', status: 'success' },
];

const moduleIcon = (module: string) => {
  const map: Record<string, React.ReactNode> = {
    Commission: <DollarSign className="w-3.5 h-3.5" />,
    'Admin Management': <Users className="w-3.5 h-3.5" />,
    Platform: <Settings className="w-3.5 h-3.5" />,
    Auth: <Shield className="w-3.5 h-3.5" />,
    Analytics: <Filter className="w-3.5 h-3.5" />,
    Vendors: <Edit className="w-3.5 h-3.5" />,
  };
  return map[module] || <Shield className="w-3.5 h-3.5" />;
};

const moduleBg = (module: string) => {
  const map: Record<string, string> = {
    Commission: 'bg-green-500/20 text-green-400',
    'Admin Management': 'bg-blue-500/20 text-blue-400',
    Platform: 'bg-orange-500/20 text-orange-400',
    Auth: 'bg-red-500/20 text-red-400',
    Analytics: 'bg-purple-500/20 text-purple-400',
    Vendors: 'bg-yellow-500/20 text-yellow-400',
  };
  return map[module] || 'bg-gray-500/20 text-gray-400';
};

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(DEMO_LOGS);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(50));
        const snap = await getDocs(q);
        if (snap.size > 0) {
          setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog)));
        }
      } catch (e) {}
    };
    fetchLogs();
  }, []);

  const modules = ['all', ...Array.from(new Set(logs.map(l => l.module)))];

  const filtered = logs.filter(log => {
    const matchSearch = log.adminName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);
    const matchModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchSearch && matchModule;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Audit Logs</h1>
          <p className="text-gray-400 text-sm mt-1">Track all admin actions and system events</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by admin, action, or IP..."
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {modules.map(m => <option key={m} value={m}>{m === 'all' ? 'All Modules' : m}</option>)}
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/50">
              {['Admin', 'Action', 'Module', 'Timestamp', 'IP Address', 'Status'].map(h => (
                <th key={h} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 text-xs font-semibold">
                      {log.adminName.charAt(0)}
                    </div>
                    <span className="text-white text-sm">{log.adminName}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-300 text-sm max-w-xs truncate">{log.action}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${moduleBg(log.module)}`}>
                    {moduleIcon(log.module)} {log.module}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs font-mono">{log.timestamp}</td>
                <td className="px-5 py-3 text-gray-500 text-xs font-mono">{log.ipAddress}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-500 py-12">No logs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
