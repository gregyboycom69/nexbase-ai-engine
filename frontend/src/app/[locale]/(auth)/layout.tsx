"use client";

import { BrandMark } from "@/components/branding/brand-mark";
import { useBranding } from "@/components/branding/branding-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Headquarters } from "@/components/virtual-office/headquarters";
import { useOnScreenKeyboard } from "@/hooks/use-on-screen-keyboard";
import { BUILT_IN_BRANDING } from "@/lib/branding";
import { useTranslations } from "next-intl";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("pages.auth");
  const { appName, tagline } = useBranding();
  useOnScreenKeyboard();

  return (
    <div className="bg-background text-foreground grid h-[calc(var(--app-height,100dvh)-var(--shell-inset-top,0px))] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <main
        id="main"
        className="bg-card flex min-h-0 flex-col overflow-y-auto pb-[var(--safe-bottom)]"
      >
        <header
          data-auth-titlebar
          data-tauri-drag-region="deep"
          className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-10"
        >
          {/* Not a link: the root redirects straight back here, so a brand mark
              that navigates would be a no-op. */}
          <span className="nexbase-wordmark inline-flex min-w-0 items-center gap-2.5 text-base">
            <BrandMark size={32} />
            <span className="truncate">{appName}</span>
          </span>
          <ThemeToggle variant="segmented" />
        </header>
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="nexbase-signin w-full max-w-md">{children}</div>
        </div>
      </main>

      <aside className="hidden min-h-0 p-4 lg:block">
        <Headquarters
          tagline={
            tagline === BUILT_IN_BRANDING.tagline
              ? t.rich("tagline", { b: (chunks) => <strong>{chunks}</strong> })
              : tagline
          }
        />
      </aside>
    </div>
  );
}
