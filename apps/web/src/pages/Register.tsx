import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Globe,
  ChevronDown,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { ALL_COUNTRIES } from '../lib/countries';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    countryCode: 'CM',
    country: 'Cameroon',
  });

  const [error, setError] = useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: (data: any) => apiClient.post('/auth/register', data),
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth(user, token);
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Registration failed. Please check your information.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError("Please fill in all personal details.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError(null);
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6 relative font-['Plus_Jakarta_Sans',sans-serif]">
      <PublicNavbar />

      <div className="bg-card w-full max-w-lg lg:max-w-4xl rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl flex overflow-hidden min-h-[580px] border border-border mt-14 sm:mt-10">

        {/* LEFT SIDEBAR: VALUE PROPOSITION (Desktop) */}
        <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-[#061224] via-[#0B1E36] to-[#061224] p-10 text-white flex flex-col justify-between relative overflow-hidden border-r border-white/10">
          <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-[#FFC107]/15 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-sky-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-3">
              <div className="flex items-end gap-1 h-7">
                <span className="w-1.5 h-3 bg-[#FFC107] rounded-xs" />
                <span className="w-1.5 h-4.5 bg-[#FFC107] rounded-xs" />
                <span className="w-1.5 h-6 bg-[#FFC107] rounded-xs" />
                <span className="w-1.5 h-7.5 bg-[#FFC107] rounded-xs" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-white">CPROHUB</span>
                <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase -mt-0.5">
                  Build · Manage · Grow
                </span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <h3 className="text-2xl font-black tracking-tight leading-snug">
                One Account for Everything You Build.
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Join thousands of builders, contractors, engineers, and suppliers managing operations seamlessly in one workspace.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 size={16} className="text-[#FFC107] shrink-0 mt-0.5" />
                <span><strong>Instant Setup:</strong> Start using tools in under 30 seconds</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 size={16} className="text-[#FFC107] shrink-0 mt-0.5" />
                <span><strong>Free Core Tools:</strong> BOQ creator, invoices, project tracking & AI Hub</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-200">
                <CheckCircle2 size={16} className="text-[#FFC107] shrink-0 mt-0.5" />
                <span><strong>Business Profile:</strong> Configure your business details anytime in settings</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest relative z-10 border-t border-white/10 pt-4">
            <ShieldCheck size={14} className="text-[#FFC107]" />
            <span>Secure Cloud Infrastructure</span>
          </div>
        </div>

        {/* RIGHT SIDE: SIGN UP FORM */}
        <div className="flex-1 p-8 sm:p-12 md:p-14 relative flex flex-col justify-center">

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FFC107]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quick Sign Up</span>
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">Create Your Account</h2>
            <p className="text-muted-foreground text-xs sm:text-sm font-medium leading-relaxed">
              Sign up with your personal details to get immediate access to your workspace. You can configure your company info and services in your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full p-4.5 pl-12 bg-muted border border-border/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full p-4.5 pl-12 bg-muted border border-border/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Country Selector */}
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35 pointer-events-none" size={18} />
              <select
                value={formData.countryCode}
                onChange={(e) => {
                  const c = ALL_COUNTRIES.find((opt) => opt.code === e.target.value);
                  setFormData({
                    ...formData,
                    countryCode: e.target.value,
                    country: c ? c.name : e.target.value,
                  });
                }}
                required
                className="w-full p-4.5 pl-12 pr-10 bg-muted border border-border/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold text-sm text-foreground appearance-none cursor-pointer"
              >
                {ALL_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-background text-foreground py-1">
                    {c.flag} {c.name} ({c.currency})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/35 pointer-events-none" size={18} />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password (min. 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full p-4.5 pl-12 pr-14 bg-muted border border-border/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full py-4.5 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                {registerMutation.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>Create Account & Start</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Login Link */}
          <div className="mt-8 text-center border-t border-border/60 pt-6">
            <p className="text-xs text-muted-foreground font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-black hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
