import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PersonaType,
  Event,
  Venue,
  Ticket,
  Attendee,
  Schedule,
  Sponsor,
  VendorStall,
  AuditLog,
  SystemSLA,
  WorkflowStage,
  TicketTierType
} from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_VENUES,
  INITIAL_TICKETS,
  INITIAL_ATTENDEES,
  INITIAL_SCHEDULES,
  INITIAL_SPONSORS,
  INITIAL_VENDOR_STALLS,
  INITIAL_AUDIT_LOGS,
  SYSTEM_SLAS
} from '../data/mockData';

interface AppContextType {
  currentPersona: PersonaType;
  setCurrentPersona: (persona: PersonaType) => void;
  events: Event[];
  venues: Venue[];
  tickets: Ticket[];
  attendees: Attendee[];
  currentAttendee: Attendee;
  setCurrentAttendee: (attendee: Attendee) => void;
  schedules: Schedule[];
  sponsors: Sponsor[];
  vendorStalls: VendorStall[];
  auditLogs: AuditLog[];
  systemSLAs: SystemSLA[];
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  selectedTicketForPass: Ticket | null;
  setSelectedTicketForPass: (ticket: Ticket | null) => void;
  isWorkflowModalOpen: boolean;
  setIsWorkflowModalOpen: (open: boolean) => void;
  
