import { Venue, Event, Attendee, Ticket, Schedule, Sponsor, VendorStall, AuditLog, SystemSLA } from '../types';

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'ven-mumbai-01',
    name: 'Jio World Convention Centre Arena',
    city: 'Mumbai',
    address: 'G Block BKC, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
    capacity: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    amenities: ['Gigabit Wi-Fi 6', 'Air Conditioned', 'VIP Valet Parking', 'Multi-cuisine Food Court', 'Disability Access', 'Acoustic Soundstage'],
    stallsAvailable: 28,
    sections: [
      { id: 'sec-vip', name: 'Platinum VIP Lounge & Front Row', tier: 'VIP', basePrice: 7500, rows: 4, seatsPerRow: 16, color: '#f59e0b' },
      { id: 'sec-gold', name: 'Gold Club Tier', tier: 'GOLD', basePrice: 4500, rows: 6, seatsPerRow: 20, color: '#eab308' },
      { id: 'sec-silver', name: 'Silver Grandstand', tier: 'SILVER', basePrice: 2800, rows: 8, seatsPerRow: 24, color: '#94a3b8' },
      { id: 'sec-gen', name: 'General Arena Floor', tier: 'GENERAL', basePrice: 1500, rows: 10, seatsPerRow: 28, color: '#3b82f6' }
    ]
  },
  {
    id: 'ven-blr-02',
    name: 'Palace Grounds Grand Arena',
    city: 'Bengaluru',
    address: 'Jayamahal Main Road, Near Mekhri Circle, Bengaluru, Karnataka 560006',
    capacity: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    amenities: ['Open Air Amphitheatre', 'F&B Village', 'Laser & Pyrotechnics Support', 'High-speed Fiber Drop', 'Shuttle Bus Pickup'],
    stallsAvailable: 40,
    sections: [
      { id: 'sec-vip-blr', name: 'Royal VIP Enclosure', tier: 'VIP', basePrice: 6500, rows: 4, seatsPerRow: 18, color: '#f59e0b' },
      { id: 'sec-gold-blr', name: 'Fan Pit Gold Zone', tier: 'GOLD', basePrice: 3800, rows: 6, seatsPerRow: 22, color: '#eab308' },
      { id: 'sec-silver-blr', name: 'Lawn Silver Circle', tier: 'SILVER', basePrice: 2200, rows: 8, seatsPerRow: 26, color: '#94a3b8' },
      { id: 'sec-gen-blr', name: 'General Lawn Tier', tier: 'GENERAL', basePrice: 1200, rows: 12, seatsPerRow: 30, color: '#3b82f6' }
    ]
  },
  {
    id: 'ven-delhi-03',
    name: 'Bharat Mandapam Amphitheatre',
    city: 'New Delhi',
    address: 'Pragati Maidan, New Delhi, Delhi 110001',
    capacity: 9000,
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80',
    amenities: ['State-of-the-art AV', 'Interpretation Pods', 'Metro Connected', 'Executive Dining', 'Media Broadcast Hub'],
    stallsAvailable: 20,
    sections: [
      { id: 'sec-vip-del', name: 'Executive Diplomat VIP', tier: 'VIP', basePrice: 8000, rows: 3, seatsPerRow: 14, color: '#f59e0b' },
      { id: 'sec-gold-del', name: 'Premium Gold Hall', tier: 'GOLD', basePrice: 5000, rows: 5, seatsPerRow: 18, color: '#eab308' },
      { id: 'sec-silver-del', name: 'Silver Gallery', tier: 'SILVER', basePrice: 3000, rows: 6, seatsPerRow: 20, color: '#94a3b8' },
      { id: 'sec-gen-del', name: 'Auditorium Standard', tier: 'GENERAL', basePrice: 1800, rows: 8, seatsPerRow: 22, color: '#3b82f6' }
    ]
  },
  {
    id: 'ven-hyd-04',
    name: 'HITEX International Exhibition Hall',
    city: 'Hyderabad',
    address: 'Trade Fair Office Building, Izzat Nagar, Madhapur, Hyderabad, Telangana 500084',
    capacity: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    amenities: ['Pillarless Halls', 'Extensive Rigging Grid', '5G Ultra Coverage', 'Food Boulevard', 'Green Rooms'],
    stallsAvailable: 35,
    sections: [
      { id: 'sec-vip-hyd', name: 'VIP Cyber Deck', tier: 'VIP', basePrice: 6000, rows: 4, seatsPerRow: 16, color: '#f59e0b' },
      { id: 'sec-gold-hyd', name: 'Gold Track A', tier: 'GOLD', basePrice: 3500, rows: 6, seatsPerRow: 20, color: '#eab308' },
      { id: 'sec-silver-hyd', name: 'Silver Track B', tier: 'SILVER', basePrice: 2000, rows: 8, seatsPerRow: 24, color: '#94a3b8' },
      { id: 'sec-gen-hyd', name: 'Open Access Zone', tier: 'GENERAL', basePrice: 999, rows: 10, seatsPerRow: 28, color: '#3b82f6' }
    ]
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-soundwaves-2026',
    title: 'Soundwaves India Symphony & Pop Live',
    category: 'Concert',
    description: 'An electrifying multi-genre concert featuring the National Symphony Orchestra collaborating with India\'s top Bollywood fusion and indie synth pop artists.',
    venueId: 'ven-mumbai-01',
    date: '2026-09-18',
    time: '18:30',
    endTime: '23:30',
    status: 'ON_SALE',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    organizer: 'Airtel Digital Live & ISP Entertainment Hub',
    tags: ['Live Music', 'Bollywood Fusion', 'Symphony', 'Exclusive ISP Pass'],
    totalCapacity: 12500,
    featured: true,
    workflowStage: 'SALES_RESERVATIONS',
    ticketTiers: [
      { tier: 'VIP', name: 'Platinum VIP (Lounge + Meet & Greet)', price: 7500, totalQuantity: 250, soldQuantity: 184, perks: ['Complimentary Cocktails & Dining', 'Dedicated Fast Track Entry', 'Front Row Recliner', 'Signed Tour Vinyl'], color: '#f59e0b' },
      { tier: 'GOLD', name: 'Gold Fan Circle', price: 4500, totalQuantity: 800, soldQuantity: 620, perks: ['Priority Entry Gate 3', 'Free Welcome Beverage', 'Close Stage View'], color: '#eab308' },
      { tier: 'SILVER', name: 'Silver Grandstand', price: 2800, totalQuantity: 2500, soldQuantity: 1940, perks: ['Tiered Elevated Seating', 'Direct Concession Access'], color: '#94a3b8' },
      { tier: 'GENERAL', name: 'General Arena Standing', price: 1500, totalQuantity: 5000, soldQuantity: 3410, perks: ['Standard Arena Entry Gate 7'], color: '#3b82f6' }
    ]
  },
  {
    id: 'evt-futuretech-2026',
    title: 'ISP NextGen Telecom & AI Summit 2026',
    category: 'Conference',
    description: 'The premier national forum bridging high-speed 6G connectivity, edge cloud infrastructure, and generative AI innovations for consumer entertainment.',
    venueId: 'ven-blr-02',
    date: '2026-10-05',
    time: '09:00',
    endTime: '19:00',
    status: 'ON_SALE',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    organizer: 'National Broadband Alliance of India',
    tags: ['AI', 'Tech Summit', 'Telecommunications', 'Networking', 'Founders'],
    totalCapacity: 8000,
    featured: true,
    workflowStage: 'SALES_RESERVATIONS',
    ticketTiers: [
      { tier: 'VIP', name: 'VIP All-Access C-Level Pass', price: 12000, totalQuantity: 150, soldQuantity: 110, perks: ['Speakers Dinner Entry', 'Executive Lounge Access', '1-on-1 Investor Speed Dating'], color: '#f59e0b' },
      { tier: 'GOLD', name: 'Gold Delegate', price: 5500, totalQuantity: 600, soldQuantity: 430, perks: ['Full Keynotes & Masterclasses Access', 'Gourmet Buffet Lunch', 'Conference Kit'], color: '#eab308' },
      { tier: 'SILVER', name: 'Silver Standard Attendee', price: 3200, totalQuantity: 1800, soldQuantity: 1250, perks: ['Keynote Halls Access', 'Exhibition Floor Entry'], color: '#94a3b8' },
      { tier: 'GENERAL', name: 'Student & Developer Pass', price: 1200, totalQuantity: 1500, soldQuantity: 1100, perks: ['Expo Floor', 'Hackathon & Workshop Arena'], color: '#3b82f6' }
    ]
  },
  {
    id: 'evt-comedy-night',
    title: 'The Great Indian Comedy Gala - All Stars',
    category: 'Comedy',
    description: 'A non-stop 3-hour laughter marathon starring India’s premier standup comedians with musical roasts and crowd improvisations.',
    venueId: 'ven-delhi-03',
    date: '2026-09-26',
    time: '19:30',
    endTime: '22:30',
    status: 'ON_SALE',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    organizer: 'LaughLab Live',
    tags: ['Comedy', 'Standup', 'Delhi Weekend', 'Nightlife'],
    totalCapacity: 5000,
    workflowStage: 'SALES_RESERVATIONS',
    ticketTiers: [
      { tier: 'VIP', name: 'Front Row VIP Laugh Deck', price: 4000, totalQuantity: 80, soldQuantity: 75, perks: ['Interactive Crowd Spotting', 'Free Snack Basket'], color: '#f59e0b' },
      { tier: 'GOLD', name: 'Center Stage Gold', price: 2500, totalQuantity: 400, soldQuantity: 340, perks: ['Unobstructed Clear View'], color: '#eab308' },
      { tier: 'SILVER', name: 'Balcony Silver', price: 1500, totalQuantity: 1200, soldQuantity: 880, perks: ['Comfortable Elevated Seats'], color: '#94a3b8' },
      { tier: 'GENERAL', name: 'Rear Standard', price: 899, totalQuantity: 1500, soldQuantity: 980, perks: ['Standard Seating'], color: '#3b82f6' }
    ]
  },
  {
    id: 'evt-gaming-championship',
    title: 'Pro Gaming & Esports National Arena 2026',
    category: 'Sports',
    description: 'Top national esports clans battle in high-octane FPS and MOBA tournaments streamed across ultra-low latency ISP fiber arrays.',
    venueId: 'ven-hyd-04',
    date: '2026-11-12',
    time: '11:00',
    endTime: '21:00',
    status: 'PUBLISHED',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    organizer: 'CyberSports India',
    tags: ['Esports', 'Gaming', 'LAN Tournament', 'Cosplay'],
    totalCapacity: 10000,
    workflowStage: 'PRICING_INVENTORY',
    ticketTiers: [
      { tier: 'VIP', name: 'VIP Streamer Pass + LAN Seat', price: 5000, totalQuantity: 100, soldQuantity: 45, perks: ['LAN Play Zone Access', 'Exclusive Merch Kit', 'Pro Meet'], color: '#f59e0b' },
      { tier: 'GOLD', name: 'Fan Zone Gold', price: 2200, totalQuantity: 800, soldQuantity: 310, perks: ['Giant Screen Direct View', 'Goodie Bag'], color: '#eab308' },
      { tier: 'SILVER', name: 'Standard Spectator', price: 999, totalQuantity: 3000, soldQuantity: 1200, perks: ['Tournament Hall Access'], color: '#94a3b8' }
    ]
  }
];

