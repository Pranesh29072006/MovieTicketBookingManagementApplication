export type PersonaType =
  | 'ticketing_manager'
  | 'event_planner'
  | 'attendee'
  | 'vendor'
  | 'sponsor'
  | 'control_agent';

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ON_SALE' | 'SOLD_OUT' | 'COMPLETED' | 'CANCELLED';

export type TicketTierType = 'VIP' | 'GOLD' | 'SILVER' | 'GENERAL' | 'EARLY_BIRD';

export type TicketStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'REFUNDED';

export type WorkflowStage =
  | 'EVENT_SETUP'
  | 'VENUE_ALLOCATION'
  | 'PRICING_INVENTORY'
  | 'SALES_RESERVATIONS'
  | 'GATE_VALIDATION'
  | 'POST_EVENT_RECONCILIATION';

export interface Seat {
  id: string;
  section: string;
  row: string;
  number: number;
  tier: TicketTierType;
  price: number;
  isBooked: boolean;
  bookedBy?: string;
}

export interface VenueSection {
  id: string;
  name: string;
  tier: TicketTierType;
  basePrice: number;
  rows: number;
  seatsPerRow: number;
  color: string;
}

// 1. Data Object: Venue
export interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  sections: VenueSection[];
  amenities: string[];
  imageUrl: string;
  stallsAvailable: number;
}

export interface TicketTierConfig {
  tier: TicketTierType;
  name: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  perks: string[];
  color: string;
}

// 2. Data Object: Event
export interface Event {
  id: string;
  title: string;
  category: 'Concert' | 'Conference' | 'Festival' | 'Comedy' | 'Sports' | 'Exhibition';
  description: string;
  venueId: string;
  date: string;
  time: string;
  endTime: string;
  status: EventStatus;
  bannerUrl: string;
  organizer: string;
  tags: string[];
  totalCapacity: number;
  ticketTiers: TicketTierConfig[];
  workflowStage: WorkflowStage;
  featured?: boolean;
}

// 3. Data Object: Ticket
export interface Ticket {
  id: string;
  ticketNumber: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueCity: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  tier: TicketTierType;
  section: string;
  seatLabel: string;
  price: number;
  tax: number;
  totalPaid: number;
  status: TicketStatus;
  qrCodeData: string;
  purchaseDate: string;
  paymentMethod: string;
  transactionId: string;
  checkedInAt?: string;
  checkedInGate?: string;
}

// 4. Data Object: Attendee
export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberTier: 'Regular' | 'Silver' | 'Gold' | 'VIP Club';
  loyaltyPoints: number;
  preferences: string[];
}

export interface ScheduleSlot {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  speakerOrArtist: string;
  stage: string;
  category: string;
  description: string;
}

// 5. Data Object: Schedule
export interface Schedule {
  id: string;
  eventId: string;
  eventDate: string;
  slots: ScheduleSlot[];
}

export interface BannerPlacement {
  id: string;
  location: 'Main Stage Screen' | 'Entrance Archway' | 'Mobile App Header' | 'VIP Lounge Backdrop' | 'Event Badges';
  dimensions: string;
  impressionsEstimated: number;
  assigned: boolean;
}

// 6. Data Object: Sponsor
export interface Sponsor {
  id: string;
  name: string;
  company: string;
  tier: 'Title' | 'Platinum' | 'Gold' | 'Silver' | 'Official Partner';
  logo: string;
  contributedAmount: number; // in INR
  sponsoredEventIds: string[];
  bannerPlacements: string[];
  vipPassesQuota: number;
  vipPassesUsed: number;
  impressionsDelivered: number;
  contactEmail: string;
}

// Additional Vendor Data Object for Venue operations
export interface VendorStall {
  id: string;
  eventId: string;
  stallNumber: string;
  vendorName: string;
  vendorType: 'F&B Gourmet' | 'Official Merchandise' | 'Interactive Experience' | 'Beverages' | 'Telecom & Tech';
  stallSize: '10x10 ft' | '20x10 ft' | 'Island Booth';
  fee: number;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE';
  staffPasses: number;
  menuOrItems: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  persona: PersonaType;
  action: string;
  details: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  caseId?: string;
}

export interface SystemSLA {
  service: string;
  uptime: string;
  targetResponseMs: number;
  currentResponseMs: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'WARNING';
}
