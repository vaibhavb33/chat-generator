import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  FileCode2,
  Film,
  Layers,
  Lock,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/input';
import { GeneratorCard } from '@/components/directory/GeneratorCard';
import { HomeInteractiveSearch } from '@/components/homepage/HomeInteractiveSearch';
import { FaqAccordion } from '@/components/homepage/FaqAccordion';
import { GENERATOR_MANIFESTS } from '@/core/registry/generators';

const HOME_FAQS = [
  {
    question: 'Are ChatForge PNG and JPEG exports really watermark-free?',
    answer:
      'Yes. Every static PNG, JPEG, and HTML transcript export from our 10 generators is 100% free and completely watermark-free—no account or credit card required.',
  },
  {
    question: 'Do you upload my chat text or profile photos to a server?',
    answer:
      'No. All mockup rendering happens locally inside your browser using client-side Canvas rendering and IndexedDB auto-save. Your conversations never leave your device.',
  },
  {
    question: 'Can I create multi-person group chats or paste a full script?',
    answer:
      'Yes. Use WhatsApp Group or Discord generators for unlimited color-coded participants, or click "Paste Script" to auto-generate an entire conversation from "Name: Message" dialogue.',
  },
  {
    question: 'Does ChatForge work on mobile phones without installing an app?',
    answer:
      'Yes. ChatForge is a responsive web app designed preview-first for 360px and 390px mobile screens, with expandable edit drawers and zero horizontal overflow.',
  },
  {
    question: 'What is the intended ethical use for these mockup generators?',
    answer:
      'ChatForge is built for creative storytelling, YouTube/TikTok skits, UI/UX presentation decks, marketing previews, film props, and media literacy education. Financial receipt forgery and impersonation are strictly prohibited.',
  },
];

