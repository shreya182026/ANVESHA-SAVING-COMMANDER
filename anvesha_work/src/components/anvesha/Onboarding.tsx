import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Play,
  Pause,
  Wallet,
  Target,
  PiggyBank,
  HandCoins,
  MessageCircleQuestion,
  CircleHelp,
  Languages,
  Settings2,
  Bell,
  CalendarDays,
  Landmark,
  IndianRupee,
  Plus,
} from "lucide-react";
import {
  useAnvesha,
  RANGE_OPTIONS,
  essentialDaily,
  flexibleDaily,
  recommendedSaving,
  availableSpending,
  monthlyExpenses,
  emergencyTargetFromExpenses,
  type Goal,
} from "@/lib/anvesha/store";
import { LANGUAGES, makeT, inr, type Lang } from "@/lib/anvesha/i18n";
import {
  Button,
  Card,
  Field,
  Select,
  Choice,
  Progress,
  AnviBubble,
  AnviAvatar,
  Modal,
  TopBar,
  Stepper,
  Banner,
  SimNote,
} from "./ui";
import splash from "@/assets/splash.jpg";
import { cn } from "@/lib/utils";

function Page({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-5 pb-4 no-scrollbar">{children}</div>
      {footer && <div className="space-y-2.5 border-t border-border bg-card/60 px-5 py-4">{footer}</div>}
    </div>
  );
}

/* ---------------- Splash ---------------- */

function Splash() {
  const { go, state } = useAnvesha();
  const t = makeT(state.lang);
  return (
    <div className="flex h-full flex-col bg-brand-gradient px-6 pb-8 pt-14 text-primary-foreground">
      <div className="flex-1">
        <p className="text-xs font-semibold tracking-[0.35em] opacity-80">SAVINGS ASSISTANT</p>
        <h1 className="mt-2 text-5xl font-extrabold tracking-tight">{t("appName")}</h1>
        <p className="mt-3 max-w-[16rem] text-[15px] leading-relaxed opacity-90">{t("tagline")}</p>
        <img
          src={splash}
          alt="Delivery worker riding a scooter with savings coins"
          width={1024}
          height={768}
          className="mt-8 w-full rounded-3xl object-cover shadow-[var(--shadow-float)]"
        />
      </div>
      <div className="space-y-3">
        <p className="text-center text-[13px] opacity-85">
          Built for delivery partners with different earnings every day.
        </p>
        <Button variant="accent" onClick={() => go("auth")}>
          {t("getStarted")}
        </Button>
      </div>
    </div>
  );
}

/* ---------------- Auth ---------------- */

