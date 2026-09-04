import React from "react";
import { getDailyReport, type MoneyEntry } from "../../lib/daily-money";

export default function DailyMoneySummary({
  entries, date, onAdd
}: { entries: MoneyEntry[]; date: string; onAdd?: () => void }) {
  const r = getDailyReport(entries, date);
  return (
    <section style={{background:"#FFF9F2",borderRadius:20,padding:18,border:"1px solid rgba(15,92,94,.10)",color:"#173536"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
        <div>
          <div style={{fontSize:12,fontWeight:800,color:"#0F5C5E"}}>DAY REPORT</div>
          <div style={{fontSize:18,fontWeight:800}}>{date}</div>
        </div>
        <button type="button" onClick={onAdd} style={{border:0,borderRadius:12,padding:"9px 12px",background:"#168A83",color:"#fff",fontWeight:700}}>
          + Add
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:14}}>
        <div><small>Income</small><div style={{fontWeight:800}}>₹{r.income}</div></div>
        <div><small>Expenses</small><div style={{fontWeight:800}}>₹{r.expenses}</div></div>
        <div><small>Net</small><div style={{fontWeight:800}}>₹{r.net}</div></div>
      </div>
      <div style={{marginTop:14,fontSize:13}}>
        {r.entries.length === 0 ? "No record added for this date yet." :
          r.entries.map(e => <div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(23,53,54,.08)"}}>
            <span>{e.type === "income" ? "Income" : e.category || "Expense"}</span>
            <strong>{e.type === "income" ? "+" : "−"}₹{e.amount}</strong>
          </div>)
        }
      </div>
    </section>
  );
}