export const INITIAL_ATTENDEES: Attendee[] = [
  {
    id: 'att-user-01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.in',
    phone: '+91 98201 44521',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    memberTier: 'VIP Club',
    loyaltyPoints: 3450,
    preferences: ['Concerts', 'Front Row', 'Electronic', 'Fast Track Gate']
  },
  {
    id: 'att-user-02',
    name: 'Priya Mukherjee',
    email: 'priya.m@techcorp.in',
    phone: '+91 98450 88219',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    memberTier: 'Gold',
    loyaltyPoints: 1820,
    preferences: ['Tech Conferences', 'Workshops', 'Networking']
  },
  {
    id: 'att-user-03',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@gmail.com',
    phone: '+91 97690 12345',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    memberTier: 'Silver',
    loyaltyPoints: 950,
    preferences: ['Comedy', 'Sports', 'Group Bookings']
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-sw-8921',
    ticketNumber: 'TKT-2418304-001',
    eventId: 'evt-soundwaves-2026',
    eventTitle: 'Soundwaves India Symphony & Pop Live',
    eventDate: '2026-09-18',
    eventTime: '18:30',
    venueName: 'Jio World Convention Centre Arena',
    venueCity: 'Mumbai',
    attendeeId: 'att-user-01',
    attendeeName: 'Aarav Sharma',
    attendeeEmail: 'aarav.sharma@example.in',
    attendeePhone: '+91 98201 44521',
    tier: 'VIP',
    section: 'Platinum VIP Lounge',
    seatLabel: 'VIP-A04',
    price: 7500,
    tax: 1350,
    totalPaid: 8850,
    status: 'CONFIRMED',
    qrCodeData: 'PEGA_BP2418304:TKT-2418304-001:EVT-SW-8921:AARAV_SHARMA',
    purchaseDate: '2026-08-20 14:32:10',
    paymentMethod: 'UPI (GPay / HDFC Bank)',
    transactionId: 'TXN-UPI-9948210382'
  },
  {
    id: 'tkt-sw-8922',
    ticketNumber: 'TKT-2418304-002',
    eventId: 'evt-soundwaves-2026',
    eventTitle: 'Soundwaves India Symphony & Pop Live',
    eventDate: '2026-09-18',
    eventTime: '18:30',
    venueName: 'Jio World Convention Centre Arena',
    venueCity: 'Mumbai',
    attendeeId: 'att-user-01',
    attendeeName: 'Aarav Sharma',
    attendeeEmail: 'aarav.sharma@example.in',
    attendeePhone: '+91 98201 44521',
    tier: 'VIP',
    section: 'Platinum VIP Lounge',
    seatLabel: 'VIP-A05',
    price: 7500,
    tax: 1350,
    totalPaid: 8850,
    status: 'CONFIRMED',
    qrCodeData: 'PEGA_BP2418304:TKT-2418304-002:EVT-SW-8921:AARAV_SHARMA',
    purchaseDate: '2026-08-20 14:32:10',
    paymentMethod: 'UPI (GPay / HDFC Bank)',
    transactionId: 'TXN-UPI-9948210382'
  },
  {
    id: 'tkt-ft-3301',
    ticketNumber: 'TKT-2418304-003',
    eventId: 'evt-futuretech-2026',
    eventTitle: 'ISP NextGen Telecom & AI Summit 2026',
    eventDate: '2026-10-05',
    eventTime: '09:00',
    venueName: 'Palace Grounds Grand Arena',
    venueCity: 'Bengaluru',
    attendeeId: 'att-user-02',
    attendeeName: 'Priya Mukherjee',
    attendeeEmail: 'priya.m@techcorp.in',
    attendeePhone: '+91 98450 88219',
    tier: 'GOLD',
    section: 'Fan Pit Gold Zone',
    seatLabel: 'GOLD-B12',
    price: 5500,
    tax: 990,
    totalPaid: 6490,
    status: 'CHECKED_IN',
    qrCodeData: 'PEGA_BP2418304:TKT-2418304-003:EVT-FT-3301:PRIYA_M',
    purchaseDate: '2026-08-15 11:20:04',
    paymentMethod: 'Corporate Credit Card (MasterCard 4492)',
    transactionId: 'TXN-CC-882190341',
    checkedInAt: '2026-08-28 09:14:22',
    checkedInGate: 'Gate A - Fast Track'
  }
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sch-soundwaves',
    eventId: 'evt-soundwaves-2026',
    eventDate: '2026-09-18',
    slots: [
      { id: 'sl-1', startTime: '18:30', endTime: '19:15', title: 'Acoustic Preludes & Symphony Welcome', speakerOrArtist: 'Bombay Chamber Strings', stage: 'Main Stage Alpha', category: 'Orchestral', description: 'Opening orchestral suite featuring classical Indian ragas blended with modern brass.' },
      { id: 'sl-2', startTime: '19:30', endTime: '20:45', title: 'Indie Fusion & Electric Sitar Live', speakerOrArtist: 'Rishabh & The Echoes', stage: 'Main Stage Alpha', category: 'Fusion Pop', description: 'Chart-topping indie synth pop and viral acoustic compositions.' },
      { id: 'sl-3', startTime: '21:00', endTime: '23:15', title: 'The Mega Bollywood Symphony Grand Finale', speakerOrArtist: 'All-Star Ensemble feat. Arijit & Neha Tribute', stage: 'Main Stage Alpha', category: 'Headliner', description: 'Massive 50-piece orchestra accompanied by pyrotechnics and 4K visual mapping.' },
      { id: 'sl-4', startTime: '23:15', endTime: '23:30', title: 'Encore & ISP Light Drone Show', speakerOrArtist: 'SkyLight Tech Collective', stage: 'Sky Arena', category: 'Drone Art', description: '500-drone illuminated sky show in sync with live electronic beats.' }
    ]
  },
  {
    id: 'sch-futuretech',
    eventId: 'evt-futuretech-2026',
    eventDate: '2026-10-05',
    slots: [
      { id: 'sl-10', startTime: '09:00', endTime: '10:00', title: 'Registration, VIP Breakfast & Networking', speakerOrArtist: 'Organizing Committee', stage: 'Grand Atrium', category: 'Hospitality', description: 'Badge pickup, smart NFC wristband distribution, and gourmet espresso bar.' },
      { id: 'sl-11', startTime: '10:00', endTime: '11:15', title: 'Keynote: The Fiber-to-AI Superhighway', speakerOrArtist: 'Dr. Vikrant Rao (CTO, National Broadband)', stage: 'Hall 1 Keynote Dome', category: 'Keynote', description: 'Exploring 100Gbps consumer edge computing, zero-latency immersive media, and AI agents.' },
      { id: 'sl-12', startTime: '11:30', endTime: '13:00', title: 'Panel: Monetizing Live Entertainment & Smart Venues', speakerOrArtist: 'Entertainment Execs & Tech Pioneers', stage: 'Hall 1 Keynote Dome', category: 'Panel', description: 'Dynamic ticket allocation, biometric gates, and augmented stadium experiences.' },
      { id: 'sl-13', startTime: '14:00', endTime: '16:30', title: 'Interactive Expo & Startup Showcase', speakerOrArtist: '30 Selected Tech Startups', stage: 'Expo Pavilion', category: 'Showcase', description: 'Hands-on demos of VR stadiums, AI ticketing fraud engines, and spatial audio.' }
    ]
  }
];

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'spn-01',
    name: 'SpeedNet Gigabit Fiber',
    company: 'SpeedNet ISP Ltd.',
    tier: 'Title',
    logo: '⚡ SpeedNet Fiber',
    contributedAmount: 2500000,
    sponsoredEventIds: ['evt-soundwaves-2026', 'evt-futuretech-2026'],
    bannerPlacements: ['Main Stage Screen', 'Mobile App Header', 'Entrance Archway'],
    vipPassesQuota: 50,
    vipPassesUsed: 32,
    impressionsDelivered: 420000,
    contactEmail: 'sponsorship@speednet.in'
  },
  {
    id: 'spn-02',
    name: 'PayMatrix India UPI',
    company: 'PayMatrix FinTech Corp',
    tier: 'Platinum',
    logo: '💳 PayMatrix UPI',
    contributedAmount: 1500000,
    sponsoredEventIds: ['evt-soundwaves-2026', 'evt-comedy-night'],
    bannerPlacements: ['VIP Lounge Backdrop', 'Event Badges'],
    vipPassesQuota: 30,
    vipPassesUsed: 24,
    impressionsDelivered: 290000,
    contactEmail: 'alliances@paymatrix.in'
  },
  {
    id: 'spn-03',
    name: 'CloudScale Edge Systems',
    company: 'CloudScale Technologies',
    tier: 'Gold',
    logo: '☁️ CloudScale',
    contributedAmount: 850000,
    sponsoredEventIds: ['evt-futuretech-2026', 'evt-gaming-championship'],
    bannerPlacements: ['Mobile App Header'],
    vipPassesQuota: 15,
    vipPassesUsed: 12,
    impressionsDelivered: 165000,
    contactEmail: 'partnerships@cloudscale.io'
  }
];

