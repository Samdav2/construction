import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Building2,
  Store,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/auth/company/subscribe');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-overview'] });
      toast.success('Successfully upgraded to CPROHUB Premium! 🚀');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to activate subscription.');
    }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-[#071426] text-white border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-[2.5rem] overflow-hidden p-6 sm:p-8 select-none"
          >
            {/* Top Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC107]/15 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFC107]/20 border border-[#FFC107]/40 px-3 py-1 rounded-full text-[#FFC107] text-xs font-black uppercase tracking-wider mb-4">
              <Sparkles size={13} />
              <span>Premium Tier Required</span>
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

            {/* Upgrade CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="order-2 sm:order-1 flex-1 py-3.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center"
              >
                Maybe Later
              </button>
              <button
                onClick={() => subscribeMutation.mutate()}
                disabled={subscribeMutation.isPending}
                className="order-1 sm:order-2 flex-2 py-3.5 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {subscribeMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Zap size={14} className="fill-slate-950" />
                    <span>Upgrade to Premium</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
