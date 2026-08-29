import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Event, Venue, ScheduleSlot, TicketTierType } from '../../types';
import {
  Calendar,
  Plus,
  Sparkles,
  MapPin,
  Clock,
  Music,
  Users,
  Building,
  CheckCircle2,
  ListPlus,
  Wand2,
  Trash2
} from 'lucide-react';

export const EventPlannerView: React.FC = () => {
  const {
    events,
    venues,
    schedules,
    createEvent,
    addScheduleSlot,
    selectedEventId,
    setSelectedEventId,
    createVenue
  } = useApp();

  const [activeTab, setActiveTab] = useState<'EVENTS' | 'CREATE_EVENT' | 'SCHEDULE' | 'VENUES'>('EVENTS');

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const currentVenue = venues.find(v => v.id === currentEvent?.venueId);
  const currentSchedule = schedules.find(s => s.eventId === currentEvent?.id);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Concert' | 'Conference' | 'Festival' | 'Comedy' | 'Sports' | 'Exhibition'>('Concert');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-11-20');
  const [newEventTime, setNewEventTime] = useState('18:00');
  const [newEventEndTime, setNewEventEndTime] = useState('22:30');
  const [newEventVenueId, setNewEventVenueId] = useState(venues[0]?.id || '');
  const [newEventCapacity, setNewEventCapacity] = useState(10000);
  const [newEventTags, setNewEventTags] = useState('Live Music, Bollywood, VIP Pass');
  const [newEventBanner, setNewEventBanner] = useState('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80');

  // Schedule slot form state
  const [slotTime, setSlotTime] = useState('19:00');
  const [slotEndTime, setSlotEndTime] = useState('20:30');
  const [slotTitle, setSlotTitle] = useState('');
  const [slotArtist, setSlotArtist] = useState('');
  const [slotStage, setSlotStage] = useState('Main Stage Alpha');
  const [slotCategory, setSlotCategory] = useState('Headliner');
  const [slotDesc, setSlotDesc] = useState('');

  // AI Copilot Generator
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleAiCopilot = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      if (newEventCategory === 'Concert') {
        setNewEventTitle('Acoustic Sunset & Bollywood EDM Festival');
        setNewEventDesc('An unforgettable outdoor evening featuring acoustic sunset preludes leading into a high-energy Bollywood electronic dance symphony with 3D projection mapping.');
        setNewEventTags('Concert, EDM, Sunset, Bollywood, 4K Visuals');
        setNewEventCapacity(15000);
      } else if (newEventCategory === 'Conference') {
        setNewEventTitle('India Broadband & Cloud Innovation Conclave');
        setNewEventDesc('Gathering 500+ telecom leaders, AI founders, and cloud architects to discuss 100Gbps internet rollouts, consumer gaming edge nodes, and smart stadium tech.');
        setNewEventTags('AI, Telecom, 6G, Cloud, Innovation, Keynotes');
        setNewEventCapacity(8000);
      } else {
        setNewEventTitle('Grand Mumbai All-Stars Comedy Feast');
        setNewEventDesc('Top 8 standup comedians live in an unplugged 3-hour laugh marathon with musical parodies and interactive crowd games.');
        setNewEventTags('Standup, Comedy, Mumbai Nightlife, VIP Laugh Deck');
        setNewEventCapacity(4500);
      }
      setIsGeneratingAi(false);
    }, 800);
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) return;

    const created = createEvent({
      title: newEventTitle,
      category: newEventCategory,
      description: newEventDesc,
      venueId: newEventVenueId,
      date: newEventDate,
      time: newEventTime,
      endTime: newEventEndTime,
      totalCapacity: newEventCapacity,
      tags: newEventTags.split(',').map(t => t.trim()),
      bannerUrl: newEventBanner,
      status: 'PUBLISHED'
    });

    setSelectedEventId(created.id);
    setActiveTab('EVENTS');
  };

  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotTitle) return;

    addScheduleSlot(currentEvent.id, {
      startTime: slotTime,
      endTime: slotEndTime,
      title: slotTitle,
      speakerOrArtist: slotArtist,
      stage: slotStage,
      category: slotCategory,
      description: slotDesc
    });

    setSlotTitle('');
    setSlotArtist('');
    setSlotDesc('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold uppercase tracking-wider">
              Persona: Event Planner Channel
            </span>
            <span className="text-xs text-slate-500 font-mono">BP-2418304</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5">
            Event Architecture & Production Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Design multi-stage schedules, configure seating charts, and launch entertainment experiences.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab('CREATE_EVENT')}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm flex items-center gap-2 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Event Case</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('EVENTS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'EVENTS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          All Active Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('SCHEDULE')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'SCHEDULE'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Multi-Track Schedules & Lineup
        </button>
        <button
          onClick={() => setActiveTab('VENUES')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'VENUES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Venue Blueprints ({venues.length})
        </button>
        <button
          onClick={() => setActiveTab('CREATE_EVENT')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'CREATE_EVENT'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          + New Event Wizard
        </button>
      </div>

      {/* TAB 1: ALL EVENTS */}
      {activeTab === 'EVENTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => {
            const v = venues.find(venue => venue.id === ev.venueId);
            const isSelected = ev.id === currentEvent.id;

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`p-5 rounded-xl bg-white border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:border-blue-400 shadow-sm ${
                  isSelected ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="relative h-36 rounded-lg overflow-hidden mb-3 border border-slate-100">
                    <img
                      src={ev.bannerUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                      {ev.category}
                    </div>
                    <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-blue-600 text-[10px] font-semibold text-white">
                      {ev.status}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-1">{ev.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{ev.description}</p>

                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{ev.date} • {ev.time} IST</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span className="truncate">{v?.name}, {v?.city}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">
                    Cap: {ev.totalCapacity.toLocaleString('en-IN')}
                  </span>
                  <span className="font-semibold text-blue-700">
                    {ev.ticketTiers.length} Pricing Tiers
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SCHEDULE */}
      {activeTab === 'SCHEDULE' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Schedule Timeline */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Schedule Timeline for "{currentEvent.title}"
                </h3>
                <p className="text-xs text-slate-500">
                  Date: {currentEvent.date} • Venue: {currentVenue?.name}
                </p>
              </div>
              <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-3 py-1 rounded-md">
                {currentSchedule?.slots.length || 0} Time Slots
              </span>
            </div>

            <div className="space-y-3">
              {(!currentSchedule || currentSchedule.slots.length === 0) && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No schedule slots added yet. Use the builder on the right.
                </div>
              )}

              {currentSchedule?.slots.map((slot, idx) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-4"
                >
                  <div className="text-center min-w-[70px] bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-xs font-mono font-bold text-blue-700 block">
                      {slot.startTime}
                    </span>
                    <span className="text-[10px] text-slate-400 block">to {slot.endTime}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{slot.title}</h4>
                      <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                        {slot.stage}
                      </span>
                    </div>

                    <p className="text-xs text-amber-700 font-semibold mt-0.5">
                      Performer/Speaker: {slot.speakerOrArtist} ({slot.category})
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{slot.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Slot Form */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-blue-600" />
              <span>Add Schedule Session</span>
            </h3>

            <form onSubmit={handleAddSlotSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={slotTime}
                    onChange={e => setSlotTime(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-medium block mb-1">End Time</label>
                  <input
                    type="time"
                    value={slotEndTime}
                    onChange={e => setSlotEndTime(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Session / Performance Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Synth Opening Act"
                  value={slotTitle}
                  onChange={e => setSlotTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Artist / Speaker Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJ Shaan & Bombay Strings"
                  value={slotArtist}
                  onChange={e => setSlotArtist(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Stage / Zone</label>
                  <select
                    value={slotStage}
                    onChange={e => setSlotStage(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Main Stage Alpha">Main Stage Alpha</option>
                    <option value="Acoustic Pavilion">Acoustic Pavilion</option>
                    <option value="Sky Drone Deck">Sky Drone Deck</option>
                    <option value="Keynote Hall 1">Keynote Hall 1</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 font-medium block mb-1">Session Type</label>
                  <input
                    type="text"
                    value={slotCategory}
                    onChange={e => setSlotCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 font-medium block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis of this slot..."
                  value={slotDesc}
                  onChange={e => setSlotDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Schedule Object</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: VENUES */}
      {activeTab === 'VENUES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {venues.map(v => (
            <div key={v.id} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{v.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{v.address}, {v.city}</span>
                  </p>
                </div>
                <span className="text-xs font-mono bg-blue-50 px-3 py-1 rounded-md text-blue-700 font-semibold border border-blue-200">
                  {v.capacity.toLocaleString('en-IN')} Cap
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700">Configured Seating Sections:</span>
                <div className="grid grid-cols-2 gap-2">
                  {v.sections.map(sec => (
                    <div
                      key={sec.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.color }} />
                        <span className="font-bold text-slate-900 truncate">{sec.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {sec.rows} rows × {sec.seatsPerRow} seats • Base ₹{sec.basePrice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">Venue Amenities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {v.amenities.map((a, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CREATE EVENT WIZARD */}
      {activeTab === 'CREATE_EVENT' && (
        <form onSubmit={handleCreateEventSubmit} className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Initialize New Entertainment Case</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pega Blueprint BP-2418304 • Event Setup & Seating Allocation Stage
              </p>
            </div>

            <button
              type="button"
              onClick={handleAiCopilot}
              disabled={isGeneratingAi}
              className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isGeneratingAi ? 'Synthesizing...' : 'AI Planner Copilot'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="text-slate-600 font-medium block mb-1">Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Soundwaves Live Festival Mumbai"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Category</label>
              <select
                value={newEventCategory}
                onChange={e => setNewEventCategory(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Concert">Concert</option>
                <option value="Conference">Conference</option>
                <option value="Comedy">Comedy</option>
                <option value="Festival">Festival</option>
                <option value="Sports">Sports</option>
                <option value="Exhibition">Exhibition</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Assigned Venue</label>
              <select
                value={newEventVenueId}
                onChange={e => setNewEventVenueId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Event Date</label>
              <input
                type="date"
                required
                value={newEventDate}
                onChange={e => setNewEventDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 font-medium block mb-1">Start Time</label>
                <input
                  type="time"
                  value={newEventTime}
                  onChange={e => setNewEventTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-600 font-medium block mb-1">End Time</label>
                <input
                  type="time"
                  value={newEventEndTime}
                  onChange={e => setNewEventEndTime(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-600 font-medium block mb-1">Event Description & Program</label>
              <textarea
                rows={3}
                required
                value={newEventDesc}
                onChange={e => setNewEventDesc(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-600 font-medium block mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                value={newEventTags}
                onChange={e => setNewEventTags(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Publish Event & Allocate Venue Inventory</span>
          </button>
        </form>
      )}
    </div>
  );
};
