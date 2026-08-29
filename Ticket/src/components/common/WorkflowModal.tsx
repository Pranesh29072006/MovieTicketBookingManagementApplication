import React from 'react';
import { useApp } from '../../context/AppContext';
import { WorkflowStage } from '../../types';
import {
  X,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Building,
  Ticket as TicketIcon,
  DollarSign,
  UserCheck,
  BarChart3,
  Calendar
} from 'lucide-react';

export const WorkflowModal: React.FC = () => {
  const { isWorkflowModalOpen, setIsWorkflowModalOpen, events, advanceWorkflowStage, selectedEventId, setSelectedEventId } = useApp();

  if (!isWorkflowModalOpen) return null;

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  const stages: { stage: WorkflowStage; title: string; desc: string; icon: any }[] = [
    {
      stage: 'EVENT_SETUP',
      title: '1. Event Setup',
      desc: 'Define event title, schedule, tags, and performer lineups',
      icon: Calendar
    },
    {
      stage: 'VENUE_ALLOCATION',
      title: '2. Venue & Seating',
      desc: 'Map arena zones (VIP, Gold, Silver, General) and stall booths',
      icon: Building
    },
    {
      stage: 'PRICING_INVENTORY',
      title: '3. Pricing & Tiers',
      desc: 'Set dynamic prices, promo codes, and tier capacities',
      icon: DollarSign
    },
    {
      stage: 'SALES_RESERVATIONS',
      title: '4. Sales & Booking',
      desc: 'Public ticket sales, seat reservations, and payment processing',
      icon: TicketIcon
    },
    {
      stage: 'GATE_VALIDATION',
      title: '5. Gate Validation',
      desc: 'High-speed QR code scanning and real-time attendance tracking',
      icon: UserCheck
    },
    {
      stage: 'POST_EVENT_RECONCILIATION',
      title: '6. Reconciliation',
      desc: 'Settlement of ticket revenue, vendor fees, sponsor accounts',
      icon: BarChart3
    }
  ];

  const currentStageIndex = stages.findIndex(s => s.stage === currentEvent.workflowStage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl my-6 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">Ticketing Management Workflow</h3>
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-semibold">
                  Pega BP-2418304
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated case lifecycle managing venue allocation, sales, reservations, and gate validation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWorkflowModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Active Case Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] uppercase font-semibold text-slate-500">Active Event Case</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{currentEvent.title}</h4>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={currentEvent.id}
                onChange={e => setSelectedEventId(e.target.value)}
                className="bg-white border border-slate-300 text-xs text-slate-900 font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.workflowStage})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Workflow Stage Progress Tracker */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {stages.map((stg, idx) => {
              const Icon = stg.icon;
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              let cardBg = 'bg-slate-50 border-slate-200 text-slate-600';
              let badgeColor = 'bg-white border border-slate-200 text-slate-600';

              if (isCurrent) {
                cardBg = 'bg-blue-50/70 border-blue-500 text-slate-900 shadow-2xs';
                badgeColor = 'bg-blue-600 text-white';
              } else if (isPast) {
                cardBg = 'bg-emerald-50/70 border-emerald-300 text-slate-800';
                badgeColor = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
              }

              return (
                <div
                  key={stg.stage}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${cardBg}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`p-2 rounded-lg text-xs font-bold ${badgeColor}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {isCurrent && <Clock className="w-4 h-4 text-blue-600 animate-pulse" />}
                    </div>
                    <h5 className="text-xs font-bold leading-tight mb-1 text-slate-900">{stg.title}</h5>
                    <p className="text-[10px] text-slate-500 leading-snug">{stg.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200">
                    {isCurrent ? (
                      <button
                        onClick={() => {
                          const nextIdx = Math.min(stages.length - 1, idx + 1);
                          advanceWorkflowStage(currentEvent.id, stages[nextIdx].stage);
                        }}
                        className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 shadow-2xs transition cursor-pointer"
                      >
                        <span>Advance</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => advanceWorkflowStage(currentEvent.id, stg.stage)}
                        className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[10px] font-medium transition cursor-pointer"
                      >
                        Set Stage
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SLA & Blueprint Information Box */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 uppercase font-semibold text-[10px]">Blueprint Specification</span>
              <p className="text-slate-900 font-bold mt-1">Pega BP-2418304</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Internet Service Provider • India</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-semibold text-[10px]">System of Record (SOR)</span>
              <p className="text-slate-900 font-bold mt-1">Pega Local Data Engine</p>
              <p className="text-slate-500 text-[11px] mt-0.5">6 Shared Data Objects active</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-semibold text-[10px]">Workflow SLA Target</span>
              <p className="text-emerald-700 font-bold mt-1">100% In-Compliance</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Sub-second gate validation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
