import { useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DashboardShell } from '../components/layout/DashboardShell';
import apiClient from '../api/client';
import { t } from '../theme';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  Radar, Search, MapPin, Calendar, Building2, RefreshCw, Loader2,
  ExternalLink, Mail, Briefcase, Landmark, Target, Zap, Lock,
} from 'lucide-react';
import { PremiumModal } from '../components/dashboard/PremiumModal';

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  type: 'job' | 'tender';
  category: string;
  source: string;
  sourceUrl: string;
  organization: string;
  country: string;
  region: string;
  city: string;
  locationText: string;
  budget: number;
  currency: string;
  deadline: string | null;
  isConstruction: boolean;
  sector: 'government' | 'private';
  contactEmail: string;
  contactPhone: string;
  postedAt: string;
  matchScore: number;
  matchReasons?: string[];
}

interface OpportunitiesResponse {
  opportunities: Opportunity[];
  total: number;
}

const DAY = 24 * 60 * 60 * 1000;

const fmtDate = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const daysUntil = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / DAY);
};

/* Match score pill — green ≥75, amber 50–74, slate <50 */
const MatchPill = ({ score }: { score: number }) => {
  const s = Math.round(score || 0);
  const tone =
    s >= 75
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : s >= 50
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-muted text-muted-foreground border-border';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${tone}`}>
      <Target size={11} /> {s}% match
    </span>
  );
};

const TypeBadge = ({ type }: { type: 'job' | 'tender' }) =>
  type === 'tender' ? (
    <span className="px-3 py-1 bg-primary-pale text-primary text-[9px] font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1">
      <Landmark size={10} /> Tender
    </span>
  ) : (
    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20 inline-flex items-center gap-1">
      <Briefcase size={10} /> Job
    </span>
  );

