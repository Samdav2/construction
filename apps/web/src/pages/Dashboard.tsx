import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';
import { useAuthStore } from '../store/useAuthStore';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { TourModal } from '../components/dashboard/TourModal';
import { PremiumBanner } from '../components/dashboard/PremiumBanner';
import { PremiumModal } from '../components/dashboard/PremiumModal';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import {
  Briefcase, ClipboardList, FileText, Users, Radar,
  BarChart, Sparkles, Store, Building2, Calculator, ArrowRight,
  Wallet, Receipt, MessageSquare, Settings, Lock
} from 'lucide-react';

// Types
interface Overview {
  projects: { total: number; byStatus: Record<string, number> };
  budget: { total: number; spent: number; utilization: number };
  boq: {
    totalValue: number; verifiedValue: number; pendingValue: number;
    itemsTotal: number; itemsVerified: number; itemsPending: number; itemsRejected: number;
    verificationRate: number;
  };
}

interface DashboardCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  path: string;
  delay: number;
  isPrimary?: boolean;
  className?: string;
  isPremiumOnly?: boolean;
  isUserPremium?: boolean;
  onLockedClick?: () => void;
}

// Dashboard Card Component
const DashboardCard = ({ 
  icon: Icon, 
  title, 
  desc, 
  path, 
  delay, 
  isPrimary = false, 
  className = '', 
  isPremiumOnly = false,
  isUserPremium = true,
  onLockedClick 
}: DashboardCardProps) => (
  <Link 
    to={path} 
    onClick={(e) => {
      if (isPremiumOnly && !isUserPremium) {
        e.preventDefault();
        if (onLockedClick) onLockedClick();
      }
    }}
   className={`group block relative overflow-hidden rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 ${
  isPrimary
    ? 'bg-foreground text-background border-foreground shadow-xl'
    : 'bg-card text-foreground border-border shadow-sm hover:shadow-lg'
} ${className}`}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative z-10 h-full p-5 sm:p-8 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1rem] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
          isPrimary ? 'bg-background/10 text-primary' : 'bg-muted text-foreground'
        }`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        
        {isPremiumOnly && !isUserPremium ? (
          <span className="bg-[#FFC107] text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Lock size={10} /> PRO
          </span>
        ) : (
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 ${
            isPrimary ? 'bg-primary text-foreground' : 'bg-foreground text-background'
          }`}>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div className="relative z-20">
        <h3 className={`text-base sm:text-xl font-black tracking-tight mb-1 sm:mb-2 ${isPrimary ? 'text-background' : 'text-foreground'}`}>
          {title}
        </h3>
        <p className={`text-[10px] sm:text-xs font-semibold leading-relaxed max-w-[90%] ${isPrimary ? 'text-background/70' : 'text-muted-foreground'}`}>
          {desc}
        </p>
      </div>

      <div className={`absolute -bottom-6 -right-6 pointer-events-none transition-transform duration-500 group-hover:scale-110 ${
        isPrimary ? 'opacity-5 text-background' : 'opacity-[0.03] text-foreground'
      }`}>
        <Icon size={140} />
      </div>
    </motion.div>
  </Link>
);

