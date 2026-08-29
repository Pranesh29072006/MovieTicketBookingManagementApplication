import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrScannerModal } from '../common/QrScannerModal';
import { TicketTierType, Ticket } from '../../types';
import {
  Ticket as TicketIcon,
  TrendingUp,
  DollarSign,
  UserCheck,
  Scan,
  RotateCcw,
  Sliders,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Building,
  Calendar,
  Layers
} from 'lucide-react';

export const TicketingManagerView: React.FC = () => {
  const {
    events,
    venues,
    tickets,
    selectedEventId,
    setSelectedEventId,
    updateTicketTiers,
    cancelTicket,
    setSelectedTicketForPass,
    setIsWorkflowModalOpen
  } = useApp();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PRICING' | 'GATE_VALIDATION' | 'REFUNDS'>('OVERVIEW');
  const [filterTier, setFilterTier] = useState<string>('ALL');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const currentVenue = venues.find(v => v.id === currentEvent?.venueId);

  // Calculate Metrics
  const eventTickets = tickets.filter(t => t.eventId === currentEvent.id);
  const totalRevenue = eventTickets
    .filter(t => t.status !== 'CANCELLED' && t.status !== 'REFUNDED')
    .reduce((acc, t) => acc + t.totalPaid, 0);

  const totalSold = eventTickets.filter(t => t.status !== 'CANCELLED' && t.status !== 'REFUNDED').length;
  const checkedInCount = eventTickets.filter(t => t.status === 'CHECKED_IN').length;
  const attendanceRate = totalSold > 0 ? Math.round((checkedInCount / totalSold) * 100) : 0;

  // Local state for editing tiers
  const [tiersEdit, setTiersEdit] = useState(currentEvent.ticketTiers);

  const handlePriceChange = (tier: TicketTierType, newPrice: number) => {
    const updated = tiersEdit.map(t => (t.tier === tier ? { ...t, price: newPrice } : t));
    setTiersEdit(updated);
    updateTicketTiers(currentEvent.id, updated);
  };

  const handleCapacityChange = (tier: TicketTierType, newCap: number) => {
    const updated = tiersEdit.map(t => (t.tier === tier ? { ...t, totalQuantity: newCap } : t));
    setTiersEdit(updated);
    updateTicketTiers(currentEvent.id, updated);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider">
              Persona: Ticketing Manager Channel
            </span>
            <span className="text-xs text-slate-500 font-mono">BP-2418304</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
            Ticketing Operations & Inventory Command
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage dynamic seat pricing, gate barcode validation turnstiles, and sales ledger.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={currentEvent.id}
            onChange={e => {
              setSelectedEventId(e.target.value);
              const targetEv = events.find(ev => ev.id === e.target.value);
              if (targetEv) setTiersEdit(targetEv.ticketTiers);
            }}
            className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({ev.date})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition"
          >
            <Scan className="w-4 h-4" />
            <span>Gate Scanner Reader</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +18.4% velocity this week
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Tickets Issued</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <TicketIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {totalSold}{' '}
            <span className="text-xs font-normal text-slate-500">
              / {currentEvent.totalCapacity.toLocaleString('en-IN')}
            </span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {Math.round((totalSold / currentEvent.totalCapacity) * 100)}% venue capacity booked
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gate Check-Ins</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {checkedInCount} <span className="text-xs font-normal text-slate-500">scanned</span>
          </p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            {attendanceRate}% live gate arrival rate
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Workflow Stage</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-blue-700 mt-2 truncate">
            {currentEvent.workflowStage.replace(/_/g, ' ')}
          </p>
          <button
            onClick={() => setIsWorkflowModalOpen(true)}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline mt-1 block text-left"
          >
            Inspect Case Stage & SLA →
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Tier Breakdown & Capacity
        </button>
        <button
          onClick={() => setActiveTab('PRICING')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'PRICING'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Dynamic Pricing Configurator
        </button>
        <button
          onClick={() => setActiveTab('GATE_VALIDATION')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'GATE_VALIDATION'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Live Issued Passes ({eventTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('REFUNDS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'REFUNDS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Cancellations & Refunds
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tiers Progress */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Ticket Tier Allocation & Capacity</h3>
              <span className="text-xs font-medium text-slate-500">{currentVenue?.name}</span>
            </div>

            <div className="space-y-4">
              {currentEvent.ticketTiers.map(tier => {
                const sold = tier.soldQuantity;
                const total = tier.totalQuantity;
                const pct = Math.min(100, Math.round((sold / total) * 100));
                const tierRev = sold * tier.price;

                return (
                  <div
                    key={tier.tier}
                    className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tier.color }}
                        />
                        <span className="font-bold text-sm text-slate-900">{tier.name}</span>
                        <span className="text-xs font-mono font-semibold text-blue-700">
                          ₹{tier.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        ₹{tierRev.toLocaleString('en-IN')} earned
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: tier.color
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>
                        {sold} sold / {total} total quota
                      </span>
                      <span>{pct}% allocation filled</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Gate Launch Box */}
          <div className="p-6 rounded-xl bg-[#1E293B] text-white border border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-3 shadow-sm">
                <Scan className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Live Turnstile Terminal</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Operate high-speed optical barcode & QR code validator. Auto-detects fraud and duplicate entrance scans.
              </p>

              <div className="p-3.5 bg-slate-900/90 rounded-lg border border-slate-700 my-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Sensor latency:</span>
                  <span className="text-emerald-400 font-semibold">25 ms</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Anti-Fraud Shield:</span>
                  <span className="text-emerald-400 font-semibold">ACTIVE</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Turnstiles online:</span>
                  <span className="text-slate-200">5 Gates</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Launch Turnstile Scanner UI</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING CONFIGURATOR */}
      {activeTab === 'PRICING' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900">Dynamic Pricing & Inventory Adjustment</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update tier base rates, seat limits, and VIP perks for "{currentEvent.title}".
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-3 py-1 rounded-md self-start">
              Auto-synced with Pega Local SOR
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiersEdit.map(tier => (
              <div
                key={tier.tier}
                className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="font-bold text-sm text-slate-900">{tier.name}</span>
                  </div>
                  <span className="text-xs font-mono bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                    {tier.tier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Base Price (INR ₹)</label>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={e => handlePriceChange(tier.tier, Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Total Capacity Quota</label>
                    <input
                      type="number"
                      value={tier.totalQuantity}
                      onChange={e => handleCapacityChange(tier.tier, Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-600 block mb-1">Included Tier Perks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {tier.perks.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-medium"
                      >
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GATE VALIDATION / ISSUED PASSES */}
      {activeTab === 'GATE_VALIDATION' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Issued Passes Ledger ({eventTickets.length})</h3>
              <p className="text-xs text-slate-500">Real-time attendance record and QR barcode statuses.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterTier}
                onChange={e => setFilterTier(e.target.value)}
                className="bg-white border border-slate-300 text-xs text-slate-800 rounded-lg px-3 py-1.5 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Tiers</option>
                <option value="VIP">VIP Only</option>
                <option value="GOLD">Gold Only</option>
                <option value="SILVER">Silver Only</option>
                <option value="GENERAL">General Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Attendee</th>
                  <th className="p-3">Tier & Seat</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {eventTickets
                  .filter(t => filterTier === 'ALL' || t.tier === filterTier)
                  .map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-mono font-bold text-blue-700">{t.ticketNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{t.attendeeName}</div>
                        <div className="text-[10px] text-slate-500">{t.attendeeEmail}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold">{t.tier}</span> • {t.seatLabel}
                        <div className="text-[10px] text-slate-500">{t.section}</div>
                      </td>
                      <td className="p-3 font-mono font-semibold">₹{t.totalPaid.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                            t.status === 'CHECKED_IN'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : t.status === 'CONFIRMED'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedTicketForPass(t)}
                          className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[11px] font-medium flex items-center gap-1 transition shadow-sm cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Pass</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REFUNDS */}
      {activeTab === 'REFUNDS' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Cancellation & Refund Approvals</h3>
            <p className="text-xs text-slate-500">
              Manage refund requests according to venue cancellation policies.
            </p>
          </div>

          <div className="space-y-3">
            {eventTickets
              .filter(t => t.status === 'CONFIRMED')
              .slice(0, 4)
              .map(t => (
                <div
                  key={t.id}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{t.attendeeName}</span>
                      <span className="font-mono text-blue-700">({t.ticketNumber})</span>
                      <span className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">
                        {t.tier} • {t.seatLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Purchased on {t.purchaseDate} via {t.paymentMethod}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 font-mono">
                      ₹{t.totalPaid.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => cancelTicket(t.id, 'Manager Discretion / Customer Request')}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition shadow-sm cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Issue Refund</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Gate Scanner Modal */}
      <QrScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  );
};
