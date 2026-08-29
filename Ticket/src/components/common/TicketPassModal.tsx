import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Ticket } from '../../types';
import {
  X,
  Download,
  Share2,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Printer,
  ShieldCheck,
  CreditCard,
  User,
  Ticket as TicketIcon
} from 'lucide-react';

interface TicketPassModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({ ticket, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ticket && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        ticket.qrCodeData || ticket.ticketNumber,
        {
          width: 180,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        error => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText?.(
      `Ticketing Pass: ${ticket.eventTitle}\nTicket: ${ticket.ticketNumber}\nSeat: ${ticket.seatLabel} (${ticket.section})\nVenue: ${ticket.venueName}, ${ticket.venueCity}\nDate: ${ticket.eventDate} at ${ticket.eventTime}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'VIP':
        return 'from-amber-500 via-amber-600 to-amber-700 text-amber-950';
      case 'GOLD':
        return 'from-yellow-400 via-amber-500 to-yellow-600 text-yellow-950';
      case 'SILVER':
        return 'from-slate-300 via-slate-400 to-slate-500 text-slate-900';
      default:
        return 'from-blue-500 via-indigo-600 to-blue-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md my-8 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-sm text-slate-900">Pega Digital Pass</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Physical Pass Container */}
        <div className="p-6 bg-slate-50">
          <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header Banner */}
            <div className={`p-4 bg-gradient-to-r ${getTierColor(ticket.tier)} font-medium flex items-center justify-between`}>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs uppercase font-bold tracking-wider">{ticket.tier} PASS</span>
              </div>
              <span className="text-xs font-mono font-bold bg-black/20 px-2 py-0.5 rounded">
                {ticket.ticketNumber}
              </span>
            </div>

            {/* Event Info */}
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">
                {ticket.eventTitle}
              </h3>
              <p className="text-xs text-blue-700 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified by Pega System of Record (BP-2418304)</span>
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-medium">DATE</span>
                    <span className="font-semibold text-slate-900">{ticket.eventDate}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-medium">TIME</span>
                    <span className="font-semibold text-slate-900">{ticket.eventTime} IST</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-slate-700 col-span-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-medium">VENUE</span>
                    <span className="font-semibold text-slate-900">{ticket.venueName}, {ticket.venueCity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat & Attendee Details */}
            <div className="p-4 bg-slate-50 grid grid-cols-3 gap-2 text-center border-b border-slate-200">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">SECTION</span>
                <span className="text-xs font-bold text-blue-700 truncate block mt-0.5">{ticket.section}</span>
              </div>
              <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-200">
                <span className="text-[10px] text-blue-700 block uppercase font-medium">SEAT / ZONE</span>
                <span className="text-sm font-bold text-blue-900 truncate block mt-0.5">{ticket.seatLabel}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">STATUS</span>
                <span className={`text-[11px] font-bold block mt-0.5 ${
                  ticket.status === 'CHECKED_IN'
                    ? 'text-emerald-700'
                    : ticket.status === 'CONFIRMED'
                    ? 'text-blue-700'
                    : 'text-amber-700'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            {/* Attendee Info bar */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-2 truncate">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-medium">{ticket.attendeeName}</span>
              </div>
              <span className="font-bold text-slate-900 shrink-0">₹{ticket.totalPaid.toLocaleString('en-IN')}</span>
            </div>

            {/* Ticket Tear Notches */}
            <div className="relative flex items-center justify-between my-0">
              <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 -ml-3" />
              <div className="flex-1 border-b-2 border-dashed border-slate-300 mx-2" />
              <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 -mr-3" />
            </div>

            {/* QR Code and Barcode Section */}
            <div className="p-6 bg-white flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs inline-block">
                <canvas ref={canvasRef} className="w-[150px] h-[150px]" />
              </div>
              <p className="text-[11px] font-mono text-slate-700 mt-3 tracking-widest uppercase font-semibold">
                {ticket.ticketNumber}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[260px]">
                Scan at turnstile gate reader. Valid for single admission.
              </p>
              {ticket.checkedInAt && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Checked-in at {ticket.checkedInAt} ({ticket.checkedInGate || 'Gate A'})</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied Details!' : 'Share Pass'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
