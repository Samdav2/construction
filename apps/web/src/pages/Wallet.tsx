/**
 * /dashboard/wallet
 *
 * Full wallet page:
 *  – Balance card (always in user's chosen currency equivalent)
 *  – Top-up modal: enter USD → see live local-currency preview → redirect to Swychr
 *  – Transaction history table
 *  – Handles /dashboard/wallet/verify?transaction_id=… after Swychr redirect
 */
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import { useCurrencyStore, SUPPORTED_CURRENCIES } from '../store/useCurrencyStore';
import { ALL_COUNTRIES, getCountryByCode } from '../lib/countries';

import apiClient from '../api/client';
import toast from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet as WalletIcon, Plus, ArrowUpCircle, ArrowDownCircle,
  Loader2, CheckCircle2, AlertCircle, RefreshCw,
  ExternalLink, X, Clock, TrendingUp, Lock, Globe, ArrowRightLeft, ShieldCheck
} from 'lucide-react';

type WalletTransaction = {
  type: 'credit' | 'debit' | string;
  amount: number;
  amountUSD?: number;
  currency?: string;
  note?: string;
  transactionId?: string;
  date?: string;
};

type VerifyResponse = {
  status: 'success' | 'pending' | string;
  balance?: number;
  alreadyCredited?: boolean;
};

