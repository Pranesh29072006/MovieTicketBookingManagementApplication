import React from 'react';
import { useApp } from '../context/AppContext';
import { PersonaType } from '../types';
import {
  Ticket,
  Users,
  Layers,
  Shield,
  Sparkles,
  Calendar,
  Store,
  Crown,
  Cpu,
  RefreshCw,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentPersona,
    setCurrentPersona,
    setIsWorkflowModalOpen,
    resetToInitialData,
    currentAttendee
  } = useApp();

  const personas: {
    id: PersonaType;
    label: string;
    role: string;
    icon: any;
    color: string;
  }[] = [
    {
      id: 'ticketing_manager',
      label: 'Ticketing Manager',
      role: 'Pricing, Inventory & Gate Ops',
      icon: Ticket,
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: 'event_planner',
      label: 'Event Planner',
      role: 'Venues, Schedules & Lineup',
      icon: Calendar,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'attendee',
      label: 'Attendee',
      role: 'Discovery, Seat Map & Passes',
      icon: Users,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'vendor',
      label: 'Vendor',
      role: 'Venue Stalls & Concessions',
      icon: Store,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'sponsor',
      label: 'Sponsor',
      role: 'Packages, Banners & VIP Passes',
      icon: Crown,
      color: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'control_agent',
      label: 'Application Control Agent',
      role: 'Pega Blueprint BP-2418304 Governance',
      icon: Cpu,
      color: 'from-rose-500 to-pink-600'
    }
  ];

  const currentPersonaObj = personas.find(p => p.id === currentPersona) || personas[0];
  const CurrentIcon = currentPersonaObj.icon;

  return (
    <header className="sticky top-0 z-40 bg-[#1E293B] border-b border-slate-700/80 shadow-sm">
      {/* Top micro-meta banner */}
      <div className="bg-[#0F172A] px-4 py-1.5 text-[11px] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Pega Blueprint BP-2418304
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-300">Internet Service Provider (India)</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400">Consumer Services: Entertainment</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-blue-300 font-mono text-[10px]">
            <Building2 className="w-3 h-3 text-blue-400" />
            Pega Local System of Record (6 Data Objects)
          </span>
          <button
            onClick={resetToInitialData}
            title="Reset system demo data"
            className="hover:text-amber-300 text-slate-400 transition flex items-center gap-1 text-[10px]"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand and workflow pill */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Ticketing and Booking
              </h1>
              <button
                onClick={() => setIsWorkflowModalOpen(true)}
                className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/40 text-blue-200 text-[10px] font-semibold hover:bg-blue-500/30 transition flex items-center gap-1 cursor-pointer"
              >
                <Layers className="w-3 h-3 text-blue-300" />
                <span>Workflow Case (BP-2418304)</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Automated venue reservations, seat allocations & payment processing
            </p>
          </div>
        </div>

        {/* Persona Channels Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider hidden xl:inline">
            Personas:
          </span>
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-700/80">
            {personas.map(p => {
              const Icon = p.icon;
              const isActive = currentPersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentPersona(p.id)}
                  title={`${p.label} - ${p.role}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
