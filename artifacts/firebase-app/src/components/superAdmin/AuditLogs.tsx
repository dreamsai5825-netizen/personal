import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Search, Filter, Shield, Edit, Settings, DollarSign, Users } from 'lucide-react';

interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failed';
}

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

const asDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    const parsed = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const formatTimestamp = (value: unknown) => {
  const parsed = asDate(value);
  if (!parsed) return 'Unknown';
  return parsed.toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const normalizeStatus = (value: unknown): 'success' | 'failed' =>
  String(value ?? '').toLowerCase() === 'failed' ? 'failed' : 'success';

const normalizedLog = (id: string, data: Record<string, unknown>): AuditLog => ({
  id,
  adminName: String(data.adminName ?? data.admin ?? data.actorName ?? 'Unknown Admin'),
  action: String(data.action ?? data.description ?? 'No action recorded'),
  module: String(data.module ?? data.category ?? 'General'),
  timestamp: formatTimestamp(data.timestamp ?? data.createdAt ?? data.updatedAt),
  ipAddress: String(data.ipAddress ?? data.ip ?? 'N/A'),
  status: normalizeStatus(data.status),
});

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'audit_logs'),
      (snapshot) => {
        const nextLogs = snapshot.docs
          .map((doc) => normalizedLog(doc.id, doc.data() as Record<string, unknown>))
          .sort((left, right) => right.timestamp.localeCompare(left.timestamp));
        setLogs(nextLogs);
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        console.error('Realtime audit log listener failed:', snapshotError);
        setLogs([]);
        setLoading(false);
        setError('Realtime audit logs could not be loaded.');
      },
    );

    return () => unsubscribe();
  }, []);

  const modules = useMemo(
    () => ['all', ...Array.from(new Set(logs.map((log) => log.module))).sort((left, right) => left.localeCompare(right))],
    [logs],
  );

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.adminName.toLowerCase().includes(search.toLowerCase()) ||
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

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by admin, action, or IP..."
            className="w-full bg-gray-900 border border-gray-700 text-gray-200 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
          />
        </div>
        <select
          value={moduleFilter}
          onChange={(event) => setModuleFilter(event.target.value)}
          className="bg-gray-900 border border-gray-700 text-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {modules.map((module) => <option key={module} value={module}>{module === 'all' ? 'All Modules' : module}</option>)}
        </select>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/50">
              {['Admin', 'Action', 'Module', 'Timestamp', 'IP Address', 'Status'].map((heading) => (
                <th key={heading} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-12">Loading live audit logs...</td>
              </tr>
            )}
            {!loading && filtered.map((log) => (
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
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-12">
                  {logs.length === 0 ? 'No audit logs have been recorded yet.' : 'No logs found for the current filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
