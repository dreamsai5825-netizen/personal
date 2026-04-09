import React from 'react';
import { usePlatformContent } from '../platformContent';

export const SiteFooter: React.FC = () => {
  const { content } = usePlatformContent();
  const logoLabel = content.branding.appName.charAt(0).toUpperCase() || 'O';

  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              {content.branding.logoUrl ? (
                <img src={content.branding.logoUrl} alt={content.branding.appName} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
              ) : (
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {logoLabel}
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-gray-900">{content.branding.appName}</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">{content.footer.description}</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              {content.footer.companyLinks.map((link) => (
                <li key={`${link.label}-${link.path}`}>
                  <a href={link.path} className="hover:text-orange-500 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              {content.footer.supportLinks.map((link) => (
                <li key={`${link.label}-${link.path}`}>
                  <a href={link.path} className="hover:text-orange-500 transition-colors">{link.label}</a>
                </li>
              ))}
              <li><a href={`mailto:${content.support.email}`} className="hover:text-orange-500 transition-colors">{content.support.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-50 mt-12 pt-8">
          <p className="text-sm text-gray-400">{content.footer.copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};
