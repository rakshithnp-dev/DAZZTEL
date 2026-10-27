'use client';

import React, { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = () => {
    setLoading(true);
    fetch('/api/v1/analytics/overview')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        }
      })
      .catch((err) => console.error('Failed to load admin analytics', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading && !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">
        Loading Platform Governance Console...
      </div>
    );
  }

  const { metrics, recentBookings, properties } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
            Enterprise Governance
          </span>
          <h1 className="text-3xl font-black text-white">Platform Administration & Analytics</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time multi-property occupancy, GST revenue reconciliation, and inventory rules.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold rounded-lg border border-gray-700 transition"
        >
          ⟳ Refresh Data
        </button>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Gross Booking Value</span>
          <div className="text-2xl font-black text-emerald-400 mt-2">₹{metrics?.grossRevenueINR}</div>
          <span className="text-[10px] text-gray-500 mt-1 block">Authoritative payments captured</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Net Revenue</span>
          <div className="text-2xl font-black text-white mt-2">₹{metrics?.netRevenueINR}</div>
          <span className="text-[10px] text-gray-500 mt-1 block">Net recognized after refunds</span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Bed Occupancy</span>
          <div className="text-2xl font-black text-purple-400 mt-2">{metrics?.occupancyRatePercent}%</div>
          <span className="text-[10px] text-gray-500 mt-1 block">
            {metrics?.occupiedBedsCount} of {metrics?.totalBedsCount} beds allocated today
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Confirmed Stays</span>
          <div className="text-2xl font-black text-blue-400 mt-2">{metrics?.confirmedBookings}</div>
          <span className="text-[10px] text-gray-500 mt-1 block">
            {metrics?.cancelledBookings} cancelled / refunded
          </span>
        </div>
      </div>

      {/* Properties & Inventory Segment Rules */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Active Properties & Motorcycle Segment Rules</h2>
          <span className="text-xs bg-purple-950 text-purple-400 border border-purple-800 px-2.5 py-1 rounded-full font-bold">
            Multi-Property Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties?.map((prop: any) => (
            <div key={prop.id} className="bg-gray-950 border border-gray-800 p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-white text-base">{prop.name}</h3>
                  <span className="text-xs font-mono text-purple-400">Code: {prop.code}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                  {prop.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 pt-2 border-t border-gray-800/80">
                <div>
                  <span className="text-gray-500 block text-[10px]">Location:</span>
                  <span>{prop.city}, {prop.state}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">GSTIN Number:</span>
                  <span className="font-mono text-gray-300">{prop.gstin || '30AAAAA0000A1Z5'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Motorcycle Bed Ratio:</span>
                  <span className="font-bold text-orange-400">50% Reserved Beds</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Auto-Release Cutoff:</span>
                  <span className="font-bold text-gray-200">24h Prior to Check-in</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Bookings Ledger */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white">Master Reservations Ledger</h2>
        {recentBookings?.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No reservations recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[10px] uppercase text-gray-400 bg-gray-950/80 border-b border-gray-800">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Guest Name</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Stay Dates</th>
                  <th className="p-3">Nights</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {recentBookings?.map((b: any) => (
                  <tr key={b.id} className="hover:bg-gray-800/40">
                    <td className="p-3 font-mono font-bold text-purple-400">{b.bookingReference}</td>
                    <td className="p-3 font-semibold text-white">{b.primaryGuest?.fullName || 'Guest'}</td>
                    <td className="p-3 text-gray-400">{b.property?.code}</td>
                    <td className="p-3 text-gray-300">
                      {new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-mono">{b.totalNights}</td>
                    <td className="p-3 font-bold text-emerald-400">
                      ₹{(b.totalGrandAmountPaise / 100).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold text-[10px]">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 text-[10px]">
                      {new Date(b.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
