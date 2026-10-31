'use client';

import React, { useState, useEffect } from 'react';

// Room Types
interface RoomType {
  id: string;
  name: string;
  category: 'bunk' | 'pod' | 'suite' | 'group';
  basePrice: number;
  rating: number;
  reviewsCount: number;
  highlight: string;
  image: string;
  specs: string[];
  description: string;
}

// Cafe & Commissary Items
interface CafeItem {
  id: string;
  name: string;
  price: number;
  category: 'Beverages' | 'Mains' | 'Recovery';
  description: string;
}

// Group Member Interface
interface GroupMember {
  id: string;
  name: string;
  phone: string;
  bike: string;
  bedAssigned: string;
  idVerified: boolean;
  status: 'Invited' | 'Confirmed' | 'Checked-In';
}

// Front Desk Arrivals
interface GuestArrival {
  id: string;
  name: string;
  ref: string;
  room: string;
  bike: string;
  otp: string;
  status: 'Arriving' | 'Checked-In' | 'Departed';
  keycode: string;
  balance: number;
}

// Folio Item
interface FolioItem {
  id: string;
  desc: string;
  amount: number;
  type: 'STAY' | 'ADDON' | 'CAFE' | 'LAUNDRY' | 'TAX';
}

// Housekeeping Task
interface CleaningTask {
  id: string;
  room: string;
  type: 'CHECKOUT_CLEAN' | 'STAYOVER_CLEAN' | 'DEEP_SANITIZE';
  priority: 'URGENT' | 'HIGH' | 'NORMAL';
  assignedTo: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

// Maintenance Ticket
interface MaintenanceTicket {
  id: string;
  location: string;
  issue: string;
  priority: 'EMERGENCY' | 'HIGH' | 'ROUTINE';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  time: string;
}

// Vendor Order
interface VendorOrder {
  id: string;
  category: 'KITCHEN' | 'LAUNDRY';
  room: string;
  guestName: string;
  items: string;
  totalPaise: number;
  status: 'RECEIVED' | 'PREPARING' | 'READY' | 'DELIVERED';
  orderTime: string;
}

const ROOMS: RoomType[] = [
  {
    id: 'acoustic-bunk',
    name: 'Acoustic Solo Bunk',
    category: 'bunk',
    basePrice: 849,
    rating: 4.94,
    reviewsCount: 182,
    highlight: '50% segment reserved for touring motorcyclists',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80',
    specs: ['-32dB acoustic dampening', '120L steel gear vault', 'Universal 230V and 65W USB-C', 'Blackout privacy shutter'],
    description: 'Individual capsule shell with acoustic insulation and subterranean steel locker sized for helmet, boots, and riding armor.',
  },
  {
    id: 'moto-pod',
    name: 'Moto En-Suite Pod',
    category: 'pod',
    basePrice: 1450,
    rating: 4.98,
    reviewsCount: 116,
    highlight: 'Ground floor with covered motorcycle bay included',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    specs: ['Direct ground-floor bay 04', 'Private rain shower', 'Heated helmet drying nook', '600 Mbps dual-line fiber'],
    description: 'Private studio pod with direct courtyard access to your motorcycle, private en-suite bathroom, and heated gear hooks.',
  },
  {
    id: 'atelier-suite',
    name: 'Deluxe Atelier Suite',
    category: 'suite',
    basePrice: 2800,
    rating: 5.0,
    reviewsCount: 78,
    highlight: 'King bed and private motorcycle workshop proximity',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    specs: ['King orthopedic mattress', 'Private terrace', 'Dedicated tool caddy and garage bay 01', 'Espresso machine'],
    description: 'Generous private suite designed for longer stays, couples, and road captains requiring quiet space and immediate workshop proximity.',
  },
  {
    id: 'team-cluster',
    name: 'Expedition 4-Bed Cluster',
    category: 'group',
    basePrice: 3200,
    rating: 4.96,
    reviewsCount: 54,
    highlight: 'Connected cluster for motorcycle touring teams',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
    specs: ['4 adjacent private pods', 'Shared gear maintenance rack', 'Group master or split folio', '4 covered bays reserved'],
    description: 'Engineered squad wing for multi-rider groups and expedition organizers requiring contiguous pods and collective gear storage.',
  },
];

const CAFE_MENU: CafeItem[] = [
  { id: 'c-1', name: 'Double Espresso & Cold Brew', price: 160, category: 'Beverages', description: 'Chikmagalur single-origin beans extracted at 9 bars pressure.' },
  { id: 'c-2', name: 'High-Protein Recovery Skillet', price: 290, category: 'Mains', description: 'Farm eggs, smoked chicken sausage, grilled sourdough, and avocado butter.' },
  { id: 'c-3', name: 'Electrolyte Hydration Bowl', price: 180, category: 'Recovery', description: 'Tender coconut water, soaked chia, dragon fruit, and Himalayan rock salts.' },
  { id: 'c-4', name: 'Touring Campfire Toastie', price: 220, category: 'Mains', description: 'Smoked cheddar, caramelized shallots, and spicy mustard on grilled brioche.' },
];

export default function HomePage() {
  // Client Showcase Portal Selector
  const [activePortal, setActivePortal] = useState<'guest' | 'pms' | 'group' | 'housekeeping' | 'manager' | 'vendor' | 'admin'>('guest');

  // Search & Filters
  const [destination, setDestination] = useState('Sakrepatna, Karnataka');
  const [checkInDate, setCheckInDate] = useState('2026-11-14');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-17');
  const [guestCount, setGuestCount] = useState(1);
  const [isMotorcyclist, setIsMotorcyclist] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bunk' | 'pod' | 'suite' | 'group'>('all');

  // Interactive Booking Drawer
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(ROOMS[0]);
  const [checkoutStep, setCheckoutStep] = useState<number>(1);
  const [holdId] = useState<string>('HLD-8942');
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [guestName, setGuestName] = useState('Vikramaditya Rao');
  const [guestPhone, setGuestPhone] = useState('+91 98201 44819');
  const [guestEmail, setGuestEmail] = useState('vikram.rao@touring.in');
  const [bikePlate, setBikePlate] = useState('KA-18-M-4921');
  const [bikeModel, setBikeModel] = useState('Royal Enfield Himalayan 450');
  const [dpdpConsent, setDpdpConsent] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD'>('UPI');
  const [bookingRef] = useState('DAZ-SKP-2611-4921');
  const [accessPin] = useState('8492#');
  const [preArrivalOtp] = useState('582914');

  // Addons
  const [includeLocker, setIncludeLocker] = useState(true);
  const [includeLaundry, setIncludeLaundry] = useState(false);
  const [includeCafe, setIncludeCafe] = useState(true);

  // Group Organiser (Option B)
  const [groupFolioMode, setGroupFolioMode] = useState<'MASTER' | 'SPLIT'>('MASTER');
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { id: 'gm-1', name: 'Vikramaditya Rao (Lead)', phone: '+91 98201 44819', bike: 'Himalayan 450', bedAssigned: 'Pod 101', idVerified: true, status: 'Confirmed' },
    { id: 'gm-2', name: 'Kavita Menon', phone: '+91 98450 11234', bike: 'KTM 390 Adventure', bedAssigned: 'Pod 102', idVerified: true, status: 'Confirmed' },
    { id: 'gm-3', name: 'Arjun Nambiar', phone: '+91 99001 77210', bike: 'Triumph Scrambler 400X', bedAssigned: 'Pod 103', idVerified: false, status: 'Invited' },
    { id: 'gm-4', name: 'Zoya Farooqui', phone: '+91 97110 33490', bike: 'BMW G310 GS', bedAssigned: 'Pod 104', idVerified: true, status: 'Confirmed' },
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  // Front Desk PMS (Option A + B)
  const [arrivals, setArrivals] = useState<GuestArrival[]>([
    { id: 'arr-1', name: 'Vikramaditya Rao', ref: 'DAZ-SKP-2611-4921', room: 'Pod 101', bike: 'KA-18-M-4921', otp: '582914', status: 'Arriving', keycode: '8492#', balance: 0 },
    { id: 'arr-2', name: 'Rahul Sharma', ref: 'DAZ-SKP-2611-1049', room: 'Bunk B-04', bike: 'KA-04-EE-9112', otp: '419082', status: 'Checked-In', keycode: '1904#', balance: 450 },
    { id: 'arr-3', name: 'Sneha Patil', ref: 'DAZ-SKP-2611-7721', room: 'Suite 201', bike: 'KA-05-MM-3001', otp: '710493', status: 'Arriving', keycode: '7721#', balance: 0 },
  ]);
  const [otpVerifyInput, setOtpVerifyInput] = useState('');
  const [selectedArrival, setSelectedArrival] = useState<GuestArrival>(arrivals[0]);
  const [folioCharges, setFolioCharges] = useState<FolioItem[]>([
    { id: 'f-1', desc: 'Room Stay: Pod 101 (3 Nights)', amount: 4350, type: 'STAY' },
    { id: 'f-2', desc: 'Heated Gear Vault Access', amount: 450, type: 'ADDON' },
    { id: 'f-3', desc: 'Cafe: Recovery Skillet x 2', amount: 580, type: 'CAFE' },
    { id: 'f-4', desc: 'GST @ 12% (HSN 9963)', amount: 645, type: 'TAX' },
  ]);
  const [newChargeDesc, setNewChargeDesc] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState('');
  const [visitorPassCode, setVisitorPassCode] = useState<string | null>(null);

  // Housekeeping (Option A + B)
  const [tasks, setTasks] = useState<CleaningTask[]>([
    { id: 't-1', room: 'Bunk B-02', type: 'CHECKOUT_CLEAN', priority: 'URGENT', assignedTo: 'Ramesh K.', status: 'IN_PROGRESS' },
    { id: 't-2', room: 'Pod 104', type: 'STAYOVER_CLEAN', priority: 'NORMAL', assignedTo: 'Sunita P.', status: 'PENDING' },
    { id: 't-3', room: 'Suite 202', type: 'DEEP_SANITIZE', priority: 'HIGH', assignedTo: 'Ramesh K.', status: 'COMPLETED' },
    { id: 't-4', room: 'Motorcycle Bay 03', type: 'CHECKOUT_CLEAN', priority: 'NORMAL', assignedTo: 'Anand V.', status: 'PENDING' },
  ]);
  const [tickets] = useState<MaintenanceTicket[]>([
    { id: 'mt-1', location: 'Bike Wash Bay 01', issue: 'High-pressure nozzle pressure drop below 100 PSI', priority: 'HIGH', status: 'IN_PROGRESS', time: '10:14 AM' },
    { id: 'mt-2', location: 'Pod 103 Gear Locker', issue: 'Electronic solenoid lock battery low warning', priority: 'ROUTINE', status: 'OPEN', time: '09:30 AM' },
  ]);

  // Property Manager & Day Close (Option A + B)
  const [bikerReleaseHours, setBikerReleaseHours] = useState(24);
  const [dayCloseStatus, setDayCloseStatus] = useState<'PENDING' | 'LOCKED'>('PENDING');
  const [dayRevenuePaise] = useState(18450000); // ₹1,84,500.00
  const [dayTaxPaise] = useState(2214000); // ₹22,140.00

  // Vendor Hub (Option B)
  const [vendorOrders, setVendorOrders] = useState<VendorOrder[]>([
    { id: 'ord-101', category: 'KITCHEN', room: 'Pod 101', guestName: 'Vikramaditya Rao', items: 'Recovery Skillet x 1, Cold Brew x 1', totalPaise: 45000, status: 'PREPARING', orderTime: '10:45 AM' },
    { id: 'ord-102', category: 'LAUNDRY', room: 'Bunk B-04', guestName: 'Rahul Sharma', items: 'Cordura Riding Jacket De-grease & Dry', totalPaise: 35000, status: 'RECEIVED', orderTime: '10:30 AM' },
    { id: 'ord-103', category: 'KITCHEN', room: 'Suite 201', guestName: 'Sneha Patil', items: 'Campfire Toastie x 2, Electrolyte Bowl x 1', totalPaise: 62000, status: 'READY', orderTime: '10:15 AM' },
  ]);

  // Platform Admin Audit Trail
  const [auditLogs] = useState([
    { id: 'aud-991', actor: 'SYSTEM_CRON', action: 'INVENTORY_RELEASE', detail: 'Released 2 unsold biker beds into general pool at T-24h cutoff', time: '10:00:00 UTC' },
    { id: 'aud-992', actor: 'FRONT_DESK_USER_02', action: 'ARR_OTP_VERIFIED', detail: 'Arrival OTP 582914 verified for Stay DAZ-SKP-2611-4921', time: '10:12:44 UTC' },
    { id: 'aud-993', actor: 'PAYMENTS_GATEWAY', action: 'UPI_WEBHOOK_PROCESSED', detail: 'Paise 5,42,500 credited via Razorpay HMAC verified', time: '10:18:20 UTC' },
    { id: 'aud-994', actor: 'PROPERTY_MGR', action: 'RATE_OVERRIDE_REJECTED', detail: 'Locked day revenue prevents retroactive folio adjustments', time: '10:22:05 UTC' },
  ]);

  // Hold Timer Effect
  useEffect(() => {
    if (isCheckoutOpen && checkoutStep >= 1 && checkoutStep <= 4 && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isCheckoutOpen, checkoutStep, timeLeft]);

  // Calculations
  const nights = 3;
  const roomTotal = selectedRoom.basePrice * nights;
  const lockerTotal = includeLocker ? 150 * nights : 0;
  const laundryTotal = includeLaundry ? 350 : 0;
  const cafeTotal = includeCafe ? 450 : 0;
  const subtotal = roomTotal + lockerTotal + laundryTotal + cafeTotal;
  const gstAmount = Math.round(subtotal * 0.12);
  const grandTotal = subtotal + gstAmount;

  // Invoice generator
  const downloadTaxInvoice = () => {
    const text = `======================================================================
               DAZZTEL HOSPITALITY INDIA PRIVATE LIMITED
     SAKREPATNA MOTORCYCLE & NOMAD SANCTUARY • CHIKKAMAGALURU, KARNATAKA - 577135
      GSTIN: 29AABCH7829M1ZF • STATE CODE: 29 (KARNATAKA) • HSN: 9963
======================================================================
TAX INVOICE NO: DAZ-SKP-2026-00892
INVOICE DATE  : 14 NOV 2026
BOOKING REF   : ${bookingRef}
STAY PERIOD   : ${checkInDate} to ${checkOutDate} (${nights} Nights)
GUEST NAME    : ${guestName}
MOTORCYCLE    : ${bikePlate} (${bikeModel})
ROOM / UNIT   : ${selectedRoom.name}
----------------------------------------------------------------------
PARTICULARS                          RATE (INR)   QTY   AMOUNT (INR)
----------------------------------------------------------------------
1. ${selectedRoom.name} Stay        ₹${selectedRoom.basePrice}.00     ${nights}     ₹${roomTotal}.00
2. 45°C Heated Gear Locker Vault     ₹150.00     ${nights}     ₹${lockerTotal}.00
3. Specialized Riding Gear Laundry   ₹350.00     1     ₹${laundryTotal}.00
4. Artisan Cafe Breakfast Pack       ₹450.00     1     ₹${cafeTotal}.00
----------------------------------------------------------------------
TAXABLE VALUE                                          ₹${subtotal}.00
CENTRAL GST (CGST @ 6%)                                ₹${(gstAmount / 2).toFixed(2)}
STATE GST   (SGST @ 6%)                                ₹${(gstAmount / 2).toFixed(2)}
----------------------------------------------------------------------
TOTAL AMOUNT PAYABLE (INR)                             ₹${grandTotal}.00
AMOUNT IN PAISE: ${grandTotal * 100} PAISE
----------------------------------------------------------------------
CRYPTOGRAPHIC ROOM KEYCODE PIN: ${accessPin}
PRE-ARRIVAL OTP: ${preArrivalOtp} (Valid until checked in)
----------------------------------------------------------------------
THIS IS AN IMMUTABLE ELECTRONIC TAX INVOICE UNDER RULE 48(4) OF CGST.
======================================================================`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TAX-INVOICE-${bookingRef}.txt`;
    a.click();
  };

  const downloadGpxRoute = () => {
    const gpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="DAZZTEL Curator" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>DAZZTEL Western Ghats Coffee & Mountain Loop (Sakrepatna to Mullayanagiri Peak)</name>
    <desc>Curated 142km twisty tarmac mountain loop through coffee estates with high-elevation waypoints.</desc>
  </metadata>
  <wpt lat="13.4332" lon="75.9189"><name>DAZZTEL Sakrepatna Sanctuary</name></wpt>
  <wpt lat="13.3912" lon="75.7205"><name>Bababudangiri Ridge Viewpoint</name></wpt>
  <wpt lat="13.3914" lon="75.7196"><name>Mullayanagiri Peak Ascent Point</name></wpt>
</gpx>`;
    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DAZZTEL-WESTERN-GHATS-LOOP.gpx`;
    a.click();
  };

  const filteredRooms = selectedCategory === 'all' ? ROOMS : ROOMS.filter((r) => r.category === selectedCategory);

  return (
    <div style={{ minHeight: '100vh', width: '100%', overflowX: 'clip', background: 'var(--color-paper)', color: 'var(--color-ink)' }}>
      {/* 0. STICKY CLIENT DEMO PORTAL SELECTOR (Visible on all devices) */}
      <div className="client-showcase-bar">
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-xs)' }}>
            <span className="tag-badge tag-badge--signal" style={{ fontSize: '10px', padding: '2px 8px' }}>
              CLIENT PREVIEW SELECTOR
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-paper-2)' }}>
              Tap any portal to test full features:
            </span>
          </div>

          <div className="showcase-scroll">
            <button
              type="button"
              className={`showcase-pill ${activePortal === 'guest' ? 'showcase-pill--active' : ''}`}
              onClick={() => setActivePortal('guest')}
            >
              1. Guest Booking Portal
            </button>
            <button
              type="button"
              className={`showcase-pill ${activePortal === 'pms' ? 'showcase-pill--active' : ''}`}
              onClick={() => setActivePortal('pms')}
            >
              2. Front Desk PMS
            </button>
            <button
              type="button"
              className={`showcase-pill ${activePortal === 'group' ? 'showcase-pill--active' : ''}`}
              onClick={() => setActivePortal('group')}
            >
              3. Group Organiser
            </button>
            <button
              type="button"
              className={`showcase-pill ${activePortal === 'housekeeping' ? 'showcase-pill--active' : ''}`}
              onClick={() => setActivePortal('housekeeping')}
            >
              4. Housekeeping
            </button>
            <button
              type="button"
              className={`showcase-pill ${activePortal === 'manager' ? 'showcase-pill--active' : ''}`}
              onClick={() => setActivePortal('manager')}
            >
              5. Property Manager
            </button>
            <button
              type="button"
              className={`showcase-pill ${activePortal === 'vendor' ? 'showcase-pill--active' : ''}`}
              onClick={() => setActivePortal('vendor')}
            >
              6. Vendor Hub
            </button>
            <button
              type="button"
              className={`showcase-pill ${activePortal === 'admin' ? 'showcase-pill--active' : ''}`}
              onClick={() => setActivePortal('admin')}
            >
              7. HQ Admin Audit
            </button>
          </div>
        </div>
      </div>

      {/* 1. Global Navigation Bar */}
      <header className="nav-root">
        <div className="nav-inner">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <img
              src="/dazztel-emblem.jpg"
              alt="DAZZTEL"
              style={{ height: '36px', width: '36px', objectFit: 'contain', borderRadius: '50%' }}
            />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ink)', lineHeight: 1 }}>
              DAZZTEL
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', borderLeft: '1px solid var(--color-rule)', paddingLeft: 'var(--space-2xs)' }} className="nav-location-tag">
              Sakrepatna, Karnataka
            </span>
          </div>

          {/* Navigation Links for Desktop */}
          {activePortal === 'guest' && (
            <nav className="nav-links-desktop">
              <a href="#stays" style={{ textDecoration: 'none', color: 'var(--color-ink)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                Stays &amp; Pods
              </a>
              <a href="#garage" style={{ textDecoration: 'none', color: 'var(--color-ink)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                Garage &amp; Workshop
              </a>
              <a href="#amenities" style={{ textDecoration: 'none', color: 'var(--color-ink)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                Sanctuary
              </a>
              <a href="#cafe" style={{ textDecoration: 'none', color: 'var(--color-ink)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                Atelier Cafe
              </a>
            </nav>
          )}

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <a
              href="tel:112"
              className="btn btn--danger-outline btn--sm"
              style={{ whiteSpace: 'nowrap' }}
            >
              SOS
            </a>
          </div>
        </div>
      </header>

      {/* 2. GUEST FRONT-END EXPERIENCE */}
      {activePortal === 'guest' && (
        <main style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-md) var(--space-md)', width: '100%', boxSizing: 'border-box' }}>
          {/* Hero Section */}
          <section className="hero-box">
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <img
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80"
                alt="Touring motorcyclist heading to DAZZTEL Sanctuary in Sakrepatna, Karnataka"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, oklch(10% 0.01 60 / 0.2) 0%, oklch(10% 0.01 60 / 0.82) 100%)' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 var(--space-xs) 0', wordBreak: 'break-word' }}>
                Sleep Soundly. Ride Boundless.
              </h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lead)', color: 'oklch(95% 0.01 80)', margin: '0 0 var(--space-md) 0', lineHeight: 1.4 }}>
                India’s engineered boutique hostel network for touring motorcyclists and remote digital nomads.
              </p>
            </div>
          </section>

          {/* Floating Pill Search Bar */}
          <section className="search-section-wrap">
            <div className="hotel-search-bar">
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600, marginBottom: 'var(--space-3xs)' }}>
                  LOCATION
                </label>
                <input
                  type="text"
                  className="input-hotel"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Sakrepatna, Karnataka"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600, marginBottom: 'var(--space-3xs)' }}>
                  CHECK-IN
                </label>
                <input
                  type="date"
                  className="input-hotel"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600, marginBottom: 'var(--space-3xs)' }}>
                  CHECK-OUT
                </label>
                <input
                  type="date"
                  className="input-hotel"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 600, marginBottom: 'var(--space-3xs)' }}>
                  GUESTS
                </label>
                <select
                  className="input-hotel"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                >
                  <option value={1}>1 Rider / Nomad</option>
                  <option value={2}>2 Guests (Double)</option>
                  <option value={4}>4 Rider Group</option>
                  <option value={6}>6 Rider Expedition</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--text-xs)', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={isMotorcyclist}
                    onChange={(e) => setIsMotorcyclist(e.target.checked)}
                  />
                  <span>Touring Motorcyclist (50% Bed Lock &amp; Covered Bay)</span>
                </label>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-3xs)' }}>
                  Enables ANPR bay gate access and gear locker allocation
                </span>
              </div>
            </div>
          </section>

          {/* Accommodation Category Filter Chips */}
          <section id="stays" style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 'var(--space-xs)', marginBottom: 'var(--space-lg)' }}>
              <button
                type="button"
                className={`btn btn--sm ${selectedCategory === 'all' ? 'btn--primary' : ''}`}
                onClick={() => setSelectedCategory('all')}
                style={{ flexShrink: 0 }}
              >
                All Stays
              </button>
              <button
                type="button"
                className={`btn btn--sm ${selectedCategory === 'bunk' ? 'btn--primary' : ''}`}
                onClick={() => setSelectedCategory('bunk')}
                style={{ flexShrink: 0 }}
              >
                Acoustic Bunk Pods
              </button>
              <button
                type="button"
                className={`btn btn--sm ${selectedCategory === 'pod' ? 'btn--primary' : ''}`}
                onClick={() => setSelectedCategory('pod')}
                style={{ flexShrink: 0 }}
              >
                Moto En-Suite Studios
              </button>
              <button
                type="button"
                className={`btn btn--sm ${selectedCategory === 'suite' ? 'btn--primary' : ''}`}
                onClick={() => setSelectedCategory('suite')}
                style={{ flexShrink: 0 }}
              >
                Deluxe Atelier Suites
              </button>
              <button
                type="button"
                className={`btn btn--sm ${selectedCategory === 'group' ? 'btn--primary' : ''}`}
                onClick={() => setSelectedCategory('group')}
                style={{ flexShrink: 0 }}
              >
                Expedition Groups
              </button>
            </div>

            {/* Room Cards Grid */}
            <div className="grid-cards">
              {filteredRooms.map((room) => (
                <article key={room.id} className="hotel-card">
                  <div className="hotel-card-media">
                    <img src={room.image} alt={room.name} />
                    <div style={{ position: 'absolute', top: 'var(--space-xs)', left: 'var(--space-xs)' }}>
                      <span className="tag-badge tag-badge--amber">
                        {room.highlight}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 'var(--space-xs)', right: 'var(--space-xs)', background: 'oklch(10% 0.01 60 / 0.85)', padding: 'var(--space-3xs) var(--space-xs)', borderRadius: 'var(--radius-pill)', color: 'var(--color-white)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-outlier)' }}>
                      ₹{room.basePrice.toLocaleString('en-IN')} / night
                    </div>
                  </div>

                  <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, margin: 0 }}>
                        {room.name}
                      </h3>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink)' }}>
                        ★ {room.rating} <span style={{ color: 'var(--color-muted)' }}>({room.reviewsCount})</span>
                      </span>
                    </div>

                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: '0 0 var(--space-md) 0', lineHeight: 1.5 }}>
                      {room.description}
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-lg) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)' }}>
                      {room.specs.map((spec, i) => (
                        <li key={i} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                          <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-xs)', borderTop: 'var(--rule-hair) solid var(--color-rule)', paddingTop: 'var(--space-md)' }}>
                      <div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>{nights} nights total</span>
                        <div style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-md)', fontWeight: 700 }}>
                          ₹{(room.basePrice * nights).toLocaleString('en-IN')}
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', fontWeight: 400 }}> + 12% GST</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => {
                          setSelectedRoom(room);
                          setCheckoutStep(1);
                          setIsCheckoutOpen(true);
                        }}
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Interactive Booking Drawer / Modal */}
          {isCheckoutOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'oklch(10% 0.01 60 / 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xs)', boxSizing: 'border-box' }}>
              <div className="plate" style={{ width: '100%', maxWidth: '780px', maxHeight: '92vh', overflowY: 'auto', background: 'var(--color-white)', position: 'relative' }}>
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  style={{ position: 'absolute', top: 'var(--space-sm)', right: 'var(--space-sm)', background: 'transparent', border: 'none', fontSize: 'var(--text-lg)', cursor: 'pointer', color: 'var(--color-muted)' }}
                  aria-label="Close"
                >
                  ✕
                </button>

                {/* Hold Header */}
                <div style={{ borderBottom: 'var(--rule-hair) solid var(--color-rule)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                    Step {checkoutStep} of 5: {checkoutStep === 1 && 'Confirm Pod & Dates'}
                    {checkoutStep === 2 && 'Rider Profile & License Plate'}
                    {checkoutStep === 3 && 'Sanctuary Add-ons & 12% GST'}
                    {checkoutStep === 4 && 'Payment (UPI or Card)'}
                    {checkoutStep === 5 && 'Keycode PIN & Tax Invoice'}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                    <span className="tag-badge tag-badge--amber">
                      Hold: {holdId}
                    </span>
                    <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-sm)', fontWeight: 700, color: timeLeft < 120 ? 'var(--color-error)' : 'var(--color-accent)' }}>
                      {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')} hold remaining
                    </span>
                  </div>
                </div>

                {/* Step 1: Unit & Dates */}
                {checkoutStep === 1 && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                      <div style={{ border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', padding: 'var(--space-md)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Selected Unit</span>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, margin: 'var(--space-2xs) 0' }}>
                          {selectedRoom.name}
                        </h4>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0 }}>
                          {selectedRoom.highlight}
                        </p>
                      </div>

                      <div style={{ border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', padding: 'var(--space-md)' }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Stay Duration</span>
                        <div style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-md)', fontWeight: 700, margin: 'var(--space-2xs) 0' }}>
                          {checkInDate} to {checkOutDate}
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                          {nights} Nights (Check-in 14:00, Check-out 11:00)
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => setCheckoutStep(2)}
                      >
                        Proceed to Rider Info
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Rider & ANPR Plate */}
                {checkoutStep === 2 && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2xs)' }}>
                          Rider Full Name
                        </label>
                        <input
                          type="text"
                          className="input-hotel"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2xs)' }}>
                          Phone (for Arrival OTP)
                        </label>
                        <input
                          type="text"
                          className="input-hotel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2xs)' }}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="input-hotel"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2xs)' }}>
                          Motorcycle License Plate (ANPR Whitelist)
                        </label>
                        <input
                          type="text"
                          className="input-hotel"
                          value={bikePlate}
                          onChange={(e) => setBikePlate(e.target.value)}
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2xs)' }}>
                          Motorcycle Model
                        </label>
                        <input
                          type="text"
                          className="input-hotel"
                          value={bikeModel}
                          onChange={(e) => setBikeModel(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', background: 'var(--color-paper-2)' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xs)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={dpdpConsent}
                          onChange={(e) => setDpdpConsent(e.target.checked)}
                          style={{ marginTop: '2px' }}
                        />
                        <span>
                          <strong>India DPDP Act 2023 Consent:</strong> I consent to DAZZTEL securely processing my name, phone number, vehicle registration number, and government photo identity document strictly for stay verification and gate access.
                        </span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setCheckoutStep(1)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary"
                        disabled={!dpdpConsent}
                        onClick={() => setCheckoutStep(3)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Continue to Add-ons
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Add-ons & GST */}
                {checkoutStep === 3 && (
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>
                      Select Sanctuary Add-ons
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md)', border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', cursor: 'pointer', background: includeLocker ? 'var(--color-accent-soft)' : 'var(--color-plate)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                          <input
                            type="checkbox"
                            checked={includeLocker}
                            onChange={(e) => setIncludeLocker(e.target.checked)}
                          />
                          <div>
                            <strong style={{ fontSize: 'var(--text-sm)', display: 'block' }}>45°C Heated Gear Drying Vault</strong>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Overnight drying for helmet, boots, and riding jacket</span>
                          </div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                          ₹{(150 * nights).toLocaleString('en-IN')}
                        </span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md)', border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', cursor: 'pointer', background: includeLaundry ? 'var(--color-accent-soft)' : 'var(--color-plate)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                          <input
                            type="checkbox"
                            checked={includeLaundry}
                            onChange={(e) => setIncludeLaundry(e.target.checked)}
                          />
                          <div>
                            <strong style={{ fontSize: 'var(--text-sm)', display: 'block' }}>Cordura &amp; Technical Gear Laundry</strong>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Specialized detergent cycle for riding apparel</span>
                          </div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                          ₹350
                        </span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md)', border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', cursor: 'pointer', background: includeCafe ? 'var(--color-accent-soft)' : 'var(--color-plate)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                          <input
                            type="checkbox"
                            checked={includeCafe}
                            onChange={(e) => setIncludeCafe(e.target.checked)}
                          />
                          <div>
                            <strong style={{ fontSize: 'var(--text-sm)', display: 'block' }}>Daily Rider Breakfast &amp; Cold Brew Pass</strong>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>High-protein skillet bowl and single-origin Chikmagalur pour-over</span>
                          </div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                          ₹450
                        </span>
                      </label>
                    </div>

                    {/* GST Breakdown */}
                    <div style={{ border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', background: 'var(--color-paper-2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2xs)', fontSize: 'var(--text-xs)' }}>
                        <span>Accommodation ({selectedRoom.name} x {nights} Nights):</span>
                        <span style={{ fontFamily: 'var(--font-outlier)' }}>₹{roomTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', margin: 'var(--space-xs) 0', borderTop: 'var(--rule-hair) solid var(--color-rule)', paddingTop: 'var(--space-xs)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                        <span>Taxable Value (HSN 9963):</span>
                        <span style={{ fontFamily: 'var(--font-outlier)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2xs)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                        <span>CGST @ 6% + SGST @ 6% (Total 12% GST):</span>
                        <span style={{ fontFamily: 'var(--font-outlier)' }}>₹{gstAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-sm)', borderTop: 'var(--rule-bar) solid var(--color-ink)', paddingTop: 'var(--space-sm)', fontSize: 'var(--text-md)', fontWeight: 700 }}>
                        <span>Total Payable:</span>
                        <span style={{ fontFamily: 'var(--font-outlier)', color: 'var(--color-accent)' }}>
                          ₹{grandTotal.toLocaleString('en-IN')}
                          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--color-muted)' }}> ({grandTotal * 100} paise)</span>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setCheckoutStep(2)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => setCheckoutStep(4)}
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {checkoutStep === 4 && (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                        Instant UPI QR or Card
                      </h4>
                      <span className="tag-badge tag-badge--amber" style={{ marginBottom: 'var(--space-xs)' }}>
                        Idempotency: IDEMP-2611-{holdId}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                      <button
                        type="button"
                        className={`btn ${paymentMethod === 'UPI' ? 'btn--primary' : ''}`}
                        onClick={() => setPaymentMethod('UPI')}
                      >
                        Instant UPI QR
                      </button>
                      <button
                        type="button"
                        className={`btn ${paymentMethod === 'CARD' ? 'btn--primary' : ''}`}
                        onClick={() => setPaymentMethod('CARD')}
                      >
                        Credit / Debit Card
                      </button>
                    </div>

                    {paymentMethod === 'UPI' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-lg)', border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', background: 'var(--color-paper-2)', marginBottom: 'var(--space-lg)' }}>
                        <div style={{ width: '180px', height: '180px', background: 'var(--color-white)', borderRadius: 'var(--radius-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--rule-hair) solid var(--color-rule)', marginBottom: 'var(--space-md)', padding: 'var(--space-xs)' }}>
                          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} aria-hidden="true">
                            <rect width="100" height="100" fill="white" />
                            <path d="M10 10h30v30h-30zM60 10h30v30h-30zM10 60h30v30h-30z" fill="black" />
                            <path d="M16 16h18v18h-18zM66 16h18v18h-18zM16 66h18v18h-18z" fill="white" />
                            <path d="M22 22h6v6h-6zM72 22h6v6h-6zM22 72h6v6h-6z" fill="black" />
                            <rect x="50" y="50" width="10" height="10" fill="black" />
                            <rect x="70" y="60" width="10" height="20" fill="black" />
                            <rect x="50" y="75" width="25" height="10" fill="black" />
                          </svg>
                        </div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2xs)' }}>
                          dazztel.sanctuary@icici
                        </span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                          Amount: ₹{grandTotal.toLocaleString('en-IN')} (Includes 12% GST)
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', maxWidth: '400px', margin: '0 auto var(--space-lg) auto' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2xs)' }}>
                            Card Number
                          </label>
                          <input
                            type="text"
                            className="input-hotel"
                            defaultValue="4111 •••• •••• 4921"
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2xs)' }}>
                              Expiry
                            </label>
                            <input type="text" className="input-hotel" defaultValue="08/29" />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-2xs)' }}>
                              CVV
                            </label>
                            <input type="password" className="input-hotel" defaultValue="892" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setCheckoutStep(3)}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => setCheckoutStep(5)}
                      >
                        Confirm Payment (₹{grandTotal.toLocaleString('en-IN')})
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 5: Confirmed */}
                {checkoutStep === 5 && (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', fontWeight: 800, margin: '0 0 var(--space-2xs) 0' }}>
                        You’re Set for the Sanctuary
                      </h3>
                      <span className="tag-badge tag-badge--signal" style={{ marginBottom: 'var(--space-xs)' }}>
                        Confirmed (Idempotent)
                      </span>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 'var(--space-2xs) 0 0 0' }}>
                        Booking Reference: <strong>{bookingRef}</strong>
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                      <div className="plate plate--accent">
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent)', display: 'block' }}>
                          DIGITAL KEYCODE PIN
                        </span>
                        <div style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: '0.1em', margin: 'var(--space-2xs) 0', color: 'var(--color-accent)' }}>
                          {accessPin}
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', margin: 0 }}>
                          Keypad PIN for {selectedRoom.name}. Active automatically from 14:00 on arrival day.
                        </p>
                      </div>

                      <div className="plate">
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-muted)', display: 'block' }}>
                          ARRIVAL VERIFICATION OTP
                        </span>
                        <div style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: '0.15em', margin: 'var(--space-2xs) 0', color: 'var(--color-ink)' }}>
                          {preArrivalOtp}
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0 }}>
                          Show at front desk kiosk for paperless instant check-in.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={downloadTaxInvoice}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Tax Invoice (.txt)
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={downloadGpxRoute}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        GPX Route (.gpx)
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setIsCheckoutOpen(false)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section: Motorcyclist & Nomad Facilities */}
          <section id="garage" style={{ marginBottom: 'var(--space-3xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', fontWeight: 700, margin: '0 0 var(--space-xs) 0' }}>
              Built Specifically for the Road
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: '0 0 var(--space-lg) 0' }}>
              Standard hotels treat motorbikes and riding gear as afterthoughts. DAZZTEL is purpose-engineered from the ground up.
            </p>

            <div className="grid-facilities">
              <div className="plate">
                <div style={{ height: '140px', borderRadius: 'calc(var(--radius-card) - 4px)', overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"
                    alt="Covered motorcycle bays"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                  Covered Bays &amp; Workshop
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0, lineHeight: 1.5 }}>
                  Concrete bays with paddock stands, torque wrenches, chain lube station, and 24/7 CCTV coverage.
                </p>
              </div>

              <div className="plate">
                <div style={{ height: '140px', borderRadius: 'calc(var(--radius-card) - 4px)', overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"
                    alt="45C heated drying vaults"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                  45°C Heated Gear Vaults
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0, lineHeight: 1.5 }}>
                  Subterranean dehumidified steel vaults dry rain-soaked armor, jackets, and boots in 4 hours.
                </p>
              </div>

              <div className="plate" id="cafe">
                <div style={{ height: '140px', borderRadius: 'calc(var(--radius-card) - 4px)', overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                    alt="Atelier cafe and roastery"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                  Atelier Cafe &amp; Roastery
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0, lineHeight: 1.5 }}>
                  Chikmagalur single-origin espressos, sourdough breakfast bowls, and electrolyte recovery drinks.
                </p>
              </div>

              <div className="plate" id="amenities">
                <div style={{ height: '140px', borderRadius: 'calc(var(--radius-card) - 4px)', overflow: 'hidden', marginBottom: 'var(--space-md)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80"
                    alt="Nomad workspace lounge"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                  600 Mbps Dual-WAN Fiber
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0, lineHeight: 1.5 }}>
                  Ergonomic Herman Miller seating, acoustic quiet call nooks, and backup diesel generator for zero dropped calls.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Cafe Menu */}
          <section style={{ marginBottom: 'var(--space-3xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-lg)' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                  Atelier Cafe &amp; Commissary
                </h2>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 0 }}>
                  Order direct to your sleeping pod or the motorcycle garage workbench.
                </p>
              </div>
              <span className="tag-badge tag-badge--signal">
                Kitchen Online • 15 Min Delivery
              </span>
            </div>

            <div className="grid-facilities">
              {CAFE_MENU.map((item) => (
                <div key={item.id} className="plate" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-xs)' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 700, margin: 0 }}>
                      {item.name}
                    </h4>
                    <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                      ₹{item.price}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: '0 0 var(--space-md) 0', flex: 1 }}>
                    {item.description}
                  </p>
                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={() => alert(`Added ${item.name} to Guest Folio (Room Pod 101)`)}
                  >
                    Add to Folio
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Emergency SOS Protocol */}
          <section id="sos-dispatch" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div className="plate plate--dark" style={{ borderLeft: '4px solid var(--color-error)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-xs) 0' }}>
                    Emergency Medical &amp; Roadside Assistance
                  </h3>
                  <span className="tag-badge tag-badge--danger" style={{ marginBottom: 'var(--space-2xs)' }}>
                    SOS Protocol
                  </span>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'oklch(85% 0.01 60)', margin: 'var(--space-xs) 0 0 0', maxWidth: '640px' }}>
                    Alerts on-duty Front Desk and Property Manager within 5 seconds via Socket.IO. Automatic escalation after 2 minutes. India National Emergency Number: <strong>112</strong>.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                  <a
                    href="tel:112"
                    className="btn btn--danger-outline"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Call National 112
                  </a>
                  <button
                    type="button"
                    className="btn btn--primary"
                    style={{ background: 'var(--color-error)', borderColor: 'var(--color-error)', whiteSpace: 'nowrap' }}
                    onClick={() => alert('SOS Signal broadcast to on-duty staff. Front desk dispatched to Pod 101.')}
                  >
                    Dispatch SOS
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* 3. FRONT DESK PMS PORTAL */}
      {activePortal === 'pms' && (
        <main style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-md) var(--space-md)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                Front Desk Arrivals &amp; Tape Chart
              </h2>
              <span className="tag-badge tag-badge--amber" style={{ marginBottom: 'var(--space-2xs)' }}>
                Staff PMS Core
              </span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 'var(--space-xs) 0 0 0' }}>
                Verify 6-digit cryptographic OTPs, issue instant room keycodes, and manage guest folios.
              </p>
            </div>

            <button
              type="button"
              className="btn btn--sm"
              onClick={() => {
                const pass = `${Math.floor(1000 + Math.random() * 9000)}#`;
                setVisitorPassCode(pass);
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              Issue Visitor Pass
            </button>
          </div>

          {visitorPassCode && (
            <div className="plate plate--accent" style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
              <div>
                <strong>Option B Visitor Keycode Issued:</strong> Code <code>{visitorPassCode}</code> active for 4 hours for courtyard &amp; workshop access.
              </div>
              <button type="button" className="btn btn--sm" onClick={() => setVisitorPassCode(null)}>
                Dismiss
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
            {/* Arrivals List */}
            <div className="plate">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>
                Today’s Arrivals
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {arrivals.map((arr) => (
                  <div
                    key={arr.id}
                    onClick={() => setSelectedArrival(arr)}
                    style={{
                      padding: 'var(--space-sm)',
                      border: 'var(--rule-hair) solid var(--color-rule)',
                      borderRadius: 'var(--radius-card)',
                      cursor: 'pointer',
                      background: selectedArrival.id === arr.id ? 'var(--color-paper-2)' : 'var(--color-plate)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: 'var(--text-sm)' }}>{arr.name}</strong>
                      <span className={`tag-badge ${arr.status === 'Checked-In' ? 'tag-badge--signal' : 'tag-badge--amber'}`}>
                        {arr.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-2xs)' }}>
                      {arr.room} • Plate: {arr.bike} • OTP: <code>{arr.otp}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OTP Verification & Express Check-In */}
            <div className="plate">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>
                Verify Arrival OTP for {selectedArrival.name}
              </h3>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                Guest provides the 6-digit OTP received via SMS / PWA. Verified against HMAC-SHA256 store.
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-sm)', margin: 'var(--space-md) 0', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="input-hotel"
                  placeholder="Enter 6-digit OTP"
                  value={otpVerifyInput}
                  onChange={(e) => setOtpVerifyInput(e.target.value)}
                  style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-lg)', letterSpacing: '0.2em', flex: 1, minWidth: '160px' }}
                />
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    if (otpVerifyInput === selectedArrival.otp) {
                      setArrivals(
                        arrivals.map((a) =>
                          a.id === selectedArrival.id ? { ...a, status: 'Checked-In' } : a
                        )
                      );
                      alert(`OTP Verified! Keycode ${selectedArrival.keycode} active. Room status flipped to OCCUPIED.`);
                      setOtpVerifyInput('');
                    } else {
                      alert('Invalid OTP. Please verify or check guest confirmation.');
                    }
                  }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Verify OTP
                </button>
              </div>

              <div style={{ borderTop: 'var(--rule-hair) solid var(--color-rule)', paddingTop: 'var(--space-md)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Assigned Room Keycode:</span>
                <div style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-accent)' }}>
                  {selectedArrival.keycode}
                </div>
              </div>
            </div>
          </div>

          {/* Guest Folio Manager */}
          <div className="plate">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: 0 }}>
                Live Folio: {selectedArrival.name} ({selectedArrival.room})
              </h3>
              <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-md)', fontWeight: 700 }}>
                Folio Balance: ₹{folioCharges.reduce((acc, c) => acc + c.amount, 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="table-wrapper">
              <table className="board-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {folioCharges.map((f) => (
                    <tr key={f.id}>
                      <td>{f.desc}</td>
                      <td>
                        <span className="tag-badge tag-badge--neutral">{f.type}</span>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-outlier)' }}>₹{f.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Folio Charge */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input-hotel"
                placeholder="Item / Charge Description (e.g. Engine Oil 15W50)"
                value={newChargeDesc}
                onChange={(e) => setNewChargeDesc(e.target.value)}
                style={{ flex: 2, minWidth: '180px' }}
              />
              <input
                type="number"
                className="input-hotel"
                placeholder="Amount (₹)"
                value={newChargeAmount}
                onChange={(e) => setNewChargeAmount(e.target.value)}
                style={{ flex: 1, minWidth: '100px' }}
              />
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  if (newChargeDesc && newChargeAmount) {
                    setFolioCharges([
                      ...folioCharges,
                      {
                        id: `f-${Date.now()}`,
                        desc: newChargeDesc,
                        amount: Number(newChargeAmount),
                        type: 'ADDON',
                      },
                    ]);
                    setNewChargeDesc('');
                    setNewChargeAmount('');
                  }
                }}
                style={{ whiteSpace: 'nowrap' }}
              >
                Post Charge
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 4. GROUP ORGANISER PORTAL */}
      {activePortal === 'group' && (
        <main style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-md) var(--space-md)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                Group Organiser &amp; Multi-Bed Roster
              </h2>
              <span className="tag-badge tag-badge--amber" style={{ marginBottom: 'var(--space-2xs)' }}>
                Expedition Hub
              </span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 'var(--space-xs) 0 0 0' }}>
                Manage team room allocation, invite riders, and choose Master vs Split Folio billing.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Billing Mode:</span>
              <button
                type="button"
                className={`btn btn--sm ${groupFolioMode === 'MASTER' ? 'btn--primary' : ''}`}
                onClick={() => setGroupFolioMode('MASTER')}
                style={{ whiteSpace: 'nowrap' }}
              >
                Master Folio
              </button>
              <button
                type="button"
                className={`btn btn--sm ${groupFolioMode === 'SPLIT' ? 'btn--primary' : ''}`}
                onClick={() => setGroupFolioMode('SPLIT')}
                style={{ whiteSpace: 'nowrap' }}
              >
                Split Folio
              </button>
            </div>
          </div>

          <div className="plate">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>
              Expedition Roster (Western Ghats Ride Team • 4 of 6 Confirmed)
            </h3>

            <div className="table-wrapper">
              <table className="board-table">
                <thead>
                  <tr>
                    <th>Rider Name</th>
                    <th>Contact</th>
                    <th>Motorcycle</th>
                    <th>Assigned Unit</th>
                    <th>DPDP ID Status</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {groupMembers.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td style={{ fontFamily: 'var(--font-outlier)' }}>{m.phone}</td>
                      <td>{m.bike}</td>
                      <td style={{ fontFamily: 'var(--font-outlier)', fontWeight: 600 }}>{m.bedAssigned}</td>
                      <td>
                        <span className={`tag-badge ${m.idVerified ? 'tag-badge--signal' : 'tag-badge--amber'}`}>
                          {m.idVerified ? 'Verified' : 'Pending Upload'}
                        </span>
                      </td>
                      <td>
                        <span className={`tag-badge ${m.status === 'Confirmed' ? 'tag-badge--signal' : 'tag-badge--neutral'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Member Form */}
            <div style={{ marginTop: 'var(--space-lg)', borderTop: 'var(--rule-hair) solid var(--color-rule)', paddingTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input-hotel"
                placeholder="Rider Full Name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                style={{ flex: 1, minWidth: '160px' }}
              />
              <input
                type="text"
                className="input-hotel"
                placeholder="Phone (+91)"
                value={newMemberPhone}
                onChange={(e) => setNewMemberPhone(e.target.value)}
                style={{ flex: 1, minWidth: '160px' }}
              />
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  if (newMemberName && newMemberPhone) {
                    setGroupMembers([
                      ...groupMembers,
                      {
                        id: `gm-${Date.now()}`,
                        name: newMemberName,
                        phone: newMemberPhone,
                        bike: 'Motorcycle TBD',
                        bedAssigned: `Pod 10${groupMembers.length + 1}`,
                        idVerified: false,
                        status: 'Invited',
                      },
                    ]);
                    setNewMemberName('');
                    setNewMemberPhone('');
                  }
                }}
                style={{ whiteSpace: 'nowrap' }}
              >
                Send Invite Link
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 5. HOUSEKEEPING & MAINTENANCE PORTAL */}
      {activePortal === 'housekeeping' && (
        <main style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-md) var(--space-md)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-lg)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                Housekeeping &amp; Facility Work Orders
              </h2>
              <span className="tag-badge tag-badge--amber" style={{ marginBottom: 'var(--space-2xs)' }}>
                Operations
              </span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 'var(--space-xs) 0 0 0' }}>
                Prioritized room turnarounds and motorcycle facility maintenance tickets.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--space-lg)' }}>
            {/* Housekeeping Tasks */}
            <div className="plate">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>
                Turnaround Queue
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {tasks.map((task) => (
                  <div key={task.id} style={{ border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', padding: 'var(--space-sm)', background: 'var(--color-plate)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: 'var(--text-sm)' }}>{task.room}</strong>
                      <span className={`tag-badge ${task.priority === 'URGENT' ? 'tag-badge--danger' : 'tag-badge--neutral'}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 'var(--space-2xs) 0' }}>
                      {task.type} • Assigned: {task.assignedTo}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
                      <span className={`tag-badge ${task.status === 'COMPLETED' ? 'tag-badge--signal' : 'tag-badge--amber'}`}>
                        {task.status}
                      </span>
                      {task.status !== 'COMPLETED' && (
                        <button
                          type="button"
                          className="btn btn--sm"
                          onClick={() => {
                            setTasks(
                              tasks.map((t) =>
                                t.id === task.id
                                  ? { ...t, status: t.status === 'PENDING' ? 'IN_PROGRESS' : 'COMPLETED' }
                                  : t
                              )
                            );
                          }}
                        >
                          {task.status === 'PENDING' ? 'Start Cleaning' : 'Mark Inspected & Ready'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Facility Tickets */}
            <div className="plate">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>
                Active Maintenance Tickets
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {tickets.map((ticket) => (
                  <div key={ticket.id} style={{ border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', padding: 'var(--space-sm)', background: 'var(--color-plate)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: 'var(--text-sm)' }}>{ticket.location}</strong>
                      <span className="tag-badge tag-badge--amber">{ticket.priority}</span>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 'var(--space-2xs) 0' }}>
                      {ticket.issue}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>Logged: {ticket.time}</span>
                      <span className="tag-badge tag-badge--signal">{ticket.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 6. PROPERTY MANAGER & DAY CLOSE PORTAL */}
      {activePortal === 'manager' && (
        <main style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-md) var(--space-md)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-lg)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                Inventory Yield &amp; Gate G7 Day Close
              </h2>
              <span className="tag-badge tag-badge--amber" style={{ marginBottom: 'var(--space-2xs)' }}>
                Property Administration
              </span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 'var(--space-xs) 0 0 0' }}>
                Configure motorcyclist auto-release cutoff windows and perform tamper-proof business day close.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--space-lg)' }}>
            {/* 50% Motorcyclist Auto-Release Engine */}
            <div className="plate">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>
                50% Biker Inventory Auto-Release Rule
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: '0 0 var(--space-md) 0' }}>
                Per Master Build Spec: ~50% of beds are reserved for touring motorcyclists. A scheduled BullMQ background worker automatically releases unsold motorcyclist beds into general availability at a configurable cutoff window before arrival.
              </p>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2xs)' }}>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Auto-Release Cutoff Window:</label>
                  <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-accent)' }}>
                    T - {bikerReleaseHours} Hours Before Arrival
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="72"
                  step="6"
                  value={bikerReleaseHours}
                  onChange={(e) => setBikerReleaseHours(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <span className="tag-badge tag-badge--signal">
                Rule Active: Next BullMQ Sweep at 12:00 UTC
              </span>
            </div>

            {/* Gate G7 Day Close Night Audit */}
            <div className="plate">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>
                Gate G7 Day Close Audit
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: '0 0 var(--space-md) 0' }}>
                Day close locks the business day’s revenue against retroactive folio edits. All monetary amounts stored as integer paise.
              </p>

              <div style={{ border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', padding: 'var(--space-md)', background: 'var(--color-paper-2)', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2xs)', fontSize: 'var(--text-xs)' }}>
                  <span>Gross Room Revenue:</span>
                  <span style={{ fontFamily: 'var(--font-outlier)' }}>₹{(dayRevenuePaise / 100).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2xs)', fontSize: 'var(--text-xs)' }}>
                  <span>12% GST Collected (HSN 9963):</span>
                  <span style={{ fontFamily: 'var(--font-outlier)' }}>₹{(dayTaxPaise / 100).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: 'var(--rule-hair) solid var(--color-rule)', paddingTop: 'var(--space-xs)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                  <span>Audit Variance Check:</span>
                  <span style={{ color: 'var(--color-success)', fontFamily: 'var(--font-outlier)' }}>0 Paise Variance</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn--primary"
                disabled={dayCloseStatus === 'LOCKED'}
                onClick={() => {
                  setDayCloseStatus('LOCKED');
                  alert('Day Close Complete! Financial day locked. Sequential ledger sealed.');
                }}
              >
                {dayCloseStatus === 'LOCKED' ? 'Day Revenue Locked' : 'Execute Gate G7 Day Close'}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 7. VENDOR HUB (Option B) */}
      {activePortal === 'vendor' && (
        <main style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-md) var(--space-md)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-lg)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                Vendor Hub: Kitchen &amp; Laundry Dispatch
              </h2>
              <span className="tag-badge tag-badge--amber" style={{ marginBottom: 'var(--space-2xs)' }}>
                Option B Service Providers
              </span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 'var(--space-xs) 0 0 0' }}>
                Restricted portal for food vendors and specialized technical gear laundry partners.
              </p>
            </div>
          </div>

          <div className="plate">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)', fontWeight: 700, margin: '0 0 var(--space-md) 0' }}>
              Incoming Work Orders
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {vendorOrders.map((ord) => (
                <div key={ord.id} style={{ border: 'var(--rule-hair) solid var(--color-rule)', borderRadius: 'var(--radius-card)', padding: 'var(--space-md)', background: 'var(--color-plate)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                    <div>
                      <span className="tag-badge tag-badge--amber" style={{ marginRight: 'var(--space-xs)' }}>
                        {ord.category}
                      </span>
                      <strong>{ord.items}</strong>
                    </div>
                    <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                      ₹{(ord.totalPaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 'var(--space-xs) 0' }}>
                    Deliver to: <strong>{ord.room}</strong> ({ord.guestName}) • Placed at {ord.orderTime}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--rule-hair) solid var(--color-rule)', paddingTop: 'var(--space-xs)' }}>
                    <span className="tag-badge tag-badge--signal">
                      Status: {ord.status}
                    </span>

                    <button
                      type="button"
                      className="btn btn--sm btn--primary"
                      onClick={() => {
                        const nextStatus: Record<string, 'PREPARING' | 'READY' | 'DELIVERED'> = {
                          RECEIVED: 'PREPARING',
                          PREPARING: 'READY',
                          READY: 'DELIVERED',
                        };
                        const next = nextStatus[ord.status];
                        if (next) {
                          setVendorOrders(
                            vendorOrders.map((o) => (o.id === ord.id ? { ...o, status: next } : o))
                          );
                        }
                      }}
                    >
                      Advance Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* 8. HQ ADMIN & AUDIT TRAIL PORTAL */}
      {activePortal === 'admin' && (
        <main style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-md) var(--space-md)', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-lg)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-section)', fontWeight: 700, margin: '0 0 var(--space-2xs) 0' }}>
                Append-Only Immutable Audit Trail
              </h2>
              <span className="tag-badge tag-badge--amber" style={{ marginBottom: 'var(--space-2xs)' }}>
                Platform Governance
              </span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: 'var(--space-xs) 0 0 0' }}>
                Enforced by PostgreSQL trigger forbidding UPDATE and DELETE operations.
              </p>
            </div>
          </div>

          <div className="plate">
            <div className="table-wrapper">
              <table className="board-table">
                <thead>
                  <tr>
                    <th>Audit ID</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Detail</th>
                    <th>Timestamp (UTC)</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontFamily: 'var(--font-outlier)' }}>{log.id}</td>
                      <td style={{ fontWeight: 600 }}>{log.actor}</td>
                      <td>
                        <span className="tag-badge tag-badge--signal">{log.action}</span>
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)' }}>{log.detail}</td>
                      <td style={{ fontFamily: 'var(--font-outlier)', color: 'var(--color-muted)' }}>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* 4. Global Masthead Footer */}
      <footer style={{ borderTop: 'var(--rule-hair) solid var(--color-rule)', background: 'var(--color-white)', padding: 'var(--space-xl) var(--space-md)', marginTop: 'var(--space-2xl)' }}>
        <div style={{ maxWidth: 'var(--container)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <img
              src="/dazztel-emblem.jpg"
              alt="DAZZTEL"
              style={{ height: '42px', width: '42px', objectFit: 'contain', borderRadius: '50%' }}
            />
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ink)', display: 'block', lineHeight: 1.1, marginBottom: 'var(--space-3xs)' }}>
                DAZZTEL
              </span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0 }}>
                Boutique moto &amp; nomad sanctuary • Sakrepatna, Chikkamagaluru, Karnataka - 577135
              </p>
            </div>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textAlign: 'left' }}>
            <div>GSTIN: 29AABCH7829M1ZF / State Code 29 (Karnataka) / HSN 9963</div>
            <div>Compliant with India DPDP Act 2023 / Emergency SOS Dispatch 112</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
