'use client';

import React, { useState } from 'react';

export default function StaffPmsDashboard() {
  // Front-Desk OTP Verification
  const [otpDigits, setOtpDigits] = useState(['8', '4', '9', '2', '', '']);
  const [guestCheckedIn, setGuestCheckedIn] = useState(false);
  const [accessCode, setAccessCode] = useState('8492#');
  const [codeRevoked, setCodeRevoked] = useState(false);
  const [dayCloseDone, setDayCloseDone] = useState(false);

  // Housekeeping task queue state
  const [tasks, setTasks] = useState([
    { id: '101-A3', bed: 'Bed 101-A3', guest: 'Rohan D.', time: '11:30 AM', priority: 'High', status: 'Dirty', staff: 'Ramesh K.' },
    { id: '102-B1', bed: 'Bed 102-B1', guest: 'Priya M.', time: '10:45 AM', priority: 'Med', status: 'Cleaning', staff: 'Sunita B.' },
    { id: '104-A2', bed: 'Bed 104-A2', guest: 'Dev N.', time: '09:15 AM', priority: 'Normal', status: 'Inspected', staff: 'Ramesh K.' },
    { id: '105-B4', bed: 'Bed 105-B4', guest: 'Sameer P.', time: '08:30 AM', priority: 'Rush', status: 'Ready', staff: 'Sunita B.' },
  ]);

  const handleAdvanceStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus =
          t.status === 'Dirty' ? 'Cleaning' : t.status === 'Cleaning' ? 'Inspected' : t.status === 'Inspected' ? 'Ready' : 'Clean';
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleVerifyOtp = () => {
    setGuestCheckedIn(true);
  };

  const handleRevokeCode = () => {
    setCodeRevoked(true);
    setTimeout(() => {
      setAccessCode('9140#');
      setCodeRevoked(false);
    }, 2000);
  };

  const handleDayClose = () => {
    setDayCloseDone(true);
    setTimeout(() => setDayCloseDone(false), 5000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-body min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="w-full px-6 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-slate-950/90 shadow-2xl border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                two_wheeler
              </span>
            </div>
            <div>
              <span className="font-headline text-lg font-black tracking-widest text-amber-500">HOTELYO PMS</span>
              <span className="block text-[10px] font-label font-bold tracking-wider text-slate-400 uppercase leading-none">
                Moto Hub System
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800"></div>

          {/* Property Switcher */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200">
            <span className="material-symbols-outlined text-sm text-amber-400">location_on</span>
            <span>HOTELYO Anjuna, Goa (Hub 01)</span>
          </button>

          {/* Live Status Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono font-semibold">Online • 84% Occupancy</span>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search guest, booking ID, bike reg (e.g. MH 12)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3.5">
          <button className="animate-sos flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-headline text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency_home
            </span>
            <span>SOS Broadcast</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
              VS
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-200">Vikram S.</div>
              <div className="text-[10px] text-amber-500 font-mono">Front Desk • Shift 1</div>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Bar */}
      <nav className="bg-slate-950/70 border-b border-slate-900 px-6 py-2 flex items-center justify-between text-xs font-headline font-semibold uppercase tracking-wider">
        <div className="flex items-center gap-6">
          <span className="text-amber-400 font-bold border-b-2 border-amber-400 pb-1 flex items-center gap-1.5 cursor-pointer">
            <span className="material-symbols-outlined text-sm">dashboard</span> Dashboard
          </span>
          <span className="text-slate-400 hover:text-slate-200 pb-1 flex items-center gap-1.5 cursor-pointer">
            <span className="material-symbols-outlined text-sm">bed</span> Beds & Lockers
          </span>
          <span className="text-slate-400 hover:text-slate-200 pb-1 flex items-center gap-1.5 cursor-pointer">
            <span className="material-symbols-outlined text-sm">two_wheeler</span> Wash Bay
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Gate ANPR: MH-ACTIVE
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span> Locker Hub: 45°C Dry Mode
          </span>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="flex-1 p-6 space-y-6 max-w-[1720px] mx-auto w-full">
        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-label uppercase tracking-wider font-semibold">
              <span>Total In-House</span>
              <span className="material-symbols-outlined text-amber-500 text-xl">groups</span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <div className="text-3xl font-headline font-bold text-white tracking-tight">
                38 <span className="text-sm font-normal text-slate-400">Guests</span>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                92% Cap
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-amber-400 font-mono flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">two_wheeler</span>
              <span>62% touring riders (24 bikes)</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-label uppercase tracking-wider font-semibold">
              <span>Today's Arrivals</span>
              <span className="material-symbols-outlined text-amber-500 text-xl">luggage</span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <div className="text-3xl font-headline font-bold text-white tracking-tight">
                14 <span className="text-sm font-normal text-slate-400">Check-ins</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded uppercase font-headline">
                Shift target
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 font-mono">
              <span className="text-emerald-400 font-semibold">8 verified</span> •{' '}
              <span className="text-amber-400 font-semibold">6 pending OTP</span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-label uppercase tracking-wider font-semibold">
              <span>Departures</span>
              <span className="material-symbols-outlined text-rose-500 text-xl">logout</span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <div className="text-3xl font-headline font-bold text-white tracking-tight">
                9 <span className="text-sm font-normal text-slate-400">Pending Out</span>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-medium bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full font-mono">
                By 12:00
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 font-label">
              5 locker stored • 4 keys handed
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-label uppercase tracking-wider font-semibold">
              <span>Housekeeping & Beds</span>
              <span className="material-symbols-outlined text-amber-500 text-xl">cleaning_services</span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <div className="text-3xl font-headline font-bold text-white tracking-tight">
                12 <span className="text-sm font-normal text-slate-400">Active Beds</span>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-mono text-slate-300 bg-slate-800 rounded">Floor 1</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1 text-[11px] pt-3 border-t border-slate-800 text-center font-mono">
              <div className="bg-emerald-950/40 text-emerald-400 rounded py-0.5 border border-emerald-500/20">4 Cln</div>
              <div className="bg-rose-950/40 text-rose-400 rounded py-0.5 border border-rose-500/20">3 Drt</div>
              <div className="bg-slate-800 text-slate-300 rounded py-0.5 border border-slate-700">1 Insp</div>
              <div className="bg-amber-950/40 text-amber-400 rounded py-0.5 border border-amber-500/20">4 Occ</div>
            </div>
          </div>
        </section>

        {/* Two-Column Grid: 70% Left, 30% Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Room 101 Bed Matrix Grid */}
            <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <span className="material-symbols-outlined text-lg">meeting_room</span>
                  </div>
                  <div>
                    <h2 className="font-headline text-base font-bold text-white tracking-wide">
                      Room 101: 6-Bed AC Moto Dorm
                    </h2>
                    <div className="text-xs text-slate-400 font-label">
                      Ground Floor • Heavy-Baggage Access • Dual Keypad Entry
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-md text-xs font-semibold bg-amber-500 text-slate-950">All Beds</span>
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300">Occupied (2)</span>
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-slate-800 text-amber-400">Moto Reserved (2)</span>
                </div>
              </div>

              {/* 6 Bed Cards Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {/* Bed A1 */}
                <div className="p-4 rounded-lg bg-slate-950/80 border border-emerald-500/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-headline font-bold text-sm text-white">
                        Bed A1 <span className="text-[11px] font-normal text-slate-400 font-label">• Lower Bunk</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200 mt-1">Kabir Mehta</div>
                      <div className="text-[11px] text-slate-400 font-mono">KTM 390 Adv (MH 02)</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
                      Occupied
                    </span>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex flex-wrap gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">Slot #02</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">Locker #01</span>
                  </div>
                </div>

                {/* Bed A2 (Arjun Singhania) */}
                <div className="p-4 rounded-lg bg-slate-950/80 border-2 border-amber-500/70 shadow-md shadow-amber-950/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-headline font-bold text-sm text-white">
                        Bed A2 <span className="text-[11px] font-normal text-slate-400 font-label">• Upper Bunk</span>
                      </div>
                      <div className="text-xs font-semibold text-amber-300 mt-1">Arjun Singhania</div>
                      <div className="text-[11px] text-slate-400 font-mono">RE Himalayan 450</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/50 uppercase animate-pulse">
                      {guestCheckedIn ? 'Checked-In' : 'Arriving'}
                    </span>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">Slot #04</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">Locker #07</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 font-mono">OTP Pending</span>
                  </div>
                </div>

                {/* Bed A3 (Dirty) */}
                <div className="p-4 rounded-lg bg-slate-950/80 border border-rose-500/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-headline font-bold text-sm text-white">
                        Bed A3 <span className="text-[11px] font-normal text-slate-400 font-label">• Lower Bunk</span>
                      </div>
                      <div className="text-xs text-rose-300 mt-1">Previous: Rohan D.</div>
                      <div className="text-[11px] text-slate-400 font-mono">Out at 11:30 AM</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 uppercase">
                      Needs Linen
                    </span>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950/50 text-rose-400">
                      Housekeeping Priority
                    </span>
                  </div>
                </div>

                {/* Bed B1 (Moto Reserved) */}
                <div className="p-4 rounded-lg bg-slate-950/80 border border-amber-600/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-headline font-bold text-sm text-white">
                        Bed B1 <span className="text-[11px] font-normal text-slate-400 font-label">• Upper Bunk</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-300 mt-1">Touring Group Res.</div>
                      <div className="text-[11px] text-slate-400 font-mono">ETA 18:00 IST</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-600/20 text-amber-500 border border-amber-600/40 uppercase">
                      Moto Reserved
                    </span>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      Paddock Stand Reserved
                    </span>
                  </div>
                </div>

                {/* Bed B2 (Clean Ready) */}
                <div className="p-4 rounded-lg bg-slate-950/80 border border-emerald-500/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-headline font-bold text-sm text-white">
                        Bed B2 <span className="text-[11px] font-normal text-slate-400 font-label">• Lower Bunk</span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-400 mt-1">Ready for Walk-in</div>
                      <div className="text-[11px] text-slate-400 font-mono">Inspected 12:15 PM</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 uppercase">
                      Clean Ready
                    </span>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Instant Walk-in Ready</span>
                  </div>
                </div>

                {/* Bed B3 (Inspecting) */}
                <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-700/60">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-headline font-bold text-sm text-slate-300">
                        Bed B3 <span className="text-[11px] font-normal text-slate-400 font-label">• Upper Bunk</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">AC Filter Cleaning</div>
                      <div className="text-[11px] text-slate-500 font-mono">Work order #402</div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                      Inspecting
                    </span>
                  </div>
                  <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Technician on-site</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Housekeeping Task Queue */}
            <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">cleaning_services</span>
                  <h3 className="font-headline text-sm font-bold text-white uppercase tracking-wider">
                    Immediate Housekeeping Task Queue
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Floor 1 & 2 Turnover</span>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs font-label">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800/80">
                      <th className="py-2.5 px-3">Bed / Unit</th>
                      <th className="py-2.5 px-3">Guest Out</th>
                      <th className="py-2.5 px-3">Priority</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Assigned Staff</th>
                      <th className="py-2.5 px-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-body">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-headline font-bold text-white">{task.bed}</td>
                        <td className="py-3 px-3 text-slate-300">
                          {task.guest} <span className="text-[10px] text-slate-500 font-mono">({task.time})</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              task.priority === 'High' || task.priority === 'Rush'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              task.status === 'Dirty'
                                ? 'bg-rose-950/60 text-rose-400 border border-rose-800'
                                : task.status === 'Cleaning'
                                ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                                : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{task.staff}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleAdvanceStatus(task.id)}
                            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-semibold text-[11px] transition-all"
                          >
                            Advance Status →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Guest Arrival Verification Panel */}
            <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-xl">bolt</span>
                  <h3 className="font-headline text-sm font-bold text-white uppercase tracking-wider">
                    Quick Guest Arrival Verification
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Gate ANPR Match
                </span>
              </div>

              {/* Guest Profile */}
              <div className="mt-4 p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 font-label">
                      Guest Profile
                    </span>
                    <h4 className="font-headline text-base font-bold text-white">Arjun Singhania</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono">Booking ID</span>
                    <div className="text-xs font-bold text-slate-200 font-mono">#HY-ANJ-9482</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Vehicle Detected</span>
                    <div className="font-medium text-slate-200 truncate">RE Himalayan 450</div>
                    <div className="text-[10px] text-amber-400 font-mono">Kamet White • MH 12 QX 4040</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Stay & Assignment</span>
                    <div className="font-medium text-slate-200">3 Nights Stay</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Bunk #101-A2 (Upper)</div>
                  </div>
                </div>
              </div>

              {/* OTP Input Section */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-label mb-2 flex items-center justify-between">
                  <span>Secure 6-Digit Guest OTP</span>
                  <span className="text-[10px] text-amber-400 font-mono font-normal">SMS sent to +91 98230•••40</span>
                </label>

                <div className="grid grid-cols-6 gap-2">
                  {['8', '4', '9', '2', '1', '0'].map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      defaultValue={digit}
                      className="h-11 text-center font-headline text-lg font-bold bg-slate-950 border border-amber-500/70 text-amber-400 rounded-lg focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  className="mt-3.5 w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-headline font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <span className="material-symbols-outlined text-base font-bold">verified</span>
                  <span>{guestCheckedIn ? '✓ Verified & Checked-In' : 'Verify OTP & Issue Room PIN'}</span>
                </button>
              </div>

              {/* Live Issued Access Box */}
              <div className="mt-4 p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Room & Locker Digital Keycode
                    </span>
                    <div className="font-mono text-2xl font-black text-amber-400 tracking-widest mt-0.5">
                      {accessCode}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => alert(`Copied Keycode ${accessCode}`)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Copy PIN"
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>
                    <button
                      onClick={() => alert(`Sent Keycode ${accessCode} via WhatsApp to +91 9823048291`)}
                      className="p-1.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800"
                      title="Send WhatsApp"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Gate Boom Barrier</span>
                  <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span> ANPR Auto-Clear Active
                  </span>
                </div>

                <button
                  onClick={handleRevokeCode}
                  className="w-full mt-1 py-1.5 rounded border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-[11px] font-label font-semibold transition-all"
                >
                  {codeRevoked ? 'Regenerating new cipher PIN...' : 'Revoke / Regenerate Keycode'}
                </button>
              </div>
            </section>

            {/* Moto Bay & Gear Locker Widget */}
            <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">garage_home</span>
                  <h3 className="font-headline text-sm font-bold text-white uppercase tracking-wider">
                    Moto Bay & Gear Vault
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-amber-400">6 Bays Monitored</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/30">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Bay 01</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate">Tiger 900</div>
                  <div className="text-[9px] text-slate-500 font-mono">KA 04 MP</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/30">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Bay 02</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate">KTM 390</div>
                  <div className="text-[9px] text-slate-500 font-mono">DL 03 AP</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Bay 03</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">Available</div>
                  <div className="text-[9px] text-slate-500 font-mono">Ready</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/50">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Bay 04</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                  </div>
                  <div className="text-xs font-bold text-amber-300 mt-1 truncate">Himalayan</div>
                  <div className="text-[9px] text-amber-400 font-mono">MH 12 QX</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/30">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Bay 05</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate">Interceptor</div>
                  <div className="text-[9px] text-slate-500 font-mono">GA 01 R</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Bay 06</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">Available</div>
                  <div className="text-[9px] text-slate-500 font-mono">Ready</div>
                </div>
              </div>

              {/* High-Pressure Wash Bay status */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">cleaning_services</span>
                  <div>
                    <div className="font-semibold text-slate-200">High-Pressure Wash Bay</div>
                    <div className="text-[10px] text-slate-400">120 PSI Foam Gun Active</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">
                  RUNNING
                </span>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Docked Bottom Bar for Day Close */}
      <footer className="sticky bottom-0 z-40 bg-slate-950/95 border-t border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>Shift Front Desk 01</span>
          <span>•</span>
          <span>Manager: Vikram S.</span>
          <span>•</span>
          <span className="text-slate-200">Shift Cash: ₹14,250</span>
          <span>•</span>
          <span className="text-emerald-400">Active Keycards: 28</span>
        </div>

        <div className="flex items-center gap-3">
          {dayCloseDone && (
            <span className="text-xs text-emerald-400 font-mono font-bold">
              ✓ Day-close processed & audit logs sealed!
            </span>
          )}
          <button
            onClick={handleDayClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-headline font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span>Audit Shift & Initiate Day Close</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
