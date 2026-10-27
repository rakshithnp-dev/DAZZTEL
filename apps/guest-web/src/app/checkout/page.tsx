'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const holdIdFromQuery = searchParams.get('holdId');

  // Checkout Screens: 1 (Stay Selection) -> 2 (Guest Info) -> 3 (Review & Offers) -> 4 (Payment) -> 5 (Confirmation)
  const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Hold details
  const [hold, setHold] = useState<any>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(600); // 10 minutes

  // Guest details (Screen 2)
  const [fullName, setFullName] = useState('Arjun Nambiar');
  const [email, setEmail] = useState('rider.arjun@gmail.com');
  const [phone, setPhone] = useState('+919988776655');
  const [nationality, setNationality] = useState('IN');
  const [bikeModel, setBikeModel] = useState('Royal Enfield Himalayan 450');
  const [bikeRegNumber, setBikeRegNumber] = useState('GA-03-AB-4021');

  // Coupon & Offers (Screen 3)
  const [couponCode, setCouponCode] = useState('MOTOEXPLORE10');
  const [discountPaise, setDiscountPaise] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Payment (Screen 4)
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmation result (Screen 5)
  const [confirmation, setConfirmation] = useState<any>(null);

  // Load hold on mount
  useEffect(() => {
    const cachedHold = sessionStorage.getItem('currentHold');
    if (cachedHold) {
      const parsed = JSON.parse(cachedHold);
      setHold(parsed);
      const expiresAt = new Date(parsed.expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemainingSeconds(diff);
    }
  }, []);

  // 10-minute hold countdown timer
  useEffect(() => {
    if (screen === 5) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          alert('Your 10-minute hold has expired. The beds have been released back to general availability.');
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, router]);

  const applyCoupon = () => {
    if (!couponCode) return;
    if (couponCode.toUpperCase() === 'MOTOEXPLORE10') {
      const discount = Math.round((hold.pricing.accommodationPaise * 10) / 100);
      setDiscountPaise(discount);
      setCouponApplied(true);
    } else {
      alert('Invalid or expired coupon code');
    }
  };

  const handleFinalPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdId: hold.holdId,
          guest: {
            fullName,
            email,
            phone,
            nationality,
            bikeModel,
            bikeRegNumber,
          },
          couponCode: couponApplied ? couponCode : undefined,
          paymentMethod,
          idempotencyKey: `idemp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Payment processing failed');
      }

      setConfirmation(json.data);
      setScreen(5);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!hold) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-4">No active booking hold found</h2>
        <p className="text-sm text-slate-400 mb-6">
          Please select your preferred dates and beds from our search page.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-brand-500 text-slate-950 font-bold rounded-lg text-sm"
        >
          Return to Discovery
        </Link>
      </div>
    );
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const grandTotalPaise = Math.max(0, hold.pricing.totalGrandAmountPaise - discountPaise);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 5-Screen Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span className={screen >= 1 ? 'text-brand-500 font-extrabold' : ''}>1. Stay Selection</span>
          <span className={screen >= 2 ? 'text-brand-500 font-extrabold' : ''}>2. Guest Details</span>
          <span className={screen >= 3 ? 'text-brand-500 font-extrabold' : ''}>3. Review & Offers</span>
          <span className={screen >= 4 ? 'text-brand-500 font-extrabold' : ''}>4. Payment</span>
          <span className={screen === 5 ? 'text-brand-500 font-extrabold' : ''}>5. Confirmation</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-500 h-full transition-all duration-300"
            style={{ width: `${(screen / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Hold Expiry Banner */}
      {screen < 5 && (
        <div className="mb-6 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
          <span>
            ⏳ <strong>Temporary Hold Active:</strong> Your bed is held in the database for{' '}
            <span className="font-mono font-bold text-white">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </span>
          <span className="text-[10px] text-amber-400 font-medium">Anti-Double-Booking Protection</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* SCREEN 1: STAY SELECTION SUMMARY */}
      {screen === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white">Screen 1 of 5: Review Stay Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-xs">Reference Hold:</span>
              <span className="font-mono font-bold text-white">{hold.bookingReference}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Nights & Beds:</span>
              <span className="text-white font-semibold">
                {hold.pricing.totalNights} Nights • {hold.pricing.bedCount} Bed(s)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Base Accommodation:</span>
              <span className="text-white font-semibold">₹{(hold.pricing.accommodationPaise / 100).toFixed(0)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Add-ons:</span>
              <span className="text-white font-semibold">
                Parking: ₹{(hold.pricing.parkingPaise / 100).toFixed(0)} • Locker: ₹{(hold.pricing.lockerPaise / 100).toFixed(0)}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setScreen(2)}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-lg text-sm transition"
            >
              Continue to Guest Details →
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: GUEST INFORMATION */}
      {screen === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white">Screen 2 of 5: Guest Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email (for Receipt & Access Code)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number (for 6-Digit Arrival OTP)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-moto-500 mb-1">Motorcycle Make & Model</label>
              <input
                type="text"
                value={bikeModel}
                onChange={(e) => setBikeModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-moto-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-moto-500 mb-1">Bike Registration Number</label>
              <input
                type="text"
                value={bikeRegNumber}
                onChange={(e) => setBikeRegNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-moto-500"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setScreen(1)}
              className="px-4 py-2 border border-slate-700 text-slate-300 font-semibold rounded-lg text-sm"
            >
              ← Back
            </button>
            <button
              onClick={() => setScreen(3)}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-lg text-sm transition"
            >
              Continue to Offers & Review →
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: REVIEW & OFFERS */}
      {screen === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white">Screen 3 of 5: Review & Apply Coupons</h2>

          {/* Coupon Entry */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter Coupon Code (e.g. MOTOEXPLORE10)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white uppercase focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-brand-400 font-bold rounded-lg text-sm border border-slate-700"
            >
              Apply Code
            </button>
          </div>

          {couponApplied && (
            <div className="text-xs text-brand-400 font-bold bg-brand-950/40 p-2 rounded border border-brand-500/30">
              ✓ Coupon MOTOEXPLORE10 applied: ₹{(discountPaise / 100).toFixed(0)} saved!
            </div>
          )}

          {/* Full Price Breakdown */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Accommodation Subtotal ({hold.pricing.totalNights} nights)</span>
              <span>₹{(hold.pricing.accommodationPaise / 100).toFixed(2)}</span>
            </div>
            {hold.pricing.parkingPaise > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Gated Motorcycle Parking</span>
                <span>₹{(hold.pricing.parkingPaise / 100).toFixed(2)}</span>
              </div>
            )}
            {hold.pricing.lockerPaise > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Riding Gear Locker</span>
                <span>₹{(hold.pricing.lockerPaise / 100).toFixed(2)}</span>
              </div>
            )}
            {discountPaise > 0 && (
              <div className="flex justify-between text-brand-400 font-semibold">
                <span>Coupon Discount</span>
                <span>-₹{(discountPaise / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>CGST (6%)</span>
              <span>₹{(hold.pricing.cgstPaise / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>SGST (6%)</span>
              <span>₹{(hold.pricing.sgstPaise / 100).toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between text-lg font-black text-white">
              <span>Total Payable Amount</span>
              <span className="text-brand-400">₹{(grandTotalPaise / 100).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setScreen(2)}
              className="px-4 py-2 border border-slate-700 text-slate-300 font-semibold rounded-lg text-sm"
            >
              ← Back
            </button>
            <button
              onClick={() => setScreen(4)}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-lg text-sm transition"
            >
              Proceed to Payment →
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 4: PAYMENT */}
      {screen === 4 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white">Screen 4 of 5: Payment (Indian Gateway)</h2>
          <p className="text-xs text-slate-400">
            Secure 256-bit encrypted checkout. Amount to be captured:{' '}
            <strong className="text-white">₹{(grandTotalPaise / 100).toFixed(2)}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setPaymentMethod('UPI')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                paymentMethod === 'UPI'
                  ? 'border-brand-500 bg-brand-950/20 ring-2 ring-brand-500'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="font-bold text-white text-sm">⚡ Instant UPI</div>
              <p className="text-xs text-slate-400 mt-1">Google Pay, PhonePe, Paytm, BHIM</p>
            </div>

            <div
              onClick={() => setPaymentMethod('CARD')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                paymentMethod === 'CARD'
                  ? 'border-brand-500 bg-brand-950/20 ring-2 ring-brand-500'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="font-bold text-white text-sm">💳 Credit / Debit Card</div>
              <p className="text-xs text-slate-400 mt-1">Visa, Mastercard, RuPay</p>
            </div>

            <div
              onClick={() => setPaymentMethod('NET_BANKING')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                paymentMethod === 'NET_BANKING'
                  ? 'border-brand-500 bg-brand-950/20 ring-2 ring-brand-500'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="font-bold text-white text-sm">🏦 Net Banking</div>
              <p className="text-xs text-slate-400 mt-1">All major Indian banks</p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setScreen(3)}
              className="px-4 py-2 border border-slate-700 text-slate-300 font-semibold rounded-lg text-sm"
            >
              ← Back
            </button>
            <button
              onClick={handleFinalPayment}
              disabled={loading}
              className="px-8 py-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-black rounded-xl text-base transition shadow-xl shadow-brand-500/20"
            >
              {loading ? 'Processing Payment...' : `Pay ₹${(grandTotalPaise / 100).toFixed(2)} Now`}
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 5: CONFIRMATION & RECEIPT */}
      {screen === 5 && confirmation && (
        <div className="bg-slate-900 border border-brand-500/50 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-brand-500/40">
            ✓
          </div>

          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Booking Confirmed
            </span>
            <h2 className="text-3xl font-black text-white mt-1">
              Ref: {confirmation.bookingReference}
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Receipt and pre-arrival instructions have been dispatched to{' '}
              <strong className="text-white">{confirmation.guest.email}</strong>
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-left max-w-md mx-auto space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Status:</span>
              <span className="font-bold text-brand-400">Paid ({confirmation.payment.formattedAmountINR})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Method:</span>
              <span className="font-semibold text-white">{confirmation.payment.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Folio Account:</span>
              <span className="font-mono text-xs text-slate-300">{confirmation.folioId}</span>
            </div>
          </div>

          {/* Pre-arrival Checklist */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-left max-w-md mx-auto">
            <h3 className="text-sm font-bold text-white mb-3">Pre-Arrival Checklist</h3>
            <ul className="text-xs space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">1.</span>
                <span><strong>Pre-Check-in ID Upload:</strong> Upload your government photo ID (Aadhaar / Passport) before arrival.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">2.</span>
                <span><strong>6-Digit Arrival OTP:</strong> Will be sent to your phone ({confirmation.guest.phone}) on check-in day.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 font-bold">3.</span>
                <span><strong>Room Access Code:</strong> Will be active immediately upon front-desk OTP verification.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-sm transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading checkout session...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
