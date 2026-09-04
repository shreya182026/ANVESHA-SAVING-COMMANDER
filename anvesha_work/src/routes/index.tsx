import { createFileRoute } from "@tanstack/react-router";
import { Component, type ReactNode } from "react";
import { AnveshaProvider, useAnvesha } from "@/lib/anvesha/store";
import { PhoneFrame } from "@/components/anvesha/PhoneFrame";
import { OnboardingFlow } from "@/components/anvesha/Onboarding";
import { MainApp } from "@/components/anvesha/MainApp";

const title = "ANVESHA — Save today. Stay ready for tomorrow.";
const description =
  "A simple savings assistant for India's delivery workers: flexible daily saving suggestions that adapt to what you actually earn.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

class AppErrorBoundary extends Component<
  { children: ReactNode; onRecover: () => void },
  { error: Error | null }
> {
  state = { error: null };
  private recovering = false;

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch() {
    if (this.recovering) return;
    this.recovering = true;
    // Recover in-app without a browser refresh. The parent restores the last
    // safe onboarding checkpoint, then this boundary retries the render.
    this.props.onRecover();
  }

  componentDidUpdate() {
    if (this.state.error && this.recovering) {
      this.recovering = false;
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <PhoneFrame>
          <div className="flex h-full items-center justify-center bg-background px-6 text-center">
            <div className="rounded-3xl bg-secondary px-6 py-5 shadow-[var(--shadow-card)]">
              <p className="text-sm font-semibold text-foreground">Getting Anvesha ready…</p>
            </div>
          </div>
        </PhoneFrame>
      );
    }
    return this.props.children;
  }
}

function Shell() {
  const { state } = useAnvesha();
  return <PhoneFrame>{state.screen === "app" ? <MainApp /> : <OnboardingFlow />}</PhoneFrame>;
}

function RecoveryShell() {
  const { state, set } = useAnvesha();

  const recover = () => {
    const previous: Record<string, string> = {
      buffer: "goalsetup",
      budget: "buffer",
      goalsetup: "onboardingHub",
      whysave: "upi",
      upi: "financial",
      financial: "personal",
      personal: "onboardingHub",
      onboardingHub: "intro",
      intro: "name",
      name: "langloc",
    };
    const safe = previous[state.screen] || (state.onboarded ? "app" : "onboardingHub");
    set({ screen: safe as any, onboardingStep: safe as any });
  };

  return <AppErrorBoundary onRecover={recover}><Shell /></AppErrorBoundary>;
}

function Index() {
  return (
    <AnveshaProvider>
      <RecoveryShell />
    </AnveshaProvider>
  );
}
