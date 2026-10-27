'use client';

import React, { useState } from 'react';

export default function AdminDashboardPage() {
  // Motorcyclist allocation policy state
  const [allocationPct, setAllocationPct] = useState(50);
  const [autoReleaseEnabled, setAutoReleaseEnabled] = useState(true);
  const [policySaved, setPolicySaved] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const lockedBeds = Math.round(48 * (allocationPct / 100));
  const generalBeds = 48 - lockedBeds;

  const handleSavePolicy = () => {
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 3000);
  };

  // Ledger records
  const ledgerData = [
    {
      ref: '#HY-ANJ-9482',
      guest: 'Arjun Singhania',
      vehicle: 'RE Himalayan (MH 12 QX 4040)',
      property: 'Goa Anjuna',
      room: 'Bunk #101-A2',
      dates: '14-17 Nov 2026',
      addons: 'Bay #04 + Heated Locker',
      invoice: 'INV-2026-8841',
      total: '₹3,493',
      payment: 'Settled UPI (GPay)',
      access: '8492# • Gate Cleared',
    },
    {
      ref: '#HY-LEH-1049',
      guest: 'Vikram Rathore',
      vehicle: 'KTM 390 Adv (DL 03 AP 9921)',
      property: 'Leh Ladakh',
      room: 'Pod #204-B1',
      dates: '15-18 Nov 2026',
      addons: 'Bay #01 + Tool Pass',
      invoice: 'INV-2026-8842',
      total: '₹4,120',
      payment: 'Settled Axis Card',
      access: 'Issued 3910# • En Route',
    },
    {
      ref: '#HY-ANJ-9410',
      guest: 'Ananya Sen',
      vehicle: 'BMW G310GS (KA 01 MR 7812)',
      property: 'Goa Anjuna',
      room: 'Bunk #102-A1',
      dates: '14-16 Nov 2026',
      addons: 'Locker Only',
      invoice: 'INV-2026-8843',
      total: '₹2,850',
      payment: 'Settled PhonePe',
      access: '1104# • Gate Cleared',
    },
    {
      ref: '#HY-MAN-3081',
      guest: 'Kabir Mehta',
      vehicle: 'KTM 390 (HP 01 BB 2049)',
      property: 'Manali Hub',
      room: 'Pod #301-C2',
      dates: '16-19 Nov 2026',
      addons: 'Bay #02',
      invoice: 'INV-2026-8844',
      total: '₹3,790',
      payment: 'Settled UPI',
      access: '5821# • Active',
    },
    {
      ref: '#HY-ANJ-9390',
      guest: 'Priya Mohan',
      vehicle: 'General Nomad',
      property: 'Goa Anjuna',
      room: 'Bunk #103-B2',
      dates: '12-15 Nov 2026',
      addons: 'Standard Locker',
      invoice: 'INV-2026-8840',
      total: '₹2,240',
      payment: 'Settled HDFC NetBanking',
      access: 'Completed Checkout',
    },
  ];

  const filteredLedger = ledgerData.filter((item) => {
    const matchesSearch =
      item.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProperty = selectedProperty === 'All' || item.property.includes(selectedProperty);
    return matchesSearch && matchesProperty;
  });

  return (
    <div className="bg-slate-950 text-slate-100 font-body min-h-screen antialiased selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 border-b border-slate-800/80 backdrop-blur-md bg-slate-950/90 shadow-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <span className="material-symbols-outlined text-2xl font-bold">sports_motorsports</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-amber-500">
                  HOTELYO HQ
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-semibold">
                  HQ Node 01
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                EXECUTIVE ADMIN PLATFORM
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-800/80 text-sm">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
              <span className="material-symbols-outlined text-amber-400 text-lg">domain</span>
              <span className="font-medium text-xs">All Properties: Goa Anjuna, Leh Ladakh, Manali Hub</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                3 Hubs Active
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
              <span className="material-symbols-outlined text-slate-400 text-base">calendar_month</span>
              <span>November 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="text-amber-400 font-bold">₹</span>
              <span>INR (₹)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-400 hover:bg-rose-900/40 text-xs font-headline font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-rose-400 text-base animate-pulse">lock_person</span>
            <span>Emergency Lockout</span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
              RK
            </div>
            <div className="hidden xl:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-200">Rakshith</span>
                <span className="material-symbols-outlined text-[13px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500">HQ Principal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Shell */}
      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-64 pt-16 flex flex-col justify-between p-4 z-40 border-r border-slate-800/80 backdrop-blur-md bg-slate-950/95 shadow-xl hidden md:flex">
          <div className="space-y-6">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <span className="material-symbols-outlined text-xl">shield</span>
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-slate-100 uppercase tracking-tight">MotoNomad HQ</h4>
                <p className="text-[11px] font-mono text-slate-400">Central Control 01</p>
              </div>
            </div>

            <nav className="space-y-1">
              <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">HQ Operations Core</p>
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold text-sm" href="#">
                <span className="material-symbols-outlined text-xl">analytics</span>
                <span>Portfolio Metrics</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              </a>
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 font-medium text-sm transition-colors" href="#policy-controller">
                <span className="material-symbols-outlined text-xl">policy</span>
                <span>Policy Controller</span>
              </a>
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 font-medium text-sm transition-colors" href="#reservations-ledger">
                <span className="material-symbols-outlined text-xl">account_balance</span>
                <span>Financial Ledger</span>
                <span className="ml-auto px-1.5 py-0.5 text-[9px] font-mono bg-slate-800 text-slate-300 rounded">114 beds</span>
              </a>
              <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 font-medium text-sm transition-colors" href="#audit-log">
                <span className="material-symbols-outlined text-xl">receipt_long</span>
                <span>Live Audit Stream</span>
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </a>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="px-3 py-2 rounded-md bg-slate-950 border border-slate-900 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>SEC-LAYER: L3-V4</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> SYNCED
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6 lg:p-8 space-y-8 max-w-[1720px] mx-auto overflow-x-hidden">
          {/* Executive Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-2xl lg:text-3xl text-slate-50 tracking-tight">
                  Executive Operations & Yield Matrix
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-semibold">
                  LIVE Q4-2026
                </span>
              </div>
              <p className="text-xs lg:text-sm text-slate-400 mt-1">
                Real-time multi-property telemetry across Goa Anjuna, Leh Ladakh & Manali Hubs. Moto-nomad priority locking engaged.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => alert('Exporting full GST ledger CSV/PDF...')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base text-amber-400">file_download</span>
                <span>Export Executive Snapshot</span>
              </button>
            </div>
          </div>

          {/* Executive KPIs Grid (5 Bento Cards) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-lg">monitoring</span>
                <h2 className="font-headline font-bold text-sm uppercase tracking-wider text-slate-300">
                  Financial & Portfolio Performance Metrics
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Timestamp: Live Synced</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {/* Card 1: Gross Revenue */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Total Gross Revenue
                  </span>
                  <span className="material-symbols-outlined text-amber-400 text-xl">payments</span>
                </div>
                <div className="font-display font-extrabold text-2xl lg:text-3xl text-slate-50 tracking-tight mb-2">
                  ₹14,82,450
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[11px]">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +18.4% MoM growth
                </span>
                <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800 font-mono">
                  Consolidated Q4 target achieved 109.2%
                </p>
              </div>

              {/* Card 2: Blended Occupancy */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Blended Occupancy
                  </span>
                  <span className="material-symbols-outlined text-amber-400 text-xl">hotel</span>
                </div>
                <div className="font-display font-extrabold text-2xl lg:text-3xl text-slate-50 tracking-tight mb-2">
                  86.4% <span className="text-xs font-mono text-slate-400 font-normal">/ 114 beds</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full" style={{ width: '86.4%' }}></div>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>Anj: <strong className="text-emerald-400">92%</strong></span>
                  <span>Leh: <strong className="text-amber-400">78%</strong></span>
                  <span>Man: <strong className="text-emerald-400">84%</strong></span>
                </div>
              </div>

              {/* Card 3: Motorcyclist Revenue Share */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Moto Rider Share
                  </span>
                  <span className="material-symbols-outlined text-amber-400 text-xl">two_wheeler</span>
                </div>
                <div className="font-display font-extrabold text-2xl lg:text-3xl text-amber-400 tracking-tight mb-2">
                  ₹8,15,300
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25 text-[11px]">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  55% of gross • 50% quota beat
                </div>
                <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800 font-mono">
                  Moto segment outperforming OTA by 14%
                </p>
              </div>

              {/* Card 4: Bike Bay & Locker Ancillary */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Bay & Locker Yield
                  </span>
                  <span className="material-symbols-outlined text-amber-400 text-xl">garage</span>
                </div>
                <div className="font-display font-extrabold text-2xl lg:text-3xl text-slate-50 tracking-tight mb-2">
                  ₹1,62,800
                </div>
                <div className="text-xs font-mono text-slate-300 flex items-center justify-between mb-1">
                  <span>148 bay nights</span>
                  <span className="text-amber-400">+122 lockers</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800 font-mono">
                  ARPU add-on delta: +₹380/bed-night
                </p>
              </div>

              {/* Card 5: Net GST Liability */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Net GST Liability
                  </span>
                  <span className="material-symbols-outlined text-amber-400 text-xl">receipt</span>
                </div>
                <div className="font-display font-extrabold text-2xl lg:text-3xl text-slate-50 tracking-tight mb-2">
                  ₹1,77,894
                </div>
                <div className="text-[11px] font-mono text-slate-300 space-y-0.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">CGST 6%:</span>
                    <span>₹88,947</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SGST 6%:</span>
                    <span>₹88,947</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold">
                    GSTIN VERIFIED
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Filing T-7</span>
                </div>
              </div>
            </div>
          </section>

          {/* Motorcyclist Reserved Segment Policy Controller */}
          <section className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl relative overflow-hidden" id="policy-controller">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500"></div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <span className="material-symbols-outlined text-2xl">tune</span>
                </span>
                <div>
                  <h3 className="font-headline font-bold text-lg text-slate-100">
                    Dynamic Moto-Bed Inventory Allocator & Fallback Engine
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Automated rate management & quota allocation matrix for touring motorcyclists.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {policySaved && (
                  <span className="text-xs text-emerald-400 font-mono font-bold">✓ Policy Saved!</span>
                )}
                <button
                  onClick={handleSavePolicy}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-headline font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Save Policy</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
              {/* Slider (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                      Property Scope Allocation
                    </span>
                    <h4 className="font-display font-bold text-slate-200 text-base mt-0.5">
                      Anjuna Property Motorcycle Bed Allocation
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-extrabold text-amber-400">{allocationPct}%</span>
                    <span className="text-[11px] font-mono text-slate-400 block">(Configurable: 30% - 70%)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="30"
                    max="70"
                    value={allocationPct}
                    onChange={(e) => setAllocationPct(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>30% Minimum Floor</span>
                    <span className="text-amber-400 font-semibold">Recommended Target: 45-55%</span>
                    <span>70% Peak Rally Cap</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Live Locked Moto Beds</span>
                    <p className="font-mono text-lg font-bold text-amber-400 mt-0.5">{lockedBeds} of 48 beds</p>
                    <span className="text-[10px] text-emerald-400 font-mono">19 Pre-booked (79%)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">General OTA Capacity</span>
                    <p className="font-mono text-lg font-bold text-slate-200 mt-0.5">{generalBeds} of 48 beds</p>
                    <span className="text-[10px] text-amber-400 font-mono">22 Pre-booked (91%)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Secured Bike Bays</span>
                    <p className="font-mono text-lg font-bold text-slate-200 mt-0.5">18 of 20 bays</p>
                    <span className="text-[10px] text-rose-400 font-mono">2 Bays remaining</span>
                  </div>
                </div>
              </div>

              {/* Fallback Switch (5 cols) */}
              <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-emerald-400">autorenew</span>
                      Automated Yield Fallback
                    </span>
                    <span
                      onClick={() => setAutoReleaseEnabled(!autoReleaseEnabled)}
                      className={`cursor-pointer px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                        autoReleaseEnabled
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {autoReleaseEnabled ? 'ENABLED / ACTIVE' : 'DISABLED'}
                    </span>
                  </div>

                  <h5 className="text-xs font-semibold text-slate-200">
                    Auto-release unsold moto beds 24h prior to check-in to general public
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Unclaimed rider slots auto-convert to general OTA inventory at 12:00 PM T-1 day. Prevents vacancy spoilage while ensuring guaranteed inventory for late-night riders.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-400 text-sm">security</span>
                    Safety Floor: Minimum 3 emergency rider pods reserved till 18:00 IST
                  </span>
                  <span className="text-amber-400 font-semibold">PROTECTED</span>
                </div>
              </div>
            </div>
          </section>

          {/* Master Reservations & Financial Ledger */}
          <section className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden" id="reservations-ledger">
            <div className="p-5 border-b border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-xl">dataset</span>
                  <h3 className="font-headline font-bold text-base text-slate-100">
                    Master Reservations & Financial Ledger
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-mono bg-slate-800 text-slate-300 rounded font-medium">
                    {filteredLedger.length} Records Shown
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time ledger with automated GST invoicing, ANPR clearance gates, and keypad PIN dispatch.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px]">
                  <span className="material-symbols-outlined text-slate-500 absolute left-3 top-2.5 text-lg">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest, booking ref, bike..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="All">All Hubs (Goa, Leh, Manali)</option>
                  <option value="Goa">Goa Anjuna</option>
                  <option value="Leh">Leh Ladakh</option>
                  <option value="Manali">Manali Hub</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/90 text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Guest Name & Rider Badge</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Room / Bed</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Add-ons</th>
                    <th className="py-3 px-4">GST Invoice #</th>
                    <th className="py-3 px-4 text-right">Total INR</th>
                    <th className="py-3 px-4 text-center">Payment Status</th>
                    <th className="py-3 px-4">Access PIN & ANPR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-body">
                  {filteredLedger.map((row) => (
                    <tr key={row.ref} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{row.ref}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100">{row.guest}</div>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400/90 mt-0.5">
                          <span className="material-symbols-outlined text-[12px]">two_wheeler</span>
                          <span>{row.vehicle}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-300">{row.property}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">{row.room}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{row.dates}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                          {row.addons}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{row.invoice}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-100 text-right">{row.total}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {row.payment}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">{row.access}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Cryptographic SHA-256 Audit Log */}
          <section className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-3" id="audit-log">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">lock</span>
                <h3 className="font-headline font-bold text-sm text-slate-100 uppercase tracking-wider">
                  Tamper-Proof Audit Trail (SHA-256)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Zero Unverified Mutations</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-amber-400">[14:32:08 IST]</span> Actor:{' '}
                  <strong className="text-white">Admin: Rakshith (HQ)</strong> • Policy threshold set to {allocationPct}%
                </div>
                <span className="text-slate-500 text-[10px]">0x8f4c...3b12</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-amber-400">[14:15:22 IST]</span> Actor:{' '}
                  <strong className="text-white">ANPR Gateway Node #1</strong> • Gate barrier clearance for MH 12 QX 4040
                </div>
                <span className="text-slate-500 text-[10px]">0x1d9e...a409</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-amber-400">[13:58:40 IST]</span> Actor:{' '}
                  <strong className="text-white">UPI Gateway Webhook</strong> • Payment settled ₹3,493 (Inv: INV-2026-8841)
                </div>
                <span className="text-slate-500 text-[10px]">0x6a12...77fe</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
