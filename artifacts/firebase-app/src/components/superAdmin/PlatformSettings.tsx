import React, { useState } from 'react';
import { Save, AlertTriangle, Globe, Mail, Phone, Clock, DollarSign } from 'lucide-react';

interface PlatformConfig {
  appName: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  defaultCurrency: string;
  timezone: string;
  maxDeliveryRadius: number;
  platformVersion: string;
}

const DEFAULT_CONFIG: PlatformConfig = {
  appName: 'OmniServe',
  supportEmail: 'support@omniServe.com',
  supportPhone: '+91 80 1234 5678',
  maintenanceMode: false,
  defaultCurrency: 'INR',
  timezone: 'Asia/Kolkata',
  maxDeliveryRadius: 15,
  platformVersion: '2.4.1',
};

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
const TIMEZONES = ['Asia/Kolkata', 'Asia/Dubai', 'America/New_York', 'Europe/London', 'Asia/Singapore'];

export const PlatformSettings: React.FC = () => {
  const [config, setConfig] = useState<PlatformConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);

  const update = (field: keyof PlatformConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleMaintenanceToggle = () => {
    if (!config.maintenanceMode) {
      setShowMaintenanceConfirm(true);
    } else {
      update('maintenanceMode', false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Platform Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Configure global platform settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" /> General Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">App Name</label>
              <input
                value={config.appName}
                onChange={e => update('appName', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Platform Version</label>
              <input
                value={config.platformVersion}
                onChange={e => update('platformVersion', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Max Delivery Radius (km)</label>
              <input
                type="number"
                value={config.maxDeliveryRadius}
                onChange={e => update('maxDeliveryRadius', Number(e.target.value))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Support Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-orange-400" /> Support Contact
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Support Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={config.supportEmail}
                  onChange={e => update('supportEmail', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Support Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={config.supportPhone}
                  onChange={e => update('supportPhone', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-400" /> Localisation
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Default Currency</label>
              <select
                value={config.defaultCurrency}
                onChange={e => update('defaultCurrency', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Timezone</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={config.timezone}
                  onChange={e => update('timezone', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {TIMEZONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className={`bg-gray-900 border rounded-xl p-5 ${config.maintenanceMode ? 'border-red-500/50' : 'border-gray-800'}`}>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${config.maintenanceMode ? 'text-red-400' : 'text-orange-400'}`} />
            Maintenance Mode
          </h3>
          {config.maintenanceMode && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm font-medium">⚠️ Platform is currently in Maintenance Mode</p>
              <p className="text-red-300/70 text-xs mt-1">Users cannot access the platform. Disable to restore normal operations.</p>
            </div>
          )}
          <p className="text-gray-400 text-sm mb-4">
            Enabling maintenance mode will temporarily disable the platform for all users. Use this during critical updates or emergencies.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleMaintenanceToggle}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${config.maintenanceMode ? 'bg-red-500' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${config.maintenanceMode ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`font-medium text-sm ${config.maintenanceMode ? 'text-red-400' : 'text-gray-400'}`}>
              {config.maintenanceMode ? 'ON — Platform Disabled' : 'OFF — Platform Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Maintenance Confirmation Modal */}
      {showMaintenanceConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-red-500/50 rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-white font-bold mb-2">Enable Maintenance Mode?</h3>
            <p className="text-gray-400 text-sm mb-6">All users will lose access to the platform immediately. Only proceed if absolutely necessary.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowMaintenanceConfirm(false)} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm transition-colors">Cancel</button>
              <button onClick={() => { update('maintenanceMode', true); setShowMaintenanceConfirm(false); }} className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">
                Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
