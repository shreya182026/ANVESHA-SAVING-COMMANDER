import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.95_0.012_180)] p-0 sm:p-6">
      <div className="w-full max-w-[420px] sm:rounded-[2.6rem] sm:border-[10px] sm:border-[oklch(0.29_0.028_195)] sm:shadow-[var(--shadow-float)]">
        <div className="relative h-[100svh] w-full overflow-hidden bg-background sm:h-[860px] sm:rounded-[2rem]">
          {children}
        </div>
      </div>
    </div>
  );
}
