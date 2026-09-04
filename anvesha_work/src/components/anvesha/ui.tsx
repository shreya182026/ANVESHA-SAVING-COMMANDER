import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { X, ChevronLeft, Check, Loader2 } from "lucide-react";
import anviAvatar from "@/assets/anvi.png";
import { cn } from "@/lib/utils";

/* ---------- Button ---------- */

type Variant = "primary" | "secondary" | "accent" | "ghost" | "outline" | "danger";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  full?: boolean;
  size?: "md" | "sm";
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-gradient text-primary-foreground shadow-[var(--shadow-card)] hover:brightness-110 active:brightness-95",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-97 active:brightness-94",
  accent:
    "bg-warm-gradient text-accent-foreground shadow-[var(--shadow-card)] hover:brightness-110 active:brightness-95",
  ghost: "bg-transparent text-primary hover:bg-secondary",
  outline: "border border-border bg-card text-foreground hover:bg-muted",
  danger: "bg-destructive text-destructive-foreground hover:brightness-110",
};

export function Button({
  variant = "primary",
  loading,
  full = true,
  size = "md",
  className,
  children,
  disabled,
  ...rest
}: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-150 active:scale-[0.98]",
        size === "md" ? "min-h-13 px-5 text-[15px]" : "min-h-10 px-4 text-sm",
        full && "w-full",
        variants[variant],
        (disabled || loading) && "pointer-events-none opacity-45",
        className,
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/* ---------- Card ---------- */

export function Card({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const Tag: any = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-3xl bg-card p-4 text-left shadow-[var(--shadow-card)]",
        onClick && "w-full transition-transform active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ---------- Inputs ---------- */

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Field({ label, error, hint, className, ...rest }: FieldProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      )}
      <input
        {...rest}
        className={cn(
          "w-full rounded-2xl border bg-card px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20",
          error ? "border-destructive" : "border-border",
          className,
        )}
      />
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-2xl border bg-card px-4 py-3.5 text-[15px] outline-none focus:border-primary",
          error ? "border-destructive" : "border-border",
        )}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function Choice({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: { value: string; label: string; sub?: string }[];
  value: string;
  onChange: (v: string) => void;
  columns?: number;
}) {
  return (
    <div className={cn("grid gap-2.5", columns === 2 && "grid-cols-2")}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all active:scale-[0.99]",
              active
                ? "border-primary bg-secondary shadow-[var(--shadow-card)]"
                : "border-border bg-card",
            )}
          >
            <span>
              <span className="block text-[15px] font-medium">{o.label}</span>
              {o.sub && <span className="block text-xs text-muted-foreground">{o.sub}</span>}
            </span>
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                active ? "border-primary bg-primary" : "border-border",
              )}
            >
              {active && <Check className="h-3 w-3 text-primary-foreground" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  sub,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 py-3 text-left"
    >
      <span>
        <span className="block text-[15px] font-medium">{label}</span>
        {sub && <span className="block text-xs text-muted-foreground">{sub}</span>}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all",
            checked ? "left-5.5" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

/* ---------- Progress ---------- */

export function Progress({
  value,
  max,
  tone = "accent",
}: {
  value: number;
  max: number;
  tone?: "accent" | "primary";
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          tone === "accent" ? "bg-warm-gradient" : "bg-brand-gradient",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ---------- Anvi ---------- */

export function AnviAvatar({ size = 44 }: { size?: number }) {
  return (
    <img
      src={anviAvatar}
      alt="Anvi, your Anvesha savings assistant"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full bg-secondary object-cover"
    />
  );
}

export function AnviBubble({
  children,
  tone = "soft",
}: {
  children: ReactNode;
  tone?: "soft" | "warm";
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-3xl p-3.5",
        tone === "soft" ? "bg-secondary" : "bg-accent-soft",
      )}
    >
      <AnviAvatar size={40} />
      <p className="pt-0.5 text-[13.5px] leading-relaxed text-foreground/90">{children}</p>
    </div>
  );
}

/* ---------- Modal / Sheet ---------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  dismissible = true,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="Close"
        onClick={dismissible ? onClose : undefined}
        className="absolute inset-0 bg-[oklch(0.29_0.028_195_/_0.45)] backdrop-blur-[2px]"
      />
      <div className="relative max-h-[88%] w-full overflow-y-auto rounded-t-4xl bg-card p-5 pb-7 shadow-[var(--shadow-float)] animate-in slide-in-from-bottom duration-200 no-scrollbar">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        {(title || dismissible) && (
          <div className="mb-3 flex items-start justify-between gap-3">
            {title && <h3 className="text-lg font-bold">{title}</h3>}
            {dismissible && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full bg-muted p-1.5 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ---------- Screen chrome ---------- */

export function TopBar({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 bg-background/95 px-4 py-3 backdrop-blur">
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          className="-ml-2 rounded-full p-2 text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="flex-1 text-lg font-bold">{title}</h1>
      {right}
    </div>
  );
}

export function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 px-4 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i <= step ? "bg-primary" : "bg-border",
          )}
        />
      ))}
    </div>
  );
}

export function Banner({
  tone,
  children,
}: {
  tone: "error" | "success" | "info";
  children: ReactNode;
}) {
  const map = {
    error: "bg-destructive/10 text-destructive",
    success: "bg-[oklch(0.6_0.11_160_/_0.12)] text-[oklch(0.42_0.09_160)]",
    info: "bg-secondary text-secondary-foreground",
  };
  return <div className={cn("rounded-2xl px-4 py-3 text-sm", map[tone])}>{children}</div>;
}

export function SimNote({ text }: { text: string }) {
  return (
    <p className="rounded-xl bg-muted px-3 py-2 text-center text-[11px] font-medium tracking-wide text-muted-foreground">
      {text}
    </p>
  );
}

/* small helper for simulated async actions */
export function useSimulate() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => () => setLoading(false), []);
  const run = (ms: number, cb?: () => void) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      cb?.();
    }, ms);
  };
  return { loading, done, run, reset: () => setDone(false) };
}
