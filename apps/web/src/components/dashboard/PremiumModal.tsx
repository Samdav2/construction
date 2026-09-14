import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  Store,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  Lock,
  Globe,
  Radar
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

const COUNTRIES = [
  { code: 'CM', label: 'Cameroon (XAF)', currency: 'XAF' },
  { code: 'SN', label: 'Senegal (XOF)', currency: 'XOF' },
  { code: 'CI', label: "Côte d'Ivoire (XOF)", currency: 'XOF' },
  { code: 'NG', label: 'Nigeria (NGN)', currency: 'NGN' },
  { code: 'GH', label: 'Ghana (GHS)', currency: 'GHS' },
  { code: 'KE', label: 'Kenya (KES)', currency: 'KES' },
  { code: 'ZA', label: 'South Africa (ZAR)', currency: 'ZAR' },
  { code: 'EG', label: 'Egypt (EGP)', currency: 'EGP' },
  { code: 'US', label: 'United States (USD)', currency: 'USD' },
  { code: 'GB', label: 'United Kingdom (GBP)', currency: 'GBP' },
];

export const PremiumModal = ({
  isOpen,
  onClose,
  featureTitle = 'Only Pay When a Client Contacts You',
  featureDesc = 'Recharge your account and promote your construction business. Your balance is only deducted when a client contacts you.'
}: PremiumModalProps) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<'overview' | 'checkout' | 'verifying'>('overview');
  const [rechargeAmount, setRechargeAmount] = useState<number>(10);
  const [selectedCountry, setSelectedCountry] = useState('CM');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeTxId, setActiveTxId] = useState<string | null>(null);

  // Fetch company profile to prefill phone if available
  const { data: company } = useQuery({
    queryKey: ['company-profile'],
    queryFn: async () => (await apiClient.get('/auth/company/profile')).data,
    enabled: isOpen
  });

  useEffect(() => {
    if (company?.phone || company?.receiptSettings?.whatsappNumber) {
      setPhoneNumber(company.phone || company.receiptSettings?.whatsappNumber || '');
    }
  }, [company]);

  // Live conversion estimation query based on selected recharge amount
  const { data: conversion } = useQuery({
    queryKey: ['premium-conversion', selectedCountry, rechargeAmount],
    queryFn: async () => {
      const res = await apiClient.get(`/wallet/rate?amount=${rechargeAmount}&countryCode=${selectedCountry}`);
      return res.data;
    },
    enabled: isOpen
  });

  // Verification query when activeTxId is set
  const { data: verifyData } = useQuery({
    queryKey: ['wallet-topup-verify', activeTxId],
    queryFn: async () => {
      const res = await apiClient.get(`/wallet/topup-verify/${activeTxId}`);
      return res.data;
    },
    refetchInterval: (q) => {
      if (q.state.data?.status === 'success') return false;
      return 3000;
    },
    enabled: !!activeTxId && step === 'verifying'
  });

  useEffect(() => {
    if (verifyData?.status === 'success') {
      toast.success('Account recharged! Pro features unlocked! 🚀');
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
      queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  }, [verifyData, queryClient]);

  // Initiate Swychr Wallet Top-up Mutation
  const initiateMutation = useMutation({
    mutationFn: async (payload: { amountUSD: number; countryCode: string; phoneNumber?: string }) => {
      const res = await apiClient.post('/wallet/topup-initiate', payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.paymentLink) {
        setActiveTxId(data.transactionId);
        setStep('verifying');
        // Open Swychr hosted checkout
        window.location.href = data.paymentLink;
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to generate payment link. Please try again.');
    }
  });

  const handleClose = () => {
    setStep('overview');
    setActiveTxId(null);
    onClose();
  };

  const handleStartCheckout = () => {
    initiateMutation.mutate({
      amountUSD: rechargeAmount,
      countryCode: selectedCountry,
      phoneNumber: phoneNumber.trim()
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4">
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
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-[#071426] text-white border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-[1.75rem] sm:rounded-[2.5rem] p-4 sm:p-7 select-none max-h-[92dvh] overflow-y-auto overscroll-contain flex flex-col my-auto"
          >
            {/* Glow Highlights */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC107]/15 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer z-20"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Step 1: RECHARGE OVERVIEW & PERKS */}
            {step === 'overview' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col flex-1"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 bg-[#FFC107]/20 border border-[#FFC107]/40 px-3 py-1 rounded-full text-[#FFC107] text-[11px] font-black uppercase tracking-wider mb-2.5 w-fit">
                  <Zap size={12} className="fill-[#FFC107]" />
                  <span>GROWTH PLAN • RECHARGE ACCOUNT</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-black tracking-tight mb-1 text-white break-words pr-6">
                  {featureTitle}
                </h3>

                <p className="text-slate-300 text-[11.5px] sm:text-sm font-medium leading-relaxed mb-3 sm:mb-4 break-words">
                  {featureDesc}
                </p>

                {/* Feature Perks List */}
                <div className="space-y-2 sm:space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">Public Directory Listing</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-snug">Publish your verified company profile and receive inbound client leads.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 border-t border-white/10 pt-2 sm:pt-2.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Store size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">Marketplace Material Selling</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-snug">List and sell building materials and machinery across Africa.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 border-t border-white/10 pt-2 sm:pt-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Radar size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">Lead &amp; Tender Scraper</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-snug">Scrape live project tenders, contractor opportunities, and construction jobs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 border-t border-white/10 pt-2 sm:pt-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">Verified Builder Badge</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-snug">Stand out with verified contractor credentials on all project bids.</p>
                    </div>
                  </div>
                </div>

                {/* Recharge Account Card (Clean & Prominent) */}
                <div className="bg-[#FFC107]/10 border border-[#FFC107]/35 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-[#FFC107] block">
                        Recharge Account (No Monthly Fees)
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xl sm:text-2xl font-black text-white">${rechargeAmount}</span>
                        <span className="text-[11px] text-emerald-400 font-bold">100% in your wallet</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-950 bg-[#FFC107] px-2.5 py-1 rounded-lg shrink-0">
                      Instant Pro Unlock
                    </span>
                  </div>

                  {/* Quick amount picker */}
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRechargeAmount(amt)}
                        className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          rechargeAmount === amt
                            ? 'bg-[#FFC107] text-slate-950 border-[#FFC107] shadow-sm scale-[1.02]'
                            : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                        }`}
                      >
                        ${amt} {amt === 10 ? '(Min)' : ''}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] sm:text-[10.5px] text-slate-300 leading-relaxed">
                    Maintain a <strong>$10+ wallet balance</strong> to keep Pro active. Zero monthly subscription fees—your deposit is only deducted when a client contacts you.
                  </p>
                </div>

                {/* Sticky Action Footer */}
                <div className="sticky bottom-0 bg-[#071426]/95 backdrop-blur-md pt-2 pb-1 -mx-4 -mb-4 px-4 sm:-mx-7 sm:-mb-7 sm:px-7 border-t border-white/10 mt-auto">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="order-2 sm:order-1 flex-1 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      Maybe Later
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('checkout')}
                      className="order-1 sm:order-2 flex-2 py-2.5 sm:py-3 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap size={14} className="fill-slate-950" />
                      <span>Recharge Account (${rechargeAmount})</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: SWYCHR PAYMENT CHECKOUT */}
            {step === 'checkout' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col flex-1"
              >
                <div className="flex items-center gap-2 text-slate-400 mb-3 cursor-pointer hover:text-white transition-colors" onClick={() => setStep('overview')}>
                  <ArrowLeft size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Back to Overview</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-black tracking-tight mb-1 text-white">
                  Recharge Account (${rechargeAmount} USD)
                </h3>
                <p className="text-slate-300 text-xs font-medium mb-4">
                  Select your country and enter your Mobile Money (MTN / Orange) or Card number.
                </p>

                {/* Country selector */}
                <div className="space-y-1 mb-3.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Globe size={13} className="text-[#FFC107]" />
                    <span>Payment Country & Currency</span>
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/15 text-white text-xs font-bold outline-none focus:border-[#FFC107] transition-all cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#071426] text-white">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Money / Phone Number */}
                <div className="space-y-1 mb-3.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">
                    Mobile Money / Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 670123456 or +237670123456"
                    className="w-full p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs font-semibold outline-none focus:border-[#FFC107] transition-all"
                  />
                </div>

                {/* Converted Amount Summary Box */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400 font-semibold">Deposit:</span>
                    <span className="text-xs font-black text-white">${rechargeAmount}.00 USD</span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                    <span className="text-xs text-slate-300 font-bold">Estimated Local Total:</span>
                    <span className="text-base sm:text-lg font-black text-[#FFC107]">
                      {conversion?.localAmount
                        ? `${Number(conversion.localAmount).toLocaleString()} ${conversion.currency || 'XAF'}`
                        : `≈ ${(rechargeAmount * 600).toLocaleString()} XAF`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 pt-1.5 text-[9.5px] text-slate-400 border-t border-white/5">
                    <Lock size={11} className="text-emerald-400 shrink-0" />
                    <span>Secure 256-bit encrypted checkout via Swychr / AccountPe. Zero recurring fees.</span>
                  </div>
                </div>

                {/* Sticky Action Buttons */}
                <div className="sticky bottom-0 bg-[#071426]/95 backdrop-blur-md pt-2 pb-1 -mx-4 -mb-4 px-4 sm:-mx-7 sm:-mb-7 sm:px-7 border-t border-white/10 mt-auto">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep('overview')}
                      className="flex-1 py-2.5 sm:py-3 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={initiateMutation.isPending}
                      onClick={handleStartCheckout}
                      className="flex-2 py-2.5 sm:py-3 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {initiateMutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          <span>Redirecting…</span>
                        </>
                      ) : (
                        <>
                          <CreditCard size={15} />
                          <span>Pay ${rechargeAmount}</span>
                          <ExternalLink size={12} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: VERIFYING PAYMENT */}
            {step === 'verifying' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#FFC107]/20 border border-[#FFC107]/40 text-[#FFC107] flex items-center justify-center mx-auto mb-4 animate-pulse">
                  {verifyData?.status === 'success' ? (
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  ) : (
                    <Loader2 size={32} className="animate-spin" />
                  )}
                </div>

                <h3 className="text-xl font-black text-white mb-2">
                  {verifyData?.status === 'success' ? 'Recharge Confirmed! 🎉' : 'Awaiting Payment Confirmation'}
                </h3>
                <p className="text-slate-300 text-xs font-medium max-w-sm mx-auto mb-6">
                  {verifyData?.status === 'success'
                    ? `Your wallet has been credited with $${rechargeAmount} USD and all Pro features are now unlocked! There are no monthly subscription fees—your funds remain yours to use.`
                    : 'Complete your payment in the Swychr window. Once finished, your wallet will be credited and Pro features will activate automatically.'}
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
