import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Building2,
  Store,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  CreditCard,
  Phone
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDesc?: string;
}

export const PremiumModal = ({
  isOpen,
  onClose,
  featureTitle = 'CPROHUB Premium',
  featureDesc = 'Upgrade your workspace to access premium business directory and marketplace selling features.'
}: PremiumModalProps) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<'overview' | 'payment'>('overview');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  // Fetch admin configured subscription settings
  const { data: config } = useQuery({
    queryKey: ['subscription-config'],
    queryFn: async () => {
      const res = await apiClient.get('/auth/company/subscription-config');
      return res.data;
    },
    enabled: isOpen
  });

  const monthlyFee = config?.monthlyFee ?? 29;
  const bankName = config?.bankName || 'United Bank for Africa (UBA)';
  const accountNumber = config?.accountNumber || '1029384756';
  const accountName = config?.accountName || 'CPROHUB Enterprise Ltd';
  const mobileMoneyNumber = config?.mobileMoneyNumber || '+237 670 000 000';
  const instructions = config?.instructions || 'Transfer the monthly fee to our verified account details below, then enter your transaction reference number to activate Premium.';

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Copied ${field} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const subscribeMutation = useMutation({
    mutationFn: async (payload: { paymentReference: string; paymentMethod: string }) => {
      const res = await apiClient.post('/auth/company/subscribe', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      toast.success('Successfully upgraded to CPROHUB Premium! 🚀');
      setStep('overview');
      setPaymentReference('');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to activate subscription.');
    }
  });

  const handleClose = () => {
    setStep('overview');
    onClose();
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    subscribeMutation.mutate({
      paymentReference: paymentReference.trim(),
      paymentMethod
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-[#071426] text-white border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-[2.5rem] overflow-hidden p-6 sm:p-8 select-none max-h-[90vh] overflow-y-auto"
          >
            {/* Top Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC107]/15 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer z-10"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Step 1: PERKS & PRICING OVERVIEW */}
            {step === 'overview' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#FFC107]/20 border border-[#FFC107]/40 px-3 py-1 rounded-full text-[#FFC107] text-xs font-black uppercase tracking-wider mb-4">
                  <Sparkles size={13} />
                  <span>Premium Plan • ${monthlyFee}/mo</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-white">
                  {featureTitle}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                  {featureDesc}
                </p>

                {/* Feature Perks List */}
                <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 mb-7">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">Public Directory Listing</h4>
                      <p className="text-[11px] text-slate-300">Publish your company profile and capture direct project leads.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-white/10 pt-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                      <Store size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">Marketplace Material Selling</h4>
                      <p className="text-[11px] text-slate-300">List and sell building materials and equipment to active contractors.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-white/10 pt-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center shrink-0">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">Verified Builder Badge</h4>
                      <p className="text-[11px] text-slate-300">Gain trust with verified contractor status across all search results.</p>
                    </div>
                  </div>
                </div>

                {/* Pricing summary */}
                <div className="flex items-center justify-between bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-2xl p-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC107] block">Monthly Subscription</span>
                    <span className="text-2xl font-black text-white">${monthlyFee} <span className="text-xs text-slate-300 font-normal">/ month</span></span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-lg">Admin Verified</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="order-2 sm:order-1 flex-1 py-3.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Maybe Later
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="order-1 sm:order-2 flex-2 py-3.5 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap size={14} className="fill-slate-950" />
                    <span>Proceed to Payment</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: ADMIN PAYMENT DETAILS & CONFIRMATION */}
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="flex items-center gap-2 text-slate-400 mb-4 cursor-pointer hover:text-white transition-colors" onClick={() => setStep('overview')}>
                  <ArrowLeft size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Back to Plan</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-1 text-white">
                  Payment Details (${monthlyFee})
                </h3>
                <p className="text-slate-300 text-xs font-medium mb-5">
                  {instructions}
                </p>

                {/* Payment Method Switcher */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-[#FFC107]/20 border-[#FFC107] text-[#FFC107]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Bank Transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'mobile_money'
                        ? 'bg-[#FFC107]/20 border-[#FFC107] text-[#FFC107]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Phone size={14} />
                    <span>Mobile Money</span>
                  </button>
                </div>

                {/* Payment Account Cards */}
                {paymentMethod === 'bank_transfer' ? (
                  <div className="space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/10">
                      <span className="text-slate-400">Bank Name:</span>
                      <span className="font-bold text-white">{bankName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/10">
                      <span className="text-slate-400">Account Name:</span>
                      <span className="font-bold text-white">{accountName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#FFC107]">{accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(accountNumber, 'Account Number')}
                          className="p-1 hover:bg-white/10 rounded transition-colors text-slate-300 hover:text-white cursor-pointer"
                          title="Copy Account Number"
                        >
                          {copiedField === 'Account Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-white/10">
                      <span className="text-slate-400">Operator:</span>
                      <span className="font-bold text-white">MTN / Orange Money</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/10">
                      <span className="text-slate-400">Beneficiary:</span>
                      <span className="font-bold text-white">{accountName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">MoMo Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#FFC107]">{mobileMoneyNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(mobileMoneyNumber, 'Mobile Money Number')}
                          className="p-1 hover:bg-white/10 rounded transition-colors text-slate-300 hover:text-white cursor-pointer"
                          title="Copy MoMo Number"
                        >
                          {copiedField === 'Mobile Money Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form to submit payment reference */}
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">
                      Transaction Reference / Sender Name / Receipt ID
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. TXN-893041 or Sender Full Name"
                      className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs font-medium outline-none focus:border-[#FFC107] transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('overview')}
                      className="flex-1 py-3.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={subscribeMutation.isPending || !paymentReference.trim()}
                      className="flex-2 py-3.5 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {subscribeMutation.isPending ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Submit & Activate</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
