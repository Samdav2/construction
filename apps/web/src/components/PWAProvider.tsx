import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Download, X, Share, Plus, Smartphone, Monitor } from 'lucide-react';

interface PWAContextType {
  isInstallable: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  showPopup: boolean;
  setShowPopup: (show: boolean) => void;
  installPWA: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

export const PWAProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Reset instructions state when modal is closed
  useEffect(() => {
    if (!showPopup) {
      setShowInstructions(false);
    }
  }, [showPopup]);

  // Check standalone and user agent
  useEffect(() => {
    const checkIsStandalone = () => {
      return (
        window.matchMedia?.('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true
      );
    };

    const checkIsIOS = () => {
      const ua = navigator.userAgent;
      const ios = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      return ios;
    };

    setIsStandalone(checkIsStandalone());
    setIsIOS(checkIsIOS());

    // Listen for custom standalone change
    const mediaQuery = window.matchMedia?.('(display-mode: standalone)');
    const onChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    mediaQuery?.addEventListener('change', onChange);

    return () => {
      mediaQuery?.removeEventListener('change', onChange);
    };
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    if (isStandalone) return;

    const onPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // If we just logged in and were waiting for this prompt, trigger the popup
      if (sessionStorage.getItem('justLoggedIn') === 'true' || pendingPrompt) {
        setShowPopup(true);
        setPendingPrompt(false);
        sessionStorage.removeItem('justLoggedIn');
      }
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowPopup(false);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [isStandalone, pendingPrompt]);

  // Automatically trigger popup on landing pages and after login
  useEffect(() => {
    if (isStandalone) {
      sessionStorage.removeItem('justLoggedIn');
      return;
    }

    const pathname = location.pathname;
    const isLandingPage = pathname === '/' || pathname === '/cprohub';

    if (isLandingPage) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 400);
      return () => clearTimeout(timer);
    }

    if (sessionStorage.getItem('justLoggedIn') === 'true') {
      if (isIOS || deferredPrompt) {
        setShowPopup(true);
        sessionStorage.removeItem('justLoggedIn');
      } else {
        setPendingPrompt(true);
      }
    }
  }, [location.pathname, isStandalone, isIOS, deferredPrompt]);

  const installPWA = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true);
      setShowPopup(true);
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
      setShowPopup(false);
    } catch (err) {
      setShowInstructions(true);
      setShowPopup(true);
    }
  };

  const handleDismiss = () => {
    setShowPopup(false);
  };

  const isInstallable = !isStandalone;

  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const search = typeof window !== 'undefined' ? window.location.search.toLowerCase() : '';

  const isCproHub =
    location.pathname.startsWith('/cprohub') ||
    hostname === 'cprohub.cpromark.com' ||
    hostname.startsWith('cprohub.') ||
    hostname.includes('cprohub') ||
    search.includes('view=cprohub') ||
    import.meta.env.VITE_DEFAULT_LANDING === 'cprohub';

  const isCpromarkPage = location.pathname === '/cpromark' || (location.pathname === '/' && !isCproHub);
  const appName = isCproHub ? 'Cprohub' : (isCpromarkPage ? 'Cpromark' : 'Cprohub');
  const appLogo = isCproHub ? '/cprohub-logo.png' : (isCpromarkPage ? '/cpromark-logo.png' : '/cprohub-logo.png');

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isStandalone,
        isIOS,
        showPopup,
        setShowPopup,
        installPWA,
      }}
    >
      {children}

      {/* Non-Blocking Top-Left Installation Popover */}
      <AnimatePresence>
        {showPopup && (
          <div className={`fixed top-16 sm:top-20 left-3 sm:left-6 z-[9999] pointer-events-auto ${(location.pathname === '/cprohub' || isCproHub) && !showInstructions ? 'hidden md:block' : ''}`}>
            {/* Popover Form Card */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-[340px] max-w-[calc(100vw-1.5rem)] bg-[#0B182B]/98 text-white border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl rounded-2xl p-4 sm:p-5 relative"
            >
              {/* Close 'X' Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </button>

              {/* App Header */}
              <div className="flex items-center gap-3 mb-3.5 pr-6">
                <div className="w-10 h-10 rounded-xl bg-white border border-white/20 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  <img src={appLogo} alt={`${appName} Logo`} className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white leading-tight">Install {appName}</h4>
                  <p className="text-[11px] font-medium text-slate-300">Quick launch & offline access</p>
                </div>
              </div>

              {isIOS ? (
                /* iOS Safari instructions */
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Install {appName} on your Home Screen via Safari:
                  </p>
                  <div className="space-y-2 bg-white/5 border border-white/10 rounded-xl p-3 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-200">
                      <div className="w-6 h-6 rounded-lg bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center shrink-0">
                        <Share size={13} />
                      </div>
                      <span>1. Tap <strong className="text-white">Share</strong> in Safari</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200 border-t border-white/10 pt-2">
                      <div className="w-6 h-6 rounded-lg bg-[#FFC107]/20 text-[#FFC107] flex items-center justify-center shrink-0">
                        <Plus size={13} />
                      </div>
                      <span>2. Select <strong className="text-white">Add to Home Screen</strong></span>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="w-full bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 py-2.5 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer text-center"
                  >
                    Got It
                  </button>
                </div>
              ) : showInstructions ? (
                /* Desktop/Android manual instructions fallback */
                <div className="space-y-3">
                  <div className="space-y-2 bg-white/5 border border-white/10 rounded-xl p-3 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Monitor size={14} className="text-[#FFC107] shrink-0" />
                      <span><strong>Desktop:</strong> Click the install icon in your address bar</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200 border-t border-white/10 pt-2">
                      <Smartphone size={14} className="text-[#FFC107] shrink-0" />
                      <span><strong>Mobile:</strong> Tap browser menu &gt; <em>Install App</em></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowInstructions(false)}
                      className="flex-1 bg-white/10 hover:bg-white/15 text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="flex-1 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 py-2 rounded-xl text-xs font-black transition-all cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Prompt */
                <div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2.5 mb-3.5 text-[11px] text-slate-300">
                    <Smartphone size={14} className="text-[#FFC107] shrink-0" />
                    <span>Works offline with real-time project updates.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDismiss}
                      className="px-3 py-2 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Later
                    </button>
                    <button
                      onClick={() => setShowInstructions(true)}
                      className="px-3 py-2 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Help
                    </button>
                    <button
                      onClick={installPWA}
                      className="flex-1 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 py-2 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Download size={13} />
                      <span>Install App</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PWAContext.Provider>
  );
};