function Auth() {
  const { go, set, state } = useAnvesha();
  const t = makeT(state.lang);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [method, setMethod] = useState<"mobile" | "email">("mobile");
  const [value, setValue] = useState("98765 43210");
  const [error, setError] = useState("");

  const submit = () => {
    const identifier = method === "mobile" ? value.replace(/\D/g, "") : value.trim().toLowerCase();
    if (!identifier) return setError("Please enter this information.");
    if (method === "email" && !identifier.includes("@")) return setError("Please enter a valid email.");
    if (method === "mobile" && identifier.length < 10) return setError("Please enter a valid 10-digit mobile number.");

    // Login is only for accounts that have already been created. Check this
    // before opening the OTP screen so a missing account never produces the
    // misleading “Incorrect OTP” message.
    if (mode === "login") {
      try {
        const accounts = JSON.parse(localStorage.getItem("anvesha-accounts-v1") || "{}");
        if (!accounts[identifier]) {
          return setError("This number does not exist in our accounts. Please create a new account.");
        }
      } catch {
        return setError("We couldn't check your account. Please try again.");
      }
    }

    setError("");
    set({ authMode: mode, authIdentifier: identifier, phone: method === "mobile" ? value : state.phone, loggedIn: false });
    go("otp");
  };

  return (
    <Page
      footer={
        <>
          <Button onClick={submit}>{mode === "login" ? t("login") : t("signup")}</Button>
          {mode === "login" && error.includes("does not exist") && (
            <Button variant="accent" onClick={() => { setMode("signup"); setError(""); }}>
              Create a new account
            </Button>
          )}
          <Button variant="ghost" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? t("newHere") : t("alreadyAccount")}
          </Button>
        </>
      }
    >
      <TopBar title="" onBack={() => go("splash")} />
      <h1 className="text-2xl font-bold">{t("welcomeTitle")}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{t("authSubtitle")}</p>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              mode === m ? "bg-card text-primary shadow-[var(--shadow-card)]" : "text-muted-foreground"
            }`}
          >
            {m === "login" ? t("login") : t("signup")}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <Choice
          columns={2}
          value={method}
          onChange={(v) => {
            setMethod(v as "mobile" | "email");
            setValue(v === "mobile" ? "98765 43210" : "rahul@example.com");
            setError("");
          }}
          options={[
            { value: "mobile", label: t("mobile") },
            { value: "email", label: t("email") },
          ]}
        />
        <Field
          label={method === "mobile" ? t("mobile") : t("email")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={error}
          inputMode={method === "mobile" ? "numeric" : "email"}
        />
        <AnviBubble>
          Hi! I'm Anvi. We only send a one-time code — we never ask for your bank password or UPI PIN.
        </AnviBubble>
      </div>
    </Page>
  );
}

/* ---------------- OTP ---------------- */

function Otp() {
  const { go, set, state, authenticate } = useAnvesha();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const verify = () => {
    if (code.length !== 6) { setStatus("error"); return; }
    setStatus("loading");
    window.setTimeout(() => {
      if (code !== "123456") { setStatus("error"); return; }
      const result = authenticate(state.authMode, state.authIdentifier || state.phone.replace(/\D/g, ""));
      if (!result.ok) { setStatus("error"); return; }
      setStatus("idle");
    }, 250);
  };

  return (
    <Page
      footer={
        <>
          <Button onClick={verify} loading={status === "loading"} disabled={code.length !== 6}>
            Verify & continue
          </Button>
          <Button variant="ghost" onClick={() => setCode("123456")}>
            Use demo code 123456
          </Button>
        </>
      }
    >
      <TopBar title="Verify your number" onBack={() => go("auth")} />
      <p className="text-sm text-muted-foreground">
        We sent a 6-digit code to {state.phone}. For this prototype, the code is{" "}
        <span className="font-semibold text-foreground">123456</span>.
      </p>
      <div className="mt-6">
        <Field
          label="One-time code"
          value={code}
          inputMode="numeric"
          maxLength={6}
          placeholder="● ● ● ● ● ●"
          className="text-center text-2xl tracking-[0.4em]"
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
            if (status === "error") setStatus("idle");
          }}
          error={status === "error" ? "Incorrect OTP. Please try again." : ""}
        />
      </div>
      <div className="mt-4">
        <SimNote text="Prototype simulation — no real OTP is sent." />
      </div>
    </Page>
  );
}

/* ---------------- Language + Location ---------------- */

function LangLoc() {
  const { go, set, state } = useAnvesha();
  const t = makeT(state.lang);
  const [locating, setLocating] = useState(false);
  const [manual, setManual] = useState(false);

  const recommended =
    state.locationPermission === "unknown"
      ? []
      : LANGUAGES.filter((l) => l.regions.some((r) => r.toLowerCase() === state.city.toLowerCase())).slice(0, 3);
  const rest = LANGUAGES.filter((l) => !recommended.includes(l));

  return (
    <Page
      footer={
        <Button onClick={() => go("name")} disabled={state.locationPermission === "unknown"}>
          {t("continue")}
        </Button>
      }
    >
      <TopBar title={t("makeYours")} onBack={() => go("auth")} />
      <Card className="bg-secondary">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 text-primary" />
          <p className="text-[13px] leading-relaxed">{t("locationPrivacy")}</p>
        </div>
      </Card>

      <div className="mt-3 space-y-2.5">
        <Button
          loading={locating}
          variant="primary"
          onClick={() => {
            setLocating(true);
            if (!navigator.geolocation) {
              setLocating(false);
              set({ locationPermission: "denied" });
              return;
            }
            navigator.geolocation.getCurrentPosition(
              (position) => {
                // Browser geolocation gives coordinates. For privacy, keep only a coarse
                // region label in app state; the prototype does not store coordinates.
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const coarseCity =
                  lat >= 28 && lat <= 29.2 && lon >= 76 && lon <= 78.5 ? "Delhi" :
                  lat >= 18.8 && lat <= 19.5 && lon >= 72.7 && lon <= 73.2 ? "Mumbai" :
                  lat >= 22.3 && lat <= 23 && lon >= 88 && lon <= 88.6 ? "Kolkata" :
                  lat >= 12.8 && lat <= 13.2 && lon >= 77.4 && lon <= 77.8 ? "Bengaluru" :
                  lat >= 17.2 && lat <= 17.7 && lon >= 78.2 && lon <= 78.7 ? "Hyderabad" :
                  "India";
                setLocating(false);
                set({ locationPermission: "granted", city: coarseCity });
              },
              () => {
                setLocating(false);
                set({ locationPermission: "denied" });
              },
              { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
            );
          }}
        >
          {t("useLocation")}
        </Button>
        <Button variant="outline" onClick={() => setManual(true)}>
          {t("chooseManually")}
        </Button>
        {state.locationPermission !== "unknown" && (
          <Banner tone="success">
            Location: {state.city} ({state.locationPermission === "granted" ? "detected" : "chosen manually"})
          </Banner>
        )}
      </div>

      {state.locationPermission !== "unknown" && (
        <div className="mt-6 space-y-4">
          {recommended.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">
                {t("suggestedFor")} {state.city}
              </p>
              <LangList
                langs={recommended}
                value={state.lang}
                onPick={(l) => set({ lang: l })}
              />
            </div>
          )}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">{t("allLanguages")}</p>
            <LangList langs={rest} value={state.lang} onPick={(l) => set({ lang: l })} />
          </div>
        </div>
      )}

      <Modal open={manual} onClose={() => setManual(false)} title={t("chooseRegion")}>
        <div className="space-y-2">
          {["Delhi", "Rajasthan", "Uttar Pradesh", "Bihar", "Madhya Pradesh", "Haryana", "Maharashtra", "West Bengal", "Punjab", "Gujarat", "Karnataka", "Telangana", "Andhra Pradesh", "Tamil Nadu", "Kerala", "Odisha", "Assam", "Chandigarh"].filter((c, i, a) => a.indexOf(c) === i).map((c) => (
            <Button
              key={c}
              variant="outline"
              onClick={() => {
                set({ city: c, locationPermission: "manual" });
                setManual(false);
              }}
            >
              {c}
            </Button>
          ))}
        </div>
      </Modal>
    </Page>
  );
}

function LangList({
  langs,
  value,
  onPick,
}: {
  langs: typeof LANGUAGES;
  value: Lang;
  onPick: (l: Lang) => void;
}) {
  return (
    <Choice
      value={value}
      onChange={(v) => onPick(v as Lang)}
      options={langs.map((l) => ({ value: l.code, label: `${l.native} (${l.english})` }))}
    />
  );
}

/* ---------------- Name ---------------- */

function NameScreen() {
  const { go, set, state } = useAnvesha();
  const t = makeT(state.lang);
  const [name, setName] = useState(state.name);
  const [error, setError] = useState("");
  return (
    <Page
      footer={
        <Button
          onClick={() => {
            if (!name.trim()) return setError("Please enter this information.");
            set({ name: name.trim() });
            go("intro");
          }}
        >
          {t("continue")}
        </Button>
      }
    >
      <TopBar title="" onBack={() => go("langloc")} />
      <AnviBubble>Namaste! I'm Anvi and I'll be with you inside Anvesha.</AnviBubble>
      <h1 className="mt-6 text-2xl font-bold">{t("nameQ")}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        This is only used to greet you inside the app.
      </p>
      <div className="mt-5">
        <Field
          label={t("yourName")}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          error={error}
          placeholder="Rahul"
        />
      </div>
    </Page>
  );
}

/* ---------------- Anvi intro ---------------- */

function Intro() {
  const { go, state } = useAnvesha();
  const t = makeT(state.lang);
  const portals = [
    [t("personalPortal"), t("personalPortalDesc")],
    [t("financialPortal"), t("financialPortalDesc")],
    [t("upiPortal"), t("upiPortalDesc")],
    [t("whySavePortal"), t("whySavePortalDesc")],
    [t("goalsPortal"), t("goalsPortalDesc")],
    [t("bufferPortal"), t("bufferPortalDesc")],
    [t("budgetPortal"), t("budgetPortalDesc")],
  ];
  return (
    <Page footer={<Button onClick={() => go("onboardingHub")}>{t("startSetup")}</Button>}>
      <div className="flex flex-col items-center pt-8 text-center">
        <AnviAvatar size={108} />
        <h1 className="mt-4 text-2xl font-bold">{t("hello")}, {state.name}! {t("imAnvi")}</h1>
        <AnviBubble>{t("introAnvi")}</AnviBubble>
      </div>
      <Card className="mt-4 bg-secondary">
        <p className="font-bold">{t("dashboardIntroTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("dashboardIntroBody")}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {portals.map(([title, desc]) => <div key={title} className="rounded-2xl bg-card p-3 border border-border"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{desc}</p></div>)}
        </div>
      </Card>
    </Page>
  );
}

/* ---------------- Guided tour ---------------- */

const TOUR = [
  { icon: CalendarDays, title: "Calendar", text: "Record multiple income and expense entries for each day, see the daily budget and savings, and review your financial activity." },
  { icon: Target, title: "Goals", text: "Create multiple goals such as an emergency fund, vehicle repair or education and pause or resume them anytime." },
  { icon: Wallet, title: "Wallet", text: "See total simulated savings, emergency buffer, goal-wise savings and recent transactions." },
  { icon: CalendarDays, title: "Calendar", text: "Open today, yesterday or older dates to see a complete historical day report. Records are never erased at month-end." },
  { icon: ShieldCheck, title: "Emergency Buffer", text: "Build a separate cushion for medical emergencies, vehicle repairs and income gaps." },
  { icon: PiggyBank, title: "Budget & Savings", text: "See essential expenses, flexible spending, available money and an adaptive savings recommendation." },
  { icon: Landmark, title: "Benefits & Schemes", text: "Explore simple, clearly labelled suggestions. Anvesha never pretends a scheme is guaranteed or sells a product." },
  { icon: Bell, title: "Notifications", text: "Get useful reminders for missing records, savings opportunities, milestones and reviews without spam." },
  { icon: MessageCircleQuestion, title: "Help & Anvi", text: "Tap Anvi anytime to ask what a feature does, why a recommendation changed or what happens next." },
  { icon: Settings2, title: "Settings", text: "Change language, notifications, location permission, UPI simulation and privacy controls." },
];

function Tour() {
  const { go, set, state } = useAnvesha();
  const t = makeT(state.lang);
  const [step, setStep] = useState(0);
  const item = TOUR[step];
  const Icon = item.icon;

  const finish = () => {
    set({ tourDone: true });
    go("onboardingHub");
  };

  return (
    <Page
      footer={
        <>
          <Button onClick={() => (step === TOUR.length - 1 ? finish() : setStep(step + 1))}>
            {step === TOUR.length - 1 ? "Finish Tour" : t("continue")}
          </Button>
          <Button variant="ghost" onClick={finish}>Skip Tour</Button>
        </>
      }
    >
      <TopBar title="Meet your dashboard" onBack={step > 0 ? () => setStep(step - 1) : () => go("intro")} />

      {/* This is a dashboard-like interactive tour rather than a slideshow.
          The highlighted portal changes in place and Anvi explains the actual action. */}
      <div className="mt-3 rounded-[28px] border border-border bg-secondary p-3 shadow-[var(--shadow-card)]">
        <div className="relative mb-3 h-14 px-1">
          <div className="absolute transition-all duration-500 ease-out" style={{ left: `${6 + (step % 5) * 18}%`, top: step >= 5 ? 6 : 0 }}>
            <AnviAvatar size={42} />
          </div>
          <div className="ml-14 pt-1">
            <p className="text-xs font-semibold text-primary">Anvi's interactive tour</p>
            <p className="text-[11px] text-muted-foreground">Anvi moves to the feature she is explaining.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {TOUR.map((feature, i) => {
            const FeatureIcon = feature.icon;
            const active = i === step;
            return (
              <button
                key={feature.title}
                onClick={() => setStep(i)}
                className={cn(
                  "flex min-h-[70px] items-center gap-2 rounded-2xl border p-3 text-left transition-all",
                  active
                    ? "border-primary bg-card shadow-[var(--shadow-float)] ring-2 ring-primary/20 scale-[1.02]"
                    : "border-border bg-card/70",
                )}
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary")}>
                  <FeatureIcon className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold">{feature.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <AnviBubble>
          <strong>{item.title}:</strong> {item.text} Tap the highlighted {item.title.toLowerCase()} feature to open it later.
        </AnviBubble>
      </div>

      <Card className="mt-3 bg-accent-soft">
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-semibold">What happens when you tap it?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Anvesha takes you directly to that part of the app. You can return to Home anytime using the bottom navigation.
            </p>
          </div>
        </div>
      </Card>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {step + 1} of {TOUR.length} · You can explore everything again later by tapping Anvi.
      </p>
    </Page>
  );
}

/* ---------------- Personal information ---------------- */
function Personal() {
  const { go, set, state } = useAnvesha();
  const t = makeT(state.lang);
  const [step, setStep] = useState(0);
  const [f, setF] = useState({name:state.name, age:state.age, phone:state.phone, city:state.city, occupation:state.occupation, lang:state.lang, maritalStatus:state.maritalStatus, familyMembers:state.familyMembers, emergencyContact:state.emergencyContact});
  const [error, setError] = useState("");
  const upd=(k:keyof typeof f,v:string)=>{setF(x=>({...x,[k]:v}));setError("");};
  const save=(finish=false)=>{set({name:f.name.trim(),age:f.age,phone:f.phone,city:f.city,occupation:f.occupation,lang:f.lang as Lang,maritalStatus:f.maritalStatus,familyMembers:f.familyMembers,emergencyContact:f.emergencyContact,...(finish?{onboardingPortalIndex:1}: {})});if(finish)go("onboardingHub");};
  const steps=[
    {q:t("nameQ"),why:t("whyNeededName"),body:<Field label={t("fullName")} value={f.name} onChange={e=>upd("name",e.target.value)}/>},
    {q:t("age"),why:t("whyNeededAge"),body:<Field label={t("age")} inputMode="numeric" value={f.age} onChange={e=>upd("age",e.target.value.replace(/\D/g,""))}/>},
    {q:t("mobile"),why:"This keeps your prototype account linked to the number you verified.",body:<Field label={t("mobile")} inputMode="numeric" value={f.phone} onChange={e=>upd("phone",e.target.value)}/>},
    {q:t("cityArea"),why:t("whyNeededCity"),body:<Field label={t("cityArea")} value={f.city} onChange={e=>upd("city",e.target.value)}/>},
    {q:t("occupation"),why:t("whyNeededOccupation"),body:<Select label={t("occupation")} value={f.occupation} onChange={v=>upd("occupation",v)} options={[{value:"Delivery Worker",label:"Delivery Worker"},{value:"Cab / Auto Driver",label:"Cab / Auto Driver"},{value:"Daily Wage Worker",label:"Daily Wage Worker"},{value:"Other",label:t("other")}]} />},
    {q:t("preferredLanguage"),why:"You can change this later in Settings.",body:<Select label={t("preferredLanguage")} value={f.lang} onChange={v=>upd("lang",v)} options={LANGUAGES.map(l=>({value:l.code,label:`${l.native} (${l.english})`}))}/>},
    {q:t("maritalOptional"),why:"This is optional and helps contextualise household planning.",body:<Choice columns={2} value={f.maritalStatus} onChange={v=>upd("maritalStatus",v)} options={[{value:"Single",label:t("single")},{value:"Married",label:t("married")}]}/>},
    {q:t("familyMembers"),why:t("whyNeededFamily"),body:<Field label={t("familyMembers")} inputMode="numeric" value={f.familyMembers} onChange={e=>upd("familyMembers",e.target.value.replace(/\D/g,""))}/>},
    {q:t("emergencyContact"),why:t("emergencyHint"),body:<Field label={t("emergencyContact")} value={f.emergencyContact} onChange={e=>upd("emergencyContact",e.target.value)}/>},
  ];
  const next=()=>{if(step===0&&!f.name.trim())return setError("Please enter your name.");if(step===1&&Number(f.age)<16)return setError("Please enter a valid age.");if(step===2&&f.phone.replace(/\D/g,"").length<10)return setError("Please enter a valid mobile number.");if(step===4&&!f.occupation)return setError("Please choose your work.");if(step===7&&Number(f.familyMembers)<1)return setError("Please enter your household size.");save();if(step<steps.length-1)setStep(step+1);else save(true);};
  const current=steps[step];
  return <Page footer={<div className="space-y-2"><Button onClick={next}>{step===steps.length-1?t("finishPortal"):t("nextQuestion")}</Button><Button variant="ghost" onClick={()=>save(true)}>{t("saveExit")}</Button></div>}>
    <TopBar title={t("personalPortal")} onBack={()=>step>0?setStep(step-1):go("onboardingHub")}/>
    <div className="mt-2 flex items-center gap-3"><AnviAvatar size={54}/><div><p className="text-xs font-semibold text-primary">{t("anviSays")}</p><p className="text-sm font-semibold">{t("letsDoThis")}</p></div></div>
    <div className="mt-4"><AnviBubble>{current.why}</AnviBubble></div>
    <Card className="mt-4 bg-secondary"><p className="text-xs text-muted-foreground">{step+1} / {steps.length}</p><h1 className="mt-1 text-xl font-bold">{current.q}</h1><div className="mt-5">{current.body}</div>{error&&<p className="mt-2 text-xs text-destructive">{error}</p>}</Card>
    <div className="mt-3 flex gap-2"><Button variant="outline" disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))}>{t("previousQuestion")}</Button><Button variant="ghost" onClick={()=>save(true)}>{t("saveExit")}</Button></div>
  </Page>;
}

/* ---------------- Onboarding journey hub ---------------- */
function OnboardingHub() {
  const { state, go } = useAnvesha();
  const t = makeT(state.lang);
  const [selected, setSelected] = useState<string | null>(null);
  const [explain, setExplain] = useState<string | null>(null);
  const sequence = ["personal", "financial", "upi", "whysave", "goalsetup", "buffer", "budget"] as const;
  const items = [
    ["personal", t("personalPortal"), t("personalPortalDesc")],
    ["financial", t("financialPortal"), t("financialPortalDesc")],
    ["upi", t("upiPortal"), t("upiPortalDesc")],
    ["whysave", t("whySavePortal"), t("whySavePortalDesc")],
    ["goalsetup", t("goalsPortal"), t("goalsPortalDesc")],
    ["buffer", t("bufferPortal"), t("bufferPortalDesc")],
    ["budget", t("budgetPortal"), t("budgetPortalDesc")],
  ] as const;
  const currentIndex = Math.min(state.onboardingPortalIndex, sequence.length - 1);
  const current = sequence[currentIndex];
  const statusFor = (key: string) => {
    if (state.onboarded) return "complete";
    const idx = sequence.indexOf(key as typeof sequence[number]);
    if (idx < currentIndex) return "complete";
    if (idx === currentIndex) return "inProgress";
    return "notStarted";
  };
  const explanations: Record<string,string> = {
    personal: t("personalPortalExplain"), financial: t("financialPortalExplain"), whysave: t("whySavePortalExplain"),
    goalsetup: t("goalsPortalExplain"), buffer: t("bufferPortalExplain"), budget: t("budgetPortalExplain"), upi: t("upiPortalExplain"),
  };
  const label = (s:string) => s === "complete" ? t("portalComplete") : s === "inProgress" ? t("portalInProgress") : t("portalNotStarted");
  const open = (key: string) => {
    if (key !== current) return;
    go(key as any);
  };
  return <Page>
    <TopBar title={t("onboardingHubTitle")} onBack={() => go("intro")} />
    <div className="mt-2 rounded-3xl bg-secondary p-4">
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0"><AnviAvatar size={58} /></div>
        <div><p className="text-xs font-semibold text-primary">{t("anviSays")}</p><p className="mt-1 text-sm leading-relaxed">{t("journeyExplain")}</p></div>
      </div>
    </div>
    <div className="mt-4 space-y-3">
      {items.map(([key,title,desc],i)=>{ const status=statusFor(key); const active=key===current; return <Card key={key} className={cn("relative overflow-hidden transition-all duration-500",active&&"border-primary ring-2 ring-primary/15")}>
        {active && <div className="absolute right-3 top-2 animate-anvi-float"><AnviAvatar size={46}/></div>}
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary font-bold">{i+1}</div>
          <div className="min-w-0 flex-1 pr-10"><div className="flex items-center gap-2"><p className="font-bold">{title}</p><span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold">{label(status)}</span></div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p></div>
          <button aria-label={`${t("explain")} ${title}`} onClick={()=>setExplain(key)} className="rounded-full bg-secondary p-2 text-primary"><CircleHelp className="h-4 w-4"/></button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          {active ? <Button onClick={()=>{setSelected(key);open(key)}}>{t("tapToOpenPortal")}</Button> : <Button variant="outline" disabled>{status === "complete" ? t("completedAlready") : t("lockedUntilReady")}</Button>}
        </div>
      </Card>})}
    </div>
    <Modal open={!!explain} onClose={()=>setExplain(null)} title={explain ? items.find(x=>x[0]===explain)?.[1] ?? "" : ""}>
      {explain && <div className="space-y-3"><div className="flex items-start gap-3"><AnviAvatar size={48}/><AnviBubble>{explanations[explain]}</AnviBubble></div><Button onClick={()=>setExplain(null)}>{t("gotIt")}</Button></div>}
    </Modal>
  </Page>;
}

/* ---------------- Financial information (conversational) ---------------- */

function Financial() {
  const { go, set, state } = useAnvesha();
  const t = makeT(state.lang);
  const [step, setStep] = useState(state.financialStep || 0);
  const [d, setD] = useState({
    incomeSource: state.incomeSource,
    dailyIncome: String(state.dailyIncome),
    variability: String(state.incomeVariability),
    hasOther: state.otherIncome > 0 ? "yes" : "no",
    otherName: "",
    otherAmount: String(state.otherIncome || ""),
    household: state.familyMembers,
    earners: state.earningMembers,
    spouseWorks: state.spouseIncome > 0 ? "yes" : "no",
    spouseIncome: String(state.spouseIncome || ""),
    hasEmergency: state.existingEmergencySavings > 0 ? "yes" : "no",
    emergencyAmount: String(state.existingEmergencySavings || ""),
  });
  const [expenses, setExpenses] = useState(state.expenses);
  const [error, setError] = useState("");
  const upd = (k: string, v: string) => {
    setD({ ...d, [k]: v });
    setError("");
  };

  const expenseFields: { key: keyof typeof expenses; label: string }[] = [
    { key: "rent", label: t("rent") },
    { key: "food", label: t("food") },
    { key: "utilities", label: t("utilities") },
    { key: "phone", label: t("phoneInternet") },
    { key: "fuel", label: t("fuelVehicle") },
    { key: "education", label: t("education") },
    { key: "medical", label: t("medical") },
    { key: "debt", label: t("loanRepayments") },
    { key: "family", label: t("familySupport") },
    { key: "other", label: t("other") },
  ];

  const steps: { title: string; body: React.ReactNode; valid: () => string }[] = [
    {
      title: t("incomeSourceQ"),
      body: (
        <Choice
          value={d.incomeSource}
          onChange={(v) => upd("incomeSource", v)}
          options={[
            { value: t("deliveryWork"), label: t("deliveryWork") },
            { value: t("otherWork"), label: t("otherWork") },
            { value: t("both"), label: t("both") },
          ]}
        />
      ),
      valid: () => (d.incomeSource ? "" : "Please choose one option."),
    },
    {
      title: t("normalDayIncomeQ"),
      body: (
        <Field
          label={t("dailyEarnings")}
          inputMode="numeric"
          value={d.dailyIncome}
          onChange={(e) => upd("dailyIncome", e.target.value.replace(/\D/g, ""))}
        />
      ),
      valid: () => (Number(d.dailyIncome) > 0 ? "" : "Please enter a valid amount."),
    },
    {
      title: t("incomeVariationQ"),
      body: (
        <div>
          <Field
            label={t("difference")}
            inputMode="numeric"
            value={d.variability}
            onChange={(e) => upd("variability", e.target.value.replace(/\D/g, ""))}
            hint="Example: on a slow day you earn ₹400 less than usual."
          />
        </div>
      ),
      valid: () => (d.variability !== "" ? "" : "Please enter a valid amount."),
    },
    {
      title: t("otherIncomeQ"),
      body: (
        <div className="space-y-3">
          <Choice
            columns={2}
            value={d.hasOther}
            onChange={(v) => upd("hasOther", v)}
            options={[
              { value: "yes", label: t("yes") },
              { value: "no", label: t("no") },
            ]}
          />
          {d.hasOther === "yes" && (
            <>
              <Field label={t("whatIsIt")} value={d.otherName} onChange={(e) => upd("otherName", e.target.value)} />
              <Field
                label={t("monthlyAmount")}
                inputMode="numeric"
                value={d.otherAmount}
                onChange={(e) => upd("otherAmount", e.target.value.replace(/\D/g, ""))}
              />
            </>
          )}
        </div>
      ),
      valid: () =>
        d.hasOther === "yes" && !d.otherAmount ? "Please enter a valid amount." : "",
    },
    {
      title: t("householdQ"),
      body: (
        <div className="space-y-3">
          <Field
            label={t("householdMembers")}
            inputMode="numeric"
            value={d.household}
            onChange={(e) => upd("household", e.target.value.replace(/\D/g, ""))}
          />
          <Field
            label={t("earningMembers")}
            inputMode="numeric"
            value={d.earners}
            onChange={(e) => upd("earners", e.target.value.replace(/\D/g, ""))}
          />
          <p className="pt-1 text-sm font-medium">Does your spouse work?</p>
          <Choice
            columns={2}
            value={d.spouseWorks}
            onChange={(v) => upd("spouseWorks", v)}
            options={[
              { value: "yes", label: t("yes") },
              { value: "no", label: t("no") },
            ]}
          />
          {d.spouseWorks === "yes" && (
            <Field
              label={t("spouseIncome")}
              inputMode="numeric"
              value={d.spouseIncome}
              onChange={(e) => upd("spouseIncome", e.target.value.replace(/\D/g, ""))}
            />
          )}
        </div>
      ),
      valid: () => (Number(d.household) > 0 ? "" : "Please enter this information."),
    },
    {
      title: t("monthlyExpenses"),
      body: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose a range — you do not need exact numbers.
          </p>
          {expenseFields.map((f) => (
            <div key={f.key}>
              <p className="mb-1.5 text-sm font-medium">{f.label}</p>
              <Choice
                columns={2}
                value={expenses[f.key]}
                onChange={(v) => setExpenses({ ...expenses, [f.key]: v })}
                options={RANGE_OPTIONS}
              />
            </div>
          ))}
        </div>
      ),
      valid: () => (expenses.rent && expenses.food ? "" : "Please choose rent and food ranges."),
    },
    {
      title: t("emergencySavingsQ"),
      body: (
        <div className="space-y-3">
          <Choice
            columns={2}
            value={d.hasEmergency}
            onChange={(v) => upd("hasEmergency", v)}
            options={[
              { value: "yes", label: t("yes") },
              { value: "no", label: t("no") },
            ]}
          />
          {d.hasEmergency === "yes" && (
            <Field
              label={t("approxAmount")}
              inputMode="numeric"
              value={d.emergencyAmount}
              onChange={(e) => upd("emergencyAmount", e.target.value.replace(/\D/g, ""))}
            />
          )}
        </div>
      ),
      valid: () =>
        d.hasEmergency === "yes" && !d.emergencyAmount ? "Please enter a valid amount." : "",
    },
  ];

  const isSummary = step === steps.length;
  const monthlyIncome = Number(d.dailyIncome) * 26 + Number(d.otherAmount || 0) + Number(d.spouseIncome || 0);
  const totalExpenses = monthlyExpenses(expenses);
  const capacity = Math.max(0, monthlyIncome - totalExpenses);

  const next = () => {
    const err = steps[step].valid();
    if (err) return setError(err);
    setError("");
    const nextStep = step + 1;
    set({
      incomeSource: d.incomeSource,
      dailyIncome: Number(d.dailyIncome || 0),
      incomeVariability: Number(d.variability || 0),
      otherIncome: d.hasOther === "yes" ? Number(d.otherAmount || 0) : 0,
      familyMembers: d.household,
      earningMembers: d.earners,
      spouseIncome: d.spouseWorks === "yes" ? Number(d.spouseIncome || 0) : 0,
      expenses,
      existingEmergencySavings: d.hasEmergency === "yes" ? Number(d.emergencyAmount || 0) : 0,
      financialStep: nextStep,
    });
    setStep(nextStep);
  };

  if (isSummary) {
    const editingExisting = state.onboarded;
    return (
      <Page footer={<Button onClick={() => {
        if (editingExisting) { set({ financialStep: 0 }); go("app"); }
        else { set({ onboardingPortalIndex: 2 }); go("onboardingHub"); }
      }}>{editingExisting ? "Save changes" : t("continueToNextPortal")}</Button>}>
        <TopBar title={t("moneySummary")} onBack={() => setStep(steps.length - 1)} />
        <AnviBubble>This is what I understood. We can always change it later.</AnviBubble>
        <div className="mt-4 space-y-2.5">
          <SummaryRow label={t("estimatedMonthlyIncome")} value={inr(monthlyIncome)} />
          <SummaryRow label={t("essentialExpenses")} value={inr(totalExpenses * 0.75)} />
          <SummaryRow label={t("otherExpenses")} value={inr(totalExpenses * 0.25)} />
          <SummaryRow label={t("existingEmergencySavings")} value={inr(Number(d.emergencyAmount || 0))} />
          <SummaryRow label={t("possibleSavings")} value={inr(capacity)} highlight />
        </div>
      </Page>
    );
  }

  return (
    <Page
      footer={
        <>
          {error && <Banner tone="error">{error}</Banner>}
          <Button onClick={next}>{step === steps.length - 1 ? t("seeSummary") : t("continue")}</Button>
          <Button variant="ghost" onClick={()=>{set({ incomeSource:d.incomeSource, dailyIncome:Number(d.dailyIncome||0), incomeVariability:Number(d.variability||0), otherIncome:d.hasOther==="yes"?Number(d.otherAmount||0):0, familyMembers:d.household, earningMembers:d.earners, spouseIncome:d.spouseWorks==="yes"?Number(d.spouseIncome||0):0, expenses, existingEmergencySavings:d.hasEmergency==="yes"?Number(d.emergencyAmount||0):0, financialStep:step }); go(state.onboarded ? "app" : "onboardingHub");}}>{t("saveExit")}</Button>
        </>
      }
    >
      <TopBar
        title={t("financialTitle")}
        onBack={step === 0 ? () => go("onboardingHub") : () => setStep(step - 1)}
      />
      <Card className="mb-3 bg-secondary">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Your information stays under your control</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">We only ask for information we need to build a useful savings plan. You can review or edit it later.</p>
          </div>
        </div>
      </Card>
      <Stepper step={step} total={steps.length} />
      <h2 className="mt-4 text-xl font-bold leading-snug">{steps[step].title}</h2>
      <div className="mt-4">{steps[step].body}</div>
    </Page>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "bg-accent-soft" : ""}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`text-lg font-bold ${highlight ? "text-accent" : ""}`}>{value}</span>
      </div>
    </Card>
  );
}

/* ---------------- Why save ---------------- */

function WhySave() {
  const { go, set } = useAnvesha();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (playing) return setPlaying(false);
    setPlaying(true);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setPlaying(false);
          return 100;
        }
        return p + 5;
      });
    }, 120);
  };

  return (
    <Page
      footer={
        <>
          <Button onClick={() => set({ screen: "goalsetup", onboardingStep: "goalsetup", onboardingPortalIndex: 4 })}>Continue</Button>
          <Button variant="ghost" onClick={() => set({ screen: "goalsetup", onboardingStep: "goalsetup", onboardingPortalIndex: 4 })}>
            Skip
          </Button>
        </>
      }
    >
      <TopBar title="Why saving matters" onBack={() => go("upi")} />
      <Card className="bg-brand-gradient p-0 text-primary-foreground">
        <div className="flex h-44 items-center justify-center">
          <button
            onClick={toggle}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-card/20 backdrop-blur transition-transform active:scale-95"
            aria-label={playing ? "Pause video" : "Play video"}
          >
            {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
          </button>
        </div>
        <div className="px-4 pb-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-card/25">
            <div className="h-full bg-card transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs opacity-90">
            {progress >= 100 ? "Watched ✓" : playing ? "Playing…" : "Saving on an irregular income · 1:30"}
          </p>
        </div>
      </Card>

      <div className="mt-4 space-y-3">
        <AnviBubble>
          Your earnings change every day, so a fixed monthly saving does not work. Small daily amounts
          do.
        </AnviBubble>
        {[
          ["Medical emergencies", "One hospital visit can cost a full week of earnings."],
          ["Vehicle repair", "A bike repair stops your income until it is fixed."],
          ["Family needs", "School fees, festivals and travel come suddenly."],
          ["Income gaps", "Rain, illness or slow days mean less work."],
        ].map(([t, s]) => (
          <Card key={t}>
            <p className="text-[15px] font-semibold">{t}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s}</p>
          </Card>
        ))}
        <Card className="bg-accent-soft">
          <p className="text-[15px] font-semibold text-accent">How Anvesha helps</p>
          <p className="mt-1 text-sm">
            We suggest a small amount every day based on what you actually earned, build an emergency
            buffer first, and never take money automatically.
          </p>
        </Card>
      </div>
    </Page>
  );
}

/* ---------------- Goal setup ---------------- */

const GOAL_TYPES = [
  "Emergency Fund",
  "Medical Emergency",
  "Vehicle Repair",
  "Family Need",
  "Education",
  "Personal Goal",
  "Other",
];

export function GoalForm({
  onSave,
  onCancel,
  saveLabel = "Save goal",
}: {
  onSave: (g: Goal) => void;
  onCancel?: () => void;
  saveLabel?: string;
}) {
  const { state } = useAnvesha();
  const t = makeT(state.lang);
  const [name, setName] = useState("");
  const [custom, setCustom] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [planMode, setPlanMode] = useState<"anvesha" | "own" | "help">("anvesha");
  const [error, setError] = useState("");

  const submit = () => {
    const finalName = name === t("other") ? custom.trim() : name;
    if (!finalName || !amount || Number(amount) <= 0 || !date)
      return setError("Please complete your goal details.");
    onSave({
      id: "g" + Date.now(),
      name: finalName,
      target: Number(amount),
      current: 0,
      targetDate: date,
      status: "active",
      planMode,
    });
    setName("");
    setCustom("");
    setAmount("");
    setDate("");
    setError("");
  };

  return (
    <div className="space-y-3.5">
      <p className="text-sm font-medium">What are you saving for?</p>
      <Choice
        columns={2}
        value={name}
        onChange={(v) => {
          setName(v);
          setError("");
        }}
        options={GOAL_TYPES.map((g) => ({ value: g, label: g }))}
      />
      {name === t("other") && (
        <Field label="Goal name" value={custom} onChange={(e) => setCustom(e.target.value)} />
      )}
      <p className="text-sm font-medium">How would you like to plan it?</p>
      <Choice
        columns={1}
        value={planMode}
        onChange={(v) => setPlanMode(v as "anvesha" | "own" | "help")}
        options={[
          { value: "anvesha", label: "Let Anvesha make a plan" },
          { value: "own", label: "I want to make my own plan" },
          { value: "help", label: "Help me decide" },
        ]}
      />
      <Field
        label="How much would you like to save? (₹)"
        inputMode="numeric"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
      />
      <Field
        label="When would you like to reach this goal?"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      {error && <Banner tone="error">{error}</Banner>}
      <Button onClick={submit} variant="accent">
        <Plus className="h-4 w-4" /> {saveLabel}
      </Button>
      {onCancel && (
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </div>
  );
}

function GoalSetup() {
  const { go, set, state } = useAnvesha();
  const [adding, setAdding] = useState(state.goals.length === 0);
  return (
    <Page
      footer={
        <>
          <Button onClick={() => set({ screen: "buffer", onboardingStep: "buffer", onboardingPortalIndex: 5 })} disabled={state.goals.length === 0}>
            Continue
          </Button>
          {!adding && (
            <Button variant="outline" onClick={() => setAdding(true)}>
              Add another goal
            </Button>
          )}
        </>
      }
    >
      <TopBar title="What are you saving for?" onBack={() => go("whysave")} />
      <div className="space-y-3">
        {state.goals.map((g) => (
          <Card key={g.id}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">{g.name}</p>
              <span className="text-sm font-semibold text-accent">{inr(g.target)}</span>
            </div>
            <div className="mt-2">
              <Progress value={g.current} max={g.target} />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {inr(g.current)} saved · by {g.targetDate}
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        {adding ? (
          <Card>
            <GoalForm
              onSave={(g) => {
                // Keep goal creation atomic from the user's perspective.
                // The new goal is complete before the form closes.
                set({ goals: [...state.goals, { ...g, status: "active" }] });
                setAdding(false);
              }}
              onCancel={state.goals.length ? () => setAdding(false) : undefined}
            />
          </Card>
        ) : (
          <AnviBubble>
            Most partners start with an Emergency Fund. You can add more goals anytime.
          </AnviBubble>
        )}
      </div>
    </Page>
  );
}

/* ---------------- UPI setup ---------------- */

function Upi() {
  const { go, set, state } = useAnvesha();
  const [phase, setPhase] = useState<"idle" | "auth" | "connecting" | "done">(
    state.upiConnected ? "done" : "idle",
  );

  return (
    <Page
      footer={
        <>
          {phase === "done" ? (
            <Button onClick={() => set({ screen: "whysave", onboardingStep: "whysave", onboardingPortalIndex: 3 })}>Continue</Button>
          ) : (
            <>
              <Button onClick={() => setPhase("auth")}>Connect UPI</Button>
              <Button variant="ghost" onClick={() => set({ screen: "whysave", onboardingStep: "whysave", onboardingPortalIndex: 3 })}>
                Skip for now
              </Button>
            </>
          )}
        </>
      }
    >
      <TopBar title="Connect UPI" onBack={() => go("financial")} />
      <AnviBubble>
        Connect your UPI account to make saving easier. Your money stays in your own bank account
        unless you choose to save.
      </AnviBubble>
      <Card className="mt-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div className="text-sm">
            <p className="font-semibold">We will never ask for</p>
            <ul className="mt-1.5 space-y-1 text-muted-foreground">
              <li>• Your UPI PIN</li>
              <li>• Your bank password</li>
              <li>• Your card or OTP details</li>
            </ul>
          </div>
        </div>
      </Card>
      {phase === "done" && (
        <div className="mt-4 space-y-3">
          <Banner tone="success">UPI connected ✓ — {state.upiId}</Banner>
        </div>
      )}
      <div className="mt-4">
        <SimNote text="Prototype simulation — no real bank account is connected." />
      </div>

      <Modal
        open={phase === "auth" || phase === "connecting"}
        onClose={() => setPhase("idle")}
        title="Authorise in your UPI app"
        dismissible={phase === "auth"}
      >
        <div className="space-y-4">
          <Card className="bg-secondary">
            <p className="text-sm">
              Approve a ₹1 verification request in your UPI app. No PIN is asked here.
            </p>
            <p className="mt-2 text-sm font-semibold">{state.upiId}</p>
          </Card>
          {phase === "connecting" ? (
            <Banner tone="info">Connecting securely…</Banner>
          ) : (
            <Button
              onClick={() => {
                setPhase("connecting");
                setTimeout(() => {
                  set({ upiConnected: true });
                  setPhase("done");
                }, 1400);
              }}
            >
              Approve request
            </Button>
          )}
          <SimNote text="Prototype simulation — no real money is transferred." />
        </div>
      </Modal>
    </Page>
  );
}

/* ---------------- Emergency buffer onboarding portal ---------------- */
function BufferPortal() {
  const { state, set, go } = useAnvesha();
  const t = makeT(state.lang);
  const target = Number(state.emergencyBufferTarget) > 0 ? Number(state.emergencyBufferTarget) : emergencyTargetFromExpenses(state);
  const [value, setValue] = useState(String(state.existingEmergencySavings || state.emergencyBuffer || ""));
  return <Page footer={<Button onClick={()=>set({ emergencyBuffer:Number(value)||0, emergencyBufferTarget:target, onboardingPortalIndex:6, screen:"budget", onboardingStep:"budget" })}>{t("continueToNextPortal")}</Button>}>
    <TopBar title={t("bufferPortal")} onBack={()=>go("goalsetup")} />
    <div className="flex items-start gap-3"><AnviAvatar size={52}/><AnviBubble>{t("bufferIntroAnvi")}</AnviBubble></div>
    <Card className="mt-4 bg-secondary"><p className="font-semibold">{t("bufferQuestion")}</p><p className="mt-1 text-xs text-muted-foreground">{t("bufferSimpleHint")}</p><Field className="mt-3" label={t("currentEmergencyAmount")} inputMode="numeric" value={value} onChange={e=>setValue(e.target.value.replace(/\D/g,""))}/></Card>
    <Card className="mt-3"><p className="font-semibold">{t("recommendedTarget")}</p><p className="mt-1 text-2xl font-bold text-accent">{inr(target)}</p><p className="mt-1 text-xs text-muted-foreground">{t("bufferSeparate")}</p></Card>
  </Page>;
}

/* ---------------- Flexible budget ---------------- */

function Budget() {
  const { go, set, state } = useAnvesha();
  const rec = recommendedSaving(state);
  return (
    <Page
      footer={
        <Button
          onClick={() => {
            set({ onboarded: true, loggedIn: true, tab: "home", onboardingPortalIndex: 7 });
            go("app");
          }}
        >
          Go to my dashboard
        </Button>
      }
    >
      <TopBar title="Your flexible plan" onBack={() => go("buffer")} />
      <AnviBubble tone="warm">
        Your savings amount changes with your income. This is a recommendation, not a mandatory
        deduction.
      </AnviBubble>
      <div className="mt-4 space-y-2.5">
        <SummaryRow label="Estimated essential expenses (daily)" value={inr(essentialDaily(state))} />
        <SummaryRow label="Flexible expenses (daily)" value={inr(flexibleDaily(state))} />
        <SummaryRow
          label="Emergency buffer"
          value={`${inr(state.emergencyBuffer)} / ${inr(state.emergencyBufferTarget)}`}
        />
        <SummaryRow label="Recommended saving today" value={inr(rec)} highlight />
        <SummaryRow label="Available for spending" value={inr(availableSpending(state))} />
      </div>
      <Card className="mt-4 bg-secondary">
        <p className="text-sm font-semibold">How it adapts</p>
        <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <p>Earn ₹500 → save around ₹30–₹50</p>
          <p>Earn ₹1,000 → save around ₹100</p>
          <p>Earn ₹1,500 → save around ₹150–₹200</p>
        </div>
      </Card>
    </Page>
  );
}

/* ---------------- Router ---------------- */

export function OnboardingFlow() {
  const { state } = useAnvesha();
  switch (state.screen) {
    case "splash":
      return <Splash />;
    case "auth":
      return <Auth />;
    case "otp":
      return <Otp />;
    case "langloc":
      return <LangLoc />;
    case "name":
      return <NameScreen />;
    case "intro":
      return <Intro />;
    case "tour":
      return <Tour />;
    case "onboardingHub":
      return <OnboardingHub />;
    case "personal":
      return <Personal />;
    case "financial":
      return <Financial />;
    case "whysave":
      return <WhySave />;
    case "goalsetup":
      return <GoalSetup />;
    case "upi":
      return <Upi />;
    case "buffer":
      return <BufferPortal />;
    case "budget":
      return <Budget />;
    default:
      return null;
  }
}
