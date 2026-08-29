import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sponsor } from '../../types';
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Ticket,
  Eye,
  TrendingUp,
  Building2,
  DollarSign,
  Plus,
  Mail,
  Layers
} from 'lucide-react';

export const SponsorView: React.FC = () => {
  const { sponsors, events, claimSponsorVipPasses, addSponsor, setSelectedTicketForPass } = useApp();

  const [activeTab, setActiveTab] = useState<'PACKAGES' | 'VIP_PASSES' | 'ONBOARD'>('PACKAGES');
  const [selectedSponsorId, setSelectedSponsorId] = useState(sponsors[0]?.id || '');
  const [vipCount, setVipCount] = useState(2);
  const [recipientName, setRecipientName] = useState('Ananya Singhania');
  const [recipientEmail, setRecipientEmail] = useState('ananya.s@enterprise.in');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  // New Sponsor State
  const [newCompanyName, setNewCompanyName] = useState('Reliance Jio Fiber');
  const [newTier, setNewTier] = useState<'Title' | 'Platinum' | 'Gold' | 'Silver' | 'Official Partner'>('Platinum');
  const [newAmount, setNewAmount] = useState(2000000);
  const [newEmail, setNewEmail] = useState('alliances@jio.in');
  const [newLogo, setNewLogo] = useState('⚡ Jio Fiber Live');

  const currentSponsor = sponsors.find(s => s.id === selectedSponsorId) || sponsors[0];

  const handleClaimVip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSponsor) return;

    try {
      const issued = claimSponsorVipPasses(currentSponsor.id, vipCount, recipientName, recipientEmail);
      setClaimSuccessMsg(`Successfully issued ${issued.length} VIP pass(es) to ${recipientName}.`);
      if (issued.length > 0) {
        setSelectedTicketForPass(issued[0]);
      }
      setTimeout(() => setClaimSuccessMsg(''), 6000);
    } catch (err: any) {
      alert(err.message || 'Failed to claim VIP passes.');
    }
  };

  const handleAddSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSponsor({
      name: newCompanyName,
      company: newCompanyName,
      tier: newTier,
      contributedAmount: newAmount,
      contactEmail: newEmail,
      logo: newLogo,
      vipPassesQuota: newTier === 'Title' ? 50 : newTier === 'Platinum' ? 30 : 15,
      bannerPlacements: ['Main Stage Screen', 'Mobile App Header']
    });

    setActiveTab('PACKAGES');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider">
              Persona: Sponsor Channel
            </span>
            <span className="text-xs text-slate-500 font-mono">BP-2418304</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
            Brand Sponsorship, Banners & VIP Quota Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track multi-million INR brand investments, banner impressions, and executive passes.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('ONBOARD')}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Brand Partner</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('PACKAGES')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'PACKAGES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Active Sponsors & Impressions ({sponsors.length})
        </button>
        <button
          onClick={() => setActiveTab('VIP_PASSES')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'VIP_PASSES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Claim VIP Corporate Passes
        </button>
        <button
          onClick={() => setActiveTab('ONBOARD')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'ONBOARD'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          + Add Sponsor Agreement
        </button>
      </div>

      {/* TAB 1: PACKAGES & METRICS */}
      {activeTab === 'PACKAGES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map(spn => {
            const quotaRemaining = spn.vipPassesQuota - spn.vipPassesUsed;

            return (
              <div
                key={spn.id}
                className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold uppercase">
                      {spn.tier} Tier
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      ₹{spn.contributedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-3">{spn.company}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>{spn.contactEmail}</span>
                  </p>

                  <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Brand Impressions Delivered:</span>
                      <span className="font-bold text-blue-700 font-mono">
                        {spn.impressionsDelivered.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>VIP Pass Quota:</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {spn.vipPassesUsed} / {spn.vipPassesQuota} ({quotaRemaining} left)
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    <span className="text-[11px] text-slate-600 block font-semibold">
                      Reserved Banner Placements:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {spn.bannerPlacements.map((b, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                        >
                          📍 {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedSponsorId(spn.id);
                      setActiveTab('VIP_PASSES');
                    }}
                    className="w-full py-2.5 rounded-lg bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-200 hover:border-blue-600 cursor-pointer shadow-sm"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Issue VIP Passes ({quotaRemaining} Avail)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: VIP PASS ALLOCATION */}
      {activeTab === 'VIP_PASSES' && (
        <form
          onSubmit={handleClaimVip}
          className="p-8 rounded-xl bg-white border border-slate-200 space-y-6 max-w-2xl mx-auto shadow-sm"
        >
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Issue Sponsor VIP Complimentary Passes</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate front-row passes with digital QR barcodes for corporate guests.
            </p>
          </div>

          {claimSuccessMsg && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{claimSuccessMsg}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Select Sponsor Account</label>
              <select
                value={selectedSponsorId}
                onChange={e => setSelectedSponsorId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sponsors.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.company} ({s.tier} Tier - {s.vipPassesQuota - s.vipPassesUsed} passes left)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Number of VIP Passes</label>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, (currentSponsor?.vipPassesQuota || 10) - (currentSponsor?.vipPassesUsed || 0))}
                  value={vipCount}
                  onChange={e => setVipCount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Pass Tier</label>
                <input
                  type="text"
                  disabled
                  value="Platinum VIP Lounge & Fast Track"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-amber-800 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Guest / Executive Full Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Guest Email (For Digital Pass Delivery)</label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Crown className="w-5 h-5" />
            <span>Generate & Issue {vipCount} Digital Pass(es)</span>
          </button>
        </form>
      )}

      {/* TAB 3: ONBOARD SPONSOR */}
      {activeTab === 'ONBOARD' && (
        <form
          onSubmit={handleAddSponsorSubmit}
          className="p-8 rounded-xl bg-white border border-slate-200 space-y-6 max-w-2xl mx-auto shadow-sm"
        >
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Onboard Brand Sponsor Partner</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Create commercial sponsorship record in Pega System of Record.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Company / Brand Name</label>
              <input
                type="text"
                required
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Sponsorship Level</label>
                <select
                  value={newTier}
                  onChange={e => setNewTier(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Title">Title (₹25,00,000+)</option>
                  <option value="Platinum">Platinum (₹15,00,000)</option>
                  <option value="Gold">Gold (₹8,50,000)</option>
                  <option value="Silver">Silver (₹5,00,000)</option>
                  <option value="Official Partner">Official Partner (₹2,50,000)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Contributed Investment (INR ₹)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={e => setNewAmount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Alliance Contact Email</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Execute Sponsorship Agreement</span>
          </button>
        </form>
      )}
    </div>
  );
};
