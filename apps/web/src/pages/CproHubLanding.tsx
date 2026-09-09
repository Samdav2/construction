import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Play,
  ArrowRight,
  Clock,
  TrendingUp,
  Users,
  ShieldCheck,
  Building2,
  ShoppingCart,
  Compass,
  FileSpreadsheet,
  Briefcase,
  Receipt,
  Activity,
  FileText,
  BarChart3,
  HardHat,
  Gift,
  Menu,
  X,
  Wifi,
  Battery,
  MessageSquare,
  Bell,
  User,
  Package,
  FolderKanban,
  Calculator,
  BrainCircuit,
  Grid
} from 'lucide-react';

export default function CproHubLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#061224] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FFC107] selection:text-black overflow-x-hidden">
      {/* ─────────────────── TOP NAVBAR ─────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#061224]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/cprohub" className="flex items-center gap-3 group">
            <div className="flex items-end gap-1 h-7">
              <span className="w-1.5 h-3 bg-[#FFC107] rounded-xs" />
              <span className="w-1.5 h-4.5 bg-[#FFC107] rounded-xs" />
              <span className="w-1.5 h-6 bg-[#FFC107] rounded-xs" />
              <span className="w-1.5 h-7.5 bg-[#FFC107] rounded-xs" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-white">CPROHUB</span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase -mt-1">
                Build · Manage · Grow
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#home" className="text-white hover:text-[#FFC107] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#FFC107] transition-colors">Features</a>
            <a href="#why" className="hover:text-[#FFC107] transition-colors">About</a>
            <a href="#services" className="hover:text-[#FFC107] transition-colors">Pricing</a>
            <a href="#built-for-africa" className="hover:text-[#FFC107] transition-colors">FAQs</a>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* CTA Button (Desktop) */}
            <div className="hidden md:flex items-center">
              <Link
                to="/register"
                className="bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-full shadow-md hover:shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-3 pb-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-white hover:bg-white/5 rounded-lg"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 rounded-lg"
            >
              Features
            </a>
            <a
              href="#why"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 rounded-lg"
            >
              About
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 rounded-lg"
            >
              Pricing
            </a>
            <a
              href="#built-for-africa"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 rounded-lg"
            >
              FAQs
            </a>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 text-center bg-[#FFC107] text-slate-950 font-extrabold text-sm py-3 rounded-full shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* ─────────────────── HERO SECTION ─────────────────── */}
      <section id="home" className="relative pt-20 pb-8 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 overflow-visible bg-[#061224]">
        {/* Panoramic Background with Worker & Sunny Construction Site */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat bg-center sm:bg-[position:center_top] lg:bg-center pointer-events-none"
          style={{ backgroundImage: `url('/cprohub-hero-banner.jpg')` }}
        />
        {/* Seamless overlay system - eliminates horizontal banding & sharp cutoffs on mobile */}
        <div className="absolute inset-0 bg-[#061224]/70 sm:bg-[#061224]/40 lg:bg-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061224] via-[#061224]/90 to-[#061224]/50 lg:via-[#061224]/65 lg:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061224]/90 via-[#061224]/20 to-[#061224] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-center">
            
            {/* Left Column: Headlines, Copy, Badges, CTAs (Col 1 - 6) */}
            <div className="lg:col-span-6 text-center lg:text-left pt-2 sm:pt-6 pb-2 flex flex-col items-center lg:items-start">
              <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.18em] text-slate-300 uppercase mb-2 sm:mb-3">
                THE ALL-IN-ONE CONSTRUCTION PLATFORM
              </span>

              <h1 className="text-[25px] xs:text-[28px] sm:text-4xl lg:text-[42px] xl:text-[45px] font-black tracking-tight text-white leading-[1.16] mb-3 sm:mb-5 max-w-xl">
                Everything You Need to{' '}
                <span className="text-[#FFC107]">Build, Manage & Grow</span>{' '}
                Your Construction Business.
              </h1>

              <p className="text-slate-200 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-normal max-w-xl mx-auto lg:mx-0">
                CPROHUB brings together all the essential tools you need — from finding opportunities and
                managing your projects to handling your finances, workforce and more. All in one place.
              </p>

              {/* 3 Checkmark Badges (Positioned cleanly on one line / row) */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-3 mb-4 sm:mb-7 text-[10px] sm:text-xs font-bold text-slate-200">
                <div className="flex items-center gap-1 bg-black/35 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10 shrink-0">
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-700/80 flex items-center justify-center text-[#FFC107] shrink-0">
                    <Check size={9} strokeWidth={3} />
                  </span>
                  <span>More Opportunities</span>
                </div>

                <div className="flex items-center gap-1 bg-black/35 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10 shrink-0">
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-700/80 flex items-center justify-center text-[#FFC107] shrink-0">
                    <Check size={9} strokeWidth={3} />
                  </span>
                  <span>Less Paperwork</span>
                </div>

                <div className="flex items-center gap-1 bg-black/35 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10 shrink-0">
                  <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-slate-700/80 flex items-center justify-center text-[#FFC107] shrink-0">
                    <Check size={9} strokeWidth={3} />
                  </span>
                  <span>Greater Efficiency</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 mb-3 sm:mb-4">
                <Link
                  to="/register"
                  className="bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 font-black text-xs sm:text-sm px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full shadow-lg shadow-yellow-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
                </Link>

                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="border border-white/40 hover:border-white text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full flex items-center gap-2 hover:bg-white/10 transition-all cursor-pointer bg-black/20 backdrop-blur-xs"
                >
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/60 flex items-center justify-center">
                    <Play size={8} className="fill-white translate-x-[0.5px] sm:hidden" />
                    <Play size={10} className="fill-white translate-x-[0.5px] hidden sm:inline" />
                  </span>
                  <span>Watch Video</span>
                </button>
              </div>

              <p className="text-[10px] sm:text-xs text-slate-300 font-medium text-center lg:text-left max-w-md mx-auto lg:mx-0">
                The core services are 100% free. The only cost is a marketplace commission when you make a sale.
              </p>
            </div>

            {/* Middle Spacer Column for the Engineer who is in the background image (Col 7 - 8) */}
            <div className="hidden lg:block lg:col-span-2 min-h-[340px]" />

            {/* Right Column: Floating Light-Themed Mobile Phone Mockup (Col 9 - 12) */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end z-20 relative mt-3 lg:mt-0 lg:translate-y-12 xl:translate-y-16 lg:-mb-24 xl:-mb-32">
              {/* Phone Chassis */}
              <div className="relative w-[260px] sm:w-[295px] rounded-[38px] sm:rounded-[44px] p-2 sm:p-2.5 bg-slate-900/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.4)] border border-slate-700/80 backdrop-blur-md transition-transform hover:-translate-y-1 duration-300">
                {/* Screen glass (Light UI theme matching reference design) */}
                <div className="bg-[#F8FAFC] rounded-[30px] sm:rounded-[36px] overflow-hidden border border-slate-200 text-slate-900 flex flex-col select-none shadow-inner">
                  
                  {/* Status Bar */}
                  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-900">
                    <span>9:41</span>
                    {/* Dynamic Island pill */}
                    <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
                    <div className="flex items-center gap-1.5 text-slate-900">
                      <Wifi size={12} strokeWidth={2.5} />
                      <Battery size={13} className="fill-slate-900" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-end gap-0.5 h-3.5">
                        <span className="w-1 h-2 bg-[#FFC107] rounded-xs" />
                        <span className="w-1 h-2.5 bg-[#FFC107] rounded-xs" />
                        <span className="w-1 h-3.5 bg-[#FFC107] rounded-xs" />
                      </div>
                      <span className="text-xs font-black tracking-wider text-slate-950">CPROHUB</span>
                    </div>

                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
                      <User size={12} />
                    </div>
                  </div>

                  {/* Greeting */}
                  <div className="px-4 pt-2.5 pb-1.5 text-left bg-white">
                    <p className="text-[10px] text-slate-500 font-semibold">Good morning,</p>
                    <p className="text-xs font-extrabold text-slate-900">John Construction Ltd</p>
                  </div>

                  {/* Promo Yellow Card */}
                  <div className="mx-3.5 my-2 p-2.5 rounded-xl bg-gradient-to-r from-[#FFC107] to-[#F59E0B] text-slate-950 flex items-center justify-between shadow-xs">
                    <div className="text-left pr-2">
                      <p className="text-[10.5px] font-black leading-tight">Everything you need<br />in one place</p>
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-black/15 bg-amber-100 shadow-xs">
                      <img
                        src="/hero-worker.jpg"
                        alt="Engineer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* 3x3 App Icon Grid (Clean White Cards with Soft Tinted Icons) */}
                  <div className="px-3 py-1.5 grid grid-cols-3 gap-2 bg-[#F8FAFC]">
                    {/* 1. Directory */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Building2 size={13} />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-700">Directory</span>
                    </div>

                    {/* 2. Marketplace */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                        <ShoppingCart size={13} />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-700">Marketplace</span>
                    </div>

                    {/* 3. Opportunities */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Briefcase size={13} />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-700">Opportunities</span>
                    </div>

                    {/* 4. BOQ Tool */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                        <Calculator size={13} />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-700">BOQ Tool</span>
                    </div>

                    {/* 5. Projects */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FolderKanban size={13} />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-700">Projects</span>
                    </div>

                    {/* 6. Invoices */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <FileText size={13} />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-700">Invoices</span>
                    </div>

                    {/* 7. AI Hub */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BrainCircuit size={13} />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-700">AI Hub</span>
                    </div>

                    {/* 8. Analytics */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                        <BarChart3 size={13} />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-700">Analytics</span>
                    </div>

                    {/* 9. More */}
                    <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Grid size={13} />
                      </div>
                      <span className="text-[8.5px] font-bold text-slate-700">More</span>
                    </div>
                  </div>

                  {/* App Bottom Nav */}
                  <div className="px-4 py-2.5 bg-white border-t border-slate-200 grid grid-cols-4 gap-1 text-[8px] font-bold text-slate-500">
                    <div className="flex flex-col items-center text-[#FFC107]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] mb-0.5" />
                      <span className="font-extrabold text-slate-900">Home</span>
                    </div>
                    <div className="flex flex-col items-center hover:text-slate-800">
                      <MessageSquare size={11} className="mb-0.5" />
                      <span>Messages</span>
                    </div>
                    <div className="flex flex-col items-center hover:text-slate-800">
                      <Bell size={11} className="mb-0.5" />
                      <span>Alerts</span>
                    </div>
                    <div className="flex flex-col items-center hover:text-slate-800">
                      <User size={11} className="mb-0.5" />
                      <span>Profile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────── SECTION 2: WHY CPROHUB? ─────────────────── */}
      <section id="why" className="bg-white text-slate-900 pt-20 pb-20 lg:pt-28 lg:pb-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column (Col 1 - 6) */}
            <div className="lg:col-span-6 text-left">
              <span className="inline-block text-xs font-extrabold tracking-[0.2em] text-slate-500 uppercase mb-2">
                THE SMARTER WAY TO WORK IN CONSTRUCTION
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1E36] mb-5 tracking-tight">
                Why CPROHUB?
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                Construction is complex. Managing everything with multiple tools, spreadsheets and phone calls
                is stressful, slow and expensive.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-10">
                CPROHUB simplifies your work, connects you to new opportunities, and gives you the tools to
                stay ahead — all in one powerful platform.
              </p>

              {/* 4 Feature Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* 1. Save Time */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full border border-slate-300 text-slate-800 flex items-center justify-center shrink-0 bg-slate-50">
                    <Clock size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">Save Time</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Automate and simplify your work.
                    </p>
                  </div>
                </div>

                {/* 2. Increase Productivity */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full border border-slate-300 text-slate-800 flex items-center justify-center shrink-0 bg-slate-50">
                    <TrendingUp size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">Increase Productivity</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Get more done in less time.
                    </p>
                  </div>
                </div>

                {/* 3. Grow Your Network */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full border border-slate-300 text-slate-800 flex items-center justify-center shrink-0 bg-slate-50">
                    <Users size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">Grow Your Network</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Connect with industry professionals.
                    </p>
                  </div>
                </div>

                {/* 4. Stay Competitive */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full border border-slate-300 text-slate-800 flex items-center justify-center shrink-0 bg-slate-50">
                    <ShieldCheck size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-1">Stay Competitive</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Access opportunities, insights and tools before others.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Col 7 - 12): Arched Image with Sticker Badge */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Arched Building Photo */}
                <div className="rounded-t-[160px] rounded-b-[40px] overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-100">
                  <img
                    src="/crane-building.jpg"
                    alt="Active Construction Site with Cranes"
                    className="w-full h-[380px] sm:h-[420px] object-cover"
                  />
                </div>

                {/* Yellow Handwritten Sticker Badge */}
                <div className="absolute -bottom-4 right-2 sm:right-4 bg-[#FFC107] text-slate-950 px-6 py-3.5 rounded-2xl shadow-xl transform rotate-[-4deg] border-2 border-white">
                  <p
                    className="text-2xl sm:text-3xl font-bold leading-tight select-none text-center"
                    style={{ fontFamily: "'Caveat', cursive" }}
                  >
                    One Platform.<br />
                    Endless Possibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── SECTION 3: OUR SERVICES ─────────────────── */}
      <section id="services" className="bg-[#061427] py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row: Title on Left, Yellow Free Notice on Right */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="text-left max-w-2xl">
              <span className="inline-block text-xs font-extrabold tracking-[0.2em] text-sky-400 uppercase mb-2">
                OUR SERVICES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Powerful Tools for Every Stage of Your Work
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
                From business management to project execution, CPROHUB gives you the tools you need to
                work smarter, faster and more efficiently.
              </p>
            </div>

            {/* Yellow "All services are free" Notice Card */}
            <div className="bg-[#FFC107] text-slate-950 rounded-2xl px-5 py-4 flex items-center gap-3.5 shadow-lg shrink-0 max-w-md">
              <div className="w-10 h-10 rounded-xl bg-slate-950/10 flex items-center justify-center shrink-0">
                <Gift size={22} className="text-slate-950" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-sm sm:text-base leading-tight text-slate-950">
                  All services are free
                </h3>
                <p className="text-[11px] font-medium text-slate-800 leading-snug">
                  The only cost is a marketplace commission when you make a sale.
                </p>
              </div>
            </div>
          </div>

          {/* 12 Services Grid (4 Cols x 3 Rows on Desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* 1. Business Directory */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-white mb-4 shadow-sm">
                <Building2 size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Business Directory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage your company profile and showcase your services.
              </p>
            </div>

            {/* 2. Business Marketplace */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center text-white mb-4 shadow-sm">
                <ShoppingCart size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Business Marketplace</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Buy and sell construction equipment and materials. (Percentage fee on successful sales)
              </p>
            </div>

            {/* 3. Scraper */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-4 shadow-sm">
                <Compass size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Scraper</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover leads, tenders and business opportunities.
              </p>
            </div>

            {/* 4. BOQ Tool */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-cyan-600 flex items-center justify-center text-white mb-4 shadow-sm">
                <FileSpreadsheet size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">BOQ Tool</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate professional Bills of Quantities.
              </p>
            </div>

            {/* 5. Opportunities */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-white mb-4 shadow-sm">
                <Briefcase size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Opportunities</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse open opportunities and submit bids.
              </p>
            </div>

            {/* 6. AI Hub */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-4 shadow-sm">
                <BrainCircuit size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">AI Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get AI-powered insights for engineering, safety and more.
              </p>
            </div>

            {/* 7. Smart Receipts */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-sky-500 flex items-center justify-center text-white mb-4 shadow-sm">
                <Receipt size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Smart Receipts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate, track and download professional receipts.
              </p>
            </div>

            {/* 8. Community */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center text-white mb-4 shadow-sm">
                <Users size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Community</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect and share with construction professionals.
              </p>
            </div>

            {/* 9. Project Pulse */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center text-white mb-4 shadow-sm">
                <Activity size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Project Pulse</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor site operations and daily field reports.
              </p>
            </div>

            {/* 10. Invoices */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-orange-600 flex items-center justify-center text-white mb-4 shadow-sm">
                <FileText size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Invoices</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create, send and track financial invoices.
              </p>
            </div>

            {/* 11. Analytics */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white mb-4 shadow-sm">
                <BarChart3 size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze business and project performance.
              </p>
            </div>

            {/* 12. Workers Management */}
            <div className="bg-[#0B1E36]/90 hover:bg-[#0E2645] border border-white/5 hover:border-white/15 rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 shadow-md">
              <div className="w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-white mb-4 shadow-sm">
                <HardHat size={22} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mb-1.5">Workers Management</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage workers and teams efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── SECTION 4: BUILT FOR AFRICA & CTA ─────────────────── */}
      <section id="built-for-africa" className="bg-white text-slate-900 py-16 lg:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: Built for Africa */}
            <div className="lg:col-span-6 text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B1E36] mb-3 tracking-tight">
                Built for the People Building Africa
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-8 max-w-lg">
                Whether you're a contractor, supplier, engineer, project manager or construction professional
                — CPROHUB is designed for you. It's a platform that grows with your business.
              </p>

              {/* 5 Audience Roles Row */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
                {/* 1. Contractors */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center mb-1.5 hover:border-slate-800 transition-colors">
                    <User size={18} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">Contractors</span>
                </div>

                {/* 2. Suppliers */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center mb-1.5 hover:border-slate-800 transition-colors">
                    <Package size={18} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">Suppliers</span>
                </div>

                {/* 3. Engineers */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center mb-1.5 hover:border-slate-800 transition-colors">
                    <Compass size={18} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">Engineers</span>
                </div>

                {/* 4. Project Managers */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center mb-1.5 hover:border-slate-800 transition-colors">
                    <HardHat size={18} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">Project Managers</span>
                </div>

                {/* 5. Construction Companies */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center mb-1.5 hover:border-slate-800 transition-colors">
                    <Building2 size={18} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight">Construction Companies</span>
                </div>
              </div>
            </div>

            {/* Right Side: CTA Box */}
            <div className="lg:col-span-6 text-left lg:pl-6 lg:border-l lg:border-slate-200">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B1E36] mb-2 tracking-tight">
                Ready to Take Your Construction Business to the Next Level?
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mb-6">
                Join thousands of professionals already using CPROHUB.
              </p>

              <div className="mb-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 font-black text-sm px-8 py-3.5 rounded-full shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Create Your Free Account</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                No subscription. No hidden fees. Just real tools for real builders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── SECTION 5: FOOTER WITH SUNSET SILHOUETTE ─────────────────── */}
      <footer className="relative bg-[#020813] text-white pt-16 pb-12 overflow-hidden">
        {/* Panoramic Sunset Silhouette Header Image */}
        <div className="relative w-full h-44 sm:h-56 -mt-16 mb-8 overflow-hidden opacity-90">
          <img
            src="/sunset-builders.jpg"
            alt="Construction workers silhouette at sunset"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020813]/20 via-[#020813]/40 to-[#020813]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 text-center md:text-left">
            {/* Left: Brand info */}
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <div className="flex items-end gap-1 h-7">
                  <span className="w-1.5 h-3 bg-[#FFC107] rounded-xs" />
                  <span className="w-1.5 h-4.5 bg-[#FFC107] rounded-xs" />
                  <span className="w-1.5 h-6 bg-[#FFC107] rounded-xs" />
                  <span className="w-1.5 h-7.5 bg-[#FFC107] rounded-xs" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl font-black tracking-wider text-white">CPROHUB</span>
                  <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase -mt-1">
                    Build · Manage · Grow
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md">
                Smarter Tools. Stronger Businesses.<br className="hidden sm:inline" />
                A Better Construction Industry.
              </p>
            </div>

            {/* Right: Handwritten Script Quote */}
            <div className="transform rotate-[-3deg]">
              <p
                className="text-3xl sm:text-4xl font-bold text-[#FFC107] leading-tight select-none"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Together<br />
                We Build More.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} CPROHUB. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#home" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#home" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#home" className="hover:text-slate-300 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────── VIDEO MODAL ─────────────────── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 text-center">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-[#FFC107]/10 text-[#FFC107] flex items-center justify-center mx-auto mb-4">
              <Play size={28} className="fill-[#FFC107] translate-x-0.5" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">CPROHUB Platform Overview</h3>
            <p className="text-slate-400 text-sm mb-6">
              Watch how CPROHUB unifies bidding, project management, workforce tracking, and invoicing in one seamless platform.
            </p>
            <div className="aspect-video bg-black/60 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-500 text-sm font-semibold">
              <span>Platform Tour Video Player</span>
            </div>
            <button
              onClick={() => setVideoModalOpen(false)}
              className="mt-6 bg-[#FFC107] text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-full"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

