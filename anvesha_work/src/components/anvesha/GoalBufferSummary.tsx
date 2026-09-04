import React from "react";
import { goalProgress, bufferProgress, type SavingsGoal, type EmergencyBuffer } from "../../lib/goals-buffer";

export default function GoalBufferSummary({
  goals, buffer
}: { goals: SavingsGoal[]; buffer: EmergencyBuffer }) {
  const bp = bufferProgress(buffer);
  return (
    <section style={{display:"grid",gap:12,color:"#173536"}}>
      <div style={{background:"#DDF3EF",borderRadius:18,padding:16}}>
        <div style={{fontSize:12,fontWeight:800,color:"#0F5C5E"}}>EMERGENCY BUFFER</div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
          <strong>₹{buffer.current}</strong><span>of ₹{buffer.target}</span>
        </div>
        <div style={{height:8,background:"#fff",borderRadius:99,overflow:"hidden",marginTop:10}}>
          <div style={{height:"100%",width:`${bp}%`,background:"#168A83"}} />
        </div>
        <p style={{fontSize:12,margin:"8px 0 0"}}>
          {bp < 100 ? "Building your emergency buffer is a priority. You still decide whether to save." : "Great — your emergency buffer target is complete."}
        </p>
      </div>
      {goals.map(g => {
        const p = goalProgress(g);
        return (
          <div key={g.id} style={{background:"#FFF9F2",borderRadius:18,padding:16,border:"1px solid rgba(15,92,94,.10)"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <strong>{g.name}</strong><span>{p}%</span>
            </div>
            <div style={{fontSize:12,marginTop:4}}>₹{g.saved} / ₹{g.target}{g.deadline ? ` • ${g.deadline}` : ""}</div>
            <div style={{height:7,background:"#DDF3EF",borderRadius:99,overflow:"hidden",marginTop:9}}>
              <div style={{height:"100%",width:`${p}%`,background:"#F28C52"}} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
