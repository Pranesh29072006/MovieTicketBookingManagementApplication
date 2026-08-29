import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SeatMapPicker } from '../common/SeatMapPicker';
import { PaymentModal } from '../common/PaymentModal';
import { TicketPassModal } from '../common/TicketPassModal';
import { Event, Venue, TicketTierType, Ticket } from '../../types';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Ticket as TicketIcon,
  Eye,
  ShieldCheck,
  Award,
  CreditCard,
  User,
  Heart,
  ChevronRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

export const AttendeeView: React.FC = () => {
  const {
    events,
    venues,
    tickets,
    currentAttendee,
    setCurrentAttendee,
    attendees,
    bookTickets,
    cancelTicket,
    selectedTicketForPass,
    setSelectedTicketForPass,
    selectedEventId,
    setSelectedEventId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'DISCOVER' | 'BOOKING_FLOW' | 'MY_PASSES' | 'PROFILE'>('DISCOVER');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSeatsForCheckout, setSelectedSeatsForCheckout] = useState<{
    section: string;
    label: string;
    price: number;
    tier: TicketTierType;
  }[]>([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const currentVenue = venues.find(v => v.id === currentEvent?.venueId) || venues[0];

  // Attendee tickets
  const myTickets = tickets.filter(
    t => t.attendeeId === currentAttendee.id || t.attendeeEmail === currentAttendee.email
  );

  const filteredEvents = events.filter(ev => {
    const v = venues.find(venue => venue.id === ev.venueId);
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'ALL' || v?.city === selectedCity;
    const matchesCat = selectedCategory === 'ALL' || ev.category === selectedCategory;

    return matchesSearch && matchesCity && matchesCat;
  });

  const handleStartBooking = (ev: Event) => {
    setSelectedEventId(ev.id);
    setActiveTab('BOOKING_FLOW');
  };

  const handleProceedToPayment = (seats: any[]) => {
    setSelectedSeatsForCheckout(seats);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (newTickets: Ticket[]) => {
    setIsPaymentOpen(false);
    setSelectedSeatsForCheckout([]);
    if (newTickets.length > 0) {
      setSelectedTicketForPass(newTickets[0]);
    }
    setActiveTab('MY_PASSES');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={currentAttendee.avatar}
            alt={currentAttendee.name}
            className="w-14 h-14 rounded-xl object-cover border-2 border-blue-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
                Persona: Attendee Channel
              </span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                {currentAttendee.memberTier}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Welcome back, {currentAttendee.name}
            </h2>
            <p className="text-xs text-slate-500">
              {currentAttendee.loyaltyPoints} Loyalty Points • {myTickets.length} Active Digital Passes
            </p>
          </div>
        </div>

        {/* Switch Attendee profile */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Switch User:</span>
          <select
            value={currentAttendee.id}
            onChange={e => {
              const target = attendees.find(a => a.id === e.target.value);
              if (target) setCurrentAttendee(target);
            }}
            className="bg-white border border-slate-300 text-xs text-slate-900 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {attendees.map(att => (
              <option key={att.id} value={att.id}>
                {att.name} ({att.memberTier})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('DISCOVER')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'DISCOVER'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Discover Entertainment ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('MY_PASSES')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'MY_PASSES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <TicketIcon className="w-3.5 h-3.5" />
          <span>My Digital Passes ({myTickets.length})</span>
        </button>
        {activeTab === 'BOOKING_FLOW' && (
          <button
            onClick={() => setActiveTab('BOOKING_FLOW')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white whitespace-nowrap shadow-sm"
          >
            Seating & Checkout ({currentEvent.title})
          </button>
        )}
      </div>

      {/* TAB 1: DISCOVER EVENTS */}
      {activeTab === 'DISCOVER' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search concerts, festivals, comedy shows, venues..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="bg-white border border-slate-300 text-xs text-slate-900 rounded-lg px-3 py-2 flex-1 md:flex-initial shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Indian Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-white border border-slate-300 text-xs text-slate-900 rounded-lg px-3 py-2 flex-1 md:flex-initial shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="Concert">Concerts</option>
                <option value="Conference">Conferences</option>
                <option value="Comedy">Comedy</option>
                <option value="Sports">Sports / Esports</option>
              </select>
            </div>
          </div>

          {/* Featured Spotlight Card */}
          {filteredEvents.length > 0 && (
            <div className="relative rounded-xl overflow-hidden border border-blue-200 shadow-sm bg-gradient-to-r from-blue-50/70 via-white to-slate-50">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                        ISP Spotlight Featured
                      </span>
                      <span className="text-xs text-blue-700 font-semibold">{filteredEvents[0].category}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 leading-tight">
                      {filteredEvents[0].title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {filteredEvents[0].description}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 text-xs text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{filteredEvents[0].date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{filteredEvents[0].time} IST</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>
                          {venues.find(v => v.id === filteredEvents[0].venueId)?.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleStartBooking(filteredEvents[0])}
                      className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
                    >
                      <TicketIcon className="w-4 h-4" />
                      <span>Select Seats & Book Now (From ₹{filteredEvents[0].ticketTiers[0]?.price})</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 h-64 lg:h-auto relative">
                  <img
                    src={filteredEvents[0].bannerUrl}
                    alt={filteredEvents[0].title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white/20 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          )}

          {/* Grid of all events */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(ev => {
              const v = venues.find(venue => venue.id === ev.venueId);
              const minPrice = Math.min(...ev.ticketTiers.map(t => t.price));

              return (
                <div
                  key={ev.id}
                  className="rounded-xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-blue-400 transition group shadow-sm"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden border-b border-slate-100">
                      <img
                        src={ev.bannerUrl}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                        {ev.category}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-blue-600 text-xs font-semibold text-white shadow-sm">
                        From ₹{minPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition line-clamp-1">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ev.description}</p>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>{ev.date} at {ev.time} IST</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span className="truncate">{v?.name}, {v?.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleStartBooking(ev)}
                      className="w-full py-2.5 rounded-lg bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Pick Seats & Book</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SEATING & BOOKING */}
      {activeTab === 'BOOKING_FLOW' && (
        <div className="space-y-6">
          <button
            onClick={() => setActiveTab('DISCOVER')}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Event Discovery</span>
          </button>

          <SeatMapPicker
            event={currentEvent}
            venue={currentVenue}
            existingTickets={tickets}
            onProceedToCheckout={handleProceedToPayment}
          />
        </div>
      )}

      {/* TAB 3: MY DIGITAL PASSES */}
      {activeTab === 'MY_PASSES' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">My Digital Wallet Passes ({myTickets.length})</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cryptographically verified tickets with dynamic turnstile QR codes.
            </p>
          </div>

          {myTickets.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <TicketIcon className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No passes in your wallet yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore upcoming concerts, festivals, and conferences in India and reserve your seats.
              </p>
              <button
                onClick={() => setActiveTab('DISCOVER')}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition cursor-pointer shadow-sm"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myTickets.map(t => (
                <div
                  key={t.id}
                  className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        t.status === 'CHECKED_IN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.status === 'CONFIRMED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 line-clamp-1">{t.eventTitle}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">SEAT / ZONE</span>
                        <span className="font-bold text-blue-700">{t.seatLabel} ({t.tier})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">DATE & TIME</span>
                        <span className="font-medium text-slate-900">{t.eventDate} at {t.eventTime}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">VENUE</span>
                        <span className="font-medium text-slate-900 truncate block">{t.venueName}, {t.venueCity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedTicketForPass(t)}
                      className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Full QR Pass</span>
                    </button>

                    {t.status === 'CONFIRMED' && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to cancel and refund ticket ${t.ticketNumber}?`)) {
                            cancelTicket(t.id, 'Customer Self-Service Cancellation');
                          }
                        }}
                        className="py-2 px-3 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 text-xs font-medium transition cursor-pointer"
                        title="Cancel & Refund Ticket"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Gateway Modal */}
      {isPaymentOpen && (
        <PaymentModal
          event={currentEvent}
          selectedSeats={selectedSeatsForCheckout}
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
          onBookTickets={bookTickets}
          initialAttendee={currentAttendee}
        />
      )}

      {/* Digital Ticket Pass Modal */}
      <TicketPassModal
        ticket={selectedTicketForPass}
        onClose={() => setSelectedTicketForPass(null)}
      />
    </div>
  );
};
