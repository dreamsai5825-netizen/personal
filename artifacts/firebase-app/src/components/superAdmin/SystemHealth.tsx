import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Server, Database, CreditCard, Map, Wifi, Clock } from 'lucide-react';

type HealthStatus = 'operational' | 'degraded' | 'outage';

interface HealthItem {
  id: string;
  name: string;
  description: string;
  status: HealthStatus;
  latency?: string;
  uptime: string;
  icon: React.FC<{ className?: string }>;
  lastChecked: string;
}

const statusColor = (s: HealthStatus) => ({
  operational: 'text-green-400',
  degraded: 'text-yellow-400',
  outage: 'text-red-400',
}[s]);

const statusBg = (s: HealthStatus) => ({
  operational: 'bg-green-500/10 border-green-500/20',
  degraded: 'bg-yellow-500/10 border-yellow-500/20',
  outage: 'bg-red-500/10 border-red-500/20',
}[s]);

const StatusIcon: React.FC<{ status: HealthStatus }> = ({ status }) => {
  if (status === 'operational') return <CheckCircle className="w-5 h-5 text-green-400" />;
  if (status === 'degraded') return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  return <XCircle className="w-5 h-5 text-red-400" />;
};

const INITIAL_HEALTH: HealthItem[] = [
  { id: 'api', name: 'API Server', description: 'Core REST API and GraphQL endpoints', status: 'operational', latency: '48ms', uptime: '99.97%', icon: Server, lastChecked: 'Just now' },
  { id: 'db', name: 'Firestore Database', description: 'Primary NoSQL database', status: 'operational', latency: '12ms', uptime: '99.99%', icon: Database, lastChecked: 'Just now' },
  { id: 'payments', name: 'Payment Gateway', description: 'Razorpay payment processing', status: 'operational', latency: '120ms', uptime: '99.95%', icon: CreditCard, lastChecked: 'Just now' },
  { id: 'maps', name: 'Map Services', description: 'Google Maps & routing APIs', status: 'operational', latency: '85ms', uptime: '99.90%', icon: Map, lastChecked: 'Just now' },
  { id: 'fcm', name: 'Push Notifications', description: 'Firebase Cloud Messaging', status: 'operational', latency: '65ms', uptime: '99.85%', icon: Wifi, lastChecked: 'Just now' },
  { id: 'cdn', name: 'CDN / Storage', description: 'Firebase Storage & assets', status: 'operational', latency: '32ms', uptime: '99.98%', icon: Server, lastChecked: 'Just now' },
];

const incidents = [
  { date: 'Jun 15, 2026', title: 'Payment Gateway Slowdown', status: 'Resolved', description: 'Elevated latency on payment processing. Resolved within 45 minutes.' },
  { date: 'Jun 10, 2026', title: 'Maps API Rate Limiting', status: 'Resolved', description: 'Google Maps API quota exceeded briefly. Upgraded API tier to resolve.' },
  { date: 'May 28, 2026', title: 'Scheduled Maintenance', status: 'Completed', description: 'Database maintenance and Firestore index optimization.' },
];

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<HealthItem[]>(INITIAL_HEALTH);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1500));
    setHealth(prev => prev.map(h => ({ ...h, lastChecked: 'Just now' })));
    setLastRefresh(new Date());
    setRefreshing(false);
  };

  const allOperational = health.every(h => h.status === 'operational');
  const hasOutage = health.some(h => h.status === 'outage');
  const hasDegraded = health.some(h => h.status === 'degraded');

  const overallStatus: HealthStatus = hasOutage ? 'outage' : hasDegraded ? 'degraded' : 'operational';
  const overallMessages = {
    operational: 'All systems operational',
    degraded: 'Some systems degraded',
    outage: 'Service outage detected',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">System Health</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time infrastructure status monitoring</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      {/* Overall Status Banner */}
      <div className={`border rounded-xl p-4 mb-6 flex items-center justify-between ${statusBg(overallStatus)}`}>
        <div className="flex items-center gap-3">
          <StatusIcon status={overallStatus} />
          <div>
            <p className={`font-semibold ${statusColor(overallStatus)}`}>{overallMessages[overallStatus]}</p>
            <p className="text-gray-400 text-xs mt-0.5">Last checked: {lastRefresh.toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Clock className="w-3.5 h-3.5" />
          Auto-refreshes every 60s
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {health.map(item => (
          <div key={item.id} className={`bg-gray-900 border rounded-xl p-5 ${item.status !== 'operational' ? statusBg(item.status) : 'border-gray-800'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs">{item.description}</p>
                </div>
              </div>
              <StatusIcon status={item.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-800">
              <div className="text-center">
                <p className="text-gray-500 text-xs">Status</p>
                <p className={`text-xs font-semibold capitalize ${statusColor(item.status)}`}>{item.status}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">Latency</p>
                <p className="text-white text-xs font-semibold">{item.latency || '—'}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">Uptime</p>
                <p className="text-green-400 text-xs font-semibold">{item.uptime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Incident History */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-white font-semibold">Recent Incidents</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {incidents.map((inc, i) => (
            <div key={i} className="px-5 py-4 flex items-start gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-medium">{inc.title}</p>
                  <span className="text-green-400 text-xs font-medium bg-green-500/10 px-2 py-0.5 rounded-full">{inc.status}</span>
                </div>
                <p className="text-gray-400 text-xs">{inc.description}</p>
                <p className="text-gray-600 text-xs mt-1">{inc.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
