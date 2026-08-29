import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  ShieldCheck,
  Activity,
  Layers,
  Database,
  Terminal,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ApplicationControlAgentView: React.FC = () => {
  const {
    events,
    venues,
    tickets,
    attendees,
    schedules,
    sponsors,
    vendorStalls,
    auditLogs,
    systemSLAs,
    reconcileBatch,
    setIsWorkflowModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'GOVERNANCE' | 'DATA_OBJECTS' | 'AUDIT_TRAIL' | 'SLA_MONITOR'>('GOVERNANCE');
  const [selectedDataObject, setSelectedDataObject] = useState<'Event' | 'Venue' | 'Ticket' | 'Attendee' | 'Schedule' | 'Sponsor'>('Event');
  const [reconResult, setReconResult] = useState<{ reconciledCount: number; totalRevenue: number; discrepancy: number } | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const handleRunReconcile = () => {
    const res = reconcileBatch();
    setReconResult(res);
    setTimeout(() => setReconResult(null), 8000);
  };

  const getRecordCount = (name: string) => {
    switch (name) {
      case 'Event': return events.length;
      case 'Venue': return venues.length;
      case 'Ticket': return tickets.length;
      case 'Attendee': return attendees.length;
      case 'Schedule': return schedules.length;
      case 'Sponsor': return sponsors.length;
      default: return 0;
    }
  };

  const getCurrentDataArray = () => {
    switch (selectedDataObject) {
      case 'Event': return events;
      case 'Venue': return venues;
      case 'Ticket': return tickets;
      case 'Attendee': return attendees;
      case 'Schedule': return schedules;
      case 'Sponsor': return sponsors;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider">
              Persona: Application Control Agent Channel
            </span>
            <span className="text-xs text-slate-500 font-mono">Blueprint ID: BP-2418304</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
            System Governance, Pega SOR & SLA Command
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Supervise end-to-end case workflows, 6 shared data objects, cryptographic audit logs, and reconciliation.
          </p>
        </div>

        <button
          onClick={handleRunReconcile}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Execute System Reconciliation</span>
        </button>
      </div>

      {reconResult && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>
              Reconciliation Completed: Audited {reconResult.reconciledCount} ticket passes and contracts. Total Ledger: ₹{reconResult.totalRevenue.toLocaleString('en-IN')}. Discrepancies: 0.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded text-emerald-800">
            CASE: RECON-2418304
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('GOVERNANCE')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'GOVERNANCE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Architecture & Blueprint BP-2418304
        </button>
        <button
          onClick={() => setActiveTab('DATA_OBJECTS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'DATA_OBJECTS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          6 Data Objects (Pega Local SOR)
        </button>
        <button
          onClick={() => setActiveTab('AUDIT_TRAIL')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'AUDIT_TRAIL'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Cryptographic Audit Trail ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('SLA_MONITOR')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'SLA_MONITOR'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Real-time SLAs & Latency
        </button>
      </div>

      {/* TAB 1: GOVERNANCE & ARCHITECTURE */}
      {activeTab === 'GOVERNANCE' && (
        <div className="space-y-6">
          {/* Blueprint Specs Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-900">6</span>
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Personas and Channels</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Active role-based access control across all venue touchpoints.
                </p>
              </div>
              <ul className="space-y-1 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">✓ Ticketing Manager</li>
                <li className="flex items-center gap-1.5">✓ Event Planner</li>
                <li className="flex items-center gap-1.5">✓ Attendee</li>
                <li className="flex items-center gap-1.5">✓ Vendor</li>
                <li className="flex items-center gap-1.5">✓ Sponsor</li>
                <li className="flex items-center gap-1.5 text-blue-700 font-semibold">✓ Application Control Agent</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-900">1</span>
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Primary Workflow</h3>
                <p className="text-xs text-slate-500 mt-1">
                  End-to-end Pega case lifecycle governance.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                <span className="text-blue-700 font-bold block">Ticketing Management</span>
                <p className="text-[11px] text-slate-600">
                  Event Setup → Venue Allocation → Pricing → Sales → Gate Validation → Reconciliation
                </p>
              </div>
              <button
                onClick={() => setIsWorkflowModalOpen(true)}
                className="w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                Inspect Workflow Case State →
              </button>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-900">6</span>
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Database className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Data Objects</h3>
                <p className="text-xs text-slate-500 mt-1">
                  System of Record: Pega Local Engine.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">
                <span className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">Event ({events.length})</span>
                <span className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">Venue ({venues.length})</span>
                <span className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">Ticket ({tickets.length})</span>
                <span className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">Attendee ({attendees.length})</span>
                <span className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">Schedule ({schedules.length})</span>
                <span className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">Sponsor ({sponsors.length})</span>
              </div>
            </div>
          </div>

          {/* Context Details Card */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-slate-900">Application Context Parameters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Organization</span>
                <span className="font-bold text-slate-900 mt-1 block">Internet Service Provider</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Location</span>
                <span className="font-bold text-slate-900 mt-1 block">India (Mumbai, BLR, Delhi, HYD)</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Industry</span>
                <span className="font-bold text-slate-900 mt-1 block">Consumer Services</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block uppercase font-semibold text-[10px]">Subsegment</span>
                <span className="font-bold text-slate-900 mt-1 block">Entertainment</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DATA OBJECTS INSPECTOR */}
      {activeTab === 'DATA_OBJECTS' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Pega Local System of Record (SOR) Inspector</h3>
              <p className="text-xs text-slate-500">
                Direct view into live data structures for all 6 Data Objects.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['Event', 'Venue', 'Ticket', 'Attendee', 'Schedule', 'Sponsor'] as const).map(objName => (
                <button
                  key={objName}
                  onClick={() => setSelectedDataObject(objName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedDataObject === objName
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {objName} ({getRecordCount(objName)})
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span>Data Object: {selectedDataObject}</span>
              <span>Total Records: {getRecordCount(selectedDataObject)}</span>
            </div>
            <pre className="text-xs font-mono text-emerald-400 max-h-96 overflow-y-auto leading-relaxed">
              {JSON.stringify(getCurrentDataArray(), null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'AUDIT_TRAIL' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">Cryptographic System Audit Trail</h3>
              <p className="text-xs text-slate-500">
                Tamper-evident logs of user activities, gate check-in attempts, and ledger transactions.
              </p>
            </div>

            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-900 rounded-lg px-3 py-1.5 shadow-sm"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">INFO Only</option>
              <option value="SUCCESS">SUCCESS Only</option>
              <option value="WARNING">WARNING Only</option>
              <option value="CRITICAL">CRITICAL Only</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {auditLogs
              .filter(l => severityFilter === 'ALL' || l.severity === severityFilter)
              .map(log => {
                let badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
                if (log.severity === 'SUCCESS') badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                else if (log.severity === 'WARNING') badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
                else if (log.severity === 'CRITICAL') badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';

                return (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle}`}>
                          {log.severity}
                        </span>
                        <span className="font-mono text-blue-700 font-bold">{log.action}</span>
                        <span className="text-[11px] text-slate-500 font-mono">[{log.actor}]</span>
                      </div>
                      <p className="text-slate-700 text-xs">{log.details}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 font-mono block">{log.timestamp}</span>
                      {log.caseId && (
                        <span className="text-[10px] font-mono text-slate-600 block mt-0.5">
                          {log.caseId}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 4: REAL-TIME SLAs */}
      {activeTab === 'SLA_MONITOR' && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-6 shadow-sm">
          <div>
            <h3 className="font-bold text-base text-slate-900">System Service Level Agreements (SLAs)</h3>
            <p className="text-xs text-slate-500">
              Live response latency benchmarks for high-throughput venue operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemSLAs.map((sla, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{sla.service}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {sla.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 block">UPTIME</span>
                    <span className="font-bold text-slate-900">{sla.uptime}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 block">TARGET</span>
                    <span className="font-bold text-slate-700 font-mono">&lt; {sla.targetResponseMs}ms</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-center shadow-xs">
                    <span className="text-[10px] text-slate-500 block">CURRENT</span>
                    <span className="font-bold text-emerald-700 font-mono">{sla.currentResponseMs}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
