import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket } from '../../types';
import {
  X,
  QrCode,
  Scan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Sparkles,
  ShieldCheck,
  User
} from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose }) => {
  const { tickets, checkInTicket, setSelectedTicketForPass } = useApp();
  const [inputCode, setInputCode] = useState('');
  const [selectedGate, setSelectedGate] = useState('Gate 1 - VIP & Fast Track');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    ticket?: Ticket;
    errorType?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleManualScan = (codeToScan?: string) => {
    const target = codeToScan || inputCode;
    if (!target) return;

    const res = checkInTicket(target, selectedGate);
    setScanResult(res);
  };

  const handleQuickTestTicket = (tkt: Ticket) => {
    setInputCode(tkt.ticketNumber);
    handleManualScan(tkt.ticketNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Live Gate QR & Barcode Scanner</h3>
              <p className="text-[11px] text-slate-500">Real-time Turnstile Validation • Anti-Duplicate Fraud Shield</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Gate Selection */}
          <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-600 font-medium">Turnstile Gate:</span>
            <select
              value={selectedGate}
              onChange={e => setSelectedGate(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-900 font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="Gate 1 - VIP & Fast Track">Gate 1 - VIP & Fast Track</option>
              <option value="Gate 2 - Gold Circle">Gate 2 - Gold Circle</option>
              <option value="Gate 3 - Silver Grandstand">Gate 3 - Silver Grandstand</option>
              <option value="Gate 4 - General Arena North">Gate 4 - General Arena North</option>
              <option value="Gate 5 - General Arena South">Gate 5 - General Arena South</option>
            </select>
          </div>

          {/* Scanner Optical Simulation Viewport */}
          <div className="relative h-48 bg-slate-900 border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center overflow-hidden">
            {/* Animated Laser line */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-md shadow-red-500/50 animate-pulse" style={{ top: '50%' }} />

            <QrCode className="w-16 h-16 text-blue-400/40" />
            <p className="text-xs font-mono text-blue-200 mt-2">
              Optical Camera Sensor Active
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Align attendee digital pass QR inside viewport or test with sample tickets below
            </p>
          </div>

          {/* Manual Input Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Ticket Number (e.g. TKT-2418304-001) or QR String..."
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleManualScan()}
                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <button
              onClick={() => handleManualScan()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Validate</span>
            </button>
          </div>

          {/* Scan Result Feedback Card */}
          {scanResult && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                  : scanResult.errorType === 'DUPLICATE'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : scanResult.errorType === 'DUPLICATE' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold">
                      {scanResult.success
                        ? 'ACCESS GRANTED • VALID PASS'
                        : scanResult.errorType === 'DUPLICATE'
                        ? 'SECURITY ALERT: DUPLICATE ENTRY ATTEMPT'
                        : 'ACCESS DENIED'}
                    </h4>
                    {scanResult.ticket && (
                      <span className="text-xs font-mono font-bold bg-white/80 border border-slate-200 px-2 py-0.5 rounded text-slate-800">
                        {scanResult.ticket.tier} TIER
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-1 opacity-90">{scanResult.message}</p>

                  {scanResult.ticket && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">ATTENDEE</span>
                        <span className="font-semibold text-slate-900">{scanResult.ticket.attendeeName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">SEAT / SECTION</span>
                        <span className="font-semibold text-slate-900">
                          {scanResult.ticket.seatLabel} ({scanResult.ticket.section})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">EVENT</span>
                        <span className="font-semibold text-slate-900 truncate block">{scanResult.ticket.eventTitle}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Test Barcode Pills */}
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-semibold text-slate-500 block">
              Quick Test from Active Issued Tickets:
            </span>
            <div className="flex flex-wrap gap-2">
              {tickets.slice(0, 5).map(t => (
                <button
                  key={t.id}
                  onClick={() => handleQuickTestTicket(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition font-mono cursor-pointer ${
                    t.status === 'CHECKED_IN'
                      ? 'bg-slate-100 border-slate-200 text-slate-500'
                      : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  <span>{t.ticketNumber}</span>
                  <span className="text-[10px] text-slate-500 font-sans">({t.attendeeName.split(' ')[0]})</span>
                  <span
                    className={`text-[9px] px-1 rounded font-sans font-semibold ${
                      t.status === 'CHECKED_IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
