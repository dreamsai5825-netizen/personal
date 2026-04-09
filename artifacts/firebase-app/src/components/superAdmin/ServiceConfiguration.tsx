import React, { useEffect, useRef, useState } from 'react';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Save, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { db } from '../../firebase';

interface ServiceConfig {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  minOrder: number;
  deliveryFee: number;
  surgeEnabled: boolean;
  surgeMultiplier: number;
  updatedAt?: string;
}

const DEFAULT_SERVICES: ServiceConfig[] = [
  { id: 'food', name: 'Food Delivery', icon: '🍕', enabled: true, minOrder: 100, deliveryFee: 30, surgeEnabled: false, surgeMultiplier: 1.5 },
  { id: 'grocery', name: 'Grocery Delivery', icon: '🛒', enabled: true, minOrder: 200, deliveryFee: 25, surgeEnabled: false, surgeMultiplier: 1.3 },
  { id: 'home_services', name: 'Home Services', icon: '🔧', enabled: true, minOrder: 300, deliveryFee: 0, surgeEnabled: false, surgeMultiplier: 1.2 },
  { id: 'bike_taxi', name: 'Bike Taxi', icon: '🏍️', enabled: true, minOrder: 0, deliveryFee: 0, surgeEnabled: true, surgeMultiplier: 1.5 },
  { id: 'auto_taxi', name: 'Auto Taxi', icon: '🛺', enabled: true, minOrder: 0, deliveryFee: 0, surgeEnabled: false, surgeMultiplier: 1.4 },
];

const normalizeService = (service: Partial<ServiceConfig> & { id: string }): ServiceConfig => {
  const fallback = DEFAULT_SERVICES.find((item) => item.id === service.id);
  return {
    id: service.id,
    name: service.name ?? fallback?.name ?? service.id,
    icon: service.icon ?? fallback?.icon ?? '⚙️',
    enabled: Boolean(service.enabled ?? fallback?.enabled),
    minOrder: Number(service.minOrder ?? fallback?.minOrder ?? 0),
    deliveryFee: Number(service.deliveryFee ?? fallback?.deliveryFee ?? 0),
    surgeEnabled: Boolean(service.surgeEnabled ?? fallback?.surgeEnabled),
    surgeMultiplier: Number(service.surgeMultiplier ?? fallback?.surgeMultiplier ?? 1),
    updatedAt: service.updatedAt,
  };
};

export const ServiceConfiguration: React.FC = () => {
  const [services, setServices] = useState<ServiceConfig[]>(DEFAULT_SERVICES);
  const [expanded, setExpanded] = useState<string | null>('food');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const seededDefaultsRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'serviceConfigurations'),
      async (snapshot) => {
        try {
          if (snapshot.empty && !seededDefaultsRef.current) {
            seededDefaultsRef.current = true;
            await Promise.all(
              DEFAULT_SERVICES.map((service) =>
                setDoc(doc(db, 'serviceConfigurations', service.id), {
                  ...service,
                  updatedAt: new Date().toISOString(),
                }),
              ),
            );
            return;
          }

          const liveServices = snapshot.docs.map((item) =>
            normalizeService({ id: item.id, ...(item.data() as Partial<ServiceConfig>) }),
          );
          const merged = DEFAULT_SERVICES.map((service) => {
            const live = liveServices.find((item) => item.id === service.id);
            return live ?? service;
          });

          setServices(merged);
          setError(null);
          setLoading(false);
          setHasUnsavedChanges(false);
        } catch (snapshotError) {
          console.error('Failed to process service configuration snapshot:', snapshotError);
          setError('Unable to load service configuration data.');
          setLoading(false);
        }
      },
      (snapshotError) => {
        console.error('Service configuration realtime listener failed:', snapshotError);
        setError('Realtime updates could not be started for service configuration.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const update = (id: string, field: keyof ServiceConfig, value: string | number | boolean) => {
    setServices((prev) =>
      prev.map((service) => (service.id === id ? { ...service, [field]: value } : service)),
    );
    setHasUnsavedChanges(true);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await Promise.all(
        services.map((service) =>
          setDoc(doc(db, 'serviceConfigurations', service.id), {
            ...service,
            updatedAt: new Date().toISOString(),
          }),
        ),
      );
      setSaved(true);
      setHasUnsavedChanges(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      console.error('Failed to save service configuration:', saveError);
      setError('Saving service configuration failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Service Configuration</h1>
          <p className="text-gray-400 text-sm mt-1">Enable, disable, and configure each platform service</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading || !hasUnsavedChanges}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All'}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-400">
          Loading live service configuration...
        </div>
      )}

      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
              onClick={() => setExpanded(expanded === service.id ? null : service.id)}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <p className="text-white font-medium">{service.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Min order: Rs {service.minOrder} | Delivery: {service.deliveryFee > 0 ? `Rs ${service.deliveryFee}` : 'Free'} | Surge: {service.surgeEnabled ? `${service.surgeMultiplier}x` : 'Off'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    update(service.id, 'enabled', !service.enabled);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${service.enabled ? 'bg-orange-500' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${service.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className={`text-xs font-medium ${service.enabled ? 'text-green-400' : 'text-red-400'}`}>
                  {service.enabled ? 'Enabled' : 'Disabled'}
                </span>
                {expanded === service.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>

            {expanded === service.id && (
              <div className="px-5 pb-5 border-t border-gray-800 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Minimum Order Value (Rs)</label>
                    <input
                      type="number"
                      min={0}
                      value={service.minOrder}
                      onChange={(event) => update(service.id, 'minOrder', Number(event.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Delivery Fee (Rs)</label>
                    <input
                      type="number"
                      min={0}
                      value={service.deliveryFee}
                      onChange={(event) => update(service.id, 'deliveryFee', Number(event.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Surge Multiplier</label>
                    <input
                      type="number"
                      step={0.1}
                      min={1}
                      max={5}
                      value={service.surgeMultiplier}
                      onChange={(event) => update(service.id, 'surgeMultiplier', Number(event.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => update(service.id, 'surgeEnabled', !service.surgeEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${service.surgeEnabled ? 'bg-orange-500' : 'bg-gray-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${service.surgeEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300 text-sm">Surge Pricing</span>
                    <span className={`text-xs ${service.surgeEnabled ? 'text-yellow-400' : 'text-gray-500'}`}>
                      ({service.surgeEnabled ? `${service.surgeMultiplier}x active` : 'disabled'})
                    </span>
                  </div>
                </div>
                {service.updatedAt && (
                  <p className="mt-4 text-xs text-gray-500">
                    Last updated: {new Date(service.updatedAt).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