export const INITIAL_VENDOR_STALLS: VendorStall[] = [
  {
    id: 'vst-101',
    eventId: 'evt-soundwaves-2026',
    stallNumber: 'ST-01',
    vendorName: 'Royal Dosa & Chai Craft',
    vendorType: 'F&B Gourmet',
    stallSize: '20x10 ft',
    fee: 45000,
    status: 'ACTIVE',
    staffPasses: 6,
    menuOrItems: ['Artisan Filter Coffee', 'Cheese Ghee Podi Dosa', 'Masala Fries', 'Kolkata Kathi Rolls']
  },
  {
    id: 'vst-102',
    eventId: 'evt-soundwaves-2026',
    stallNumber: 'ST-02',
    vendorName: 'TourVibe Merch Co.',
    vendorType: 'Official Merchandise',
    stallSize: '20x10 ft',
    fee: 60000,
    status: 'ACTIVE',
    staffPasses: 4,
    menuOrItems: ['Soundwaves 2026 Official Hoodie', 'Glow Bands', 'Commemorative Posters', 'Acoustic T-Shirts']
  },
  {
    id: 'vst-103',
    eventId: 'evt-futuretech-2026',
    stallNumber: 'ST-Tech-05',
    vendorName: 'VR Hologram Experience Zone',
    vendorType: 'Interactive Experience',
    stallSize: 'Island Booth',
    fee: 90000,
    status: 'ACTIVE',
    staffPasses: 8,
    menuOrItems: ['6G Virtual Avatar Booth', 'Spatial Audio Headphones Trial', 'AI Portrait Generator']
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-28 23:15:00',
    actor: 'Pega Application Control Agent',
    persona: 'control_agent',
    action: 'SYSTEM_BOOTSTRAP',
    details: 'Pega Blueprint BP-2418304 initialized with 6 personas, 6 data objects, and automated ticketing engine.',
    severity: 'INFO',
    caseId: 'CASE-2418304'
  },
  {
    id: 'log-102',
    timestamp: '2026-08-28 23:20:12',
    actor: 'Ticketing Operations Manager',
    persona: 'ticketing_manager',
    action: 'DYNAMIC_PRICING_CONFIGURED',
    details: 'Released 250 VIP seats for Soundwaves Live at base rate INR ₹7,500 with tax model 18% GST.',
    severity: 'SUCCESS',
    caseId: 'EVT-SW-8921'
  },
  {
    id: 'log-103',
    timestamp: '2026-08-28 23:25:44',
    actor: 'Aarav Sharma (Attendee)',
    persona: 'attendee',
    action: 'TICKET_PURCHASE_COMPLETED',
    details: 'Purchased 2 VIP seats (VIP-A04, VIP-A05) via UPI TXN-UPI-9948210382. Pass generated.',
    severity: 'SUCCESS',
    caseId: 'TKT-2418304-001'
  },
  {
    id: 'log-104',
    timestamp: '2026-08-28 23:30:19',
    actor: 'SpeedNet Alliances (Sponsor)',
    persona: 'sponsor',
    action: 'SPONSORSHIP_ALLOCATED',
    details: 'Title sponsorship of INR 25,00,000 confirmed for Soundwaves 2026. 50 VIP quotas granted.',
    severity: 'INFO',
    caseId: 'SPN-01'
  }
];

export const SYSTEM_SLAS: SystemSLA[] = [
  { service: 'Ticketing Inventory Lock & Reservation Engine', uptime: '99.99%', targetResponseMs: 120, currentResponseMs: 42, status: 'OPTIMAL' },
  { service: 'UPI / Card Payment Gateway Webhook Service', uptime: '99.95%', targetResponseMs: 800, currentResponseMs: 290, status: 'OPTIMAL' },
  { service: 'Gate QR Barcode Validator & Anti-Fraud Service', uptime: '100.00%', targetResponseMs: 80, currentResponseMs: 25, status: 'OPTIMAL' },
  { service: 'Real-time Seating Allocation Grid Sync', uptime: '99.98%', targetResponseMs: 150, currentResponseMs: 58, status: 'OPTIMAL' },
  { service: 'Pega Local Data Store & Audit Trail', uptime: '100.00%', targetResponseMs: 50, currentResponseMs: 18, status: 'OPTIMAL' }
];
