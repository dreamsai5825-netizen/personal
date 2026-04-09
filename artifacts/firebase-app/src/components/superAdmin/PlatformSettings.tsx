import React, { useEffect, useState } from 'react';
import { Save, AlertTriangle, Globe, Image as ImageIcon, Mail, Phone, Clock, DollarSign, Megaphone, Quote, Upload } from 'lucide-react';
import { setDoc } from 'firebase/firestore';
import { defaultPlatformContent, PlatformContent, platformContentDocRef, PlatformLink, TestimonialItem, usePlatformContent } from '../../platformContent';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
const TIMEZONES = ['Asia/Kolkata', 'Asia/Dubai', 'America/New_York', 'Europe/London', 'Asia/Singapore'];

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const cloneContent = (content: PlatformContent): PlatformContent => JSON.parse(JSON.stringify(content)) as PlatformContent;

const updateLink = (links: PlatformLink[], index: number, field: keyof PlatformLink, value: string) =>
  links.map((link, currentIndex) => (currentIndex === index ? { ...link, [field]: value } : link));

const updateTestimonial = (items: TestimonialItem[], index: number, field: keyof TestimonialItem, value: string | number) =>
  items.map((item, currentIndex) => (currentIndex === index ? { ...item, [field]: value } : item));

export const PlatformSettings: React.FC = () => {
  const { content, loading } = usePlatformContent();
  const [draft, setDraft] = useState<PlatformContent>(cloneContent(defaultPlatformContent));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);
  const [pendingMaintenanceState, setPendingMaintenanceState] = useState<boolean | null>(null);

  useEffect(() => {
    setDraft(cloneContent(content));
  }, [content]);

  const saveDraft = async () => {
    setSaving(true);
    setError(null);
    try {
      await setDoc(platformContentDocRef, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      console.error('Failed to save platform settings:', saveError);
      setError('Saving platform settings failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMaintenanceToggle = (nextValue: boolean) => {
    if (nextValue) {
      setPendingMaintenanceState(true);
      setShowMaintenanceConfirm(true);
      return;
    }

    setDraft((prev) => ({
      ...prev,
      operations: {
        ...prev.operations,
        maintenanceMode: false,
      },
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Platform Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Control branding, landing content, support details, and hero advertising from one place.</p>
        </div>
        <button
          onClick={saveDraft}
          disabled={saving || loading}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-gray-400">
          Loading live platform settings...
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-400" /> Branding
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">App Name</label>
              <input
                value={draft.branding.appName}
                onChange={(event) => setDraft((prev) => ({ ...prev, branding: { ...prev.branding, appName: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Logo URL</label>
              <input
                value={draft.branding.logoUrl}
                onChange={(event) => setDraft((prev) => ({ ...prev, branding: { ...prev.branding, logoUrl: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Upload Logo</label>
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-700 text-gray-300 cursor-pointer hover:border-orange-500/50 hover:text-white transition-colors text-sm">
                <Upload className="w-4 h-4" />
                Choose image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const dataUrl = await toDataUrl(file);
                    setDraft((prev) => ({ ...prev, branding: { ...prev.branding, logoUrl: dataUrl } }));
                  }}
                />
              </label>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Location Label</label>
              <input
                value={draft.branding.locationLabel}
                onChange={(event) => setDraft((prev) => ({ ...prev, branding: { ...prev.branding, locationLabel: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-orange-400" /> Landing Hero
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Headline</label>
              <input
                value={draft.hero.headline}
                onChange={(event) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, headline: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Highlight Line</label>
              <input
                value={draft.hero.highlight}
                onChange={(event) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, highlight: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Subheadline</label>
              <textarea
                value={draft.hero.subheadline}
                onChange={(event) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, subheadline: event.target.value } }))}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                value={draft.hero.primaryCtaLabel}
                onChange={(event) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, primaryCtaLabel: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Primary CTA label"
              />
              <input
                value={draft.hero.primaryCtaPath}
                onChange={(event) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, primaryCtaPath: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="/food"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                value={draft.hero.secondaryCtaLabel}
                onChange={(event) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaLabel: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Secondary CTA label"
              />
              <input
                value={draft.hero.secondaryCtaPath}
                onChange={(event) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaPath: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="/rides"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">Hero Image URL</label>
              <input
                value={draft.hero.imageUrl}
                onChange={(event) => setDraft((prev) => ({ ...prev, hero: { ...prev.hero, imageUrl: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 xl:col-span-2">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-orange-400" /> Hero Advertisement Publishing
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            This is the publish layer for the landing hero. Once a vendor request is approved operationally, super admin can post the final banner here and switch it live with one save.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 px-4 py-3">
                <div>
                  <p className="text-white text-sm font-medium">Publish Hero Advertisement</p>
                  <p className="text-gray-500 text-xs">When enabled, the landing hero shows the approved banner instead of the default hero message.</p>
                </div>
                <button
                  onClick={() => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, enabled: !prev.advertisement.enabled } }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${draft.advertisement.enabled ? 'bg-orange-500' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${draft.advertisement.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <input
                value={draft.advertisement.vendorName}
                onChange={(event) => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, vendorName: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Vendor / advertiser name"
              />
              <input
                value={draft.advertisement.badge}
                onChange={(event) => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, badge: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Badge"
              />
              <input
                value={draft.advertisement.slotLabel}
                onChange={(event) => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, slotLabel: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Prime Home Hero | 7 days"
              />
              <select
                value={draft.advertisement.status}
                onChange={(event) => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, status: event.target.value as PlatformContent['advertisement']['status'] } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
              </select>
            </div>
            <div className="space-y-4">
              <input
                value={draft.advertisement.title}
                onChange={(event) => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, title: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Advertisement title"
              />
              <textarea
                value={draft.advertisement.subtitle}
                onChange={(event) => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, subtitle: event.target.value } }))}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Advertisement subtitle"
              />
              <input
                value={draft.advertisement.imageUrl}
                onChange={(event) => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, imageUrl: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Banner image URL"
              />
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-700 text-gray-300 cursor-pointer hover:border-orange-500/50 hover:text-white transition-colors text-sm">
                <Upload className="w-4 h-4" />
                Upload banner image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const dataUrl = await toDataUrl(file);
                    setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, imageUrl: dataUrl } }));
                  }}
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={draft.advertisement.primaryCtaLabel}
                  onChange={(event) => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, primaryCtaLabel: event.target.value } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Primary CTA label"
                />
                <input
                  value={draft.advertisement.primaryCtaPath}
                  onChange={(event) => setDraft((prev) => ({ ...prev, advertisement: { ...prev.advertisement, primaryCtaPath: event.target.value } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="/food"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 xl:col-span-2">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Quote className="w-4 h-4 text-orange-400" /> Testimonials
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <input
              value={draft.testimonials.sectionTitle}
              onChange={(event) => setDraft((prev) => ({ ...prev, testimonials: { ...prev.testimonials, sectionTitle: event.target.value } }))}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Section title"
            />
            <input
              value={draft.testimonials.sectionSubtitle}
              onChange={(event) => setDraft((prev) => ({ ...prev, testimonials: { ...prev.testimonials, sectionSubtitle: event.target.value } }))}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Section subtitle"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {draft.testimonials.items.map((item, index) => (
              <div key={item.id} className="rounded-xl border border-gray-800 bg-gray-950 p-4 space-y-3">
                <input
                  value={item.name}
                  onChange={(event) => setDraft((prev) => ({ ...prev, testimonials: { ...prev.testimonials, items: updateTestimonial(prev.testimonials.items, index, 'name', event.target.value) } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Customer name"
                />
                <input
                  value={item.role}
                  onChange={(event) => setDraft((prev) => ({ ...prev, testimonials: { ...prev.testimonials, items: updateTestimonial(prev.testimonials.items, index, 'role', event.target.value) } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Customer role"
                />
                <textarea
                  value={item.quote}
                  onChange={(event) => setDraft((prev) => ({ ...prev, testimonials: { ...prev.testimonials, items: updateTestimonial(prev.testimonials.items, index, 'quote', event.target.value) } }))}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Quote"
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={item.rating}
                  onChange={(event) => setDraft((prev) => ({ ...prev, testimonials: { ...prev.testimonials, items: updateTestimonial(prev.testimonials.items, index, 'rating', Number(event.target.value)) } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-orange-400" /> Support + Footer
          </h3>
          <div className="space-y-4">
            <input
              value={draft.support.email}
              onChange={(event) => setDraft((prev) => ({ ...prev, support: { ...prev.support, email: event.target.value } }))}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Support email"
            />
            <input
              value={draft.support.phone}
              onChange={(event) => setDraft((prev) => ({ ...prev, support: { ...prev.support, phone: event.target.value } }))}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Support phone"
            />
            <textarea
              value={draft.footer.description}
              onChange={(event) => setDraft((prev) => ({ ...prev, footer: { ...prev.footer, description: event.target.value } }))}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Footer description"
            />
            <input
              value={draft.footer.copyrightText}
              onChange={(event) => setDraft((prev) => ({ ...prev, footer: { ...prev.footer, copyrightText: event.target.value } }))}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Copyright text"
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-400" /> Operations
          </h3>
          <div className="space-y-4">
            <select
              value={draft.operations.defaultCurrency}
              onChange={(event) => setDraft((prev) => ({ ...prev, operations: { ...prev.operations, defaultCurrency: event.target.value } }))}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
            </select>
            <div className="relative">
              <Clock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={draft.operations.timezone}
                onChange={(event) => setDraft((prev) => ({ ...prev, operations: { ...prev.operations, timezone: event.target.value } }))}
                className="w-full bg-gray-800 border border-gray-700 text-white pl-9 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {TIMEZONES.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
              </select>
            </div>
            <input
              type="number"
              value={draft.operations.maxDeliveryRadius}
              onChange={(event) => setDraft((prev) => ({ ...prev, operations: { ...prev.operations, maxDeliveryRadius: Number(event.target.value) } }))}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Max delivery radius"
            />
            <input
              value={draft.operations.platformVersion}
              onChange={(event) => setDraft((prev) => ({ ...prev, operations: { ...prev.operations, platformVersion: event.target.value } }))}
              className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Platform version"
            />
            <div className={`rounded-xl border p-4 ${draft.operations.maintenanceMode ? 'border-red-500/40 bg-red-500/10' : 'border-gray-800 bg-gray-950'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white font-medium">Maintenance Mode</p>
                  <p className="text-gray-400 text-sm mt-1">This flag is now stored centrally so the frontend can respond dynamically once maintenance gating is added globally.</p>
                </div>
                <button
                  onClick={() => handleMaintenanceToggle(!draft.operations.maintenanceMode)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${draft.operations.maintenanceMode ? 'bg-red-500' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${draft.operations.maintenanceMode ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMaintenanceConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-red-500/50 rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-white font-bold mb-2">Enable Maintenance Mode?</h3>
            <p className="text-gray-400 text-sm mb-6">This setting is stored globally and can be used to gate the full platform once the maintenance guard is added to the public and dashboard routes.</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowMaintenanceConfirm(false); setPendingMaintenanceState(null); }} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm transition-colors">Cancel</button>
              <button
                onClick={() => {
                  setDraft((prev) => ({
                    ...prev,
                    operations: {
                      ...prev.operations,
                      maintenanceMode: pendingMaintenanceState ?? true,
                    },
                  }));
                  setShowMaintenanceConfirm(false);
                  setPendingMaintenanceState(null);
                }}
                className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
