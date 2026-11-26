import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useBillingStore } from '@/core/billing/entitlements';
import {
  ALL_PREMIUM_FEATURES,
  PRICING_PLANS,
  formatPlanPrice,
} from '@/core/billing/plansConfig';
import { PremiumUpgradeModal } from '@/components/studio/PremiumUpgradeModal';
import { ExportModal } from '@/components/studio/StudioModals';

describe('Free & Premium Access System Permissions', () => {
  beforeEach(() => {
    useBillingStore.setState({
      activePlan: 'free',
      plans: PRICING_PLANS,
      upgradeModalOpen: false,
      upgradeModalFeature: null,
      providerNotice: null,
    });
  });

  it('denies all 14 Pro capabilities for Free accounts and opens honest Upgrade Modal without simulating payment', () => {
    const store = useBillingStore.getState();
    for (const feature of ALL_PREMIUM_FEATURES) {
      expect(store.hasFeatureAccess(feature)).toBe(false);
    }

    store.openUpgradeModal('video_export');
    render(<PremiumUpgradeModal />);

    expect(screen.getByTestId('premium-upgrade-modal')).toBeTruthy();
    expect(screen.getByText('HD Story Video Export')).toBeTruthy();
    expect(screen.getByText(/Free Forever/i)).toBeTruthy();
    expect(screen.getByText(/₹299/)).toBeTruthy();

    // Clicking upgrade when no live payment provider is configured must NEVER simulate payment
    fireEvent.click(screen.getByTestId('upgrade-checkout-btn'));
    expect(screen.getByTestId('billing-provider-notice')).toBeTruthy();
    expect(useBillingStore.getState().activePlan).toBe('free');
  });

  it('unlocks Pro capabilities for Premium accounts and supports configurable pricing plans', () => {
    const customPlans = PRICING_PLANS.map((p) =>
      p.id === 'monthly'
        ? { ...p, prices: { ...p.prices, INR: 399 } }
        : p
    );
    useBillingStore.getState().configurePlans(customPlans);
    useBillingStore.setState({ activePlan: 'monthly' });

    const store = useBillingStore.getState();
    for (const feature of ALL_PREMIUM_FEATURES) {
      expect(store.hasFeatureAccess(feature)).toBe(true);
    }

    const updatedMonthly = store.plans.find((p) => p.id === 'monthly')!;
    expect(formatPlanPrice(updatedMonthly, 'INR')).toBe('₹399');

    // Verify ExportModal shows unlocked Video Export button when Premium is active
    const ref = { current: document.createElement('div') };
    render(<ExportModal open onOpenChange={() => {}} exportRef={ref} />);

    fireEvent.click(screen.getByTestId('download-tab-video'));
    expect(screen.getByTestId('confirm-export-btn').textContent).toContain('Export Video');
    expect(screen.getByTestId('confirm-export-btn').textContent).not.toContain('Unlock Video Export');
  });

  it('keeps Free export formats (PNG, JPG, WebP) accessible without registration', () => {
    const ref = { current: document.createElement('div') };
    render(<ExportModal open onOpenChange={() => {}} exportRef={ref} />);

    expect((screen.getByRole('button', { name: /^PNG$/ }) as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole('button', { name: /^JPG$/ }) as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole('button', { name: /^WEBP$/ }) as HTMLButtonElement).disabled).toBe(false);
    expect(screen.getByTestId('confirm-export-btn').textContent).toContain('Download PNG');

    // Gated Pro button still opens upgrade modal for Free user
    fireEvent.click(screen.getByTestId('pro-carousel-export-btn'));
    expect(useBillingStore.getState().upgradeModalOpen).toBe(true);
    expect(useBillingStore.getState().upgradeModalFeature).toBe('carousel_export');
  });
});
