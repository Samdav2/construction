import { useState, useEffect } from 'react';
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
  CreditCard,
  ExternalLink,
  CheckCircle2,
  Lock,
  Globe,
  Radar,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  featureTitle = 'CPROHUB Premium',
  featureDesc = 'Upgrade your workspace to access premium business directory and marketplace selling features.'
}: PremiumModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<'overview' | 'checkout' | 'verifying'>('overview');
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

  // Live conversion estimation query
  const { data: conversion } = useQuery({
    queryKey: ['premium-conversion', selectedCountry, monthlyFee],
    queryFn: async () => {
      const res = await apiClient.get(`/wallet/rate?amount=${monthlyFee}&countryCode=${selectedCountry}`);
      return res.data;
    },
    enabled: isOpen && step === 'checkout'
  });

  // Verification query when activeTxId is set
  const { data: verifyData } = useQuery({
    queryKey: ['premium-verify', activeTxId],
    queryFn: async () => {
      const res = await apiClient.get(`/auth/company/subscribe-verify/${activeTxId}`);
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
      toast.success('Successfully upgraded to CPROHUB Premium! 🚀');
      queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
  }, [verifyData, queryClient]);

  // Initiate Swychr Checkout Mutation
  const initiateMutation = useMutation({
    mutationFn: async (payload: { countryCode: string; phoneNumber?: string }) => {
      const res = await apiClient.post('/auth/company/subscribe-initiate', payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.paymentLink) {
        setActiveTxId(data.transactionId);
        setStep('verifying');
        // Open Swychr hosted checkout in current window or new tab
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
    initiateMutation.mutate({ countryCode: selectedCountry, phoneNumber: phoneNumber.trim() });
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

                <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2 text-white break-words">
                  {featureTitle}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mb-6 break-words">
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
                      <p className="text-[11px] text-slate-300">Publish your verified company profile and receive inbound client leads.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-white/10 pt-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                      <Store size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">Marketplace Material Selling</h4>
                      <p className="text-[11px] text-slate-300">List and sell building materials and machinery across Africa.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-white/10 pt-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Radar size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">Lead &amp; Tender Scraper</h4>
                      <p className="text-[11px] text-slate-300">Scrape live project tenders, contractor opportunities, and construction jobs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-t border-white/10 pt-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center shrink-0">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">Verified Builder Badge</h4>
                      <p className="text-[11px] text-slate-300">Stand out with verified contractor credentials on all project bids.</p>
                    </div>
                  </div>
                </div>

                {/* Wallet $10+ alternative access box */}
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 mb-5 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Wallet size={16} />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-white">Wallet Access ($10+)</h5>
                      <p className="text-[10px] text-emerald-200/80 leading-tight">Maintain $10+ in your wallet to unlock all Pro features automatically.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      navigate('/dashboard/wallet');
                    }}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                  >
                    Top Up
                  </button>
                </div>

                {/* Pricing summary */}
                <div className="flex items-center justify-between bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-2xl p-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC107] block">Monthly Subscription</span>
                    <span className="text-2xl font-black text-white">${monthlyFee} <span className="text-xs text-slate-300 font-normal">/ month</span></span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-lg">Instant Activation</span>
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
                    onClick={() => setStep('checkout')}
                    className="order-1 sm:order-2 flex-2 py-3.5 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap size={14} className="fill-slate-950" />
                    <span>Proceed to Payment</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: SWYCHR INTEGRATED PAYMENT CHECKOUT */}
            {step === 'checkout' && (
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
                  Swychr Checkout (${monthlyFee}/mo)
                </h3>
                <p className="text-slate-300 text-xs font-medium mb-5">
                  Select your payment country to pay with Mobile Money (MTN / Orange), Bank Cards, or Transfer.
                </p>

                {/* Country selector */}
                <div className="space-y-1.5 mb-5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Globe size={13} className="text-[#FFC107]" />
                    <span>Payment Country & Currency</span>
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/15 text-white text-xs font-bold outline-none focus:border-[#FFC107] transition-all cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#071426] text-white">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Money / Phone Number */}
                <div className="space-y-1.5 mb-5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">
                    Mobile Money / Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 670123456 or +237670123456"
                    className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs font-semibold outline-none focus:border-[#FFC107] transition-all"
                  />
                </div>

                {/* Converted Amount Summary Box */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-semibold">Standard Plan Fee:</span>
                    <span className="text-xs font-black text-white">${monthlyFee}.00 USD</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-xs text-slate-300 font-bold">Estimated Local Total:</span>
                    <span className="text-base sm:text-lg font-black text-[#FFC107]">
                      {conversion?.localAmount
                        ? `${Number(conversion.localAmount).toLocaleString()} ${conversion.currency || 'XAF'}`
                        : `≈ ${(monthlyFee * 600).toLocaleString()} XAF`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-2 text-[10px] text-slate-400 border-t border-white/5">
                    <Lock size={11} className="text-emerald-400 shrink-0" />
                    <span>Secure 256-bit encrypted checkout via Swychr / AccountPe.</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('overview')}
                    className="flex-1 py-3.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={initiateMutation.isPending}
                    onClick={handleStartCheckout}
                    className="flex-2 py-3.5 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {initiateMutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Redirecting to Swychr…</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        <span>Pay with Swychr</span>
                        <ExternalLink size={13} />
                      </>
                    )}
                  </button>
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
                  {verifyData?.status === 'success' ? 'Payment Confirmed! 🎉' : 'Awaiting Payment Confirmation'}
                </h3>
                <p className="text-slate-300 text-xs font-medium max-w-sm mx-auto mb-6">
                  {verifyData?.status === 'success'
                    ? 'Your workspace has been upgraded to CPROHUB Premium.'
                    : 'Complete your payment in the Swychr payment window. Once finished, this page will activate your Premium subscription automatically.'}
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

