import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Event, TicketTierType, Ticket } from '../../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  CheckCircle2,
  Lock,
  Sparkles,
  Loader2
} from 'lucide-react';

interface SelectedSeat {
  section: string;
  label: string;
  price: number;
  tier: TicketTierType;
}

interface PaymentModalProps {
  event: Event;
  selectedSeats: SelectedSeat[];
  onClose: () => void;
  onSuccess: (tickets: Ticket[]) => void;
  onBookTickets: (
    eventId: string,
    seats: SelectedSeat[],
    paymentMethod: string,
    attendeeInfo?: { name: string; email: string; phone: string }
  ) => Promise<Ticket[]>;
  initialAttendee: { name: string; email: string; phone: string };
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  event,
  selectedSeats,
  onClose,
  onSuccess,
  onBookTickets,
  initialAttendee
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('aarav.sharma@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4492 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [fullName, setFullName] = useState(initialAttendee.name);
  const [email, setEmail] = useState(initialAttendee.email);
  const [phone, setPhone] = useState(initialAttendee.phone);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'DETAILS' | 'OTP' | 'SUCCESS'>('DETAILS');
  const [otp, setOtp] = useState('241830');

  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const gst = Math.round(subtotal * 0.18);
  const totalPayable = Math.max(0, subtotal + gst - discountAmount);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ISP2026' || promoCode.trim().toUpperCase() === 'PEGA500') {
      setDiscountAmount(500);
    } else if (promoCode.trim().toUpperCase() === 'VIPFEST') {
      setDiscountAmount(Math.round(subtotal * 0.1));
    } else {
      alert('Invalid promo code. Try "ISP2026" or "PEGA500"');
    }
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      alert('Please fill in attendee contact information.');
      return;
    }

    setIsProcessing(true);
    // Simulate payment authorization gateway handshake
    setTimeout(() => {
      setIsProcessing(false);
      setStep('OTP');
    }, 1200);
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      let methodLabel = 'UPI';
      if (paymentMethod === 'UPI') methodLabel = `UPI (ID: ${upiId})`;
      else if (paymentMethod === 'CARD') methodLabel = `Credit Card (•••• ${cardNumber.slice(-4)})`;
      else methodLabel = `Net Banking (${selectedBank})`;

      const issuedTickets = await onBookTickets(
        event.id,
        selectedSeats,
        methodLabel,
        { name: fullName, email, phone }
      );

      setIsProcessing(false);
      setStep('SUCCESS');

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error('Confetti error', err);
      }

      setTimeout(() => {
        onSuccess(issuedTickets);
      }, 1800);
    } catch (err) {
      setIsProcessing(false);
      alert('Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Pega Secure Checkout Gateway</h3>
              <p className="text-[11px] text-slate-500">256-bit Encrypted Settlement • India Rupee (INR ₹)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'DETAILS' && (
          <form onSubmit={handleInitiatePayment} className="p-6 space-y-5">
            {/* Event Summary Pill */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{event.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedSeats.length} Seat(s): <span className="text-blue-700 font-mono font-medium">{selectedSeats.map(s => s.label).join(', ')}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Payable</span>
                <span className="text-lg font-bold text-slate-900">₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Attendee Contact Information */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-700 block">
                1. Attendee Contact Details (For Digital Passes)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Mobile (SMS / WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-700 block">
                2. Select Payment Mode
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span>UPI / QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Credit / Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NETBANKING')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                    paymentMethod === 'NETBANKING'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* Method specific inputs */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">Enter UPI ID (VPA)</span>
                    <span className="text-blue-700 font-mono text-[10px]">GPay • PhonePe • Paytm</span>
                  </div>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="mobile@upi or name@okhdfcbank"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    A payment collect request of ₹{totalPayable.toLocaleString('en-IN')} will be sent to your UPI app.
                  </p>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-[11px] text-slate-600 block font-medium">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={e => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="HDFC Bank">HDFC Bank (Fastest)</option>
                    <option value="ICICI Bank">ICICI Bank Internet Banking</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="Axis Bank">Axis Bank Retail</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Promo Code */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (e.g. ISP2026)"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 uppercase focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition cursor-pointer"
              >
                Apply
              </button>
            </div>

            {/* Price breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tickets Base Amount ({selectedSeats.length} seats)</span>
                <span className="font-medium text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Integrated GST (18%)</span>
                <span className="font-medium text-slate-900">₹{gst.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promotional Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount to Pay</span>
                <span className="text-blue-700">₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Bank Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{totalPayable.toLocaleString('en-IN')} & Issue Passes</span>
                </>
              )}
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleConfirmOtp} className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">Bank 3D Secure Authentication</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Enter the 6-digit one-time password sent to your registered mobile ending with {phone.slice(-4)}.
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold bg-white border-2 border-blue-600 rounded-xl py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="text-[11px] text-slate-500 mt-2">Default test OTP: 241830</p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Settling Ledger & Generating QR Passes...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize Transaction (₹{totalPayable.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Booking Confirmed!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your tickets have been recorded in Pega System of Record. Digital passes with cryptographic QR codes are ready.
            </p>
            <p className="text-[11px] text-blue-700 font-mono">Opening your digital pass wallet...</p>
          </div>
        )}
      </div>
    </div>
  );
};
