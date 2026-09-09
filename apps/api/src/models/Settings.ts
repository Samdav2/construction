import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema({
  marketplaceCommission: { type: Number, default: 2.5 },
  tenderFee: { type: Number, default: 50 },
  aiSystemPrompt: { type: String, default: "You are BuildHub AI..." },
  maintenanceMode: { type: Boolean, default: false }
  aiSystemPrompt: { type: String, default: "You are CPROHUB AI..." },
  maintenanceMode: { type: Boolean, default: false },

  // Premium Subscription & Payment Configuration
  premiumMonthlyFee: { type: Number, default: 29 },
  premiumPaymentMethod: { type: String, default: 'manual_transfer' },
  premiumPaymentInstructions: { 
    type: String, 
    default: 'Transfer the monthly fee to our verified account details below, then enter your transaction reference number to activate Premium.' 
  },
  premiumBankName: { type: String, default: 'United Bank for Africa (UBA)' },
  premiumAccountNumber: { type: String, default: '1029384756' },
  premiumAccountName: { type: String, default: 'CPROHUB Enterprise Ltd' },
  premiumMobileMoneyNumber: { type: String, default: '+237 670 000 000' },
  premiumSupportContact: { type: String, default: 'billing@cprohub.com' },
}, { timestamps: true });

// Check if model is already compiled to prevent errors during 'dev' reload
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
export default Settings;