// Main Dashboard Component
const Dashboard = () => {
  const { user } = useAuthStore();
  const { getHasSeenTour } = useOnboardingStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [premiumModalConfig, setPremiumModalConfig] = useState<{ open: boolean; title?: string; desc?: string }>({ open: false });

  const premiumTx = searchParams.get('premium_tx');

  // If redirected back with a Swychr transaction ID, verify it
  useEffect(() => {
    if (premiumTx) {
      apiClient.get(`/auth/company/subscribe-verify/${premiumTx}`)
        .then((res) => {
          if (res.data?.status === 'success') {
            toast.success('CPROHUB Premium activated successfully! 🚀');
            queryClient.invalidateQueries({ queryKey: ['company-profile'] });
            queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
            searchParams.delete('premium_tx');
            setSearchParams(searchParams, { replace: true });
          }
        })
        .catch(() => {});
    }
  }, [premiumTx, queryClient, searchParams, setSearchParams]);

  // Prefetch overview data
  useQuery<Overview>({
    queryKey: ['analytics-overview'],
    queryFn: async () => (await apiClient.get('/analytics/overview')).data,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch company profile to check subscription plan and onboarding completeness
  const { data: company } = useQuery({
    queryKey: ['company-profile'],
    queryFn: async () => (await apiClient.get('/auth/company/profile')).data,
    enabled: !!user,
  });

  // Fetch wallet balance
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: async () => (await apiClient.get('/wallet/balance')).data,
    enabled: user?.role === 'owner',
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const balance = useMemo(() => {
    if (walletData && !walletLoading) {
      return Number(walletData.balance || 0);
    }
    return null;
  }, [walletData, walletLoading]);

  const plan = company?.plan || (user as any)?.plan || 'basic';
  const hasWalletAccess = balance !== null && balance >= 10;
  const isPremium = plan === 'pro' || plan === 'enterprise' || hasWalletAccess;

  const formattedBalance = useMemo(() => {
    if (balance !== null) {
      return `$${Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return 'Loading...';
  }, [balance]);

  // Check if business profile needs setup
  const isProfileIncomplete = company && (!company.city || !company.phone || !company.address);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardShell>
      <AnimatePresence>
        {user?.id && user.role === 'owner' && !getHasSeenTour(user.id) && (
          <TourModal />
        )}
      </AnimatePresence>
      
      <div className="max-w-[1600px] mx-auto pb-20">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-border pb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Workspace Active
              </span>
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Member'} 👋
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2 flex items-center gap-2">
              <span>{company?.name || user?.company || 'Cprohub Workspace'}</span>
              <span>•</span>
              <span className={isPremium ? 'text-[#FFC107] font-black' : 'text-muted-foreground'}>
                {isPremium ? (hasWalletAccess && plan === 'basic' ? '⭐ Pro Access (Wallet $10+)' : '⭐ Premium Plan') : 'Basic Plan'}
              </span>
            </p>
          </motion.div>

          {/* Display wallet balance for owner if active */}
          {user?.role === 'owner' && balance !== null && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate('/dashboard/wallet')}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Wallet Balance</p>
                <p className="text-lg font-black text-foreground">{formattedBalance}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* PERSISTENT PREMIUM UPGRADE BANNER (for Free / Basic users) */}
        {!isPremium && (
          <div className="mb-8">
            <PremiumBanner plan={plan} />
          </div>
        )}

        {/* BUSINESS PROFILE SETUP REMINDER (if incomplete) */}
        {isProfileIncomplete && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                <Settings size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black text-foreground">Complete Your Business Profile</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Set up your trade category, phone number, and location in Business Settings to customize invoices and public branding.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/settings/business')}
              className="px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground text-xs font-black rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Setup Business</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* DASHBOARD CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
          {/* Business Directory (Premium Gated) */}
          <DashboardCard
            icon={Building2}
            title="Business Directory"
            desc="Manage public profile, directory listing, and client inquiries."
            path="/dashboard/inquiries"
            delay={0.05}
            isPrimary={true}
            isPremiumOnly={true}
            isUserPremium={isPremium}
            onLockedClick={() => setPremiumModalConfig({
              open: true,
              title: 'Only Pay When a Client Contacts You',
              desc: 'Recharge your account and promote your construction business. Your balance is only deducted when a client contacts you.'
            })}
          />

          {/* Business Marketplace (Premium Gated for selling materials) */}
          <DashboardCard
            icon={Store}
            title="Business Marketplace"
            desc="Sell heavy equipment and building materials."
            path="/dashboard/marketplace"
            delay={0.4}
            isPremiumOnly={true}
            isUserPremium={isPremium}
            onLockedClick={() => setPremiumModalConfig({
              open: true,
              title: 'Only Pay When a Client Contacts You',
              desc: 'Recharge your account and promote your construction business. Your balance is only deducted when a client contacts you.'
            })}
          />

          {/* Scraper / Opportunities (Premium Gated) */}
          <DashboardCard
            icon={Radar}
            title="Scraper"
            desc="Discover new leads and business tenders."
            path="/dashboard/opportunities"
            delay={0.15}
            isPremiumOnly={true}
            isUserPremium={isPremium}
            onLockedClick={() => setPremiumModalConfig({
              open: true,
              title: 'Only Pay When a Client Contacts You',
              desc: 'Recharge your account and promote your construction business. Your balance is only deducted when a client contacts you.'
            })}
          />

          <DashboardCard
            icon={Calculator}
            title="BOQ Tool"
            desc="Generate professional Bills of Quantities."
            path="/dashboard/boq"
            delay={0.1}
          />

          <DashboardCard
            icon={ClipboardList}
            title="Opportunities"
            desc="Browse open opportunities and submit bids."
            path="/dashboard/tenders"
            delay={0.18}
          />

          <DashboardCard
            icon={Sparkles}
            title="AI Hub"
            desc="Leverage AI for engineering insights and safety."
            path="/dashboard/ai"
            delay={0.2}
            isPrimary={true}
          />

          <DashboardCard
            icon={Receipt}
            title="Smart Receipts"
            desc="Generate, track, and download professional receipts."
            path="/dashboard/receipts"
            delay={0.25}
          />

          <DashboardCard
            icon={MessageSquare}
            title="Community"
            desc="Connect and share with construction professionals."
            path="/dashboard/community"
            delay={0.3}
          />

          <DashboardCard
            icon={Briefcase}
            title="Project Pulse"
            desc="Monitor ongoing site operations and daily field reports."
            path="/dashboard/projects"
            delay={0.35}
          />

          <DashboardCard
            icon={FileText}
            title="Invoices"
            desc="Create, send, and track financial invoices."
            path="/dashboard/invoices"
            delay={0.45}
          />

          <DashboardCard
            icon={BarChart}
            title="Analytics"
            desc="Live BOQ value, budgets, and AI adoption metrics."
            path="/dashboard/analytics"
            delay={0.5}
          />

          <DashboardCard
            icon={Users}
            title="Workers Management"
            desc="Payroll, attendance, timesheets, and team tasks."
            path="/dashboard/workers-management"
            delay={0.6}
          />
        </div>

        {/* PREMIUM MODAL */}
        <PremiumModal
          isOpen={premiumModalConfig.open}
          onClose={() => setPremiumModalConfig({ open: false })}
          featureTitle={premiumModalConfig.title}
          featureDesc={premiumModalConfig.desc}
        />
      </div>
    </DashboardShell>
  );
};

export default Dashboard;