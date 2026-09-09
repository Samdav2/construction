import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../components/layout/DashboardShell';

import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Save, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { t } from '../theme';

interface CompanyProfile {
  website?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  sector?: string;
  address?: string;
  description?: string;
  logo?: string;
  name?: string;
  slug?: string;
  status?: string;
  plan?: string;
  portfolio?: string[];
  receiptSettings?: {
    letterhead?: string;
    whatsappNumber?: string;
    taxId?: string;
    defaultTaxRate?: number;
    themeColor?: string;
    signature?: string;
    defaultPaymentTerms?: string;
    format?: 'standard' | 'modern' | 'minimal';
  };
}

import { PremiumModal } from '../components/dashboard/PremiumModal';
import { Zap } from 'lucide-react';

const SECTORS = [
  'General Construction',
  'Electrical Engineering',
  'Plumbing & HVAC',
  'Architecture & Design',
  'Civil Engineering & Masonry',
  'Building Material Supplier',
  'Heavy Machinery & Equipment',
  'Roofing & Waterproofing',
  'Interior Design & Finishing',
  'Painting & Decorating',
  'Structural Engineering & Surveying',
  'Project Management & Consulting'
];

const BusinessSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [tempLogo, setTempLogo] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({});
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const getPersistedSlug = () => {
    try {
      const raw = localStorage.getItem('cpromark-storage');
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      return parsed?.user?.slug || parsed?.state?.user?.slug;
    } catch { return undefined; }
  };

  const { data: company, isLoading } = useQuery<CompanyProfile>({
    queryKey: ['company-profile'],
    queryFn: async () => (await apiClient.get('/auth/company/profile')).data,
    enabled: !!user,
  });

  const companySlug = company?.slug ?? user?.slug ?? getPersistedSlug();
  const plan = company?.plan || (user as any)?.plan || 'basic';
  const isPremium = plan === 'pro' || plan === 'enterprise';

  const effectiveFormData = {
    name: formData.name !== undefined ? formData.name : company?.name ?? '',
    website: formData.website !== undefined ? formData.website : company?.website ?? '',
    email: formData.email !== undefined ? formData.email : company?.email ?? '',
    phone: formData.phone !== undefined ? formData.phone : company?.phone ?? '',
    city: formData.city !== undefined ? formData.city : company?.city ?? '',
    country: formData.country !== undefined ? formData.country : company?.country ?? '',
    sector: formData.sector !== undefined ? formData.sector : company?.sector ?? 'General Construction',
    address: formData.address !== undefined ? formData.address : company?.address ?? '',
    description: formData.description !== undefined ? formData.description : (company as any)?.description ?? '',
    receiptSettings: {
      whatsappNumber: formData.receiptSettings?.whatsappNumber !== undefined ? formData.receiptSettings.whatsappNumber : company?.receiptSettings?.whatsappNumber ?? '',
      taxId: formData.receiptSettings?.taxId !== undefined ? formData.receiptSettings.taxId : company?.receiptSettings?.taxId ?? '',
      defaultTaxRate: formData.receiptSettings?.defaultTaxRate !== undefined ? formData.receiptSettings.defaultTaxRate : company?.receiptSettings?.defaultTaxRate ?? 0,
      themeColor: formData.receiptSettings?.themeColor !== undefined ? formData.receiptSettings.themeColor : company?.receiptSettings?.themeColor ?? '#000000',
      signature: formData.receiptSettings?.signature !== undefined ? formData.receiptSettings.signature : company?.receiptSettings?.signature ?? '',
      defaultPaymentTerms: formData.receiptSettings?.defaultPaymentTerms !== undefined ? formData.receiptSettings.defaultPaymentTerms : company?.receiptSettings?.defaultPaymentTerms ?? '',
      format: formData.receiptSettings?.format !== undefined ? formData.receiptSettings.format : company?.receiptSettings?.format ?? 'standard',
    }
  };

  useEffect(() => { return () => { if (tempLogo) URL.revokeObjectURL(tempLogo); }; }, [tempLogo]);

  const logoPreview = tempLogo || company?.logo;

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !companySlug) { toast.error('Missing company slug.'); return; }
    const previewUrl = URL.createObjectURL(file);
    setTempLogo(previewUrl);
    e.target.value = '';
    const fd = new FormData();
    fd.append('file', file, file.name);
    const tid = toast.loading('Uploading logo...');
    try {
      await apiClient.post(`/auth/company/${companySlug}/logo`, fd);
      await queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      toast.success('Logo Updated', { id: tid });
    } catch { toast.dismiss(tid); setTempLogo(null); }
  };

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string>) => {
      if (!companySlug) return Promise.reject(new Error('Missing company slug'));
      return apiClient.put(`/auth/company/${companySlug}`, data);
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['company-profile'] }); 
      toast.success('Business Profile Updated');
    },
    onError: (err: unknown) => { toast.error(err instanceof Error ? err.message : 'Update failed'); },
  });

  const isUpdating = updateMutation.status === 'pending';

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto pb-40">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Business Settings</h1>
            <p className="text-muted-foreground mt-2 font-medium">Configure your company identity, category, and public profile.</p>
          </div>

          {/* Subscription Tier Card */}
          <div className="flex items-center gap-3 bg-card border border-border p-3.5 rounded-2xl shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPremium ? 'bg-[#FFC107]/20 text-[#FFC107]' : 'bg-muted text-muted-foreground'}`}>
              <Zap size={20} className={isPremium ? 'fill-[#FFC107]' : ''} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Workspace Tier</p>
              <p className="text-xs font-black text-foreground">{isPremium ? '⭐ CPROHUB Premium' : 'Free Basic Plan'}</p>
            </div>
            {!isPremium && (
              <button
                onClick={() => setPremiumModalOpen(true)}
                className="ml-2 px-3 py-1.5 bg-[#FFC107] hover:bg-[#e5ac04] text-slate-950 font-black text-[11px] rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Upgrade
              </button>
            )}
          </div>
        </header>

        {/* PROFILE CARD */}
        <div className="bg-card border border-border rounded-[3.5rem] overflow-hidden mb-12 shadow-sm">
          <div className="h-44 bg-gradient-to-r from-[#061224] via-[#0B1E36] to-[#061224] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC107]/10 blur-[80px] rounded-full pointer-events-none" />
          </div>
          <div className="px-8 sm:px-12 pb-12">
            <div className="relative -top-16 flex flex-col md:flex-row items-start md:items-end gap-6 mb-6">
              <div className="w-36 h-36 bg-background rounded-[2.5rem] border-4 border-card overflow-hidden relative flex items-center justify-center group shrink-0 shadow-lg">
                {logoPreview
                  ? <img src={logoPreview} className="w-full h-full object-cover" alt="Logo" />
                  : <span className="text-5xl font-black text-foreground/20 italic">{effectiveFormData.name?.charAt(0) || 'C'}</span>
                }
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <Camera className="text-foreground mb-1" size={26} />
                  <span className="text-[9px] text-foreground font-black uppercase tracking-widest text-center px-2">Update Logo</span>
                </div>
                <input type="file" ref={logoInputRef} className="hidden" onChange={handleLogoChange} accept="image/*" />
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{effectiveFormData.name || 'Your Company'}</h2>
                  {company?.status === 'verified' && <CheckCircle2 size={22} className="text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={13} className="text-primary" /> {effectiveFormData.city || 'City Not Set'}, {effectiveFormData.country || 'Country Not Set'}
                  <span>•</span>
                  <span>{effectiveFormData.sector}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="space-y-1 md:col-span-2">
                <label className={t.label + ' block px-1'}>Company / Business Name</label>
                <input
                  value={effectiveFormData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={t.input}
                  placeholder="e.g. Apex Builders & Engineering Ltd"
                />
              </div>

              {/* Business Sector / Category Dropdown */}
              <div className="space-y-1 md:col-span-2">
                <label className={t.label + ' block px-1'}>Business Category / Trade</label>
                <select
                  value={effectiveFormData.sector}
                  onChange={e => setFormData({ ...formData, sector: e.target.value })}
                  className={`${t.input} cursor-pointer bg-muted text-foreground`}
                >
                  {SECTORS.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className={t.label + ' block px-1'}>Official Phone / WhatsApp</label>
                <input
                  value={effectiveFormData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className={t.input}
                  placeholder="+237 600..."
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className={t.label + ' block px-1'}>Official Business Email</label>
                <input
                  value={effectiveFormData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={t.input}
                  placeholder="contact@yourcompany.com"
                />
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label className={t.label + ' block px-1'}>Website URL</label>
                <input
                  value={effectiveFormData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className={t.input}
                  placeholder="https://www.yourcompany.com"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className={t.label + ' block px-1'}>City / State</label>
                <input
                  value={effectiveFormData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className={t.input}
                  placeholder="e.g. Lagos, Douala, Nairobi"
                />
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className={t.label + ' block px-1'}>Country</label>
                <input
                  value={effectiveFormData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className={t.input}
                  placeholder="e.g. Nigeria, Cameroon, Kenya"
                />
              </div>

              {/* Physical Address */}
              <div className="space-y-1">
                <label className={t.label + ' block px-1'}>Office / Workshop Address</label>
                <input
                  value={effectiveFormData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className={t.input}
                  placeholder="Street, District, Landmark..."
                />
              </div>

              {/* Business Description */}
              <div className="space-y-1 md:col-span-2">
                <label className={t.label + ' block px-1'}>About Company / Services Description</label>
                <textarea
                  value={effectiveFormData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className={`${t.input} h-28 resize-none py-3`}
                  placeholder="Briefly describe your construction specialties, years of experience, and notable projects..."
                />
              </div>

              {/* Save CTA */}
              <div className="md:col-span-2 pt-2">
                <button
                  onClick={() => updateMutation.mutate(effectiveFormData as unknown as Record<string, string>)}
                  disabled={!companySlug || isUpdating}
                  className="w-full flex items-center justify-center gap-3 bg-primary text-brand-navy rounded-2xl font-black text-xs uppercase tracking-widest shadow-yellow hover:bg-primary-dim transition-all h-[56px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  <span>Save Business Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Upgrade Modal */}
        <PremiumModal
          isOpen={premiumModalOpen}
          onClose={() => setPremiumModalOpen(false)}
        />
      </div>
    </DashboardShell>
  );
};

export default BusinessSettings;