const OpportunityCard = ({
  o,
  money,
  index,
}: {
  o: Opportunity;
  money: (usd: number) => string;
  index: number;
}) => {
  const loc = o.locationText || [o.city, o.country].filter(Boolean).join(', ') || 'Location N/A';
  const deadline = fmtDate(o.deadline);
  const left = daysUntil(o.deadline);
  const closingSoon = left != null && left >= 0 && left <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className={`${t.cardLg} ${t.cardHover} p-7 flex flex-col`}
    >
      {/* Top row: badges + source */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <TypeBadge type={o.type} />
          {o.sector && (
            <span className={t.badgeNavy + ' capitalize'}>{o.sector}</span>
          )}
        </div>
        {o.source && (
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 shrink-0">
            {o.source}
          </span>
        )}
      </div>

      {/* Title + org */}
      <h3 className="text-lg font-black text-foreground tracking-tight leading-snug">{o.title}</h3>
      {o.organization && (
        <p className={`${t.muted} flex items-center gap-1.5 mt-1`}>
          <Building2 size={13} className="text-primary shrink-0" /> {o.organization}
        </p>
      )}

      {o.description && (
        <p className="text-sm text-muted-foreground font-medium mt-3 line-clamp-2">{o.description}</p>
      )}

      {/* Meta row */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="flex items-center gap-1.5 text-sm font-bold text-foreground/80">
          <MapPin size={14} className="text-muted-foreground shrink-0" /> {loc}
        </span>
        {deadline && (
          <span
            className={`flex items-center gap-1.5 text-sm font-bold ${closingSoon ? 'text-rose-400' : 'text-foreground/80'}`}
          >
            <Calendar size={14} className={closingSoon ? 'text-rose-400 shrink-0' : 'text-muted-foreground shrink-0'} />
            {closingSoon ? `Closing soon · ${deadline}` : deadline}
          </span>
        )}
        {o.budget > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-black text-foreground">
            {money(o.budget)}
          </span>
        )}
      </div>

      {/* Why this matches you */}
      {o.matchReasons && o.matchReasons.length > 0 && (
        <div className="mt-4 flex items-start gap-2">
          <Target size={13} className="text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] font-semibold text-muted-foreground leading-snug">
            <span className="text-foreground/70 font-bold">Why this matches you: </span>
            {o.matchReasons.join(' · ')}
          </p>
        </div>
      )}

      {/* Footer: match + actions */}
      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between gap-3 flex-wrap">
        <MatchPill score={o.matchScore} />
        <div className="flex items-center gap-2">
          {o.contactEmail && (
            <a
              href={`mailto:${o.contactEmail}`}
              className={`${t.btnSecondary} !px-4 !py-2.5 inline-flex items-center gap-2`}
              title={o.contactEmail}
            >
              <Mail size={13} /> Contact
            </a>
          )}
          {o.sourceUrl && (
            <a
              href={o.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${t.btnPrimary} !px-5 !py-2.5 inline-flex items-center gap-2`}
            >
              Apply / View <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const KpiCard = ({ icon: Icon, label, value, tint }: any) => (
  <div className={`${t.statCard} flex items-center gap-4`}>
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tint}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-black text-foreground leading-none">{value}</p>
      <p className={`mt-1.5 ${t.label}`}>{label}</p>
    </div>
  </div>
);

const Opportunities = () => {
  const { fromUSD, format } = useCurrencyStore();
  const money = (usd: number) => format(fromUSD(usd || 0));
  const { user } = useAuthStore();
  const isOwner = user?.role === 'owner';
  const qc = useQueryClient();

  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Check subscription plan & wallet balance
  const { data: company } = useQuery({
    queryKey: ['company-profile'],
    queryFn: async () => (await apiClient.get('/auth/company/profile')).data,
    enabled: !!user,
  });

  const { data: walletData } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => (await apiClient.get('/wallet/balance')).data,
    enabled: isOwner,
    staleTime: 30000,
  });

  const plan = company?.plan || (user as any)?.plan || 'basic';
  const walletBalance = Number(walletData?.balance || 0);
  const hasWalletAccess = walletBalance >= 10;
  const isPremium = plan === 'pro' || plan === 'enterprise' || hasWalletAccess;

  // Filter inputs
  const [searchInput, setSearchInput] = useState('');
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [sector, setSector] = useState('');

  // Debounce search input → q
  useEffect(() => {
    const id = setTimeout(() => setQ(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useQuery<OpportunitiesResponse>({
    queryKey: ['opportunities', { type, country, category, q, sector }],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (type) params.type = type;
      if (country) params.country = country;
      if (category) params.category = category;
      if (q) params.q = q;
      if (sector) params.sector = sector;
      return (await apiClient.get('/opportunities', { params })).data;
    },
  });

  const ingest = useMutation({
    mutationFn: async () => (await apiClient.post('/opportunities/ingest')).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });

  const opportunities = data?.opportunities ?? [];

  // Distinct options derived from current data
  const countryOptions = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.country).filter(Boolean))).sort(),
    [opportunities]
  );
  const categoryOptions = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.category).filter(Boolean))).sort(),
    [opportunities]
  );

  // KPIs computed from returned list
  const tenders = opportunities.filter((o) => o.type === 'tender').length;
  const jobs = opportunities.filter((o) => o.type === 'job').length;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(searchInput.trim());
  };

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto pb-20">
        {/* HEADER */}
        <header className={t.pageHeader}>
          <div>
            <h1 className={`${t.h2} italic flex items-center gap-3`}>
              <Radar className="text-primary" size={30} /> Tenders
            </h1>
            <p className={t.muted}>Construction jobs &amp; tenders, matched to your company</p>
          </div>
          {isOwner && (
            <button
              onClick={() => {
                if (!isPremium) {
                  setShowPremiumModal(true);
                  return;
                }
                ingest.mutate();
              }}
              disabled={ingest.isPending}
              className={`${t.btnPrimary} inline-flex items-center gap-2 disabled:opacity-60`}
            >
              {ingest.isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Refreshing…
                </>
              ) : !isPremium ? (
                <>
                  <Lock size={15} /> Refresh (Pro)
                </>
              ) : (
                <>
                  <RefreshCw size={15} /> Refresh
                </>
              )}
            </button>
          )}
        </header>

        {/* PRO / WALLET ACCESS BANNER */}
        {!isPremium && (
          <div className="mb-8 bg-[#071426] border border-white/15 rounded-3xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center shrink-0">
                <Zap size={24} className="fill-[#FFC107]" />
              </div>
              <div>
                <h4 className="font-black text-lg text-white">Only Pay When a Client Contacts You</h4>
                <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                  Recharge your account and promote your construction business. Maintain a minimum wallet balance of $10 to access live scraped tenders, contract leads, and automated business opportunities.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="w-full md:w-auto px-6 py-3 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 shrink-0 transition-all cursor-pointer"
            >
              Recharge Account
            </button>
          </div>
        )}

        {/* KPI STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <KpiCard icon={Radar} label="Total Listings" value={data?.total ?? opportunities.length} tint="bg-primary-pale text-primary" />
          <KpiCard icon={Landmark} label="Tenders" value={tenders} tint="bg-amber-500/10 text-amber-400" />
          <KpiCard icon={Briefcase} label="Jobs" value={jobs} tint="bg-indigo-500/10 text-indigo-400" />
        </div>

        {/* FILTER BAR */}
        <form
          onSubmit={onSubmit}
          className={`${t.card} p-5 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sticky top-4 z-10 backdrop-blur`}
        >
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search opportunities…"
              className={`${t.input} !pl-11`}
            />
          </div>

          <select value={type} onChange={(e) => setType(e.target.value)} className={t.select}>
            <option value="">All types</option>
            <option value="tender">Tenders</option>
            <option value="job">Jobs</option>
          </select>

          <select value={country} onChange={(e) => setCountry(e.target.value)} className={t.select}>
            <option value="">All countries</option>
            {countryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)} className={t.select}>
            <option value="">All categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={sector} onChange={(e) => setSector(e.target.value)} className={`${t.select} lg:col-start-5`}>
            <option value="">All sectors</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
          </select>
        </form>

        {/* RESULTS */}
        {isLoading ? (
          <div className="p-20 text-center text-muted-foreground font-bold flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} /> Loading opportunities…
          </div>
        ) : opportunities.length === 0 ? (
          <div className={t.emptyState}>
            <Radar size={40} className="mx-auto text-muted-foreground/40 mb-5" />
            <h3 className={`${t.h3} mb-2`}>No opportunities found</h3>
            <p className={`${t.muted} mb-7 max-w-md mx-auto`}>
              Nothing matches your filters right now. Try widening your search{isOwner ? ', or pull the latest jobs and tenders from live sources.' : '.'}
            </p>
            {isOwner && (
              <button
                onClick={() => ingest.mutate()}
                disabled={ingest.isPending}
                className={`${t.btnPrimary} inline-flex items-center gap-2 disabled:opacity-60`}
              >
                {ingest.isPending ? (
                  <><Loader2 size={15} className="animate-spin" /> Refreshing…</>
                ) : (
                  <><RefreshCw size={15} /> Refresh sources</>
                )}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className={t.label}>{opportunities.length} shown · sorted by match</p>
              {isFetching && (
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <Loader2 size={12} className="animate-spin" /> Updating
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {opportunities.map((o, i) => (
                <OpportunityCard key={o._id} o={o} money={money} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureTitle="Only Pay When a Client Contacts You"
        featureDesc="Recharge your account and promote your construction business. Your balance is only deducted when a client contacts you."
      />
    </DashboardShell>
  );
};

export default Opportunities;
