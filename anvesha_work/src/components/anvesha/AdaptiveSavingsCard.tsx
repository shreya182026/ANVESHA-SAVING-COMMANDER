import React from "react";
import { getAdaptiveSavings, type DailyPlan } from "../../lib/anvesha-finance";

type Props = DailyPlan & {
  onChoose?: (amount: number) => void;
};

export default function AdaptiveSavingsCard(props: Props) {
  const plan = getAdaptiveSavings(props);

  return (
    <section aria-label="Adaptive savings recommendation" style={{
      borderRadius: 20, padding: 20, background: "#DDF3EF",
      border: "1px solid rgba(15,92,94,.12)", color: "#173536"
    }}>
      <div style={{fontSize: 13, fontWeight: 700, color: "#0F5C5E"}}>SAFE TO SAVE TODAY</div>
      <div style={{fontSize: 34, fontWeight: 800, margin: "6px 0"}}>₹{plan.recommended}</div>
      <div style={{fontSize: 14, lineHeight: 1.45}}>
        Based on today's income of ₹{props.income} and recorded expenses of ₹{props.expenses}.
        This is a recommendation — <strong>you decide</strong> whether to save it.
      </div>

      {plan.recommended > 0 && (
        <div style={{display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap"}}>
          <button
            type="button"
            onClick={() => props.onChoose?.(plan.recommended)}
            style={{
              border: 0, borderRadius: 12, padding: "11px 16px",
              background: "#168A83", color: "#fff", fontWeight: 700, cursor: "pointer"
            }}
          >
            Save ₹{plan.recommended}
          </button>
          <button
            type="button"
            onClick={() => props.onChoose?.(0)}
            style={{
              border: "1px solid #168A83", borderRadius: 12, padding: "11px 16px",
              background: "#fff", color: "#0F5C5E", fontWeight: 700, cursor: "pointer"
            }}
          >
            Maybe later
          </button>
        </div>
      )}

      <p style={{fontSize: 12, marginBottom: 0, opacity: .8}}>{plan.reason}</p>
    </section>
  );
}
