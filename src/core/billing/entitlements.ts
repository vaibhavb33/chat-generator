'use client';

import { create } from 'zustand';
import {
  DEFAULT_BILLING_SETTINGS,
  PREMIUM_FEATURE_CATALOG,
  PRICING_PLANS,
  resolveConfigurablePlans,
  type BillingSettingsConfig,
  type CurrencyCode,
  type PlanTier,
  type PremiumFeatureKey,
  type PricingPlanConfig,
} from '@/core/billing/plansConfig';

export const FREE_EXPORT_FORMATS = ['png', 'jpeg', 'webp'] as const;

export interface EntitlementState {
  activePlan: PlanTier;
  plans: PricingPlanConfig[];
  billingSettings: BillingSettingsConfig;
  upgradeModalFeature: PremiumFeatureKey | null;
  upgradeModalOpen: boolean;
  providerNotice: string | null;

  hasFeatureAccess: (feature: PremiumFeatureKey) => boolean;
  openUpgradeModal: (feature: PremiumFeatureKey) => void;
  closeUpgradeModal: () => void;
  setCurrency: (currency: CurrencyCode) => void;
  configurePlans: (plans: PricingPlanConfig[]) => void;
  updateBillingSettings: (patch: Partial<BillingSettingsConfig>) => void;
  startProviderCheckout: (planId: Exclude<PlanTier, 'free'>) => void;
  clearProviderNotice: () => void;
}

export function isPlanEntitledToFeature(
  plan: PlanTier,
  feature: PremiumFeatureKey,
  plans: PricingPlanConfig[] = PRICING_PLANS
): boolean {
  if (!PREMIUM_FEATURE_CATALOG[feature]) return false;
  const matched = plans.find((p) => p.id === plan);
  if (!matched) return false;
  return matched.entitlements.includes(feature);
}

export const useBillingStore = create<EntitlementState>((set, get) => ({
  activePlan: 'free',
  plans: resolveConfigurablePlans(),
  billingSettings: DEFAULT_BILLING_SETTINGS,
  upgradeModalFeature: null,
  upgradeModalOpen: false,
  providerNotice: null,

  hasFeatureAccess: (feature) =>
    isPlanEntitledToFeature(get().activePlan, feature, get().plans),

  openUpgradeModal: (feature) =>
    set({
      upgradeModalFeature: feature,
      upgradeModalOpen: true,
      providerNotice: null,
    }),

  closeUpgradeModal: () =>
    set({
      upgradeModalOpen: false,
      providerNotice: null,
    }),

  setCurrency: (currency) =>
    set((s) => ({
      billingSettings: {
        ...s.billingSettings,
        currency,
      },
    })),

  configurePlans: (plans) => set({ plans }),

  updateBillingSettings: (patch) =>
    set((s) => ({
      billingSettings: {
        ...s.billingSettings,
        ...patch,
      },
    })),

  startProviderCheckout: (planId) => {
    const { billingSettings } = get();
    const { paymentProvider } = billingSettings;
    if (!paymentProvider.isConfigured || !paymentProvider.checkoutBaseUrl) {
      // Never simulate successful payments when no live billing provider is configured.
      set({
        providerNotice: `Live billing checkout (${planId.toUpperCase()} in ${billingSettings.currency}) requires a configured payment provider (Razorpay/Stripe). No test payment was simulated.`,
      });
      return;
    }

    const url = new URL(paymentProvider.checkoutBaseUrl, window.location.origin);
    url.searchParams.set('plan', planId);
    url.searchParams.set('currency', billingSettings.currency);
    window.location.assign(url.toString());
  },

  clearProviderNotice: () => set({ providerNotice: null }),
}));

export function getFeatureDefinition(feature: PremiumFeatureKey) {
  return PREMIUM_FEATURE_CATALOG[feature];
}
