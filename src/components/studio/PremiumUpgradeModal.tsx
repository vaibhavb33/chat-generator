'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  Crown,
  Lock,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  getFeatureDefinition,
  useBillingStore,
} from '@/core/billing/entitlements';
import {
  formatPlanPrice,
  type CurrencyCode,
  type PlanTier,
} from '@/core/billing/plansConfig';
import { cn } from '@/lib/utils';

export function PremiumUpgradeModal() {
  const open = useBillingStore((s) => s.upgradeModalOpen);
  const featureKey = useBillingStore((s) => s.upgradeModalFeature) ?? 'video_export';
  const plans = useBillingStore((s) => s.plans);
  const billingSettings = useBillingStore((s) => s.billingSettings);
  const providerNotice = useBillingStore((s) => s.providerNotice);
  const closeUpgradeModal = useBillingStore((s) => s.closeUpgradeModal);
  const setCurrency = useBillingStore((s) => s.setCurrency);
  const startProviderCheckout = useBillingStore((s) => s.startProviderCheckout);

  const [selectedPlan, setSelectedPlan] = useState<Exclude<PlanTier, 'free'>>('monthly');
  const feature = getFeatureDefinition(featureKey);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeUpgradeModal();
      }}
    >
      <DialogContent
        data-testid="premium-upgrade-modal"
        className="max-w-2xl overflow-y-auto max-h-[90vh]"
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              ChatForge Pro Feature
            </span>

            {/* Configurable Currency Switcher (INR Default) */}
            <div className="inline-flex items-center rounded-lg border border-slate-200 p-0.5 text-[11px] dark:border-slate-700">
              {(['INR', 'USD', 'EUR'] as CurrencyCode[]).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurrency(cur)}
                  className={cn(
                    'rounded-md px-2 py-0.5 font-semibold cursor-pointer',
                    billingSettings.currency === cur
                      ? 'bg-slate-900 text-white dark:bg-indigo-600'
                      : 'text-slate-600 dark:text-slate-400'
                  )}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          <DialogTitle className="pt-2 text-lg font-bold">
            {feature.title}
          </DialogTitle>
          <DialogDescription>{feature.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Visual Preview Card + Free vs Premium Comparison */}
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="space-y-2 rounded-xl border border-indigo-200/70 bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-700 p-3 text-white shadow-sm">
              <div className="flex items-center justify-between text-[11px] font-semibold opacity-90">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Visual Preview
                </span>
                <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">
                  PRO
                </span>
              </div>
              <p className="text-xs font-semibold leading-snug">{feature.tagline}</p>
              <p className="text-[11px] leading-relaxed text-white/85">
                {feature.previewSummary}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-semibold text-slate-900 dark:text-white">
                Free vs Pro Comparison
              </p>
              <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-[10px] font-bold uppercase text-slate-500">
                  Free Forever
                </p>
                <p className="mt-0.5 text-[11px] text-slate-700 dark:text-slate-300">
                  {feature.freeBehavior}
                </p>
              </div>
              <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-2 dark:border-indigo-900 dark:bg-indigo-950/40">
                <p className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-300">
                  ChatForge Pro
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-indigo-950 dark:text-indigo-100">
                  {feature.proBehavior}
                </p>
              </div>
            </div>
          </div>

          {/* Configurable Plan Selection (Weekly, Monthly, Lifetime) */}
          <div className="grid gap-2.5 sm:grid-cols-3">
            {plans.filter((p) => p.id !== 'free').map((plan) => {
              const planId = plan.id as Exclude<PlanTier, 'free'>;
              const isSelected = selectedPlan === planId;
              return (
                <button
                  key={plan.id}
                  type="button"
                  data-testid={`plan-card-${plan.id}`}
                  onClick={() => setSelectedPlan(planId)}
                  className={cn(
                    'flex flex-col justify-between rounded-2xl border p-3 text-left transition-all cursor-pointer',
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20 dark:bg-indigo-950/40'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {plan.name}
                      </span>
                      {plan.badge && (
                        <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-bold text-white">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-slate-950 dark:text-white">
                        {formatPlanPrice(plan, billingSettings.currency, billingSettings)}
                      </span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-500">
                      {plan.intervalLabel}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {plan.highlights.slice(0, 3).map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-1 text-[10.5px] text-slate-600 dark:text-slate-300"
                        >
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Honest Billing Notice if Payment Provider Key/Checkout URL is unconfigured */}
          {providerNotice && (
            <div
              data-testid="billing-provider-notice"
              role="status"
              className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{providerNotice}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            <p className="text-[11px] text-slate-500">
              Free static PNG &amp; JPG exports stay 100% watermark-free.
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeUpgradeModal}
              >
                <X className="h-3.5 w-3.5" />
                Close
              </Button>
              <Button
                type="button"
                variant="gradient"
                data-testid="upgrade-checkout-btn"
                onClick={() => startProviderCheckout(selectedPlan)}
              >
                <Lock className="h-3.5 w-3.5" />
                Upgrade to{' '}
                {plans.find((p) => p.id === selectedPlan)?.name}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
