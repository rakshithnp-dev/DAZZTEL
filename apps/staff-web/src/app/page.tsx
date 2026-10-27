'use client';

import React, { useState, useEffect } from 'react';

export default function StaffPmsDashboard() {
  const [propertyId, setPropertyId] = useState<string>('');
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'rooms' | 'arrivals' | 'housekeeping' | 'dayclose'>('rooms');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Load properties first
  useEffect(() => {
    fetch('/api/v1/properties')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) {
          setPropertyId(json.data[0].id);
        }
      })
      .catch((err) => console.error('Failed to load property', err));
  }, []);

  // Load PMS dashboard whenever propertyId changes
  const fetchDashboard = () => {
    if (!propertyId) return;
    setLoading(true);
    fetch(`/api/v1/pms/dashboard?propertyId=${propertyId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDashboard(json.data);
        }
      })
      .catch((err) => console.error('Failed to load PMS dashboard', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, [propertyId]);

  // Check In guest
  const handleCheckIn = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/v1/pms/check-in/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Check-in failed');

      setActionMessage(`✓ Guest checked in! Issued Access Code: ${json.data.accessCode}`);
      fetchDashboard();
    } catch (err: any) {
      alert(`Error during check-in: ${err.message}`);
    }
  };

  // Check Out guest
  const handleCheckOut = async (bookingId: string) => {
    if (!confirm('Confirm guest checkout? Room access codes will be revoked immediately.')) return;
    try {
      const res = await fetch(`/api/v1/pms/check-out/${bookingId}`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Check-out failed');

      setActionMessage('✓ Checkout completed! Room access codes revoked; housekeeping task created.');
      fetchDashboard();
    } catch (err: any) {
      alert(`Error during checkout: ${err.message}`);
    }
  };

  // Update Housekeeping Task
  const updateHousekeeping = async (taskId: string, status: string) => {
    try {
      const res = await fetch(`/api/v1/pms/housekeeping/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Update failed');

      setActionMessage(`✓ Housekeeping task updated to ${status}`);
      fetchDashboard();
    } catch (err: any) {
      alert(`Error updating task: ${err.message}`);
    }
  };

  // Perform Day Close
  const handleDayClose = async () => {
    if (!confirm('Execute Day Close? This locks today revenue snapshot into immutable ledger.')) return;
    try {
      const res = await fetch('/api/v1/pms/day-close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          managerUserId: 'manager-user-001',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error?.message || 'Day close failed');

      alert(`✓ Day Close Successful! Revenue of ₹${(json.data.totalRevenuePaise / 100).toFixed(2)} locked.`);
      fetchDashboard();
    } catch (err: any) {
      alert(`Day close error: ${err.message}`);
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading Front-Desk PMS Terminal...
      </div>
    );
  }

  const { stats, rooms, arrivalsToday, housekeepingTasks } = dashboard || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Property & Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
            Operating Property
          </span>
          <h1 className="text-2xl font-black text-white">{dashboard?.property.name}</h1>
          <p className="text-xs text-slate-400">
            Code: {dashboard?.property.code} • Location: {dashboard?.property.city}
          </p>
        </div>

        {/* Operational Quick Stats */}
        <div className="flex flex-wrap gap-4 text-center">
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Occupancy</span>
            <span className="text-xl font-black text-blue-400">{stats?.occupancyRatePercent}%</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Available Beds</span>
            <span className="text-xl font-black text-emerald-400">{stats?.availableBeds}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Occupied Beds</span>
            <span className="text-xl font-black text-white">{stats?.occupiedBeds}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Arrivals Today</span>
            <span className="text-xl font-black text-amber-400">{stats?.arrivalsTodayCount}</span>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs flex justify-between items-center">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-5 py-3 text-xs font-bold transition border-b-2 ${
            activeTab === 'rooms'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🛏️ Live Room & Bed Map ({stats?.totalBeds} Beds)
        </button>
        <button
          onClick={() => setActiveTab('arrivals')}
          className={`px-5 py-3 text-xs font-bold transition border-b-2 ${
            activeTab === 'arrivals'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🚶 Arrivals Today ({arrivalsToday?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('housekeeping')}
          className={`px-5 py-3 text-xs font-bold transition border-b-2 ${
            activeTab === 'housekeeping'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🧹 Housekeeping Queue ({housekeepingTasks?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('dayclose')}
          className={`px-5 py-3 text-xs font-bold transition border-b-2 ${
            activeTab === 'dayclose'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🔒 Day Close & Folios
        </button>
      </div>

      {/* TAB 1: LIVE ROOM & BED MAP */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-white">Legend:</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500"></span> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-600"></span> Occupied (Checked-in)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500"></span> 10m Hold</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-500"></span> Cleaning Required</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border border-moto-500 bg-moto-500/20 text-moto-500 px-1 font-bold">🏍️</span> Moto Bed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms?.map((room: any) => (
              <div key={room.roomId} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">{room.roomNumber}</h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {room.roomType.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    ₹{(room.basePricePaise / 100).toFixed(0)}/night
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {room.beds.map((bed: any) => {
                    const isOccupied = bed.status === 'OCCUPIED';
                    const isHold = bed.status === 'HOLD';
                    const isCleaning = bed.status === 'CLEANING_REQUIRED';
                    const isMoto = bed.segment === 'MOTORCYCLE_RESERVED';

                    return (
                      <div
                        key={bed.bedId}
                        className={`p-3 rounded-xl border text-xs flex flex-col justify-between min-h-[90px] ${
                          isOccupied
                            ? 'bg-blue-950/40 border-blue-500/50'
                            : isHold
                            ? 'bg-amber-950/40 border-amber-500/50'
                            : isCleaning
                            ? 'bg-purple-950/40 border-purple-500/50'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-white">Bed {bed.bedNumber}</span>
                          {isMoto && <span className="text-[10px] text-moto-500 font-extrabold">🏍️</span>}
                        </div>

                        {isOccupied && (
                          <div className="mt-1">
                            <span className="text-blue-300 font-semibold block truncate">{bed.guestName}</span>
                            {bed.accessCode && (
                              <span className="text-[10px] font-mono text-emerald-400 block">
                                Code: {bed.accessCode}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between items-center">
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                              isOccupied
                                ? 'bg-blue-500 text-white'
                                : isHold
                                ? 'bg-amber-500 text-slate-950'
                                : isCleaning
                                ? 'bg-purple-500 text-white'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {bed.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ARRIVALS TODAY */}
      {activeTab === 'arrivals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white">Expected Arrivals for Today</h2>
          {arrivalsToday?.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">No more pending arrivals for today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[10px] uppercase text-slate-400 bg-slate-950/60 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Guest Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Front-Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {arrivalsToday?.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-white">{booking.bookingReference}</td>
                      <td className="p-3 font-semibold text-white">{booking.primaryGuest?.fullName}</td>
                      <td className="p-3 text-slate-400">{booking.primaryGuest?.phone}</td>
                      <td className="p-3 font-bold text-emerald-400">
                        ₹{(booking.totalGrandAmountPaise / 100).toFixed(2)}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-700 font-bold text-[10px]">
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleCheckIn(booking.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded text-xs transition"
                        >
                          Check In & Issue Code
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HOUSEKEEPING QUEUE */}
      {activeTab === 'housekeeping' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white">Housekeeping Operations Queue</h2>
          {housekeepingTasks?.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">All rooms and beds are inspected and cleaned!</p>
          ) : (
            <div className="space-y-3">
              {housekeepingTasks?.map((task: any) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs"
                >
                  <div>
                    <span className="font-extrabold text-white text-sm">
                      {task.bed ? `${task.bed.room.roomNumber} - Bed ${task.bed.bedNumber}` : 'General Property Clean'}
                    </span>
                    <p className="text-slate-400 text-xs mt-0.5">{task.notes || 'Standard turnover cleaning'}</p>
                    <span className="text-[10px] text-slate-500">Priority: {task.priority === 1 ? 'High (Checkout)' : 'Normal'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 font-bold">
                      {task.status}
                    </span>
                    {task.status !== 'CLEANED' && task.status !== 'INSPECTED' && (
                      <button
                        onClick={() => updateHousekeeping(task.id, 'CLEANED')}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded"
                      >
                        Mark Cleaned
                      </button>
                    )}
                    {task.status === 'CLEANED' && (
                      <button
                        onClick={() => updateHousekeeping(task.id, 'INSPECTED')}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded"
                      >
                        Approve & Inspect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DAY CLOSE & FOLIOS */}
      {activeTab === 'dayclose' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">PMS Day Close Processing</h2>
            <p className="text-xs text-slate-400 mt-1">
              Closing the business day aggregates all folio transactions, reconciles collected payments, and locks the daily revenue into an immutable audit snapshot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-950 p-5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block">Total In-House Stays:</span>
              <span className="text-lg font-bold text-white">{stats?.inHouseGuestsCount} Guests</span>
            </div>
            <div>
              <span className="text-slate-400 block">Arrivals Reconciled:</span>
              <span className="text-lg font-bold text-white">{stats?.arrivalsTodayCount} Stays</span>
            </div>
            <div>
              <span className="text-slate-400 block">Departures Processed:</span>
              <span className="text-lg font-bold text-white">{stats?.departuresTodayCount} Stays</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleDayClose}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-500 font-black text-white rounded-lg text-sm transition shadow-lg shadow-red-900/30"
            >
              🔒 Execute Day Close & Lock Daily Revenue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
