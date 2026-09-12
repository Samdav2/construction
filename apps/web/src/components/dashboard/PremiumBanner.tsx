import { ArrowRight, Zap } from 'lucide-react';
import { useState } from 'react';
import { PremiumModal } from './PremiumModal';

interface PremiumBannerProps {
  plan?: string;
  className?: string;
}

export const PremiumBanner = ({ plan = 'basic', className = '' }: PremiumBannerProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Only display banner if the company is on basic plan
  if (plan === 'pro' || plan === 'enterprise') {
    return null;
  }

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FFC107] via-[#F59E0B] to-[#D97706] p-4 sm:p-4.5 shadow-md shadow-amber-500/10 text-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 select-none ${className}`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        <div className="flex items-start sm:items-center gap-3 relative z-10 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-slate-950 text-[#FFC107] flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
            <Zap size={18} className="fill-[#FFC107]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">
                GROWTH PLAN
              </span>
              <h4 className="text-xs sm:text-sm font-black text-slate-950 sm:whitespace-nowrap">
                Only Pay When a Client Contacts You
              </h4>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-900/85 mt-1 leading-normal break-words max-w-2xl">
              Recharge your account and promote your construction business. Your balance is only deducted when a client contacts you.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-white font-black text-xs px-4.5 py-2.5 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Recharge Your Account</span>
            <ArrowRight size={13} strokeWidth={2.5} className="shrink-0" />
          </button>
        </div>
      </div>

      <PremiumModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        featureTitle="Only Pay When a Client Contacts You"
        featureDesc="Recharge your account and promote your construction business. Your balance is only deducted when a client contacts you."
      />
    </>
  );
};
