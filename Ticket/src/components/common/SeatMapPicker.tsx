import React, { useState, useMemo } from 'react';
import { Event, Venue, TicketTierType, Ticket } from '../../types';
import { Sparkles, Check, Info, Users, ShieldCheck } from 'lucide-react';

interface SelectedSeat {
  section: string;
  label: string;
  price: number;
  tier: TicketTierType;
}

interface SeatMapPickerProps {
  event: Event;
  venue: Venue;
  existingTickets: Ticket[];
  onProceedToCheckout: (selectedSeats: SelectedSeat[]) => void;
}

export const SeatMapPicker: React.FC<SeatMapPickerProps> = ({
  event,
  venue,
  existingTickets,
  onProceedToCheckout
}) => {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [activeTierFilter, setActiveTierFilter] = useState<string>('ALL');

  // Booked seat labels for this event
  const bookedSeatSet = useMemo(() => {
    const set = new Set<string>();
    existingTickets
      .filter(t => t.eventId === event.id && t.status !== 'CANCELLED' && t.status !== 'REFUNDED')
      .forEach(t => set.add(t.seatLabel));
    return set;
  }, [existingTickets, event.id]);

  // Generate sections based on venue configuration and event tier prices
  const sections = useMemo(() => {
    return venue.sections.map(sec => {
      const tierConfig = event.ticketTiers.find(t => t.tier === sec.tier);
      const actualPrice = tierConfig?.price || sec.basePrice;
      
      const rowsList: { rowName: string; seats: { label: string; number: number; isBooked: boolean }[] }[] = [];
      const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];

      for (let r = 0; r < Math.min(sec.rows, rowLetters.length); r++) {
        const rowChar = rowLetters[r];
        const rowSeats = [];
        for (let s = 1; s <= sec.seatsPerRow; s++) {
          const seatLabel = `${sec.tier}-${rowChar}${String(s).padStart(2, '0')}`;
          rowSeats.push({
            label: seatLabel,
            number: s,
            isBooked: bookedSeatSet.has(seatLabel)
          });
        }
        rowsList.push({
          rowName: rowChar,
          seats: rowSeats
        });
      }

      return {
        ...sec,
        price: actualPrice,
        rowsList
      };
    });
  }, [venue, event, bookedSeatSet]);

  const toggleSeat = (sectionName: string, label: string, price: number, tier: TicketTierType, isBooked: boolean) => {
    if (isBooked) return;

    setSelectedSeats(prev => {
      const exists = prev.find(s => s.label === label);
      if (exists) {
        return prev.filter(s => s.label !== label);
      } else {
        if (prev.length >= 8) {
          alert('Maximum 8 tickets allowed per single transaction.');
          return prev;
        }
        return [...prev, { section: sectionName, label, price, tier }];
      }
    });
  };

  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const gstTax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gstTax;

  const filteredSections = sections.filter(
    s => activeTierFilter === 'ALL' || s.tier === activeTierFilter
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-700">
            Interactive Seating Plan
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Select Your Seats at {venue.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tap on available seats to reserve. GST (18%) calculated at checkout.
          </p>
        </div>

        {/* Tier filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTierFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTierFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            All Tiers
          </button>
          {event.ticketTiers.map(tier => (
            <button
              key={tier.tier}
              onClick={() => setActiveTierFilter(tier.tier)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeTierFilter === tier.tier
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <span>{tier.tier}</span>
              <span className={`text-[10px] ${activeTierFilter === tier.tier ? 'text-blue-100' : 'text-slate-500'}`}>
                ₹{tier.price.toLocaleString('en-IN')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* STAGE VISUALIZER */}
      <div className="my-8 flex flex-col items-center">
        <div className="w-full max-w-xl py-3 px-8 rounded-xl bg-slate-100 border border-slate-300 text-center shadow-xs">
          <div className="flex items-center justify-center gap-2 text-slate-800 text-xs sm:text-sm font-bold tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>MAIN PERFORMANCE STAGE / SCREEN</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Sound Array Alpha & Center Acoustic Focus
          </p>
        </div>

        {/* Curved Stage subtle line */}
        <div className="w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2 rounded-full opacity-40" />
      </div>

      {/* SEATING GRID CONTAINER */}
      <div className="space-y-6 overflow-x-auto pb-4">
        {filteredSections.map(sec => (
          <div
            key={sec.id}
            className="p-5 rounded-xl bg-slate-50 border border-slate-200 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-2xs"
                  style={{ backgroundColor: sec.color }}
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{sec.name}</h4>
                  <span className="text-[11px] text-slate-500">
                    Tier: {sec.tier} • ₹{sec.price.toLocaleString('en-IN')} per seat
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
                {sec.rows} Rows × {sec.seatsPerRow} Seats
              </span>
            </div>

            {/* Rows map */}
            <div className="space-y-2 flex flex-col items-center">
              {sec.rowsList.map(row => (
                <div key={row.rowName} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs font-mono font-semibold text-slate-500">
                    {row.rowName}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {row.seats.map(seat => {
                      const isSelected = selectedSeats.some(s => s.label === seat.label);
                      const isBooked = seat.isBooked;

                      let btnStyle = 'bg-white hover:bg-blue-50 text-slate-700 border-slate-300 shadow-2xs';
                      if (isBooked) {
                        btnStyle = 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed';
                      } else if (isSelected) {
                        btnStyle = 'bg-blue-600 text-white font-bold border-blue-700 scale-105 shadow-sm';
                      } else if (sec.tier === 'VIP') {
                        btnStyle = 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300';
                      } else if (sec.tier === 'GOLD') {
                        btnStyle = 'bg-yellow-50 hover:bg-yellow-100 text-yellow-900 border-yellow-300';
                      }

                      return (
                        <button
                          key={seat.label}
                          disabled={isBooked}
                          onClick={() => toggleSeat(sec.name, seat.label, sec.price, sec.tier, isBooked)}
                          title={`${seat.label} - ₹${sec.price} ${isBooked ? '(Booked)' : isSelected ? '(Selected)' : '(Available)'}`}
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-md text-[10px] font-mono border transition flex items-center justify-center relative cursor-pointer ${btnStyle}`}
                        >
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : isBooked ? (
                            '×'
                          ) : (
                            seat.number
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-5 text-center text-xs font-mono font-semibold text-slate-500">
                    {row.rowName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-3 px-6 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border border-slate-300" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600 border border-blue-700" />
          <span className="text-blue-700 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] text-slate-500">
            ×
          </div>
          <span>Reserved / Sold</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-50 border border-amber-300" />
          <span className="text-amber-800">VIP Recliners</span>
        </div>
      </div>

      {/* BOTTOM SELECTION DOCK */}
      <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Users className="w-4 h-4 text-blue-600" />
            <span>
              {selectedSeats.length === 0
                ? 'No seats selected yet'
                : `${selectedSeats.length} seat(s) selected: `}
            </span>
            <span className="font-mono text-blue-700 font-semibold truncate max-w-xs">
              {selectedSeats.map(s => s.label).join(', ')}
            </span>
          </div>
          {selectedSeats.length > 0 && (
            <div className="text-xs text-slate-600 mt-1">
              Base: ₹{subtotal.toLocaleString('en-IN')} + GST 18%: ₹{gstTax.toLocaleString('en-IN')} ={' '}
              <span className="text-base font-bold text-slate-900">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        <button
          disabled={selectedSeats.length === 0}
          onClick={() => onProceedToCheckout(selectedSeats)}
          className={`w-full md:w-auto px-6 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
            selectedSeats.length > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Proceed to Payment ({selectedSeats.length} Tickets)</span>
        </button>
      </div>
    </div>
  );
};
