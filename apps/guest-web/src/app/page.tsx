'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GuestDiscoveryPage() {
  const router = useRouter();

  const [checkInDate, setCheckInDate] = useState('2026-11-14');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-17');
  const [guestCount, setGuestCount] = useState(1);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  // Add-on states
  const [bikeParking, setBikeParking] = useState(true);
  const [gearLocker, setGearLocker] = useState(true);
  const [trailLunch, setTrailLunch] = useState(false);

  const pricePerNight = 849;
  const nights = 3;
  const dormTotal = pricePerNight * nights;
  const parkingTotal = bikeParking ? 150 * nights : 0;
  const lockerTotal = gearLocker ? 100 * nights : 0;
  const lunchTotal = trailLunch ? 199 * nights : 0;
  const subtotal = dormTotal + parkingTotal + lockerTotal + lunchTotal;

  const handleProceedToCheckout = () => {
    const params = new URLSearchParams({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount.toString(),
      parking: bikeParking.toString(),
      locker: gearLocker.toString(),
      lunch: trailLunch.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const triggerSos = () => {
    setSosSuccess(true);
    setTimeout(() => {
      setSosModalOpen(false);
      setSosSuccess(false);
    }, 4000);
  };

  return (
    <div className="w-full max-w-md bg-slate-950 min-h-screen relative flex flex-col pb-24 shadow-2xl overflow-x-hidden border-x border-slate-900/60 font-body">
      {/* TopAppBar with Brand & SOS Button */}
      <header className="bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/40 border-b border-slate-800">
        <div className="flex justify-between items-center w-full px-4 py-3 max-w-md mx-auto">
          {/* Brand and Motorcycle Badge */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                two_wheeler
              </span>
            </div>
            <div>
              <h1 className="font-headline text-lg font-bold tracking-wider text-slate-100 uppercase leading-none">
                HOTELYO Anjuna
              </h1>
              <span className="font-label text-[10px] tracking-wider text-amber-400 font-semibold uppercase">
                Moto & Remote Hub • Goa
              </span>
            </div>
          </div>

          {/* SOS Badge with Siren Icon */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-950/80 border border-rose-500/60 rounded-full text-rose-300 active:scale-95 transition-transform duration-150 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            type="button"
          >
            <span
              className="material-symbols-outlined text-base text-rose-400 animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              e911_emergency
            </span>
            <span className="font-headline text-xs font-bold tracking-wider text-rose-100">
              SOS
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 px-4 pt-3 space-y-4">
        {/* Hero Visual Bento Card */}
        <section className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-xl group">
          <div className="relative h-56 w-full overflow-hidden">
            <img
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              alt="Modern motorcycle hostel courtyard in Anjuna Goa with Royal Enfield motorcycles under palms"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGcu_OwKuoi2z7sQPiHZWS2yAoJiQ9s9Ahtec9wzsTIqBFgK1Dmc8Fm3_lM7HQr7AxLrZL2qlOdfLsRnPQmBTAnvv-4XDXw8hklZBTDZNmjzrT5n8sCdbcLOZZzaWu3uxLX7GZWATSHhki4ZsH1zYWPIWh84lbEqgoMqkmCBcZMI4zZVxhnpDYOuJw9vDNWdb0pJdtkX8wJrjsBu0kKoxbLS6Jbro1py1YdCrnX4dbLV8xVGE9G89vdbE1SJrU0RwrSpjXyjNEU82a"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            {/* Dynamic Floating Review & Distance Badge */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <div className="bg-slate-950/85 backdrop-blur-md border border-amber-500/40 px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-lg">
                <span className="text-amber-400 text-xs">★</span>
                <span className="font-headline text-xs font-bold text-slate-100">4.87</span>
                <span className="text-[11px] text-slate-300 font-medium">(340+ Rider Reviews)</span>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 px-2.5 py-1 rounded-full flex items-center space-x-1 text-[11px] text-slate-200">
                <span className="material-symbols-outlined text-xs text-emerald-400">near_me</span>
                <span>Anjuna Beach 600m</span>
              </div>
            </div>

            {/* Bottom Badges / Key Stats overlay */}
            <div className="absolute bottom-3 left-3 right-3">
              <h2 className="font-headline text-xl font-bold tracking-tight text-white mb-2">
                Basecamp & Work Sanctum
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg p-2 flex items-center space-x-2">
                  <span className="material-symbols-outlined text-amber-400 text-base">wifi</span>
                  <div>
                    <div className="text-[10px] text-slate-400 font-label">Fiber Network</div>
                    <div className="font-semibold text-slate-200">300 Mbps Dual-ISP</div>
                  </div>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg p-2 flex items-center space-x-2">
                  <span className="material-symbols-outlined text-emerald-400 text-base">pool</span>
                  <div>
                    <div className="text-[10px] text-slate-400 font-label">Leisure Chillout</div>
                    <div className="font-semibold text-slate-200">Plunge Pool & Deck</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Micro Highlights Row */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-amber-500 text-sm">construction</span>
              <span className="font-medium text-[11px]">24/7 Mechanic Bay</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-amber-500 text-sm">local_cafe</span>
              <span className="font-medium text-[11px]">Rider's Fuel Cafe</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-amber-500 text-sm">laptop_chromebook</span>
              <span className="font-medium text-[11px]">Co-Work Pods</span>
            </div>
          </div>
        </section>

        {/* Sticky Date & Guest Selector */}
        <section className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-800/90 rounded-xl p-3 shadow-lg shadow-black/50">
          <div className="flex items-center justify-between gap-3">
            {/* Dates */}
            <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-lg p-2 flex items-center space-x-2.5">
              <span className="material-symbols-outlined text-amber-400 text-lg">calendar_month</span>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-400 font-label uppercase tracking-wider">Trip Dates</div>
                <div className="font-headline text-xs font-semibold text-slate-100">
                  14 Nov – 17 Nov <span className="text-amber-400 font-normal">(3 Nights)</span>
                </div>
              </div>
            </div>

            {/* Guests Pill */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2 flex items-center space-x-2">
              <span className="material-symbols-outlined text-slate-400 text-lg">group</span>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-400 font-label uppercase tracking-wider">Riders</div>
                <div className="font-headline text-xs font-semibold text-slate-100">{guestCount} Guest</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Dorm Card */}
        <section className="rounded-2xl border-2 border-amber-500/40 bg-slate-900/90 p-4 space-y-3.5 relative overflow-hidden shadow-xl shadow-amber-500/5">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div>
              {/* Prominent Moto Tag */}
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-amber-500/20 text-amber-400 border border-amber-500/50 mb-1.5">
                <span>⚡ 50% Motorcyclist Reserved Tag</span>
              </span>
              <h3 className="font-headline text-lg font-bold text-white tracking-tight">6-Bed AC Mixed Dorm</h3>
              <p className="text-xs text-slate-400">Specially engineered sound-dampened acoustic bunk pods</p>
            </div>

            {/* Pricing Badge */}
            <div className="text-right">
              <div className="font-headline text-lg font-extrabold text-amber-400">
                ₹849 <span className="text-xs font-normal text-slate-400">/ night</span>
              </div>
              <div className="inline-flex items-center space-x-1 text-[11px] text-rose-400 font-semibold mt-0.5">
                <span className="material-symbols-outlined text-xs">alarm</span>
                <span>Only 2 beds left today!</span>
              </div>
            </div>
          </div>

          {/* Pod Amenities Spec Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="material-symbols-outlined text-amber-400 text-base">power</span>
              <span className="text-slate-300">Dual USB-C & AC Socket</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="material-symbols-outlined text-amber-400 text-base">curtains</span>
              <span className="text-slate-300">100% Blackout Curtains</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="material-symbols-outlined text-amber-400 text-base">menu_book</span>
              <span className="text-slate-300">Warm Reading Lamp</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <span className="material-symbols-outlined text-amber-400 text-base">lock</span>
              <span className="text-slate-300 font-medium">Under-bed Steel Gear Chest</span>
            </div>
          </div>

          {/* Motorcyclist Add-ons Configuration */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-xs font-headline font-bold text-amber-400 uppercase tracking-wider">
              Select Motorcycle Add-ons
            </div>

            {/* Parking Add-on Toggle */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-amber-500/40 transition">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  checked={bikeParking}
                  onChange={(e) => setBikeParking(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-100">Secure CCTV Bike Parking + Wash Bay</div>
                  <div className="text-[10px] text-slate-400">Pressure wash & paddock tools included</div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400">+₹150/nt</span>
            </label>

            {/* Gear Locker Add-on Toggle */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-amber-500/40 transition">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  checked={gearLocker}
                  onChange={(e) => setGearLocker(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-100">Heated Gear Locker & UV Sanitizer</div>
                  <div className="text-[10px] text-slate-400">Dry riding boots, helmets & jackets</div>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400">+₹100/nt</span>
            </label>
          </div>
        </section>

        {/* Motorcycle Specific Amenities Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-headline text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-amber-500 text-base">garage</span>
              <span>Motorcycle Facility Hub</span>
            </h4>
            <span className="text-[10px] font-label text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Free for Guests
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 mb-2">
                <span className="material-symbols-outlined text-lg">cleaning_services</span>
              </div>
              <div>
                <div className="font-headline font-bold text-xs text-white">Pressure Wash Bay</div>
                <div className="text-[11px] text-slate-400 mt-0.5">High-PSI foam wash to clean ghat mud</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 mb-2">
                <span className="material-symbols-outlined text-lg">handyman</span>
              </div>
              <div>
                <div className="font-headline font-bold text-xs text-white">Tool Kit Workbench</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Torque wrenches, paddock stands</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 mb-2">
                <span className="material-symbols-outlined text-lg">tire_repair</span>
              </div>
              <div>
                <div className="font-headline font-bold text-xs text-white">Puncture Repair Station</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Tubeless plug sets & 12V digital inflator</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 mb-2">
                <span className="material-symbols-outlined text-lg">security</span>
              </div>
              <div>
                <div className="font-headline font-bold text-xs text-white">Secure Chain-Down Bays</div>
                <div className="text-[11px] text-slate-400 mt-0.5">CCTV ground anchors & 24/7 guard</div>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Sunset Ride Out notice */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
            <span className="material-symbols-outlined text-xl">forum</span>
          </div>
          <div className="flex-1">
            <div className="font-headline text-xs font-bold text-white">Daily Sunset Ride Out to Chapora</div>
            <p className="text-[11px] text-slate-400">Briefing 5:00 PM at Cafe. Join with your rental or touring bike.</p>
          </div>
          <span className="material-symbols-outlined text-slate-500 text-sm">chevron_right</span>
        </section>

        {/* Bottom Floating Checkout Action Bar */}
        <div className="bg-slate-900/95 border border-slate-800/90 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 mt-4">
          <div>
            <div className="text-[10px] text-slate-400 font-label uppercase">Total for 3 Nights</div>
            <div className="flex items-baseline space-x-1">
              <span className="font-headline text-xl font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-400 font-medium">+12% GST</span>
            </div>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-headline font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform duration-150"
          >
            <span>Configure Stay & Checkout</span>
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-slate-900/95 backdrop-blur-lg fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.5)] border-t border-slate-800">
        <Link href="/" className="flex flex-col items-center justify-center text-amber-500 py-1 font-semibold">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            explore
          </span>
          <span className="font-label text-[10px] tracking-wide font-medium mt-0.5">Explore</span>
        </Link>
        <Link href="/checkout" className="flex flex-col items-center justify-center text-slate-400 py-1 hover:text-amber-400 transition-colors">
          <span className="material-symbols-outlined text-2xl">hotel</span>
          <span className="font-label text-[10px] tracking-wide font-medium mt-0.5">Checkout</span>
        </Link>
        <a href="http://localhost:3001" target="_blank" className="flex flex-col items-center justify-center text-slate-400 py-1 hover:text-amber-400 transition-colors">
          <span className="material-symbols-outlined text-2xl">desk</span>
          <span className="font-label text-[10px] tracking-wide font-medium mt-0.5">Staff PMS</span>
        </a>
        <a href="http://localhost:3002" target="_blank" className="flex flex-col items-center justify-center text-slate-400 py-1 hover:text-amber-400 transition-colors">
          <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          <span className="font-label text-[10px] tracking-wide font-medium mt-0.5">HQ Admin</span>
        </a>
      </nav>

      {/* Emergency SOS Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl shadow-rose-950/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                <span className="material-symbols-outlined text-2xl animate-pulse">emergency</span>
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold text-white">Emergency Rider SOS</h3>
                <p className="text-xs text-slate-400">Direct 2-Minute Escalation to On-Duty Staff</p>
              </div>
            </div>

            {sosSuccess ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs text-center font-bold">
                ✓ SOS Alert Broadcasted! Front desk manager Vikram S. notified via SMS and siren.
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-300">
                  Trigger immediate emergency assistance for medical needs, highway breakdown, or hostel security.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSosModalOpen(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={triggerSos}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-900/50"
                  >
                    Confirm SOS
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