// ─── VerifyBanner ─────────────────────────────────────────────────
const VerifyBanner = ({ txId, onSuccess }: { txId: string; onSuccess: () => void }) => {
  const qc = useQueryClient();
  const MAX = 20;
  const attemptsRef = useRef(0);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);

  const { data, isError } = useQuery<VerifyResponse, unknown, VerifyResponse, [string, string | null]>({
    queryKey: ['wallet-verify', txId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/wallet/topup-verify/${txId}`);
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX) setMaxAttemptsReached(true);
      return data as VerifyResponse;
    },
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      if (status === 'success' || attemptsRef.current >= MAX) return false;
      return 3000;
    },
    enabled: !!txId,
  });

  useEffect(() => {
    if (data?.status === 'success') {
      toast.success('Wallet topped up successfully!');
      qc.invalidateQueries({ queryKey: ['wallet-balance'] });
      qc.invalidateQueries({ queryKey: ['wallet-history'] });
      onSuccess();
    }
  }, [data, qc, onSuccess]);

  if (data?.status === 'success') {
    return (
      <div className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl px-5 py-4 mb-6">
        <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
        <p className="text-sm font-bold text-emerald-300">Payment confirmed! Your wallet has been credited in USD.</p>
      </div>
    );
  }

  if (isError || maxAttemptsReached) {
    return (
      <div className="flex items-center gap-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl px-5 py-4 mb-6">
        <AlertCircle className="text-rose-400 shrink-0" size={20} />
        <p className="text-sm font-bold text-rose-300">Could not confirm payment automatically. Contact support if money was deducted.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-2xl px-5 py-4 mb-6">
      <Loader2 className="text-primary animate-spin shrink-0" size={20} />
      <p className="text-sm font-bold text-primary">Verifying your payment… this takes a few seconds.</p>
    </div>
  );
};

// ─── TopUp Modal ──────────────────────────────────────────────────
const TopUpModal = ({ onClose, initialCountryCode, isCurrencyLocked }: { onClose: () => void; initialCountryCode?: string; isCurrencyLocked?: boolean }) => {
  const { setCurrency } = useCurrencyStore();
  const [countryCode, setCountryCode] = useState(initialCountryCode || 'CM');
  const selectedCountry = getCountryByCode(countryCode);

  const [localAmount, setLocalAmount] = useState<string>(String(selectedCountry.suggestedAmounts[1] || 10000));
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ratePreview, setRatePreview] = useState<{ usd: number; rate: number; currency: string } | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  const numLocal = Number(localAmount) || 0;

  // Sync currency store when country changes
  useEffect(() => {
    const match = SUPPORTED_CURRENCIES.find((c) => c.code === selectedCountry.currency);
    if (match) setCurrency(match);
  }, [selectedCountry.currency, setCurrency]);

  // Live rate fetch (Local Currency → USD) whenever localAmount or countryCode changes
  useEffect(() => {
    const amount = Number(localAmount);
    if (!amount || amount <= 0) {
      setRatePreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingRate(true);
      try {
        const { data } = await apiClient.get('/wallet/rate', {
          params: { from: 'local', localAmount: amount, countryCode }
        });
        setRatePreview({
          usd: data.usd,
          rate: data.rate || (amount / (data.usd || 1)),
          currency: data.currency || selectedCountry.currency
        });
      } catch {
        // Fallback calculation
        const FALLBACK_RATES: Record<string, number> = {
          XAF: 600, XOF: 600, NGN: 1600, GHS: 15, KES: 130, ZAR: 19, EGP: 48,
          RWF: 1350, TZS: 2600, UGX: 3700, USD: 1, EUR: 0.92, GBP: 0.79,
        };
        const rate = FALLBACK_RATES[selectedCountry.currency] ?? 600;
        const usd = Number((amount / rate).toFixed(2));
        setRatePreview({ usd, rate, currency: selectedCountry.currency });
      } finally {
        setLoadingRate(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [localAmount, countryCode, selectedCountry.currency]);

  const initiateMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/wallet/topup-initiate', {
        amountLocal: numLocal,
        countryCode,
        phoneNumber: phoneNumber.trim(),
      });
      return data;
    },
    onSuccess: (data) => {
      window.location.href = data.paymentLink;
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err) ? (err.response?.data as { message?: string })?.message : undefined;
      toast.error(message || 'Failed to create payment link.');
    },
  });

  const usdValue = ratePreview?.usd ?? (numLocal > 0 ? Number((numLocal / 600).toFixed(2)) : 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-card text-foreground rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-border p-6 sm:p-8 my-8 relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/15 rounded-2xl flex items-center justify-center text-primary">
              <WalletIcon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground">Fund Your Wallet</h2>
              <p className="text-xs text-muted-foreground font-medium">Deposit in your local currency & receive USD</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-xl hover:bg-muted">
            <X size={20} />
          </button>
        </div>

        {/* Country selector */}
        <div className="mb-5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center justify-between">
            <span>Payment Country & Base Currency</span>
            {isCurrencyLocked && <span className="flex items-center gap-1 text-[9px] text-amber-500 font-bold"><Lock size={10} /> Locked</span>}
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
            <select
              value={countryCode}
              disabled={isCurrencyLocked}
              onChange={(e) => {
                setCountryCode(e.target.value);
                const nextCountry = getCountryByCode(e.target.value);
                setLocalAmount(String(nextCountry.suggestedAmounts[1] || 10000));
              }}
              className="w-full pl-12 pr-10 py-3.5 bg-muted rounded-2xl text-sm font-semibold text-foreground border border-border outline-none focus:ring-2 focus:ring-primary/40 appearance-none disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {ALL_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-background text-foreground py-1">
                  {c.flag} {c.name} — {c.currency} ({c.currencySymbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick select amounts in base currency */}
        <div className="mb-5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
            Quick Select ({selectedCountry.currency})
          </label>
          <div className="grid grid-cols-3 gap-2">
            {selectedCountry.suggestedAmounts.map((amt) => {
              const isSelected = String(amt) === String(localAmount);
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLocalAmount(String(amt))}
                  className={`py-3 px-2 rounded-xl font-black text-xs sm:text-sm transition-all text-center ${
                    isSelected
                      ? 'bg-primary text-slate-950 shadow-md shadow-yellow-500/20 scale-[1.02]'
                      : 'bg-muted text-foreground/80 hover:bg-muted/80 border border-border/60'
                  }`}
                >
                  {amt.toLocaleString()} {selectedCountry.currencySymbol}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom amount in base currency */}
        <div className="mb-5">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
            Amount to Deposit ({selectedCountry.currency})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-sm text-muted-foreground">
              {selectedCountry.currencySymbol}
            </span>
            <input
              type="number"
              min="100"
              placeholder={`Enter amount in ${selectedCountry.currency}`}
              value={localAmount}
              onChange={(e) => setLocalAmount(e.target.value)}
              className="w-full pl-14 pr-16 py-3.5 bg-muted rounded-2xl text-base font-bold text-foreground placeholder:text-muted-foreground/50 border border-border outline-none focus:ring-2 focus:ring-primary/40"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground uppercase">
              {selectedCountry.currency}
            </span>
          </div>
        </div>

        {/* Live Converter Display */}
        <AnimatePresence>
          {numLocal > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-primary/10 border border-primary/25 rounded-2xl p-4.5 mb-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <ArrowRightLeft size={14} />
                  <span>Live Currency Conversion</span>
                </div>
                {loadingRate && <Loader2 size={14} className="text-primary animate-spin" />}
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">You deposit</p>
                  <p className="text-lg font-black text-foreground">
                    {numLocal.toLocaleString()} {selectedCountry.currency}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground font-medium">Wallet credited</p>
                  <p className="text-2xl font-black text-primary tracking-tight">
                    ${usdValue.toFixed(2)} <span className="text-xs text-foreground/50 font-bold">USD</span>
                  </p>
                </div>
              </div>

              {ratePreview?.rate && (
                <div className="mt-2.5 pt-2.5 border-t border-primary/15 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Exchange Rate:</span>
                  <span className="font-bold text-foreground">1 USD ≈ {Math.round(ratePreview.rate).toLocaleString()} {selectedCountry.currency}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Money / Phone Number */}
        <div className="mb-6">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 block">
            Mobile Money / Phone Number
          </label>
          <input
            type="tel"
            placeholder={`e.g. ${selectedCountry.phonePrefix} 670123456`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3.5 bg-muted rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground/50 border border-border outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <button
          type="button"
          onClick={() => initiateMutation.mutate()}
          disabled={!localAmount || numLocal <= 0 || initiateMutation.isPending}
          className="w-full py-4.5 bg-primary text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
        >
          {initiateMutation.isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Generating Payment Link…</span>
            </>
          ) : (
            <>
              <ExternalLink size={18} />
              <span>
                Deposit {numLocal.toLocaleString()} {selectedCountry.currency} • Credit ${usdValue.toFixed(2)} USD
              </span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground mt-4">
          <ShieldCheck size={14} className="text-primary" />
          <span>Secured by Swychr & AccountPe • Safe instant settlement</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main page ────────────────────────────────────────────────────
const Wallet = () => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const txIdToVerify = searchParams.get('transaction_id');
  const { format, setCurrency } = useCurrencyStore();

  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const { data } = await apiClient.get('/wallet/balance');
      return data;
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!balanceData?.currency) return;
    const match = SUPPORTED_CURRENCIES.find((c) => c.code === balanceData.currency);
    if (match) setCurrency(match);
  }, [balanceData?.currency, setCurrency]);

  const { data: history, isLoading: historyLoading } = useQuery<WalletTransaction[], unknown, WalletTransaction[], ['wallet-history']>({
    queryKey: ['wallet-history'],
    queryFn: async () => {
      const { data } = await apiClient.get('/wallet/history');
      return data as WalletTransaction[];
    },
  });

  const balance = balanceData?.balance ?? 0;
  const currency = balanceData?.currency ?? 'USD';
  // Whether the workspace currency is locked (after first top-up) — tolerate multiple possible keys
  const isCurrencyLocked = Boolean((balanceData as any)?.currencyLocked || (balanceData as any)?.isCurrencyLocked);

  // Compute total credited in USD where available, else use local amount as fallback
  const totalCredited = (history ?? []).filter((t) => t.type === 'credit').reduce((sum, t) => {
    const v = typeof t.amountUSD === 'number' ? t.amountUSD : (typeof t.amount === 'number' ? t.amount : 0);
    return sum + v;
  }, 0);

  return (
    <DashboardShell>
      <AnimatePresence>
        {showTopUp && <TopUpModal onClose={() => setShowTopUp(false)} initialCountryCode={balanceData?.countryCode} isCurrencyLocked={isCurrencyLocked} />}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto pb-20">
        {/* Verify banner after redirect */}
        {txIdToVerify && (
          <VerifyBanner
            txId={txIdToVerify}
            onSuccess={() => setSearchParams({})}
          />
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Workspace Wallet</h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Fund your account to unlock BOQ exports, listings, and premium tools.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTopUp(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-brand-navy rounded-2xl font-black text-sm shadow-yellow hover:scale-[1.02] transition-all shrink-0"
          >
            <Plus size={18} /> Top Up Wallet
          </button>
        </div>

        {/* Balance + stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Balance card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-card rounded-[2.5rem] border border-primary/20 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="flex items-start justify-between mb-6 relative">
              <div className="w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center">
                <WalletIcon size={26} className="text-primary" />
              </div>
              <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Available balance</span>
            </div>
            {balanceLoading ? (
              <Loader2 size={32} className="animate-spin text-primary mb-2" />
            ) : (
              <div>
                <p className="text-5xl font-black text-foreground tracking-tighter mb-1">
                  {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  <span className="text-2xl text-foreground/40 ml-2">{currency}</span>
                </p>
                <p className="text-sm text-foreground/40 font-medium">{format(balance)}</p>
              </div>
            )}
          </motion.div>

          {/* Quick stats */}
          <div className="space-y-4">
            <div className="bg-card rounded-[2rem] border border-border p-5">
  <div className="flex items-center gap-3 mb-2">
    <TrendingUp size={18} className="text-emerald-400" />
    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Total Credited</span>
  </div>
  <p className="text-xl font-black text-foreground">
    {historyLoading
      ? '…'
      : `${totalCredited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
    }
  </p>
</div>
            <div className="bg-card rounded-[2rem] border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={18} className="text-foreground/40" />
                <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Transactions</span>
              </div>
              <p className="text-xl font-black text-foreground">
                {historyLoading ? '…' : (history?.length ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Top-up CTA banner when balance is 0 */}
        {!balanceLoading && balance === 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 mb-10 flex items-center justify-between gap-4">
            <div>
              <p className="font-black text-primary text-sm mb-0.5">Your wallet is empty</p>
              <p className="text-xs text-muted-foreground font-medium">Top up to unlock all platform features including BOQ exports and paid listings.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowTopUp(true)}
              className="px-5 py-2.5 bg-primary text-brand-navy rounded-xl font-black text-xs shrink-0 hover:scale-105 transition-all"
            >
              Add Fund
            </button>
          </div>
        )}

        {/* Transaction history */}
        <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden">
          <div className="px-8 py-6 border-b border-border flex items-center justify-between">
            <h3 className="font-black text-foreground text-base">Transaction History</h3>
            <button
              type="button"
              onClick={() => {}}
              className="p-2 rounded-xl text-foreground/40 hover:text-primary hover:bg-white/5 transition-all"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-20 text-foreground/30">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : !history?.length ? (
            balance > 0 ? (
              <div className="px-8 py-5">
                <motion.div
                  key="synthetic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between px-0 py-5"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-500/15 text-emerald-400`}>
                      <ArrowUpCircle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">Top-up (recorded)</p>
                      <p className="text-[11px] text-foreground/40 font-medium">—</p>
                    </div>
                  </div>
                  <span className={`font-black text-sm text-emerald-400`}>+{balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-20">
                <WalletIcon size={40} className="mx-auto text-foreground/15 mb-3" />
                <p className="text-foreground/40 font-bold text-sm">No transactions yet</p>
                <p className="text-muted-foreground/50 text-xs mt-1">Your top-ups and spending will appear here.</p>
              </div>
            )
          ) : (
            <div className="divide-y divide-brand-border">
              {history.map((tx, i) => (
                <motion.div
                  key={tx.transactionId || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between px-8 py-5 hover:bg-white/2 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                      {tx.type === 'credit'
                        ? <ArrowUpCircle size={20} />
                        : <ArrowDownCircle size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">{tx.note || (tx.type === 'credit' ? 'Top-up' : 'Debit')}</p>
                      <p className="text-[11px] text-foreground/40 font-medium">
                        {tx.date ? new Date(tx.date).toLocaleString() : '—'}
                        {tx.transactionId && <span className="ml-2 opacity-50 font-mono text-[10px]">{tx.transactionId.slice(-12)}</span>}
                      </p>
                    </div>
                  </div>
                  <span className={`font-black text-sm ${tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'credit' ? '+' : '−'}
                    {tx.type === 'credit' && tx.amountUSD != null
                      ? `${tx.amountUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD`
                      : `${Number(tx.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${tx.currency ?? currency}`}
                    {tx.type === 'credit' && tx.amountUSD != null && tx.currency && tx.currency !== 'USD' ? ` • ${tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${tx.currency}` : ''}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default Wallet;