  // Actions
  bookTickets: (
    eventId: string,
    seats: { section: string; label: string; price: number; tier: TicketTierType }[],
    paymentMethod: string,
    attendeeInfo?: { name: string; email: string; phone: string }
  ) => Promise<Ticket[]>;
  checkInTicket: (ticketNumberOrQR: string, gate?: string) => { success: boolean; message: string; ticket?: Ticket; errorType?: string };
  cancelTicket: (ticketId: string, reason: string) => boolean;
  createEvent: (eventData: Partial<Event>) => Event;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  advanceWorkflowStage: (eventId: string, nextStage: WorkflowStage) => void;
  createVenue: (venueData: Partial<Venue>) => Venue;
  updateVenue: (venueId: string, updates: Partial<Venue>) => void;
  addScheduleSlot: (eventId: string, slot: any) => void;
  updateTicketTiers: (eventId: string, tiers: any[]) => void;
  addSponsor: (sponsorData: Partial<Sponsor>) => void;
  claimSponsorVipPasses: (sponsorId: string, count: number, recipientName: string, recipientEmail: string) => Ticket[];
  bookVendorStall: (stallData: Partial<VendorStall>) => void;
  reconcileBatch: () => { reconciledCount: number; totalRevenue: number; discrepancy: number };
  addAuditLog: (action: string, details: string, severity?: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS', caseId?: string) => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'pega_ticketing_blueprint_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage if available
  const [currentPersona, setCurrentPersona] = useState<PersonaType>('attendee');
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });
  const [venues, setVenues] = useState<Venue[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_venues`);
    return saved ? JSON.parse(saved) : INITIAL_VENUES;
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tickets`);
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });
  const [attendees, setAttendees] = useState<Attendee[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendees`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDEES;
  });
  const [currentAttendee, setCurrentAttendee] = useState<Attendee>(INITIAL_ATTENDEES[0]);
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_schedules`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });
  const [sponsors, setSponsors] = useState<Sponsor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sponsors`);
    return saved ? JSON.parse(saved) : INITIAL_SPONSORS;
  });
  const [vendorStalls, setVendorStalls] = useState<VendorStall[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_vendorStalls`);
    return saved ? JSON.parse(saved) : INITIAL_VENDOR_STALLS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auditLogs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [systemSLAs] = useState<SystemSLA[]>(SYSTEM_SLAS);

  const [selectedEventId, setSelectedEventId] = useState<string | null>('evt-soundwaves-2026');
  const [selectedTicketForPass, setSelectedTicketForPass] = useState<Ticket | null>(null);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
  }, [events]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_venues`, JSON.stringify(venues));
  }, [venues]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
  }, [tickets]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_attendees`, JSON.stringify(attendees));
  }, [attendees]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_schedules`, JSON.stringify(schedules));
  }, [schedules]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sponsors`, JSON.stringify(sponsors));
  }, [sponsors]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_vendorStalls`, JSON.stringify(vendorStalls));
  }, [vendorStalls]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditLog = (
    action: string,
    details: string,
    severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS' = 'INFO',
    caseId?: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: getActorNameForPersona(currentPersona, currentAttendee),
      persona: currentPersona,
      action,
      details,
      severity,
      caseId: caseId || `CASE-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const bookTickets = async (
    eventId: string,
    seats: { section: string; label: string; price: number; tier: TicketTierType }[],
    paymentMethod: string,
    attendeeInfo?: { name: string; email: string; phone: string }
  ): Promise<Ticket[]> => {
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found');
    const venue = venues.find(v => v.id === event.venueId);

    const buyerName = attendeeInfo?.name || currentAttendee.name;
    const buyerEmail = attendeeInfo?.email || currentAttendee.email;
    const buyerPhone = attendeeInfo?.phone || currentAttendee.phone;
    const txnId = `TXN-${paymentMethod.includes('UPI') ? 'UPI' : 'CARD'}-${Date.now().toString().slice(-8)}`;

    const newTickets: Ticket[] = seats.map((seat, index) => {
      const ticketNum = `TKT-2418304-${String(tickets.length + index + 1).padStart(3, '0')}`;
      const taxAmount = Math.round(seat.price * 0.18);
      const totalAmount = seat.price + taxAmount;
      
      return {
        id: `tkt-${Date.now()}-${index}`,
        ticketNumber: ticketNum,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        venueName: venue?.name || 'Grand Arena',
        venueCity: venue?.city || 'India',
        attendeeId: currentAttendee.id,
        attendeeName: buyerName,
        attendeeEmail: buyerEmail,
        attendeePhone: buyerPhone,
        tier: seat.tier,
        section: seat.section,
        seatLabel: seat.label,
        price: seat.price,
        tax: taxAmount,
        totalPaid: totalAmount,
        status: 'CONFIRMED',
        qrCodeData: `PEGA_BP2418304:${ticketNum}:${event.id}:${buyerName.toUpperCase().replace(/\s+/g, '_')}`,
        purchaseDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        paymentMethod,
        transactionId: txnId
      };
    });

    // Update tickets list
    setTickets(prev => [...newTickets, ...prev]);

    // Update event tier sold quantity
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== eventId) return ev;
        const updatedTiers = ev.ticketTiers.map(t => {
          const countForThisTier = seats.filter(s => s.tier === t.tier).length;
          return {
            ...t,
            soldQuantity: t.soldQuantity + countForThisTier
          };
        });
        return {
          ...ev,
          ticketTiers: updatedTiers
        };
      })
    );

    // Update attendee loyalty points (+50 pts per ticket)
    setAttendees(prev =>
      prev.map(att => {
        if (att.id === currentAttendee.id) {
          return {
            ...att,
            loyaltyPoints: att.loyaltyPoints + (seats.length * 50)
          };
        }
        return att;
      })
    );

    addAuditLog(
      'TICKET_PURCHASE_SUCCESS',
      `Issued ${newTickets.length} ticket(s) for "${event.title}" to ${buyerName}. Total paid: ₹${newTickets.reduce((acc, t) => acc + t.totalPaid, 0).toLocaleString('en-IN')}. Txn: ${txnId}`,
      'SUCCESS',
      newTickets[0]?.ticketNumber
    );

    return newTickets;
  };

  const checkInTicket = (
    ticketNumberOrQR: string,
    gate: string = 'Gate 1 Main Entry'
  ): { success: boolean; message: string; ticket?: Ticket; errorType?: string } => {
    const cleanInput = ticketNumberOrQR.trim();
    
    // Find ticket by ticketNumber, ID, or QR string pattern
    const ticket = tickets.find(
      t =>
        t.ticketNumber.toLowerCase() === cleanInput.toLowerCase() ||
        t.id === cleanInput ||
        t.qrCodeData === cleanInput ||
        cleanInput.includes(t.ticketNumber)
    );

    if (!ticket) {
      addAuditLog(
        'CHECK_IN_FAILED_NOT_FOUND',
        `Attempted check-in with invalid barcode/ticket ID "${ticketNumberOrQR}" at ${gate}.`,
        'WARNING'
      );
      return { success: false, message: 'Invalid Ticket! No matching record in Pega System of Record.', errorType: 'NOT_FOUND' };
    }

    if (ticket.status === 'CHECKED_IN') {
      addAuditLog(
        'CHECK_IN_DUPLICATE_ALERT',
        `DUPLICATE SCAN ATTEMPT! Ticket ${ticket.ticketNumber} was already validated at ${ticket.checkedInAt} (${ticket.checkedInGate || 'Gate A'}). Possible fraud attempt.`,
        'CRITICAL',
        ticket.ticketNumber
      );
      return {
        success: false,
        message: `Already Checked-In! Verified earlier at ${ticket.checkedInAt} (${ticket.checkedInGate || 'Gate 1'}).`,
        ticket,
        errorType: 'DUPLICATE'
      };
    }

    if (ticket.status === 'CANCELLED' || ticket.status === 'REFUNDED') {
      addAuditLog(
        'CHECK_IN_CANCELLED_TICKET',
        `Denied entry for cancelled/refunded ticket ${ticket.ticketNumber} at ${gate}.`,
        'CRITICAL',
        ticket.ticketNumber
      );
      return {
        success: false,
        message: `Entry Denied! Ticket status is ${ticket.status}.`,
        ticket,
        errorType: 'CANCELLED'
      };
    }

    // Mark checked in
    const checkInTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updatedTicket: Ticket = {
      ...ticket,
      status: 'CHECKED_IN',
      checkedInAt: checkInTime,
      checkedInGate: gate
    };

    setTickets(prev => prev.map(t => (t.id === ticket.id ? updatedTicket : t)));

    addAuditLog(
      'GATE_CHECK_IN_APPROVED',
      `Attendee ${ticket.attendeeName} successfully checked in with ${ticket.tier} ticket ${ticket.ticketNumber} (Seat ${ticket.seatLabel}) at ${gate}.`,
      'SUCCESS',
      ticket.ticketNumber
    );

    return {
      success: true,
      message: `Verified! Welcome ${ticket.attendeeName} (${ticket.tier} - Seat ${ticket.seatLabel})`,
      ticket: updatedTicket
    };
  };

  const cancelTicket = (ticketId: string, reason: string): boolean => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.status === 'CHECKED_IN') return false;

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return { ...t, status: 'REFUNDED' };
        }
        return t;
      })
    );

    // Free tier quantity
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== ticket.eventId) return ev;
        return {
          ...ev,
          ticketTiers: ev.ticketTiers.map(tier => {
            if (tier.tier === ticket.tier && tier.soldQuantity > 0) {
              return { ...tier, soldQuantity: tier.soldQuantity - 1 };
            }
            return tier;
          })
        };
      })
    );

    addAuditLog(
      'TICKET_REFUND_PROCESSED',
      `Ticket ${ticket.ticketNumber} cancelled and refunded. Reason: ${reason}. Amount refunded: ₹${ticket.totalPaid.toLocaleString('en-IN')}`,
      'INFO',
      ticket.ticketNumber
    );

    return true;
  };

  const createEvent = (eventData: Partial<Event>): Event => {
    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title: eventData.title || 'New Entertainment Event',
      category: eventData.category || 'Concert',
      description: eventData.description || 'Exclusive entertainment experience.',
      venueId: eventData.venueId || venues[0].id,
      date: eventData.date || '2026-10-25',
      time: eventData.time || '18:00',
      endTime: eventData.endTime || '22:30',
      status: eventData.status || 'PUBLISHED',
      bannerUrl:
        eventData.bannerUrl ||
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80',
      organizer: eventData.organizer || 'ISP Live Entertainment Co.',
      tags: eventData.tags || ['Live', 'Entertainment', 'Exclusive'],
      totalCapacity: eventData.totalCapacity || 5000,
      workflowStage: 'EVENT_SETUP',
      ticketTiers: eventData.ticketTiers || [
        { tier: 'VIP', name: 'VIP Pass', price: 5000, totalQuantity: 100, soldQuantity: 0, perks: ['Lounge Access', 'Fast Entry'], color: '#f59e0b' },
        { tier: 'GOLD', name: 'Gold Zone', price: 2500, totalQuantity: 500, soldQuantity: 0, perks: ['Stage Front View'], color: '#eab308' },
        { tier: 'GENERAL', name: 'General Admission', price: 999, totalQuantity: 2000, soldQuantity: 0, perks: ['Standard Entry'], color: '#3b82f6' }
      ]
    };

    setEvents(prev => [newEvent, ...prev]);

    addAuditLog(
      'EVENT_CREATED',
      `Event "${newEvent.title}" initialized by Event Planner. Initial capacity: ${newEvent.totalCapacity}.`,
      'SUCCESS',
      newEvent.id
    );

    return newEvent;
  };

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    setEvents(prev =>
      prev.map(ev => (ev.id === eventId ? { ...ev, ...updates } : ev))
    );
    addAuditLog(
      'EVENT_UPDATED',
      `Event ${eventId} details updated.`,
      'INFO',
      eventId
    );
  };

  const advanceWorkflowStage = (eventId: string, nextStage: WorkflowStage) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id === eventId) {
          return { ...ev, workflowStage: nextStage };
        }
        return ev;
      })
    );
    addAuditLog(
      'WORKFLOW_STAGE_TRANSITION',
      `Case ${eventId} transitioned to workflow stage "${nextStage}".`,
      'SUCCESS',
      eventId
    );
  };

  const createVenue = (venueData: Partial<Venue>): Venue => {
    const newVenue: Venue = {
      id: `ven-${Date.now()}`,
      name: venueData.name || 'New Grand Arena',
      city: venueData.city || 'Bengaluru',
      address: venueData.address || 'Central City Arena, India',
      capacity: venueData.capacity || 10000,
      amenities: venueData.amenities || ['Gigabit Wi-Fi 6', 'Air Conditioned', 'VIP Lounge', 'Food Court'],
      imageUrl:
        venueData.imageUrl ||
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      stallsAvailable: venueData.stallsAvailable || 25,
      sections: venueData.sections || [
        { id: 'sec-vip', name: 'VIP Deck', tier: 'VIP', basePrice: 6000, rows: 4, seatsPerRow: 16, color: '#f59e0b' },
        { id: 'sec-gold', name: 'Gold Club', tier: 'GOLD', basePrice: 3500, rows: 6, seatsPerRow: 20, color: '#eab308' },
        { id: 'sec-gen', name: 'General Floor', tier: 'GENERAL', basePrice: 1200, rows: 10, seatsPerRow: 28, color: '#3b82f6' }
      ]
    };
    setVenues(prev => [...prev, newVenue]);
    addAuditLog('VENUE_REGISTERED', `Venue "${newVenue.name}" registered in Pega Local SOR with capacity ${newVenue.capacity}.`, 'SUCCESS', newVenue.id);
    return newVenue;
  };

  const updateVenue = (venueId: string, updates: Partial<Venue>) => {
    setVenues(prev => prev.map(v => (v.id === venueId ? { ...v, ...updates } : v)));
    addAuditLog('VENUE_UPDATED', `Venue configuration updated for ${venueId}.`, 'INFO', venueId);
  };

  const addScheduleSlot = (eventId: string, slot: any) => {
    setSchedules(prev => {
      const existing = prev.find(s => s.eventId === eventId);
      const newSlot = { ...slot, id: `sl-${Date.now()}` };
      if (existing) {
        return prev.map(s =>
          s.eventId === eventId
            ? { ...s, slots: [...s.slots, newSlot].sort((a, b) => a.startTime.localeCompare(b.startTime)) }
            : s
        );
      } else {
        const ev = events.find(e => e.id === eventId);
        return [
          ...prev,
          {
            id: `sch-${Date.now()}`,
            eventId,
            eventDate: ev?.date || '2026-10-01',
            slots: [newSlot]
          }
        ];
      }
    });
    addAuditLog('SCHEDULE_SLOT_ADDED', `Schedule slot "${slot.title}" added to event ${eventId}.`, 'INFO', eventId);
  };

  const updateTicketTiers = (eventId: string, tiers: any[]) => {
    setEvents(prev =>
      prev.map(ev => (ev.id === eventId ? { ...ev, ticketTiers: tiers } : ev))
    );
    addAuditLog(
      'TICKET_TIERS_ADJUSTED',
      `Pricing and inventory tiers updated for event ${eventId}.`,
      'INFO',
      eventId
    );
  };

  const addSponsor = (sponsorData: Partial<Sponsor>) => {
    const newSponsor: Sponsor = {
      id: `spn-${Date.now()}`,
      name: sponsorData.name || 'New Brand Partner',
      company: sponsorData.company || 'Enterprise India Pvt Ltd',
      tier: sponsorData.tier || 'Gold',
      logo: sponsorData.logo || '✨ Brand Logo',
      contributedAmount: sponsorData.contributedAmount || 500000,
      sponsoredEventIds: sponsorData.sponsoredEventIds || [events[0]?.id || ''],
      bannerPlacements: sponsorData.bannerPlacements || ['Main Stage Screen'],
      vipPassesQuota: sponsorData.vipPassesQuota || 20,
      vipPassesUsed: 0,
      impressionsDelivered: 50000,
      contactEmail: sponsorData.contactEmail || 'sponsor@brand.in'
    };
    setSponsors(prev => [...prev, newSponsor]);
    addAuditLog('SPONSOR_ONBOARDED', `Sponsor "${newSponsor.company}" (${newSponsor.tier}) added with INR ₹${newSponsor.contributedAmount.toLocaleString('en-IN')} commitment.`, 'SUCCESS', newSponsor.id);
  };

  const claimSponsorVipPasses = (sponsorId: string, count: number, recipientName: string, recipientEmail: string): Ticket[] => {
    const sponsor = sponsors.find(s => s.id === sponsorId);
    if (!sponsor) throw new Error('Sponsor not found');
    if (sponsor.vipPassesUsed + count > sponsor.vipPassesQuota) {
      throw new Error('VIP pass quota exceeded');
    }

    const event = events[0];
    const venue = venues.find(v => v.id === event.venueId);

    const newTickets: Ticket[] = [];
    for (let i = 0; i < count; i++) {
      const ticketNum = `TKT-SPON-${Date.now().toString().slice(-4)}-${i + 1}`;
      newTickets.push({
        id: `tkt-spn-${Date.now()}-${i}`,
        ticketNumber: ticketNum,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        venueName: venue?.name || 'Grand Arena',
        venueCity: venue?.city || 'India',
        attendeeId: `spn-vip-${Date.now()}`,
        attendeeName: `${recipientName} (VIP Guest of ${sponsor.name})`,
        attendeeEmail: recipientEmail,
        attendeePhone: '+91 99000 00000',
        tier: 'VIP',
        section: 'Platinum VIP Lounge',
        seatLabel: `SPON-VIP-${Math.floor(10 + Math.random() * 89)}`,
        price: 0,
        tax: 0,
        totalPaid: 0,
        status: 'CONFIRMED',
        qrCodeData: `PEGA_BP2418304:${ticketNum}:SPONSOR_VIP:${sponsor.company.toUpperCase()}`,
        purchaseDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        paymentMethod: `Sponsor Complimentary Pass (${sponsor.name})`,
        transactionId: `TXN-SPON-${sponsor.id}`
      });
    }

    setTickets(prev => [...newTickets, ...prev]);
    setSponsors(prev =>
      prev.map(s => (s.id === sponsorId ? { ...s, vipPassesUsed: s.vipPassesUsed + count } : s))
    );

    addAuditLog(
      'SPONSOR_VIP_PASSES_CLAIMED',
      `Issued ${count} complimentary VIP passes to ${recipientName} (${recipientEmail}) on behalf of ${sponsor.name}.`,
      'SUCCESS',
      sponsor.id
    );

    return newTickets;
  };

  const bookVendorStall = (stallData: Partial<VendorStall>) => {
    const newStall: VendorStall = {
      id: `vst-${Date.now()}`,
      eventId: stallData.eventId || events[0]?.id || '',
      stallNumber: stallData.stallNumber || `ST-${Math.floor(10 + Math.random() * 89)}`,
      vendorName: stallData.vendorName || 'New Gourmet Stall',
      vendorType: stallData.vendorType || 'F&B Gourmet',
      stallSize: stallData.stallSize || '10x10 ft',
      fee: stallData.fee || 35000,
      status: 'ACTIVE',
      staffPasses: stallData.staffPasses || 4,
      menuOrItems: stallData.menuOrItems || ['Signature Item 1', 'Signature Item 2']
    };
    setVendorStalls(prev => [...prev, newStall]);
    addAuditLog(
      'VENDOR_STALL_ALLOCATED',
      `Stall ${newStall.stallNumber} booked by "${newStall.vendorName}" (${newStall.vendorType}) for fee ₹${newStall.fee.toLocaleString('en-IN')}.`,
      'SUCCESS',
      newStall.id
    );
  };

  const reconcileBatch = () => {
    const totalRev = tickets
      .filter(t => t.status !== 'CANCELLED' && t.status !== 'REFUNDED')
      .reduce((acc, t) => acc + t.totalPaid, 0);

    const vendorRev = vendorStalls.reduce((acc, v) => acc + v.fee, 0);
    const sponsorRev = sponsors.reduce((acc, s) => acc + s.contributedAmount, 0);

    const grandTotal = totalRev + vendorRev + sponsorRev;

    addAuditLog(
      'SYSTEM_RECONCILIATION_RUN',
      `Reconciled ${tickets.length} ticket records, ${vendorStalls.length} vendor contracts, and ${sponsors.length} sponsor agreements. Total audited ledger: ₹${grandTotal.toLocaleString('en-IN')}. Zero discrepancies.`,
      'SUCCESS',
      'RECON-2418304'
    );

    return {
      reconciledCount: tickets.length,
      totalRevenue: grandTotal,
      discrepancy: 0
    };
  };

  const resetToInitialData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_events`);
    localStorage.removeItem(`${STORAGE_KEY}_venues`);
    localStorage.removeItem(`${STORAGE_KEY}_tickets`);
    localStorage.removeItem(`${STORAGE_KEY}_attendees`);
    localStorage.removeItem(`${STORAGE_KEY}_schedules`);
    localStorage.removeItem(`${STORAGE_KEY}_sponsors`);
    localStorage.removeItem(`${STORAGE_KEY}_vendorStalls`);
    localStorage.removeItem(`${STORAGE_KEY}_auditLogs`);

    setEvents(INITIAL_EVENTS);
    setVenues(INITIAL_VENUES);
    setTickets(INITIAL_TICKETS);
    setAttendees(INITIAL_ATTENDEES);
    setSchedules(INITIAL_SCHEDULES);
    setSponsors(INITIAL_SPONSORS);
    setVendorStalls(INITIAL_VENDOR_STALLS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSelectedEventId(INITIAL_EVENTS[0].id);

    addAuditLog('DATABASE_RESET', 'Restored initial sample data for Pega Blueprint BP-2418304.', 'WARNING', 'RESET-01');
  };

  return (
    <AppContext.Provider
      value={{
        currentPersona,
        setCurrentPersona,
        events,
        venues,
        tickets,
        attendees,
        currentAttendee,
        setCurrentAttendee,
        schedules,
        sponsors,
        vendorStalls,
        auditLogs,
        systemSLAs,
        selectedEventId,
        setSelectedEventId,
        selectedTicketForPass,
        setSelectedTicketForPass,
        isWorkflowModalOpen,
        setIsWorkflowModalOpen,
        bookTickets,
        checkInTicket,
        cancelTicket,
        createEvent,
        updateEvent,
        advanceWorkflowStage,
        createVenue,
        updateVenue,
        addScheduleSlot,
        updateTicketTiers,
        addSponsor,
        claimSponsorVipPasses,
        bookVendorStall,
        reconcileBatch,
        addAuditLog,
        resetToInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

function getActorNameForPersona(persona: PersonaType, attendee: Attendee): string {
  switch (persona) {
    case 'ticketing_manager':
      return 'Ticketing Operations Manager';
    case 'event_planner':
      return 'Lead Event Architect & Planner';
    case 'attendee':
      return attendee.name || 'Consumer Attendee';
    case 'vendor':
      return 'Venue Concessions & Merch Lead';
    case 'sponsor':
      return 'Sponsorship Alliance Director';
    case 'control_agent':
      return 'Pega Application Control Agent';
    default:
      return 'System User';
  }
}
