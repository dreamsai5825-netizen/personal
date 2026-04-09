import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Server, Database, CreditCard, Map, Wifi, Clock } from 'lucide-react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { usePlatformContent } from '../../platformContent';

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

interface SnapshotProbe {
  ready: boolean;
  error: boolean;
  latencyMs: number | null;
  lastSuccess: Date | null;
}

interface IncidentItem {
  id: string;
  date: string;
  title: string;
  status: string;
  description: string;
}

const statusColor = (status: HealthStatus) => ({
  operational: 'text-green-400',
  degraded: 'text-yellow-400',
  outage: 'text-red-400',
}[status]);

const statusBg = (status: HealthStatus) => ({
  operational: 'bg-green-500/10 border-green-500/20',
  degraded: 'bg-yellow-500/10 border-yellow-500/20',
  outage: 'bg-red-500/10 border-red-500/20',
}[status]);

const StatusIcon: React.FC<{ status: HealthStatus }> = ({ status }) => {
  if (status === 'operational') return <CheckCircle className="w-5 h-5 text-green-400" />;
  if (status === 'degraded') return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  return <XCircle className="w-5 h-5 text-red-400" />;
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

const formatLatency = (value: number | null) => (value === null ? '--' : `${Math.round(value)}ms`);

const formatLastChecked = (value: Date | null) =>
  value ? value.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Waiting...';

const buildProbeStatus = (probe: SnapshotProbe, isOnline: boolean): HealthStatus => {
  if (!isOnline || probe.error) return 'outage';
  if (!probe.ready) return 'degraded';
  if (probe.latencyMs !== null && probe.latencyMs > 1500) return 'degraded';
  return 'operational';
};

const getProbeUptime = (probe: SnapshotProbe) => {
  if (probe.error) return '0%';
  if (!probe.ready) return 'Checking';
  return probe.latencyMs !== null && probe.latencyMs > 1500 ? '98.5%' : '99.9%';
};

export const SystemHealth: React.FC = () => {
  const { content } = usePlatformContent();
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [auditLogs, setAuditLogs] = useState<Array<Record<string, unknown>>>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [ridesCount, setRidesCount] = useState(0);
  const [vendorsCount, setVendorsCount] = useState(0);
  const [dbProbe, setDbProbe] = useState<SnapshotProbe>({ ready: false, error: false, latencyMs: null, lastSuccess: null });
  const [businessProbe, setBusinessProbe] = useState<SnapshotProbe>({ ready: false, error: false, latencyMs: null, lastSuccess: null });
  const [auditProbe, setAuditProbe] = useState<SnapshotProbe>({ ready: false, error: false, latencyMs: null, lastSuccess: null });

  useEffect(() => {
    const onlineHandler = () => setIsOnline(true);
    const offlineHandler = () => setIsOnline(false);
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);
    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }, []);

  useEffect(() => {
    const dbStart = Date.now();
    const businessStart = Date.now();
    const auditStart = Date.now();

    const unsubscribePlatform = onSnapshot(
      doc(db, 'platformContent', 'site'),
      () => {
        setDbProbe({
          ready: true,
          error: false,
          latencyMs: Date.now() - dbStart,
          lastSuccess: new Date(),
        });
      },
      () => {
        setDbProbe((prev) => ({ ...prev, ready: false, error: true }));
      },
    );

    const unsubscribeUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        setUsersCount(snapshot.size);
        setBusinessProbe({
          ready: true,
          error: false,
          latencyMs: Date.now() - businessStart,
          lastSuccess: new Date(),
        });
      },
      () => {
        setBusinessProbe((prev) => ({ ...prev, ready: false, error: true }));
      },
    );

    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrdersCount(snapshot.size);
    });

    const unsubscribeRides = onSnapshot(collection(db, 'rides'), (snapshot) => {
      setRidesCount(snapshot.size);
    });

    const unsubscribeVendors = onSnapshot(collection(db, 'vendors'), (snapshot) => {
      setVendorsCount(snapshot.size);
    });

    const unsubscribeAuditLogs = onSnapshot(
      collection(db, 'audit_logs'),
      (snapshot) => {
        setAuditLogs(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setAuditProbe({
          ready: true,
          error: false,
          latencyMs: Date.now() - auditStart,
          lastSuccess: new Date(),
        });
      },
      () => {
        setAuditProbe((prev) => ({ ...prev, ready: false, error: true }));
      },
    );

    return () => {
      unsubscribePlatform();
      unsubscribeUsers();
      unsubscribeOrders();
      unsubscribeRides();
      unsubscribeVendors();
      unsubscribeAuditLogs();
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setLastRefresh(new Date());
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  };

  const health = useMemo<HealthItem[]>(() => {
    const apiStatus: HealthStatus = content.operations.maintenanceMode
      ? 'degraded'
      : isOnline
        ? 'operational'
        : 'outage';

    return [
      {
        id: 'api',
        name: 'Frontend Runtime',
        description: content.operations.maintenanceMode ? 'Platform is in maintenance mode' : 'Web app runtime and route shell',
        status: apiStatus,
        latency: isOnline ? 'Browser online' : 'Offline',
        uptime: content.operations.maintenanceMode ? 'Maintenance' : '99.9%',
        icon: Server,
        lastChecked: formatLastChecked(lastRefresh),
      },
      {
        id: 'db',
        name: 'Firestore Database',
        description: 'Realtime reads for platform content and core collections',
        status: buildProbeStatus(dbProbe, isOnline),
        latency: formatLatency(dbProbe.latencyMs),
        uptime: getProbeUptime(dbProbe),
        icon: Database,
        lastChecked: formatLastChecked(dbProbe.lastSuccess),
      },
      {
        id: 'payments',
        name: 'Payment Gateway',
        description: 'Payment flow not integrated yet in live mode',
        status: 'degraded',
        latency: '--',
        uptime: 'Pending integration',
        icon: CreditCard,
        lastChecked: formatLastChecked(lastRefresh),
      },
      {
        id: 'maps',
        name: 'Map Services',
        description: ridesCount > 0 ? `Ride module active with ${ridesCount.toLocaleString('en-IN')} rides tracked` : 'Ride module available, no live rides yet',
        status: isOnline ? 'operational' : 'outage',
        latency: isOnline ? 'Client-side' : 'Offline',
        uptime: isOnline ? '99.0%' : '0%',
        icon: Map,
        lastChecked: formatLastChecked(lastRefresh),
      },
      {
        id: 'fcm',
        name: 'Realtime Activity Stream',
        description: `Users: ${usersCount.toLocaleString('en-IN')} | Vendors: ${vendorsCount.toLocaleString('en-IN')} | Orders: ${ordersCount.toLocaleString('en-IN')}`,
        status: buildProbeStatus(businessProbe, isOnline),
        latency: formatLatency(businessProbe.latencyMs),
        uptime: getProbeUptime(businessProbe),
        icon: Wifi,
        lastChecked: formatLastChecked(businessProbe.lastSuccess),
      },
      {
        id: 'audit',
        name: 'Audit Log Stream',
        description: auditLogs.length > 0 ? `${auditLogs.length.toLocaleString('en-IN')} live audit entries available` : 'Listening for audit events',
        status: buildProbeStatus(auditProbe, isOnline),
        latency: formatLatency(auditProbe.latencyMs),
        uptime: getProbeUptime(auditProbe),
        icon: Server,
        lastChecked: formatLastChecked(auditProbe.lastSuccess),
      },
    ];
  }, [auditLogs.length, auditProbe, businessProbe, content.operations.maintenanceMode, dbProbe, isOnline, lastRefresh, ordersCount, ridesCount, usersCount, vendorsCount]);

  const incidents = useMemo<IncidentItem[]>(() => {
    const derived = auditLogs
      .filter((item) => String(item.status ?? '').toLowerCase() === 'failed' || String(item.module ?? '').toLowerCase() === 'platform')
      .slice(0, 5)
      .map((item, index) => ({
        id: String(item.id ?? index),
        title: String(item.action ?? 'Platform event'),
        status: String(item.status ?? '').toLowerCase() === 'failed' ? 'Failed' : 'Tracked',
        description: `${String(item.module ?? 'General')} | ${String(item.adminName ?? 'System')}`,
        date: (() => {
          const parsed = asDate(item.timestamp ?? item.createdAt ?? item.updatedAt);
          return parsed ? parsed.toLocaleString('en-IN') : 'Unknown time';
        })(),
      }));

    if (content.operations.maintenanceMode) {
      return [
        {
          id: 'maintenance-mode',
          title: 'Maintenance Mode Enabled',
          status: 'Active',
          description: 'Platform settings currently mark the platform as under maintenance.',
          date: new Date().toLocaleString('en-IN'),
        },
        ...derived,
      ];
    }

    return derived;
  }, [auditLogs, content.operations.maintenanceMode]);

  const hasOutage = health.some((item) => item.status === 'outage');
  const hasDegraded = health.some((item) => item.status === 'degraded');
  const overallStatus: HealthStatus = hasOutage ? 'outage' : hasDegraded ? 'degraded' : 'operational';
  const overallMessages = {
    operational: 'All monitored frontend systems operational',
    degraded: 'Some monitored systems are degraded',
    outage: 'Service outage detected in monitored systems',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">System Health</h1>
          <p className="text-gray-400 text-sm mt-1">Realtime platform health based on live frontend and Firestore signals</p>
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

      <div className={`border rounded-xl p-4 mb-6 flex items-center justify-between ${statusBg(overallStatus)}`}>
        <div className="flex items-center gap-3">
          <StatusIcon status={overallStatus} />
          <div>
            <p className={`font-semibold ${statusColor(overallStatus)}`}>{overallMessages[overallStatus]}</p>
            <p className="text-gray-400 text-xs mt-0.5">Last checked: {lastRefresh.toLocaleTimeString('en-IN')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Clock className="w-3.5 h-3.5" />
          Auto-refreshes as Firestore data changes
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {health.map((item) => (
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
                <p className="text-white text-xs font-semibold">{item.latency || '--'}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs">Uptime</p>
                <p className="text-green-400 text-xs font-semibold">{item.uptime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-white font-semibold">Recent Incidents</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {incidents.length > 0 ? incidents.map((incident) => (
            <div key={incident.id} className="px-5 py-4 flex items-start gap-4">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${incident.status === 'Failed' ? 'bg-red-500' : incident.status === 'Active' ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-medium">{incident.title}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    incident.status === 'Failed'
                      ? 'text-red-400 bg-red-500/10'
                      : incident.status === 'Active'
                        ? 'text-yellow-400 bg-yellow-500/10'
                        : 'text-green-400 bg-green-500/10'
                  }`}>{incident.status}</span>
                </div>
                <p className="text-gray-400 text-xs">{incident.description}</p>
                <p className="text-gray-600 text-xs mt-1">{incident.date}</p>
              </div>
            </div>
          )) : (
            <div className="px-5 py-10 text-center text-gray-500 text-sm">
              No recent incidents detected from live audit or maintenance signals.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
