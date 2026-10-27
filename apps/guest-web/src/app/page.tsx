'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Property {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  description: string;
  setting?: {
    motorcycleBedPercent: number;
  };
}

interface BedAvailability {
  bedId: string;
  bedNumber: string;
  roomNumber: string;
  roomType: string;
  segment: 'STANDARD' | 'MOTORCYCLE_RESERVED';
  pricePerNightPaise: number;
  totalStayPricePaise: number;
}

export default function GuestDiscoveryPage() {
  const router = useRouter();

  // Search parameters
  const [property, setProperty] = useState<Property | null>(null);
  const [checkInDate, setCheckInDate] = useState('2026-11-10');
  const [checkOutDate, setCheckOutDate] = useState('2026-11-13');
  const [guestCount, setGuestCount] = useState(1);
  const [motorcycleStay, setMotorcycleStay] = useState(true);
  const [needsParking, setNeedsParking] = useState(true);
  const [needsLocker, setNeedsLocker] = useState(true);

  // Search results
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial property
  useEffect(() => {
    fetch('/api/v1/properties')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) {
          setProperty(json.data[0]);
        }
      })
      .catch((err) => console.error('Failed to load properties', err));
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!property) return;

    setLoading(true);
    setError(null);
    setSelectedBeds([]);

    try {
      const url = `/api/v1/availability/search?propertyId=${property.id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guestCount=${guestCount}&motorcycleStay=${motorcycleStay}&needsParking=${needsParking}&needsLocker=${needsLocker}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to search availability');
      }

      setSearchResult(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Run initial search once property is loaded
  useEffect(() => {
    if (property) {
      handleSearch();
    }
  }, [property]);

  const toggleBedSelection = (bedId: string) => {
    if (selectedBeds.includes(bedId)) {
      setSelectedBeds(selectedBeds.filter((id) => id !== bedId));
    } else {
      if (selectedBeds.length < guestCount) {
        setSelectedBeds([...selectedBeds, bedId]);
      } else {
        setSelectedBeds([bedId]);
      }
    }
  };

  const proceedToCheckout = async () => {
    if (selectedBeds.length === 0) {
      alert('Please select at least one available bed to proceed.');
      return;
    }

    try {
      setLoading(true);
      // Create 10-minute hold on backend
      const res = await fetch('/api/v1/bookings/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property!.id,
          bedIds: selectedBeds,
          checkInDate,
          checkOutDate,
          needsParking,
          needsLocker,
          motorcycleStay,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to create inventory hold');
      }

      // Save hold details and navigate to 5-screen checkout
      sessionStorage.setItem('currentHold', JSON.stringify(json.data));
      router.push(`/checkout?holdId=${json.data.holdId}`);
    } catch (err: any) {
      alert(`Booking conflict: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          Hostel Stays Built for <span className="text-brand-500">Nomads</span> &{' '}
          <span className="text-moto-500">Motorcyclists</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          50% beds motorcycle-ready. Secure gated bike parking, ventilated riding gear lockers,
          instant arrival OTP, and 100% verified upfront GST pricing.
        </p>
      </section>

      {/* Availability Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-10">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Destination Property
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-semibold text-white">
              {property ? property.name : 'Loading property...'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Guests</label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
            >
              <option value={1}>1 Guest (1 Bed)</option>
              <option value={2}>2 Guests (2 Beds)</option>
              <option value={4}>4 Guests (Group Dorm)</option>
            </select>
          </div>

          {/* Motorcyclist & Add-on Preferences */}
          <div className="md:col-span-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={motorcycleStay}
                  onChange={(e) => setMotorcycleStay(e.target.checked)}
                  className="rounded border-slate-700 text-moto-500 focus:ring-moto-500 bg-slate-950"
                />
                <span className="text-sm font-semibold text-moto-500">
                  🏍️ I am touring on a motorcycle (Unlock 50% reserved beds)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needsParking}
                  onChange={(e) => setNeedsParking(e.target.checked)}
                  className="rounded border-slate-700 text-brand-500 focus:ring-brand-500 bg-slate-950"
                />
                <span className="text-sm text-slate-300">
                  Gated Bike Parking (+₹100/night)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needsLocker}
                  onChange={(e) => setNeedsLocker(e.target.checked)}
                  className="rounded border-slate-700 text-brand-500 focus:ring-brand-500 bg-slate-950"
                />
                <span className="text-sm text-slate-300">
                  Riding Gear Locker (+₹50/night)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 font-bold text-white rounded-lg transition shadow-lg shadow-brand-900/30 text-sm"
            >
              {loading ? 'Searching...' : 'Search Available Beds'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Search Results Grid */}
      {searchResult && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div>
              <h2 className="text-lg font-bold text-white">
                Available Beds for {searchResult.totalNights} Nights
              </h2>
              <p className="text-xs text-slate-400">
                {searchResult.availableBedsCount} beds available (
                <span className="text-moto-500 font-semibold">
                  {searchResult.motorcycleBedsAvailable} reserved for motorcyclists
                </span>
                ) • {searchResult.parkingSpacesAvailable} parking slots •{' '}
                {searchResult.gearLockersAvailable} gear lockers
              </p>
            </div>

            {selectedBeds.length > 0 && (
              <button
                onClick={proceedToCheckout}
                disabled={loading}
                className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black rounded-xl transition shadow-lg shadow-brand-500/20 text-sm flex items-center justify-center gap-2"
              >
                Proceed to Checkout ({selectedBeds.length} bed selected) →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {searchResult.availableBeds.map((bed: BedAvailability) => {
              const isSelected = selectedBeds.includes(bed.bedId);
              const isMoto = bed.segment === 'MOTORCYCLE_RESERVED';

              return (
                <div
                  key={bed.bedId}
                  onClick={() => toggleBedSelection(bed.bedId)}
                  className={`border rounded-2xl p-5 cursor-pointer transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-500 bg-brand-950/20 shadow-lg shadow-brand-950/40 ring-2 ring-brand-500'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  {isMoto && (
                    <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider font-extrabold bg-moto-500/20 text-moto-500 border border-moto-500/30 px-2 py-0.5 rounded-full">
                      🏍️ Moto Bed
                    </span>
                  )}

                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {bed.roomNumber} ({bed.roomType.replace('_', ' ')})
                    </div>
                    <div className="text-xl font-black text-white mt-1">
                      Bed {bed.bedNumber}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Includes locker access, clean linens, reading light, personal plug point.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-white">
                        ₹{(bed.totalStayPricePaise / 100).toFixed(0)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ₹{(bed.pricePerNightPaise / 100).toFixed(0)}/night + GST
                      </div>
                    </div>

                    <div
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                        isSelected
                          ? 'bg-brand-500 text-slate-950 border-brand-500'
                          : 'border-slate-700 text-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Select Bed'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
