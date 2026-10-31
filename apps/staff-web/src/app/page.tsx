'use client';

import React, { useState } from 'react';

interface StaffUser {
  name: string;
  email: string;
  role: 'FRONT_DESK' | 'HOUSEKEEPING' | 'DUTY_MANAGER';
  shift: string;
}

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

interface FolioItem {
  id: string;
  desc: string;
  amount: number;
  type: 'STAY' | 'ADDON' | 'CAFE' | 'LAUNDRY' | 'TAX';
}

export default function StaffPmsPage() {
  const [staffUser, setStaffUser] = useState<StaffUser | null>({
    name: 'Vikram Joshi',
    email: 'frontdesk@hotelyo.com',
    role: 'FRONT_DESK',
    shift: 'Morning shift (06:00 - 14:00)',
  });

  const [loginEmail, setLoginEmail] = useState('frontdesk@hotelyo.com');
  const [loginPin, setLoginPin] = useState('1234');

  const [activeTab, setActiveTab] = useState<'arrivals' | 'tape' | 'folios' | 'housekeeping' | 'handover' | 'lostfound' | 'dayclose'>('arrivals');

  const [arrivals, setArrivals] = useState<GuestArrival[]>([
    {
      id: 'g-1',
      name: 'Arjun Singhania',
      ref: '#HY-ANJ-9482',
      room: 'Pod 101-A2',
      bike: 'RE Himalayan 450 (MH 12 QX 4040)',
      otp: '849204',
      status: 'Arriving',
      keycode: '8492#',
      balance: 0,
    },
    {
      id: 'g-2',
      name: 'Vikram Rathore',
      ref: '#HY-LEH-1049',
      room: 'Pod 204-B1',
      bike: 'KTM 390 Adventure (DL 03 AP 9921)',
      otp: '391055',
      status: 'Arriving',
      keycode: '3910#',
      balance: 450,
    },
    {
      id: 'g-3',
      name: 'Ananya Sen',
      ref: '#HY-ANJ-9410',
      room: 'Suite 102-A',
      bike: 'BMW G310GS (KA 01 MR 7812)',
      otp: '110488',
      status: 'Checked-In',
      keycode: '1104#',
      balance: 0,
    },
  ]);

  const [otpInput, setOtpInput] = useState('849204');
  const [selectedGuest, setSelectedGuest] = useState<GuestArrival>(arrivals[0]);
  const [statusNotification, setStatusNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [folioItems, setFolioItems] = useState<FolioItem[]>([
    { id: 'f-1', desc: 'Acoustic Solo Bunk (3 nights)', amount: 2547, type: 'STAY' },
    { id: 'f-2', desc: 'Covered motorcycle bay 04', amount: 450, type: 'ADDON' },
    { id: 'f-3', desc: '45°C heated gear locker', amount: 300, type: 'ADDON' },
    { id: 'f-4', desc: 'Cafe: Rider breakfast bowl and cold brew', amount: 440, type: 'CAFE' },
    { id: 'f-5', desc: 'Self-service laundry cycle', amount: 120, type: 'LAUNDRY' },
    { id: 'f-6', desc: 'GST @ 12% (HSN 9963: 6% + 6%)', amount: 463, type: 'TAX' },
  ]);
  const [newChargeDesc, setNewChargeDesc] = useState('Workshop chain cleaner pass');
  const [newChargeAmount, setNewChargeAmount] = useState('250');
  const [splitFolioActive, setSplitFolioActive] = useState(false);

  const [rooms, setRooms] = useState([
    { id: '101-A1', name: 'Pod 101-A1', type: 'Acoustic Solo Bunk', status: 'Clean' },
    { id: '101-A2', name: 'Pod 101-A2', type: 'Acoustic Solo Bunk', status: 'Occupied' },
    { id: '101-A3', name: 'Pod 101-A3', type: 'Acoustic Solo Bunk', status: 'Dirty' },
    { id: '204-B1', name: 'Pod 204-B1', type: 'Moto En-Suite Pod', status: 'Cleaning' },
    { id: '204-B2', name: 'Pod 204-B2', type: 'Moto En-Suite Pod', status: 'Clean' },
    { id: '102-A', name: 'Suite 102-A', type: 'Deluxe Atelier Suite', status: 'Occupied' },
  ]);

  const [handoverLogs, setHandoverLogs] = useState([
    {
      id: 'h-1',
      shift: 'Morning to evening',
      author: 'Vikram Joshi',
      note: 'Guest in Suite 102 requested 05:30 early departure breakfast. Keycode 8492 active for Pod 101-A2.',
      time: '13:45',
    },
    {
      id: 'h-2',
      shift: 'Night to morning',
      author: 'Suresh Patil',
      note: 'Optical barrier gate camera calibrated. 18 of 20 motorcycle bays occupied overnight. Wash bay compressor at 120 PSI.',
      time: '05:50',
    },
  ]);
  const [newHandoverNote, setNewHandoverNote] = useState('');

  const [lostItems, setLostItems] = useState([
    { id: 'lf-1', item: 'Alpinestars Drystar riding gloves (L)', location: 'Wash bay area', status: 'Unclaimed', date: '27 Oct' },
    { id: 'lf-2', item: 'GoPro Hero 11 dual charger', location: 'Locker 08 vault', status: 'Claimed by Arjun S.', date: '26 Oct' },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemLocation, setNewItemLocation] = useState('');

  const [dayCloseExecuting, setDayCloseExecuting] = useState(false);
  const [dayCloseCompleted, setDayCloseCompleted] = useState(false);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(''), 4000);
  };

  const handleQuickLogin = (role: 'FRONT_DESK' | 'HOUSEKEEPING' | 'DUTY_MANAGER', name: string, email: string) => {
    setStaffUser({ name, email, role, shift: 'Morning shift (06:00 - 14:00)' });
  };

  const handleVerifyOtp = () => {
    if (!selectedGuest) return;
    setArrivals((prev) =>
      prev.map((g) => (g.id === selectedGuest.id ? { ...g, status: 'Checked-In' } : g))
    );
    setSelectedGuest((prev) => ({ ...prev, status: 'Checked-In' }));
    showNotification(`OTP verified. Keycode ${selectedGuest.keycode} activated and ANPR barrier gate cleared.`);
  };

  const handleRegenerateKeycode = () => {
    const newCode = `${Math.floor(1000 + Math.random() * 9000)}#`;
    setArrivals((prev) =>
      prev.map((g) => (g.id === selectedGuest.id ? { ...g, keycode: newCode } : g))
    );
    setSelectedGuest((prev) => ({ ...prev, keycode: newCode }));
    showNotification(`Keycode revoked and re-issued: ${newCode}`);
  };

  const handleAddFolioCharge = () => {
    if (!newChargeDesc || !newChargeAmount) return;
    const amt = Number(newChargeAmount);
    setFolioItems((prev) => [
      ...prev,
      { id: `f-${Date.now()}`, desc: newChargeDesc, amount: amt, type: 'CAFE' },
    ]);
    setNewChargeDesc('');
    setNewChargeAmount('');
    showNotification(`Posted ₹${amt} charge to folio.`);
  };

  const handleUpdateRoomStatus = (roomId: string, newStatus: string) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r)));
  };

  const handleAddHandover = () => {
    if (!newHandoverNote) return;
    setHandoverLogs((prev) => [
      {
        id: `h-${Date.now()}`,
        shift: `${staffUser?.name || 'Staff'} entry`,
        author: staffUser?.name || 'Staff officer',
        note: newHandoverNote,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
    setNewHandoverNote('');
    showNotification('Shift handover note saved.');
  };

  const handleAddLostItem = () => {
    if (!newItemName || !newItemLocation) return;
    setLostItems((prev) => [
      {
        id: `lf-${Date.now()}`,
        item: newItemName,
        location: newItemLocation,
        status: 'Unclaimed',
        date: 'Today',
      },
      ...prev,
    ]);
    setNewItemName('');
    setNewItemLocation('');
    showNotification('Item recorded in registry.');
  };

  const handleExecuteDayClose = () => {
    setDayCloseExecuting(true);
    setTimeout(() => {
      setDayCloseExecuting(false);
      setDayCloseCompleted(true);
    }, 1100);
  };

  const filteredArrivals = arrivals.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.bike.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFolioAmount = folioItems.reduce((acc, f) => acc + f.amount, 0);

  // AUTHENTICATION SCREEN
  if (!staffUser) {
    return (
      <div className="min-h-screen bg-[#f9fbfc] flex items-center justify-center p-6 text-xs text-[#131416]">
        <div className="w-full max-w-sm bg-white border border-[#e8eaec] rounded p-8 space-y-6">
          <div>
            <h1 className="text-xl font-normal text-[#131416]">HOTELYO PMS</h1>
            <p className="text-[#5d5f60] mt-1">Staff front-desk authentication portal</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[#5d5f60] mb-1">Staff email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#cdced1] rounded text-[#131416] text-sm"
              />
            </div>
            <div>
              <label className="block text-[#5d5f60] mb-1">Security PIN</label>
              <input
                type="password"
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                className="w-full px-3 py-2 border border-[#cdced1] rounded text-[#131416] text-sm"
              />
            </div>
            <button
              onClick={() => handleQuickLogin('FRONT_DESK', 'Vikram Joshi', loginEmail)}
              className="w-full py-2 bg-[#131416] text-white rounded font-medium hover:bg-neutral-800"
            >
              Sign in to console
            </button>
          </div>

          <div className="border-t border-[#f0f1f2] pt-4 space-y-2">
            <span className="text-[#5d5f60] block">Quick role sign-in</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('FRONT_DESK', 'Vikram Joshi', 'frontdesk@hotelyo.com')}
                className="p-2 border border-[#e8eaec] rounded text-left hover:bg-[#f4f6f8]"
              >
                <div className="font-medium text-[#131416]">Front desk</div>
                <div className="text-[10px] text-[#5d5f60]">Vikram J.</div>
              </button>
              <button
                onClick={() => handleQuickLogin('HOUSEKEEPING', 'Sunita Rao', 'housekeeping@hotelyo.com')}
                className="p-2 border border-[#e8eaec] rounded text-left hover:bg-[#f4f6f8]"
              >
                <div className="font-medium text-[#131416]">Housekeeper</div>
                <div className="text-[10px] text-[#5d5f60]">Sunita R.</div>
              </button>
              <button
                onClick={() => handleQuickLogin('DUTY_MANAGER', 'Captain Rao', 'manager@hotelyo.com')}
                className="p-2 border border-[#e8eaec] rounded text-left hover:bg-[#f4f6f8]"
              >
                <div className="font-medium text-[#131416]">Duty manager</div>
                <div className="text-[10px] text-[#5d5f60]">Capt. Rao</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FRAMED SHEET APP SHELL
  return (
    <div className="min-h-screen bg-[#f9fbfc] p-2 flex flex-col text-[#131416] font-sans">
      {/* 48px TOP CHROME BAR */}
      <header className="h-12 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#131416]">HOTELYO PMS</span>
            <span className="text-[#5d5f60]">Anjuna Atelier</span>
          </div>

          <nav className="flex items-center gap-1">
            {[
              { id: 'arrivals', label: 'Arrivals & OTP' },
              { id: 'tape', label: 'Tape chart' },
              { id: 'folios', label: 'Folios & billing' },
              { id: 'housekeeping', label: 'Housekeeping' },
              { id: 'handover', label: 'Shift handover' },
              { id: 'lostfound', label: 'Lost & found' },
              { id: 'dayclose', label: 'Day close' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeTab === t.id
                    ? 'text-[#131416] font-semibold border-b-2 border-[#131416]'
                    : 'text-[#5d5f60] hover:text-[#131416]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-[#5d5f60]">
          <span>{staffUser.name} ({staffUser.role})</span>
          <span>{staffUser.shift}</span>
          <button onClick={() => setStaffUser(null)} className="text-[#c4242a] hover:underline">
            Sign out
          </button>
        </div>
      </header>

      {/* WHITE WORK SHEET INSET */}
      <main className="flex-1 bg-white border border-[#e8eaec] rounded-2xl p-6 space-y-6">
        {statusNotification && (
          <div className="p-3 bg-[#dcfae5] text-[#04250e] border border-[#b8f5cb] rounded text-xs">
            {statusNotification}
          </div>
        )}

        {/* TAB 1: ARRIVALS & OTP */}
        {activeTab === 'arrivals' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-medium text-[#131416]">Today arrivals</h2>
                <span className="font-mono text-[#5d5f60]">
                  {arrivals.filter((a) => a.status === 'Arriving').length} pending
                </span>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest or plate..."
                className="w-full px-3 py-1.5 border border-[#cdced1] rounded bg-white text-[#131416]"
              />

              <div className="space-y-2">
                {filteredArrivals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => { setSelectedGuest(g); setOtpInput(g.otp); }}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedGuest.id === g.id ? 'border-[#1b6c80] bg-[#f4f6f8]' : 'border-[#e8eaec]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-[#131416]">{g.name}</span>
                        <p className="text-[#5d5f60] font-mono">{g.ref}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] ${g.status === 'Checked-In' ? 'bg-[#dcfae5] text-[#04250e]' : 'bg-[#fffbeb] text-[#92400e]'}`}>
                        {g.status}
                      </span>
                    </div>
                    <div className="mt-2 text-[#5d5f60] flex justify-between">
                      <span>{g.room}</span>
                      <span className="font-mono">{g.bike}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="border border-[#e8eaec] rounded p-6 space-y-6">
                <div className="border-b border-[#f0f1f2] pb-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-[#131416]">{selectedGuest.name}</h3>
                    <p className="text-[#5d5f60] font-mono">{selectedGuest.ref} • {selectedGuest.room}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#5d5f60]">Outstanding</span>
                    <div className="font-mono font-medium text-[#131416] text-base">₹{selectedGuest.balance}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[#5d5f60]">Guest 6-digit arrival OTP</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-40 px-3 py-2 border border-[#cdced1] rounded text-center font-mono text-xl tracking-widest text-[#131416]"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 bg-[#131416] text-white rounded font-medium hover:bg-neutral-800"
                    >
                      Verify OTP and check in
                    </button>
                  </div>
                  <p className="text-[#5d5f60]">Active demo code: <span className="font-mono font-medium">849204</span></p>
                </div>

                <div className="p-4 bg-[#f9fbfc] border border-[#e8eaec] rounded space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[#5d5f60]">Active door keypad PIN</span>
                      <div className="text-2xl font-mono font-medium text-[#1b6c80] mt-0.5">{selectedGuest.keycode}</div>
                    </div>
                    <button
                      onClick={handleRegenerateKeycode}
                      className="px-3 py-1.5 border border-[#cdced1] rounded text-[#131416] hover:bg-white"
                    >
                      Revoke and re-issue PIN
                    </button>
                  </div>

                  <div className="border-t border-[#e8eaec] pt-2 text-[#5d5f60] flex justify-between">
                    <span>ANPR barrier gate: cleared</span>
                    <span>Bay 04 assigned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TAPE CHART */}
        {activeTab === 'tape' && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-medium text-[#131416]">5-day room tape chart</h2>
            <div className="overflow-x-auto border border-[#e8eaec] rounded">
              <table className="w-full text-left">
                <thead className="bg-[#f9fbfc] text-[#5d5f60] border-b border-[#e8eaec]">
                  <tr>
                    <th className="p-3 w-40">Unit</th>
                    <th className="p-3">Fri, 14 Nov</th>
                    <th className="p-3">Sat, 15 Nov</th>
                    <th className="p-3">Sun, 16 Nov</th>
                    <th className="p-3">Mon, 17 Nov</th>
                    <th className="p-3">Tue, 18 Nov</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f1f2]">
                  {[
                    { room: 'Bed 101-A1', guest: 'Available', status: 'free' },
                    { room: 'Bed 101-A2', guest: 'Arjun Singhania (Himalayan 450)', status: 'busy' },
                    { room: 'Bed 101-A3', guest: 'Rohit Sharma (Adv 390)', status: 'busy' },
                    { room: 'Pod 204-B1', guest: 'Vikram Rathore (KTM 390)', status: 'busy' },
                    { room: 'Pod 204-B2', guest: 'Available', status: 'free' },
                    { room: 'Suite 102-A', guest: 'Ananya Sen (BMW G310GS)', status: 'busy' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td className="p-3 font-medium text-[#131416] bg-[#f9fbfc]">{r.room}</td>
                      <td colSpan={r.status === 'busy' ? 3 : 1} className="p-2">
                        {r.status === 'busy' ? (
                          <div className="p-2 bg-[#f4f6f8] border border-[#e8eaec] rounded text-[#131416]">
                            {r.guest}
                          </div>
                        ) : (
                          <div className="p-2 text-[#1e7b4f] bg-[#dcfae5]/50 border border-[#dcfae5] rounded text-center">
                            Available (₹849)
                          </div>
                        )}
                      </td>
                      {r.status === 'busy' ? (
                        <>
                          <td className="p-2"><div className="p-2 text-center text-[#5d5f60]">Available</div></td>
                          <td className="p-2"><div className="p-2 text-center text-[#5d5f60]">Available</div></td>
                        </>
                      ) : (
                        <>
                          <td className="p-2"><div className="p-2 text-center text-[#5d5f60]">Available</div></td>
                          <td className="p-2"><div className="p-2 text-center text-[#5d5f60]">Available</div></td>
                          <td className="p-2"><div className="p-2 text-center text-[#5d5f60]">Available</div></td>
                          <td className="p-2"><div className="p-2 text-center text-[#5d5f60]">Available</div></td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FOLIOS & BILLING */}
        {activeTab === 'folios' && (
          <div className="space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-[#f0f1f2] pb-3">
              <div>
                <h2 className="text-base font-medium text-[#131416]">Folio #FL-9482 • {selectedGuest.name}</h2>
                <p className="text-[#5d5f60] font-mono">{selectedGuest.room}</p>
              </div>
              <button
                onClick={() => setSplitFolioActive(!splitFolioActive)}
                className={`px-3 py-1.5 border rounded ${splitFolioActive ? 'border-[#1b6c80] bg-[#f4f6f8] text-[#1b6c80] font-medium' : 'border-[#cdced1] text-[#131416]'}`}
              >
                {splitFolioActive ? 'Folio split active (Corporate + Personal)' : 'Split folio'}
              </button>
            </div>

            <div className="border border-[#e8eaec] rounded overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f9fbfc] text-[#5d5f60] border-b border-[#e8eaec]">
                  <tr>
                    <th className="p-3">Service</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Sub-folio routing</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f1f2]">
                  {folioItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 text-[#131416]">{item.desc}</td>
                      <td className="p-3 text-[#5d5f60] font-mono">{item.type}</td>
                      <td className="p-3 text-[#5d5f60]">
                        {splitFolioActive && (item.type === 'CAFE' || item.type === 'LAUNDRY')
                          ? 'Sub-folio B (Personal)'
                          : 'Sub-folio A (Company GST)'}
                      </td>
                      <td className="p-3 text-right font-mono text-[#131416]">₹{item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#f9fbfc] font-medium text-[#131416]">
                    <td colSpan={3} className="p-3 text-right">Total outstanding:</td>
                    <td className="p-3 text-right font-mono">₹{totalFolioAmount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#f9fbfc] border border-[#e8eaec] rounded space-y-3">
              <span className="font-medium text-[#131416] block">Post additional charge</span>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newChargeDesc}
                  onChange={(e) => setNewChargeDesc(e.target.value)}
                  placeholder="Description..."
                  className="flex-1 px-3 py-1.5 border border-[#cdced1] rounded bg-white text-[#131416]"
                />
                <input
                  type="number"
                  value={newChargeAmount}
                  onChange={(e) => setNewChargeAmount(e.target.value)}
                  placeholder="Amount ₹"
                  className="w-28 px-3 py-1.5 border border-[#cdced1] rounded bg-white font-mono text-[#131416]"
                />
                <button onClick={handleAddFolioCharge} className="px-4 py-1.5 bg-[#131416] text-white rounded font-medium">
                  Post to folio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HOUSEKEEPING */}
        {activeTab === 'housekeeping' && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-medium text-[#131416]">Housekeeping and room readiness</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rooms.map((r) => (
                <div key={r.id} className="border border-[#e8eaec] rounded p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[#131416] text-sm">{r.name}</h3>
                      <p className="text-[#5d5f60]">{r.type}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      r.status === 'Clean' ? 'bg-[#dcfae5] text-[#04250e]' : r.status === 'Dirty' ? 'bg-[#ffedea] text-[#831c1e]' : 'bg-[#fffbeb] text-[#92400e]'
                    }`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#f0f1f2]">
                    <button
                      onClick={() => handleUpdateRoomStatus(r.id, 'Dirty')}
                      className={`flex-1 py-1 border rounded ${r.status === 'Dirty' ? 'border-[#c4242a] text-[#c4242a] font-medium' : 'border-[#cdced1]'}`}
                    >
                      Dirty
                    </button>
                    <button
                      onClick={() => handleUpdateRoomStatus(r.id, 'Cleaning')}
                      className={`flex-1 py-1 border rounded ${r.status === 'Cleaning' ? 'border-[#92400e] text-[#92400e] font-medium' : 'border-[#cdced1]'}`}
                    >
                      Cleaning
                    </button>
                    <button
                      onClick={() => handleUpdateRoomStatus(r.id, 'Clean')}
                      className={`flex-1 py-1 border rounded ${r.status === 'Clean' ? 'border-[#1e7b4f] text-[#1e7b4f] font-medium' : 'border-[#cdced1]'}`}
                    >
                      Ready
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SHIFT HANDOVER */}
        {activeTab === 'handover' && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-medium text-[#131416]">Shift handover log</h2>
            <div className="space-y-2">
              {handoverLogs.map((log) => (
                <div key={log.id} className="p-3 border border-[#e8eaec] rounded bg-[#f9fbfc]">
                  <div className="flex justify-between text-[#5d5f60]">
                    <span className="font-medium text-[#131416]">{log.shift}</span>
                    <span className="font-mono">{log.time} • {log.author}</span>
                  </div>
                  <p className="mt-1 text-[#131416] leading-relaxed">{log.note}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border border-[#e8eaec] rounded bg-[#f9fbfc] space-y-2">
              <span className="font-medium text-[#131416] block">Record handover entry</span>
              <textarea
                rows={2}
                value={newHandoverNote}
                onChange={(e) => setNewHandoverNote(e.target.value)}
                placeholder="Notes for next shift..."
                className="w-full p-2 border border-[#cdced1] rounded bg-white text-[#131416]"
              />
              <button onClick={handleAddHandover} className="px-4 py-1.5 bg-[#131416] text-white rounded font-medium">
                Save note
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: LOST & FOUND */}
        {activeTab === 'lostfound' && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-medium text-[#131416]">Lost and found registry</h2>
            <div className="border border-[#e8eaec] rounded overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f9fbfc] text-[#5d5f60] border-b border-[#e8eaec]">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3">Location found</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f1f2]">
                  {lostItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-medium text-[#131416]">{item.item}</td>
                      <td className="p-3 text-[#5d5f60]">{item.location}</td>
                      <td className="p-3 text-[#5d5f60] font-mono">{item.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${item.status.includes('Claimed') ? 'bg-[#dcfae5] text-[#04250e]' : 'bg-[#fffbeb] text-[#92400e]'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border border-[#e8eaec] rounded bg-[#f9fbfc] space-y-2">
              <span className="font-medium text-[#131416] block">Log discovered item</span>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Item description..."
                  className="px-3 py-1.5 border border-[#cdced1] rounded bg-white text-[#131416]"
                />
                <input
                  type="text"
                  value={newItemLocation}
                  onChange={(e) => setNewItemLocation(e.target.value)}
                  placeholder="Found location..."
                  className="px-3 py-1.5 border border-[#cdced1] rounded bg-white text-[#131416]"
                />
              </div>
              <button onClick={handleAddLostItem} className="px-4 py-1.5 bg-[#131416] text-white rounded font-medium">
                Record in registry
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: DAY CLOSE */}
        {activeTab === 'dayclose' && (
          <div className="max-w-xl mx-auto border border-[#e8eaec] rounded p-6 space-y-6 text-xs">
            <div>
              <h2 className="text-lg font-medium text-[#131416]">Night audit and day close</h2>
              <p className="text-[#5d5f60] mt-0.5">Audits folios, verifies payment ledger, and advances calendar date.</p>
            </div>

            <div className="p-4 bg-[#f9fbfc] border border-[#e8eaec] rounded space-y-2">
              <div className="flex justify-between text-[#5d5f60]">
                <span>Room and pod revenue:</span>
                <span className="font-mono font-medium text-[#131416]">₹42,650</span>
              </div>
              <div className="flex justify-between text-[#5d5f60]">
                <span>Parking and locker add-ons:</span>
                <span className="font-mono font-medium text-[#131416]">₹4,200</span>
              </div>
              <div className="flex justify-between text-[#5d5f60]">
                <span>Cafe commissary revenue:</span>
                <span className="font-mono font-medium text-[#131416]">₹3,840</span>
              </div>
              <div className="flex justify-between text-[#5d5f60]">
                <span>GST collected (HSN 9963: 6% + 6%):</span>
                <span className="font-mono font-medium text-[#131416]">₹6,082</span>
              </div>
              <div className="border-t border-[#e8eaec] pt-2 flex justify-between font-medium text-sm text-[#131416]">
                <span>Total ledger value:</span>
                <span className="font-mono">₹56,772</span>
              </div>
            </div>

            {dayCloseCompleted ? (
              <div className="p-3 bg-[#dcfae5] text-[#04250e] border border-[#b8f5cb] rounded">
                Day close successfully executed. Financial ledger locked with cryptographic signature.
              </div>
            ) : (
              <button
                onClick={handleExecuteDayClose}
                disabled={dayCloseExecuting}
                className="w-full py-2.5 bg-[#131416] text-white rounded font-medium hover:bg-neutral-800"
              >
                {dayCloseExecuting ? 'Auditing ledger...' : 'Execute day close audit'}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
