import React from 'react';
import { HeadphonesIcon, Mail, Phone, MessageCircle } from 'lucide-react';

export const VendorSupport: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-white text-2xl font-bold">Support</h1>
        <p className="text-emerald-400 text-sm mt-1">Get help and contact the platform team</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
            <Mail className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold mb-1">Email Support</h3>
          <p className="text-emerald-400 text-sm mb-4">Typical reply in 1-2 hours</p>
          <a href="mailto:support@omniserve.in" className="mt-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm w-full font-medium">Email Us</a>
        </div>

        <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
            <Phone className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-white font-semibold mb-1">Phone Support</h3>
          <p className="text-emerald-400 text-sm mb-4">Available 9 AM - 9 PM</p>
          <a href="tel:+918000000000" className="mt-auto px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm w-full font-medium">Call Us</a>
        </div>

        <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5 flex flex-col items-center text-center sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mb-3">
            <MessageCircle className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-white font-semibold mb-1">Live Chat</h3>
          <p className="text-emerald-400 text-sm mb-4">For urgent issues</p>
          <button className="mt-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm w-full font-medium">Start Chat</button>
        </div>
      </div>

      <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
        <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
          <HeadphonesIcon className="w-5 h-5 text-emerald-400" />
          Submit a Ticket
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-emerald-400 text-xs mb-1 block">Issue Type</label>
            <select className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Payment / Payout Issue</option>
              <option>App / Technical Bug</option>
              <option>Menu / Inventory Problem</option>
              <option>Customer Complaint</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-emerald-400 text-xs mb-1 block">Description</label>
            <textarea rows={4} placeholder="Describe your issue..." className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"></textarea>
          </div>
          <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all">
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