export default function HomePage() {
  const popularTools = GENERATOR_MANIFESTS.filter((g) => g.popular);
  const messagingTools = GENERATOR_MANIFESTS.filter((g) => g.category === 'messaging');
  const postTools = GENERATOR_MANIFESTS.filter((g) => g.category === 'social_post');
  const storyTools = GENERATOR_MANIFESTS.filter((g) => g.category === 'story_profile');
  const phoneTools = GENERATOR_MANIFESTS.filter((g) => g.category === 'phone_mockup');

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      {/* 1. Modern Navigation Bar */}
      <SiteHeader />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-indigo-50/50 via-white to-white pt-12 pb-16 sm:pt-16 sm:pb-20 dark:border-slate-800 dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex flex-wrap items-center gap-2">
                <Badge variant="accent">
                  <Sparkles className="h-3 w-3" /> Zero Watermarks • 100% Client-Side
                </Badge>
                <Badge variant="outline">10 Studio Generators Ready</Badge>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08] dark:text-white">
                Create pixel-accurate{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-blue-400">
                  chat &amp; social mockups
                </span>{' '}
                in seconds.
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                Design realistic WhatsApp chats, group threads, iMessages, Instagram DMs, Stories, Posts,
                Telegram, Discord, and Call Screens right in your browser—with instant dark mode, voice
                waveforms, script import, and crisp HD PNG exports.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild variant="gradient" size="lg">
                  <Link href="/generators/whatsapp-chat">
                    Start Creating Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/generators">Browse All 10 Generators</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> No sign-up required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Auto-saves locally
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Retina 2x &amp; 3x PNGs
                </span>
              </div>
            </div>

            {/* Live Visual Hero Showcase */}
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-sm rounded-3xl border border-slate-200/90 bg-white p-4 shadow-[0_24px_60px_-15px_rgba(79,70,229,0.2)] dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-xs font-bold text-white">
                      ML
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Maya Lin
                      </p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        online • WhatsApp Studio
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Clean PNG</Badge>
                </div>

                <div className="mt-3 space-y-2.5 rounded-2xl bg-[#EFEAE2] p-3.5 text-xs dark:bg-[#0B141A]">
                  <div className="max-w-[82%] rounded-xl rounded-bl-xs bg-white px-3 py-2 text-slate-900 shadow-2xs dark:bg-[#202C33] dark:text-slate-100">
                    Can we switch the chat mockup to dark mode and add a voice note?
                    <span className="mt-0.5 block text-right text-[10px] opacity-55">
                      9:39 AM
                    </span>
                  </div>
                  <div className="ml-auto max-w-[82%] rounded-xl rounded-br-xs bg-[#D9FDD3] px-3 py-2 text-slate-900 shadow-2xs dark:bg-[#005C4B] dark:text-white">
                    Done! Exported at 2x Retina with zero watermarks 🚀
                    <span className="mt-0.5 block text-right text-[10px] text-sky-600 dark:text-sky-300">
                      9:41 AM ✓✓
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Switch skins: WhatsApp • iMessage • IG DM
                  </span>
                  <Link
                    href="/generators/whatsapp-chat"
                    className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Try live →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Prominent Generator Search */}
        <section className="bg-slate-50/70 py-10 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-5 text-center">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                Jump directly into any generator
              </h2>
            </div>
            <HomeInteractiveSearch />
          </div>
        </section>

        {/* 4. Popular Generators */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <Badge variant="accent">Most Used</Badge>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Popular Generators
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Top creator and marketer choices with pixel-accurate light &amp; dark skins.
              </p>
            </div>
            <Link
              href="/generators"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View full directory <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <GeneratorCard key={tool.id} manifest={tool} />
            ))}
          </div>
        </section>

        {/* 5. Messaging Platform Categories */}
        <section className="border-y border-slate-200/80 bg-slate-50/60 py-14 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Messaging Platform Generators
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  1-on-1 dialogues and multi-speaker group threads with reactions, voice notes, and read receipts.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {messagingTools.map((tool) => (
                <GeneratorCard key={tool.id} manifest={tool} />
              ))}
            </div>
          </div>
        </section>

        {/* 6, 7, 8: Social Media Posts, Stories & Profiles, Phone Mockups */}
        <section className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 6. Social Media Post Generators */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  <Layers className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Social Media Post Generators
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Feed layouts &amp; &ldquo;...more&rdquo; truncation previews
                  </p>
                </div>
              </div>
              {postTools.map((tool) => (
                <GeneratorCard key={tool.id} manifest={tool} />
              ))}
            </div>

            {/* 7. Story and Profile Generators */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                  <Smartphone className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Story &amp; Profile Generators
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    9:16 slide progress, polls &amp; viewer counts
                  </p>
                </div>
              </div>
              {storyTools.map((tool) => (
                <GeneratorCard key={tool.id} manifest={tool} />
              ))}
            </div>

            {/* 8. Phone Mockup Generators */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <PhoneCall className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Phone Mockup Generators
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Call screens, OS frames &amp; live timer simulator
                  </p>
                </div>
              </div>
              {phoneTools.map((tool) => (
                <GeneratorCard key={tool.id} manifest={tool} />
              ))}
            </div>
          </div>
        </section>

        {/* 9. How It Works */}
        <section
          id="how-it-works"
          className="border-y border-slate-200/80 bg-slate-50/70 py-16 dark:border-slate-800 dark:bg-slate-900/40"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="accent">Workflow</Badge>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                How ChatForge works in 3 steps
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Skip broken Figma layers and ad-riddled utilities. Go from script to clean export in under a minute.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Pick a platform skin',
                  desc: 'Start with WhatsApp, iMessage, Instagram, Telegram, Discord, or Call Screen—and switch skins anytime without re-typing.',
                },
                {
                  step: '02',
                  title: 'Compose or paste a script',
                  desc: 'Add messages, voice notes, reactions, and participants manually or paste "Name: Message" screenplay text in bulk.',
                },
                {
                  step: '03',
                  title: 'Customize & export watermark-free',
                  desc: 'Toggle Dark Mode, iOS/Android status bars, or device bezels, then export crisp 2x/3x PNGs or HTML locally.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-xs font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Feature Highlights */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Engineered to fix every mockup frustration
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Built around real creator, marketer, filmmaker, and educator feedback.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Lock,
                title: '100% Client-Side Privacy',
                desc: 'All rendering runs in your browser. Drafts auto-save to IndexedDB so refreshing never erases your work.',
              },
              {
                icon: Zap,
                title: 'Zero Surprise Watermarks',
                desc: 'Never get ambushed at the download screen. High-resolution PNG and JPEG exports are clean and free.',
              },
              {
                icon: Users,
                title: 'Multi-Speaker Group Engine',
                desc: 'Color-coded participants, reply quotes, polls, and system notices across WhatsApp Group and Discord.',
              },
              {
                icon: FileCode2,
                title: 'Screenplay Script Parser',
                desc: 'Paste multi-speaker dialogue formatted as "Name: Message" to build 30+ bubble threads in one click.',
              },
              {
                icon: Film,
                title: 'Interactive Video Timeline',
                desc: 'Step through conversations message-by-message with adjustable pacing and typing indicator previews.',
              },
              {
                icon: ShieldCheck,
                title: 'Opt-In "Simulated" Label',
                desc: 'Toggle a clean educational disclosure footer for classrooms, newsrooms, and compliance-first decks.',
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 11. Example Outputs */}
        <section
          id="examples"
          className="border-y border-slate-200/80 bg-slate-50/70 py-16 dark:border-slate-800 dark:bg-slate-900/40"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  Example Outputs
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Explore real scenes produced directly inside ChatForge Studio.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/generators">Open Directory</Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'SaaS Support Case Study',
                  platform: 'WhatsApp Chat',
                  slug: 'whatsapp-chat',
                  previewA: 'Order #CF-8841 arrived damaged 😔',
                  previewB: 'Express replacement queued! Tracking sent.',
                },
                {
                  title: 'Campaign Truncation Check',
                  platform: 'Instagram Post',
                  slug: 'instagram-post',
                  previewA: 'Verified 4:5 Feed Card • 2,841 likes',
                  previewB: 'Hook verified above mobile "...more" fold.',
                },
                {
                  title: 'Film Set Prop Scene',
                  platform: 'Fake Call Screen',
                  slug: 'fake-call-screen',
                  previewA: 'Incoming WhatsApp Voice Call • Maya Lin',
                  previewB: 'Interactive Ring & Active 01:14 Timer.',
                },
              ].map((ex) => (
                <Link
                  key={ex.title}
                  href={`/generators/${ex.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <Badge variant="outline">{ex.platform}</Badge>
                  <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    {ex.title}
                  </h3>
                  <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    <p className="rounded-lg bg-white px-2.5 py-1.5 shadow-2xs dark:bg-slate-900">
                      {ex.previewA}
                    </p>
                    <p className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-white">
                      {ex.previewB}
                    </p>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Open in Studio →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 12. Frequently Asked Questions */}
        <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqAccordion items={HOME_FAQS} />
        </section>

        {/* 13. SEO-Friendly Educational Content */}
        <section
          id="seo-guide"
          className="border-t border-slate-200/80 bg-slate-50/50 py-14 dark:border-slate-800 dark:bg-slate-900/30"
        >
          <div className="mx-auto max-w-4xl space-y-5 px-4 text-sm leading-relaxed text-slate-600 sm:px-6 dark:text-slate-400">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Creating Realistic Social Media Mockups Responsibly
            </h2>
            <p>
              Modern content creators, performance marketing agencies, UX designers, indie filmmakers,
              and media literacy educators regularly need accurate messaging and social media interface
              mockups. Traditional graphic workflows force teams to maintain brittle PSD smart objects
              or spend hours manually animating chat bubbles in video editors, while legacy online
              generators frequently inject intrusive banner ads or surprise download watermarks.
            </p>
            <p>
              ChatForge unifies 10 high-demand mockup generators—including WhatsApp Chat, WhatsApp
              Group Chat, Instagram DM, Instagram Story, Instagram Post, iMessage, Android Messages,
              Telegram, Discord, and Call Screens—inside a single local-first browser studio. Every
              skin preserves authentic dark mode contrast, typography scaling, delivery/read checkmarks,
              voice waveforms, and status bar controls while keeping 100% of your data in your browser.
            </p>
            <p>
              For classrooms, newsrooms, and media-literacy workshops, ChatForge includes a toggleable
              &ldquo;Simulated Mockup&rdquo; disclosure footer and avoids financial/payment receipt
              forgery surfaces altogether. Always pair synthetic UI visuals with clear context when
              publishing educational or editorial work.
            </p>
          </div>
        </section>
      </main>

      {/* 14. Footer */}
      <SiteFooter />
    </div>
  );
}
