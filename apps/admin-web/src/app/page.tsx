'use client';

import React, { useState } from 'react';

interface AdminUser {
  name: string;
  email: string;
  role: 'PLATFORM_ADMIN';
}

interface PurchaseOrder {
  id: string;
  vendor: string;
  category: string;
  items: string;
  amount: number;
  status: 'Pending' | 'Dispatched' | 'Delivered';
  date: string;
}

interface LedgerRecord {
  ref: string;
  guest: string;
  bike: string;
  hub: string;
  room: string;
  dates: string;
  invoice: string;
  total: number;
  payment: string;
  access: string;
  status: 'Confirmed' | 'Checked-In' | 'Departed';
}

export default function AdminExecutiveDashboard() {
  // Admin Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>({
    name: 'Siddharth Varma',
    email: 'admin@hotelyo.com',
    role: 'PLATFORM_ADMIN',
  });

  const [loginEmail, setLoginEmail] = useState('admin@hotelyo.com');
  const [loginPassword, setLoginPassword] = useState('admin123');

  // Property Selector
  const [selectedHub, setSelectedHub] = useState('Goa Vagator Hub');
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'allocation' | 'pricing' | 'vendors' | 'ledger' | 'audit'>('overview');

  // Policy Engine State
  const [allocationPct, setAllocationPct] = useState(50);
  const [autoReleaseEnabled, setAutoReleaseEnabled] = useState(true);
  const [statusNotification, setStatusNotification] = useState('');

  // Dynamic Pricing State (Phase 1b)
  const [weekendSurge, setWeekendSurge] = useState(20);
  const [monsoonDiscount, setMonsoonDiscount] = useState(15);
  const [festivalPeakSurge, setFestivalPeakSurge] = useState(35);

  // Vendor Management State (Phase 1b)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'PO-2026-091',
      vendor: 'Goa Cleaners & Laundry Services',
      category: 'Linen & Duvet Laundering',
      items: '150x Pod Linen Sets + 80x Microfiber Towels',
      amount: 14500,
      status: 'Delivered',
      date: '26 Oct 2026',
    },
    {
      id: 'PO-2026-092',
      vendor: 'Anjuna Organic Bakery Provisions',
      category: 'Cafe Breakfast Inventory',
      items: '50kg Sourdough Bread + Organic Eggs + Arabica Beans',
      amount: 18200,
      status: 'Dispatched',
      date: '27 Oct 2026',
    },
    {
      id: 'PO-2026-093',
      vendor: 'Motul & Castrol Fluid Supplier',
      category: 'Workshop Maintenance Fluids',
      items: '24x Chain Lube (400ml) + 12x Brake Cleaners + 10W50 Oil',
      amount: 22400,
      status: 'Pending',
      date: '28 Oct 2026',
    },
  ]);
  const [newPoVendor, setNewPoVendor] = useState('Motul & Castrol Fluid Supplier');
  const [newPoItems, setNewPoItems] = useState('');
  const [newPoAmount, setNewPoAmount] = useState('');

  // Search & Filter State
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Calculations based on hub capacity
  const hubCapacities: Record<string, number> = {
    'Goa Vagator Hub': 48,
    'Manali Old Village Hub': 36,
    'Leh Fort Road Hub': 28,
  };
  const totalBeds = hubCapacities[selectedHub] || 48;
  const lockedBeds = Math.round(totalBeds * (allocationPct / 100));
  const generalBeds = totalBeds - lockedBeds;

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(''), 4000);
  };

  const ledgerRecords: LedgerRecord[] = [
    {
      ref: '#HY-GOA-9482',
      guest: 'Arjun Singhania',
      bike: 'RE Himalayan 450 (MH 12 QX 4040)',
      hub: 'Goa Vagator',
      room: 'Pod 101-A2',
      dates: '14-17 Nov 2026',
      invoice: 'INV-2026-8841',
      total: 3469,
      payment: 'Settled UPI (GPay)',
      access: '8492#',
      status: 'Confirmed',
    },
    {
      ref: '#HY-LEH-1049',
      guest: 'Vikram Rathore',
      bike: 'KTM 390 Adv (DL 03 AP 9921)',
      hub: 'Leh Fort Road',
      room: 'Pod 204-B1',
      dates: '15-18 Nov 2026',
      invoice: 'INV-2026-8842',
      total: 4120,
      payment: 'Settled Axis Card',
      access: '3910#',
      status: 'Confirmed',
    },
    {
      ref: '#HY-GOA-9410',
      guest: 'Ananya Sen',
      bike: 'BMW G310GS (KA 01 MR 7812)',
      hub: 'Goa Vagator',
      room: 'Suite 102-A',
      dates: '14-16 Nov 2026',
      invoice: 'INV-2026-8843',
      total: 5850,
      payment: 'Settled PhonePe',
      access: '1104#',
      status: 'Checked-In',
    },
    {
      ref: '#HY-MAN-3081',
      guest: 'Kabir Mehta',
      bike: 'KTM 390 Adv (HP 01 BB 2049)',
      hub: 'Manali Old Village',
      room: 'Pod 301-C2',
      dates: '16-19 Nov 2026',
      invoice: 'INV-2026-8844',
      total: 3790,
      payment: 'Settled UPI',
      access: '5821#',
      status: 'Confirmed',
    },
  ];

  const handleExportCsv = () => {
    const headers = 'Reference,Guest Name,Vehicle,Hub,Room,Dates,Invoice,Amount INR,Payment Status,Door PIN,State\n';
    const rows = ledgerRecords
      .map(
        (r) =>
          `"${r.ref}","${r.guest}","${r.bike}","${r.hub}","${r.room}","${r.dates}","${r.invoice}",${r.total},"${r.payment}","${r.access}","${r.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HOTELYO_Master_Ledger_Export.csv';
    link.click();
    showNotification('Exported master institutional ledger CSV (HSN 9963 compliant).');
  };

  const handleCreatePo = () => {
    if (!newPoItems || !newPoAmount) return;
    setPurchaseOrders((prev) => [
      {
        id: `PO-2026-0${prev.length + 94}`,
        vendor: newPoVendor,
        category: 'Operational Supplies',
        items: newPoItems,
        amount: Number(newPoAmount),
        status: 'Pending',
        date: 'Today',
      },
      ...prev,
    ]);
    setNewPoItems('');
    setNewPoAmount('');
    showNotification('Purchase order generated and routed for approval.');
  };

  const filteredLedger = ledgerRecords.filter((rec) => {
    const matchesSearch =
      rec.guest.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.ref.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.bike.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.room.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ---------------------------------------------------------------------------
  // AUTHENTICATION SCREEN IF NOT SIGNED IN
  // ---------------------------------------------------------------------------
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#f9fbfc] flex items-center justify-center p-6 text-[#131416]">
        <div className="w-full max-w-md bg-white border border-[#e8eaec] rounded-2xl p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">HQ Executive Administration</h1>
            <p className="text-xs text-[#5d5f60]">Authorized platform operations and yield governance</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#5d5f60] mb-1">Administrator email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#e8eaec] rounded-md text-xs text-[#131416] bg-[#f9fbfc]"
              />
            </div>
            <div>
              <label className="block text-[#5d5f60] mb-1">Master credentials</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[#e8eaec] rounded-md text-xs text-[#131416] bg-[#f9fbfc]"
              />
            </div>
            <button
              onClick={() =>
                setAdminUser({
                  name: 'Siddharth Varma',
                  email: loginEmail,
                  role: 'PLATFORM_ADMIN',
                })
              }
              className="w-full py-2.5 bg-[#131416] hover:bg-[#2c2d30] text-white rounded-md text-xs font-medium transition-colors"
            >
              Sign in to platform
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED FRAMED SHEET SHELL
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f9fbfc] text-[#131416] flex flex-col antialiased">
      {/* 48px Top bar on tinted ground with no rule */}
      <header className="h-12 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight">HOTELYO HQ</span>
            <span className="text-[11px] text-[#5d5f60] px-1.5 py-0.5 bg-[#ebedee] rounded">
              Platform administration
            </span>
          </div>

          {/* Property Hub Selector */}
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="px-2.5 py-1 text-xs border border-[#e8eaec] bg-white rounded-md text-[#131416]"
          >
            <option value="Goa Vagator Hub">Goa Vagator Hub (48 beds)</option>
            <option value="Manali Old Village Hub">Manali Old Village Hub (36 beds)</option>
            <option value="Leh Fort Road Hub">Leh Fort Road Hub (28 beds)</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[#5d5f60]">
            <span>{adminUser.name}</span>
            <span className="text-[#1b6c80]">{adminUser.email}</span>
          </div>
          <button
            onClick={() => setAdminUser(null)}
            className="text-xs text-[#c4242a] hover:underline"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Sheet inset from edges */}
      <div className="flex-1 p-2 pt-0">
        <div className="bg-white border border-[#e8eaec] rounded-2xl min-h-[calc(100vh-56px)] p-6 space-y-6">
          {/* Notification banner */}
          {statusNotification && (
            <div className="p-3 text-xs bg-[#dcfae5] text-[#04250e] rounded-md flex items-center justify-between">
              <span>{statusNotification}</span>
              <button onClick={() => setStatusNotification('')} className="font-medium underline ml-2">
                Dismiss
              </button>
            </div>
          )}

          {/* Underline Tabs */}
          <div className="border-b border-[#f0f1f2] flex items-center gap-6 text-xs">
            {[
              { id: 'overview', label: 'Overview and metrics' },
              { id: 'allocation', label: 'Motorcyclist bed allocation' },
              { id: 'pricing', label: 'Dynamic pricing engine' },
              { id: 'vendors', label: 'Vendor procurement' },
              { id: 'ledger', label: 'Institutional ledger' },
              { id: 'audit', label: 'Audit event stream' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#131416] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#1b6c80]'
                    : 'text-[#5d5f60] hover:text-[#131416]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE OVERVIEW METRICS                                         */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#131416]">Portfolio metrics</h2>
                  <p className="text-xs text-[#5d5f60]">Real-time operational summary for {selectedHub}</p>
                </div>

                <div className="flex gap-1 border border-[#e8eaec] rounded-md p-0.5 bg-[#f9fbfc]">
                  {(['today', '7d', '30d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        timeRange === r ? 'bg-white font-medium text-[#131416]' : 'text-[#5d5f60]'
                      }`}
                    >
                      {r === 'today' ? 'Today' : r === '7d' ? '7 days' : '30 days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-[#e8eaec] rounded-lg space-y-1">
                  <div className="text-xs text-[#5d5f60]">Occupancy rate</div>
                  <div className="text-2xl font-normal tabular-nums">88.4%</div>
                  <div className="text-[11px] text-[#1e7b4f]">+6.2% vs previous period</div>
                </div>

                <div className="p-4 border border-[#e8eaec] rounded-lg space-y-1">
                  <div className="text-xs text-[#5d5f60]">Net lodging revenue</div>
                  <div className="text-2xl font-normal tabular-nums">₹14,28,400</div>
                  <div className="text-[11px] text-[#1e7b4f]">+14.8% month on month</div>
                </div>

                <div className="p-4 border border-[#e8eaec] rounded-lg space-y-1">
                  <div className="text-xs text-[#5d5f60]">Motorcyclist bed share</div>
                  <div className="text-2xl font-normal tabular-nums">52.1%</div>
                  <div className="text-[11px] text-[#5d5f60]">Target baseline 50%</div>
                </div>

                <div className="p-4 border border-[#e8eaec] rounded-lg space-y-1">
                  <div className="text-xs text-[#5d5f60]">Average daily rate (ADR)</div>
                  <div className="text-2xl font-normal tabular-nums">₹1,120</div>
                  <div className="text-[11px] text-[#5d5f60]">Blended across bunks and suites</div>
                </div>
              </div>

              {/* Multi-Property Portfolio Overview */}
              <div className="border border-[#e8eaec] rounded-lg p-5 space-y-4">
                <div className="text-xs font-semibold text-[#131416]">Multi-hub regional distribution</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[#5d5f60] border-b border-[#f0f1f2]">
                        <th className="pb-2 font-normal">Hub property</th>
                        <th className="pb-2 font-normal">Total capacity</th>
                        <th className="pb-2 font-normal">Moto reserved</th>
                        <th className="pb-2 font-normal">Current occupancy</th>
                        <th className="pb-2 font-normal text-right">30-day net billing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f1f2]">
                      <tr>
                        <td className="py-3 font-medium">Goa Vagator Hub</td>
                        <td className="py-3 tabular-nums">48 beds</td>
                        <td className="py-3 tabular-nums">24 beds (50%)</td>
                        <td className="py-3 tabular-nums text-[#1e7b4f]">88.4%</td>
                        <td className="py-3 tabular-nums text-right font-medium">₹14,28,400</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Manali Old Village Hub</td>
                        <td className="py-3 tabular-nums">36 beds</td>
                        <td className="py-3 tabular-nums">18 beds (50%)</td>
                        <td className="py-3 tabular-nums text-[#1e7b4f]">79.2%</td>
                        <td className="py-3 tabular-nums text-right font-medium">₹9,84,200</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium">Leh Fort Road Hub</td>
                        <td className="py-3 tabular-nums">28 beds</td>
                        <td className="py-3 tabular-nums">14 beds (50%)</td>
                        <td className="py-3 tabular-nums text-[#1e7b4f]">92.0%</td>
                        <td className="py-3 tabular-nums text-right font-medium">₹11,40,500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MOTORCYCLIST INVENTORY ALLOCATION POLICY                           */}
          {/* ========================================================================= */}
          {activeTab === 'allocation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#131416]">Motorcyclist inventory allocation</h2>
                  <p className="text-xs text-[#5d5f60]">Configure reserved bed share and automated 24-hour release rules</p>
                </div>
                <button
                  onClick={() => showNotification(`Policy saved: ${allocationPct}% locked for touring motorcyclists.`)}
                  className="px-4 py-2 bg-[#131416] hover:bg-[#2c2d30] text-white rounded-md text-xs font-medium transition-colors"
                >
                  Save policy configuration
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-[#e8eaec] rounded-lg space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#5d5f60]">Motorcyclist reserved quota</span>
                    <span className="text-base font-semibold tabular-nums text-[#1b6c80]">{allocationPct}%</span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={allocationPct}
                    onChange={(e) => setAllocationPct(Number(e.target.value))}
                    className="w-full accent-[#1b6c80]"
                  />

                  <div className="flex justify-between text-[11px] text-[#5d5f60]">
                    <span>10% min</span>
                    <span>Default: 50%</span>
                    <span>90% max</span>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center justify-between p-3 border border-[#e8eaec] rounded-md bg-[#f9fbfc] cursor-pointer">
                      <div className="text-xs">
                        <span className="font-medium text-[#131416]">24-hour auto-release fallback</span>
                        <p className="text-[#5d5f60]">Release unsold motorcycle inventory to general guests 24h before check-in</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoReleaseEnabled}
                        onChange={(e) => setAutoReleaseEnabled(e.target.checked)}
                        className="h-4 w-4 text-[#1b6c80] rounded"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-5 border border-[#e8eaec] rounded-lg bg-[#f9fbfc] space-y-4">
                  <div className="text-xs font-semibold text-[#131416]">
                    Inventory partition for {selectedHub} ({totalBeds} total beds)
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-[#e8eaec] rounded-md space-y-1">
                      <div className="text-xs text-[#5d5f60]">Moto reserved beds</div>
                      <div className="text-2xl font-normal tabular-nums text-[#1b6c80]">{lockedBeds} beds</div>
                      <div className="text-[11px] text-[#5d5f60]">{allocationPct}% of total capacity</div>
                    </div>

                    <div className="p-4 bg-white border border-[#e8eaec] rounded-md space-y-1">
                      <div className="text-xs text-[#5d5f60]">General public beds</div>
                      <div className="text-2xl font-normal tabular-nums">{generalBeds} beds</div>
                      <div className="text-[11px] text-[#5d5f60]">{100 - allocationPct}% of total capacity</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#5d5f60]">
                    Beds assigned to motorcyclists include access to secure parking bay and helmet drying lockers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DYNAMIC PRICING ENGINE (PHASE 1B)                                  */}
          {/* ========================================================================= */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#131416]">Dynamic pricing engine</h2>
                  <p className="text-xs text-[#5d5f60]">Seasonal, weekend, and festival multipliers (Phase 1b)</p>
                </div>
                <button
                  onClick={() => showNotification('Dynamic pricing rules updated across all property channels.')}
                  className="px-4 py-2 bg-[#131416] hover:bg-[#2c2d30] text-white rounded-md text-xs font-medium transition-colors"
                >
                  Save pricing multipliers
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-[#e8eaec] rounded-lg space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium">Weekend surcharge</span>
                    <span className="tabular-nums font-semibold text-[#1b6c80]">+{weekendSurge}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={weekendSurge}
                    onChange={(e) => setWeekendSurge(Number(e.target.value))}
                    className="w-full accent-[#1b6c80]"
                  />
                  <p className="text-[11px] text-[#5d5f60]">Applies Friday and Saturday nights automatically.</p>
                </div>

                <div className="p-4 border border-[#e8eaec] rounded-lg space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium">Monsoon touring discount</span>
                    <span className="tabular-nums font-semibold text-[#1e7b4f]">-{monsoonDiscount}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={monsoonDiscount}
                    onChange={(e) => setMonsoonDiscount(Number(e.target.value))}
                    className="w-full accent-[#1b6c80]"
                  />
                  <p className="text-[11px] text-[#5d5f60]">Incentivizes wet-weather touring from June to September.</p>
                </div>

                <div className="p-4 border border-[#e8eaec] rounded-lg space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium">Rider festival peak surge</span>
                    <span className="tabular-nums font-semibold text-[#c4242a]">+{festivalPeakSurge}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={festivalPeakSurge}
                    onChange={(e) => setFestivalPeakSurge(Number(e.target.value))}
                    className="w-full accent-[#1b6c80]"
                  />
                  <p className="text-[11px] text-[#5d5f60]">Applies during Goa moto events (Nov 15-25).</p>
                </div>
              </div>

              {/* Rate preview calculation */}
              <div className="border border-[#e8eaec] rounded-lg p-5 space-y-3 bg-[#f9fbfc]">
                <div className="text-xs font-semibold text-[#131416]">Computed rate schedule (Base Solo Pod: ₹999/night)</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white border border-[#e8eaec] rounded">
                    <div className="text-[#5d5f60]">Weekend rate</div>
                    <div className="text-lg font-medium tabular-nums">₹{Math.round(999 * (1 + weekendSurge / 100))}</div>
                    <div className="text-[11px] text-[#5d5f60]">Fri & Sat nights</div>
                  </div>
                  <div className="p-3 bg-white border border-[#e8eaec] rounded">
                    <div className="text-[#5d5f60]">Monsoon rate</div>
                    <div className="text-lg font-medium tabular-nums">₹{Math.round(999 * (1 - monsoonDiscount / 100))}</div>
                    <div className="text-[11px] text-[#5d5f60]">Rider off-season pass</div>
                  </div>
                  <div className="p-3 bg-white border border-[#e8eaec] rounded">
                    <div className="text-[#5d5f60]">Festival peak rate</div>
                    <div className="text-lg font-medium tabular-nums">₹{Math.round(999 * (1 + festivalPeakSurge / 100))}</div>
                    <div className="text-[11px] text-[#5d5f60]">Special event windows</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: VENDOR PROCUREMENT & PURCHASE ORDERS (PHASE 1B)                    */}
          {/* ========================================================================= */}
          {activeTab === 'vendors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#131416]">Vendor purchase orders</h2>
                  <p className="text-xs text-[#5d5f60]">Outsourced laundry, food commissary, and workshop supplies (Phase 1b)</p>
                </div>
              </div>

              <div className="border border-[#e8eaec] rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#5d5f60] border-b border-[#f0f1f2] bg-[#f9fbfc]">
                      <th className="p-3 font-normal">PO identifier</th>
                      <th className="p-3 font-normal">Vendor partner</th>
                      <th className="p-3 font-normal">Procurement items</th>
                      <th className="p-3 font-normal">Date</th>
                      <th className="p-3 font-normal text-right">Amount</th>
                      <th className="p-3 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f1f2]">
                    {purchaseOrders.map((po) => (
                      <tr key={po.id}>
                        <td className="p-3 tabular-nums font-medium">{po.id}</td>
                        <td className="p-3">
                          <div className="font-medium">{po.vendor}</div>
                          <div className="text-[11px] text-[#5d5f60]">{po.category}</div>
                        </td>
                        <td className="p-3 text-[#5d5f60]">{po.items}</td>
                        <td className="p-3 text-[#5d5f60]">{po.date}</td>
                        <td className="p-3 tabular-nums text-right font-medium">₹{po.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              po.status === 'Delivered'
                                ? 'bg-[#dcfae5] text-[#04250e]'
                                : po.status === 'Dispatched'
                                ? 'bg-[#fffbeb] text-[#92400e]'
                                : 'bg-[#ebedee] text-[#353736]'
                            }`}
                          >
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Create Purchase Order Form */}
              <div className="p-4 border border-[#e8eaec] rounded-lg bg-[#f9fbfc] space-y-3 text-xs">
                <div className="font-semibold text-[#131416]">Issue purchase order</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={newPoVendor}
                    onChange={(e) => setNewPoVendor(e.target.value)}
                    className="px-3 py-2 border border-[#e8eaec] rounded-md bg-white text-[#131416]"
                  >
                    <option value="Goa Cleaners & Laundry Services">Goa Cleaners & Laundry Services</option>
                    <option value="Anjuna Organic Bakery Provisions">Anjuna Organic Bakery Provisions</option>
                    <option value="Motul & Castrol Fluid Supplier">Motul & Castrol Fluid Supplier</option>
                  </select>
                  <input
                    type="text"
                    value={newPoItems}
                    onChange={(e) => setNewPoItems(e.target.value)}
                    placeholder="Items and specifications..."
                    className="px-3 py-2 border border-[#e8eaec] rounded-md bg-white text-[#131416]"
                  />
                  <input
                    type="number"
                    value={newPoAmount}
                    onChange={(e) => setNewPoAmount(e.target.value)}
                    placeholder="Amount in INR"
                    className="px-3 py-2 border border-[#e8eaec] rounded-md bg-white text-[#131416] tabular-nums"
                  />
                </div>
                <button
                  onClick={handleCreatePo}
                  className="px-4 py-2 bg-[#131416] hover:bg-[#2c2d30] text-white rounded-md font-medium transition-colors"
                >
                  Issue purchase order
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: MASTER INSTITUTIONAL LEDGER                                        */}
          {/* ========================================================================= */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-[#131416]">Master institutional ledger</h2>
                  <p className="text-xs text-[#5d5f60]">Comprehensive booking records, door access codes, and GST compliance</p>
                </div>

                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 bg-[#131416] hover:bg-[#2c2d30] text-white rounded-md text-xs font-medium transition-colors self-start sm:self-auto"
                >
                  Export CSV (HSN 9963)
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by guest name, bike plate, or booking ref..."
                  className="flex-1 px-3 py-2 border border-[#e8eaec] rounded-md text-xs text-[#131416] bg-[#f9fbfc]"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-[#e8eaec] rounded-md text-xs text-[#131416] bg-white"
                >
                  <option value="All">All statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-In">Checked-In</option>
                </select>
              </div>

              <div className="border border-[#e8eaec] rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[#5d5f60] border-b border-[#f0f1f2] bg-[#f9fbfc]">
                      <th className="p-3 font-normal">Reference</th>
                      <th className="p-3 font-normal">Guest and motorcycle</th>
                      <th className="p-3 font-normal">Hub and unit</th>
                      <th className="p-3 font-normal">Stay dates</th>
                      <th className="p-3 font-normal">Tax invoice</th>
                      <th className="p-3 font-normal text-right">Net billing</th>
                      <th className="p-3 font-normal">Door PIN</th>
                      <th className="p-3 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f1f2]">
                    {filteredLedger.map((row) => (
                      <tr key={row.ref}>
                        <td className="p-3 tabular-nums font-medium">{row.ref}</td>
                        <td className="p-3">
                          <div className="font-medium">{row.guest}</div>
                          <div className="text-[11px] text-[#5d5f60]">{row.bike}</div>
                        </td>
                        <td className="p-3">
                          <div>{row.hub}</div>
                          <div className="text-[11px] text-[#1b6c80] font-medium">{row.room}</div>
                        </td>
                        <td className="p-3 text-[#5d5f60]">{row.dates}</td>
                        <td className="p-3 tabular-nums text-[#5d5f60]">{row.invoice}</td>
                        <td className="p-3 tabular-nums text-right font-medium">₹{row.total.toLocaleString('en-IN')}</td>
                        <td className="p-3 tabular-nums font-semibold text-[#1b6c80]">{row.access}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              row.status === 'Checked-In'
                                ? 'bg-[#dcfae5] text-[#04250e]'
                                : 'bg-[#fffbeb] text-[#92400e]'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: CRYPTOGRAPHIC SHA-256 AUDIT STREAM                                 */}
          {/* ========================================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-[#131416]">Audit event stream</h2>
                <p className="text-xs text-[#5d5f60]">Cryptographically linked event records for door codes, folios, and day-close audits</p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    event: 'ACCESS_CODE_PROVISIONED',
                    actor: 'system:anpr_gate',
                    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                    details: 'Issued PIN 8492# for Pod 101-A2 (Guest: Arjun Singhania, Plate: GA 03 AB 4092)',
                    time: '14 Nov 2026 14:02:11 IST',
                  },
                  {
                    event: 'FOLIO_SETTLED_UPI',
                    actor: 'gateway:hdfc_upi',
                    hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
                    details: 'Received ₹3,469 via VPA hotelyo@okhdfcbank for Invoice INV-2026-8841',
                    time: '14 Nov 2026 13:58:44 IST',
                  },
                  {
                    event: 'POLICY_REALLOCATION',
                    actor: 'admin:siddharth',
                    hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
                    details: 'Locked 50% inventory (24 beds) for touring motorcyclists with 24h auto-release fallback',
                    time: '14 Nov 2026 11:20:05 IST',
                  },
                  {
                    event: 'DAY_CLOSE_COMMITTED',
                    actor: 'pms:duty_manager',
                    hash: 'c24b6b77ecb0147e4cb7910ff61c6b12d59187ec9ffec448c2668582f34714d2',
                    details: 'Night audit completed. Total Revenue: ₹56,772. Zero folio discrepancy.',
                    time: '14 Nov 2026 04:00:00 IST',
                  },
                ].map((ev, idx) => (
                  <div key={idx} className="p-4 border border-[#e8eaec] rounded-lg bg-[#f9fbfc] space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#1b6c80]">{ev.event}</span>
                      <span className="text-[11px] text-[#5d5f60]">{ev.time}</span>
                    </div>
                    <p className="text-[#131416] text-xs">{ev.details}</p>
                    <div className="text-[11px] text-[#5d5f60] truncate">
                      SHA-256: <span className="tabular-nums font-mono">{ev.hash}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
