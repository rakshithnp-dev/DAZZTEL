'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step state (1 to 5)
  // 1: Addons, 2: Rider details, 3: Review & 12% GST, 4: UPI payment, 5: Confirmed Voucher
  const [step, setStep] = useState(2); // Start at rider details since addons picked on home

  // Hold Timer (10 minutes countdown)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(582);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Form Fields
  const [guestName, setGuestName] = useState('Arjun Singhania');
  const [phone, setPhone] = useState('9823048291');
  const [email, setEmail] = useState('arjun.rides@nomad.in');
  const [bloodGroup, setBloodGroup] = useState('O+ve');
  const [emergencyName, setEmergencyName] = useState('Ravi Singhania (Brother)');
  const [emergencyPhone, setEmergencyPhone] = useState('9821098765');
  const [vehicleModel, setVehicleModel] = useState('Royal Enfield Himalayan 450');
  const [vehiclePlate, setVehiclePlate] = useState('MH 12 QX 4040');

  // Coupon
  const [couponCode, setCouponCode] = useState('RIDEGOA');
  const [couponApplied, setCouponApplied] = useState(true);

  // Financial calculations in INR
  const nights = 3;
  const baseDorm = 849 * nights; // 2547
  const bikeParking = 150 * nights; // 450
  const gearLocker = 100 * nights; // 300
  const subtotal = baseDorm + bikeParking + gearLocker; // 3297
  const discount = couponApplied ? 200 : 0;
  const taxable = subtotal - discount; // 3097
  const cgst = Math.round(taxable * 0.06); // ~186
  const sgst = Math.round(taxable * 0.06); // ~186
  const totalGst = cgst + sgst; // 372
  const netTotal = taxable + totalGst; // 3469

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiVerified, setUpiVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(5); // Confirmed
    }, 1500);
  };

  return (
    <div className="w-full max-w-md bg-slate-950 min-h-screen relative flex flex-col pb-24 shadow-2xl overflow-x-hidden border-x border-slate-900/60 font-body">
      {/* Top Header */}
      <header className="bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="font-headline font-bold text-sm">HOTELYO Checkout</span>
        </Link>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Step {step} of 5
        </span>
      </header>

      {/* 10-Minute Inventory Hold Timer Banner */}
      <div className="bg-amber-950/60 border-b border-amber-500/40 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center space-x-1.5">
          <span className="material-symbols-outlined text-sm text-amber-400 animate-spin">timelapse</span>
          <span className="font-medium">Inventory Hold Active:</span>
        </div>
        <span className="font-mono font-extrabold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/50">
          ⏱️ {formatTimer(timeLeftSeconds)}
        </span>
      </div>

      <main className="flex-1 p-4 space-y-4">
        {/* Step 2: Rider Profile & Emergency Details */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <h2 className="font-headline text-base font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-lg">person</span>
                Nomad Rider Profile
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Required for ANPR gate pass & room keypad access</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Mobile (+91)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option>O+ve</option>
                    <option>A+ve</option>
                    <option>B+ve</option>
                    <option>AB+ve</option>
                    <option>O-ve</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Rider Vehicle Info */}
              <div className="p-3 bg-slate-900/80 border border-amber-500/30 rounded-xl space-y-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase font-headline">
                  <span className="material-symbols-outlined text-sm">two_wheeler</span>
                  Touring Motorcycle Details
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Vehicle Model"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Registration (e.g. MH 12 QX 4040)"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-3 bg-slate-900/80 border border-rose-500/30 rounded-xl space-y-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase font-headline">
                  <span className="material-symbols-outlined text-sm">emergency_home</span>
                  Mandatory Emergency Contact
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Contact Name & Relation"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input
                    type="tel"
                    placeholder="Emergency Phone"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-headline font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20"
            >
              <span>Continue to 12% GST & Price Review</span>
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Step 3: Review & 12% GST Tax Breakdown */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-headline font-bold text-sm text-white">Itemized Stay Bill</span>
                <span className="text-[11px] font-mono text-slate-400">3 Nights (14–17 Nov)</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>6-Bed AC Mixed Dorm (Bed #04)</span>
                  <span className="font-mono">₹{baseDorm.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Secure CCTV Bike Parking (₹150 × 3)</span>
                  <span className="font-mono">₹{bikeParking}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Heated Gear Locker (₹100 × 3)</span>
                  <span className="font-mono">₹{gearLocker}</span>
                </div>
                <div className="flex justify-between text-amber-400 font-semibold pt-1 border-t border-slate-800">
                  <span>Subtotal (Taxable Value)</span>
                  <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Coupon Row */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">local_offer</span>
                  <span className="font-mono font-bold text-emerald-400">{couponCode}</span>
                  <span className="text-[10px] text-slate-400">Applied</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">-₹{discount}</span>
              </div>

              {/* GST 12% Compliance Card */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-[11px] text-slate-400 uppercase font-semibold">
                  <span>Mandatory GST Breakdown (12%)</span>
                  <span>HSN 9963</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Central GST (CGST 6.0%)</span>
                  <span className="font-mono">₹{cgst}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>State GST (SGST 6.0%)</span>
                  <span className="font-mono">₹{sgst}</span>
                </div>
              </div>

              {/* Total Payable */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400">Net Payable Total</span>
                  <div className="text-[10px] text-emerald-400">Zero cancellation until 24h prior</div>
                </div>
                <div className="font-headline font-black text-2xl text-amber-400">
                  ₹{netTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-headline font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20"
              >
                <span>Proceed to Instant UPI Payment</span>
                <span className="material-symbols-outlined text-sm font-bold">lock</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Instant UPI & Multi-Rail Payment */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3">
              <div className="text-xs text-slate-400 font-label uppercase">Total Amount Due</div>
              <div className="font-headline font-black text-3xl text-amber-400">
                ₹{netTotal.toLocaleString('en-IN')}
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Verified Merchant: HOTELYO HOSPITALITY PVT LTD
              </span>

              {/* Live UPI QR Code */}
              <div className="p-4 bg-white rounded-2xl inline-block shadow-2xl">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=hotelyo@icici%26pn=HOTELYO%20Hostel%26am=3469%26cu=INR"
                  alt="UPI QR Code"
                  className="w-44 h-44 mx-auto"
                />
                <div className="text-[11px] text-slate-700 font-bold mt-2 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                  Scan with any UPI App
                </div>
              </div>

              {/* Quick App Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <button
                  onClick={handleSimulatePayment}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1 text-[10px] text-slate-200"
                >
                  <span className="material-symbols-outlined text-emerald-400 text-lg">payments</span>
                  GPay
                </button>
                <button
                  onClick={handleSimulatePayment}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1 text-[10px] text-slate-200"
                >
                  <span className="material-symbols-outlined text-purple-400 text-lg">account_balance_wallet</span>
                  PhonePe
                </button>
                <button
                  onClick={handleSimulatePayment}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1 text-[10px] text-slate-200"
                >
                  <span className="material-symbols-outlined text-sky-400 text-lg">credit_card</span>
                  Paytm
                </button>
                <button
                  onClick={handleSimulatePayment}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex flex-col items-center gap-1 text-[10px] text-slate-200"
                >
                  <span className="material-symbols-outlined text-amber-400 text-lg">currency_rupee</span>
                  BHIM
                </button>
              </div>

              {/* Direct UPI ID input */}
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. arjun@oksbi)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
                <button
                  onClick={handleSimulatePayment}
                  className="px-3 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg uppercase"
                >
                  Pay
                </button>
              </div>
            </div>

            {isProcessing && (
              <div className="p-3 bg-amber-950/80 border border-amber-500/50 rounded-xl text-center text-xs text-amber-300 font-bold animate-pulse">
                Verifying bank settlement via webhook...
              </div>
            )}
          </div>
        )}

        {/* Step 5: Confirmed Voucher & Digital Gate PIN */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-5 bg-slate-900 border-2 border-emerald-500 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
              </div>
              <div>
                <h2 className="font-headline font-black text-xl text-white">Booking Confirmed!</h2>
                <p className="text-xs text-slate-400">Ref: #HY-ANJ-9482 • GST Invoice Issued</p>
              </div>

              {/* Digital Pass Box */}
              <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/40 space-y-2 text-left">
                <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  ⚡ Digital Hostel Keycode
                </div>
                <div className="font-mono text-3xl font-black text-white tracking-widest">
                  8492#
                </div>
                <p className="text-[11px] text-slate-400">
                  Valid for: Dorm 101, Gear Locker #07 & ANPR Barrier Clearance for <strong className="text-slate-200">MH 12 QX 4040</strong>.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Link
                  href="/"
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  Return Home
                </Link>
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Open Staff PMS
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading checkout session...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
