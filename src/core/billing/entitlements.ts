'use client';

import { create } from 'zustand';
import {
  DEFAULT_BILLING_SETTINGS,
  PREMIUM_FEATURE_CATALOG,
  type BillingSettingsConfig,
  type CurrencyCode,
  type PlanTier,
  type PremiumFeatureKey,
} from '@/core/billing/plansConfig';

export const FREE_EXPORT_FORMATS = ['png', 'jpeg', 'webp'] as const;

export interface EntitlementState {
  activePlan: PlanTier;
  billingSettings: BillingSettingsConfig;
  upgradeModalFeature: PremiumFeatureKey | null;
  upgradeModalOpen: boolean;
  providerNotice: string | null;

  hasFeatureAccess: (feature: PremiumFeatureKey) => boolean;
  openUpgradeModal: (feature: PremiumFeatureKey) => void;
  closeUpgradeModal: () => void;
  setCurrency: (currency: CurrencyCode) => void;
  startProviderCheckout: (planId: Exclude<PlanTier, 'free'>) => void;
  clearProviderNotice: () => void;
}

export function isPlanEntitledToFeature(
  plan: PlanTier,
  feature: PremiumFeatureKey
): boolean {
  // All 14 listed premium capabilities require a verified non-free entitlement.
  // Never bypass or simulate fake Pro unlocks client-side.
  if (!PREMIUM_FEATURE_CATALOG[feature]) return false;
  return plan === 'weekly' || plan === 'monthly' || plan === 'lifetime';
}

export const useBillingStore = create<EntitlementState>((set, get) => ({
  activePlan: 'free',
  billingSettings: DEFAULT_BILLING_SETTINGS,
  upgradeModalFeature: null,
  upgradeModalOpen: false,
  providerNotice: null,

  hasFeatureAccess: (feature) => isPlanEntitledToFeature(get().activePlan, feature),

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

  startProviderCheckout: (planId) => {
    const { billingSettings } = get();
    const { paymentProvider } = billingSettings;
    if (!paymentProvider.isConfigured || !paymentProvider.checkoutBaseUrl) {
      // Phase 6 strict rule: Never simulate successful payments when no billing provider is configured.
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
