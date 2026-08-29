import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VendorStall } from '../../types';
import {
  Store,
  Plus,
  CheckCircle2,
  Users,
  DollarSign,
  Utensils,
  ShoppingBag,
  Sparkles,
  Layers,
  MapPin,
  Calendar
} from 'lucide-react';

export const VendorView: React.FC = () => {
  const { vendorStalls, events, venues, bookVendorStall, selectedEventId, setSelectedEventId } = useApp();

  const [activeTab, setActiveTab] = useState<'STALLS' | 'BOOK_STALL' | 'CATALOG'>('STALLS');
  const [vendorName, setVendorName] = useState('Chai Point & Gourmet Street');
  const [vendorType, setVendorType] = useState<'F&B Gourmet' | 'Official Merchandise' | 'Interactive Experience' | 'Beverages' | 'Telecom & Tech'>('F&B Gourmet');
  const [stallSize, setStallSize] = useState<'10x10 ft' | '20x10 ft' | 'Island Booth'>('20x10 ft');
  const [staffPasses, setStaffPasses] = useState(6);
  const [menuItems, setMenuItems] = useState('Cold Brew Coffee, Paneer Tikka Wraps, Loaded Nachos, Masala Chai');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const currentVenue = venues.find(v => v.id === currentEvent?.venueId);

  const calculateFee = () => {
    switch (stallSize) {
      case 'Island Booth':
        return 90000;
      case '20x10 ft':
        return 55000;
      default:
        return 35000;
    }
  };

  const handleBookStallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookVendorStall({
      eventId: currentEvent.id,
      vendorName,
      vendorType,
      stallSize,
      staffPasses,
      fee: calculateFee(),
      menuOrItems: menuItems.split(',').map(m => m.trim())
    });

    setActiveTab('STALLS');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              Persona: Vendor Channel
            </span>
            <span className="text-xs text-slate-500 font-mono">BP-2418304</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
            Concessions, Merch & Booth Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Reserve venue commercial spaces, allocate staff accreditation passes, and manage offerings.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('BOOK_STALL')}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Venue Stall Space</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('STALLS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'STALLS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Active Stalls & Concessions ({vendorStalls.length})
        </button>
        <button
          onClick={() => setActiveTab('BOOK_STALL')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'BOOK_STALL'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          + Book Stall Space
        </button>
      </div>

      {/* TAB 1: STALLS LIST */}
      {activeTab === 'STALLS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendorStalls.map(stall => {
            const ev = events.find(e => e.id === stall.eventId);

            return (
              <div
                key={stall.id}
                className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                      {stall.stallNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 font-mono">
                      ₹{stall.fee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3">{stall.vendorName}</h3>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {stall.vendorType} • {stall.stallSize}
                  </span>

                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      ASSIGNED EVENT
                    </span>
                    <p className="text-slate-900 font-medium line-clamp-1">{ev?.title || 'Main Arena Event'}</p>
                    <span className="text-slate-500 text-[11px] block">{ev?.date}</span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] text-slate-600 block font-medium">Catalog / Menu Items:</span>
                    <div className="flex flex-wrap gap-1">
                      {stall.menuOrItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                        >
                          • {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>{stall.staffPasses} Staff Badges</span>
                  </span>
                  <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px]">
                    {stall.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: BOOK STALL */}
      {activeTab === 'BOOK_STALL' && (
        <form
          onSubmit={handleBookStallSubmit}
          className="p-8 rounded-xl bg-white border border-slate-200 space-y-6 max-w-2xl mx-auto shadow-sm"
        >
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Reserve Commercial Venue Space</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Apply for gourmet F&B, branded merchandise, or experiential booths.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Target Event</label>
              <select
                value={currentEvent.id}
                onChange={e => setSelectedEventId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {events.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.date})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Vendor / Brand Name</label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={e => setVendorName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Commercial Category</label>
                <select
                  value={vendorType}
                  onChange={e => setVendorType(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="F&B Gourmet">F&B Gourmet</option>
                  <option value="Official Merchandise">Official Merchandise</option>
                  <option value="Interactive Experience">Interactive Experience</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Telecom & Tech">Telecom & Tech</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Stall Dimension</label>
                <select
                  value={stallSize}
                  onChange={e => setStallSize(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10x10 ft">10x10 ft (₹35,000)</option>
                  <option value="20x10 ft">20x10 ft (₹55,000)</option>
                  <option value="Island Booth">Island Booth 30x20 ft (₹90,000)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Staff Accreditation Passes Required</label>
              <input
                type="number"
                min={2}
                max={15}
                value={staffPasses}
                onChange={e => setStaffPasses(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Products / Menu Items (Comma Separated)</label>
              <textarea
                rows={2}
                value={menuItems}
                onChange={e => setMenuItems(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Total Stall Fee:</span>
              <span className="text-base font-bold text-slate-900 font-mono">
                ₹{calculateFee().toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Confirm Stall Contract & Issue Staff Passes</span>
          </button>
        </form>
      )}
    </div>
  );
};
