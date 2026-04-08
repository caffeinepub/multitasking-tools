import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calculator,
  Clock,
  IndianRupee,
  Percent,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  totalMonths: number;
  schedule: {
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

function calcEMI(
  principal: number,
  rate: number,
  tenure: number,
  unit: "years" | "months",
): EMIResult {
  const r = rate / 100 / 12;
  const n = unit === "years" ? tenure * 12 : tenure;
  const emi = (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;
  const schedule: EMIResult["schedule"] = [];
  let balance = principal;
  for (let i = 1; i <= Math.min(n, 12); i++) {
    const interest = balance * r;
    const princ = emi - interest;
    balance -= princ;
    schedule.push({
      month: i,
      principal: princ,
      interest,
      balance: Math.max(balance, 0),
    });
  }
  return { emi, totalPayment, totalInterest, totalMonths: n, schedule };
}

const fmt = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

type FieldId = "emi-principal" | "emi-rate" | "emi-tenure";

const STATIC_FIELDS = [
  {
    label: "Loan Amount",
    id: "emi-principal" as FieldId,
    placeholder: "500000",
    icon: IndianRupee,
    suffix: "₹",
  },
  {
    label: "Annual Interest Rate",
    id: "emi-rate" as FieldId,
    placeholder: "8.5",
    icon: Percent,
    suffix: "%",
  },
] as const;

export function LoanEMI() {
  const [values, setValues] = useState<Record<FieldId, string>>({
    "emi-principal": "500000",
    "emi-rate": "8.5",
    "emi-tenure": "5",
  });
  const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");
  const [result, setResult] = useState<EMIResult | null>(null);

  const calculate = () => {
    const p = Number.parseFloat(values["emi-principal"]);
    const r = Number.parseFloat(values["emi-rate"]);
    const t = Number.parseFloat(values["emi-tenure"]);
    if (p > 0 && r > 0 && t > 0) setResult(calcEMI(p, r, t, tenureUnit));
  };

  const tenureDisplay = (() => {
    const t = Number.parseFloat(values["emi-tenure"]);
    if (!result || Number.isNaN(t)) return "";
    if (tenureUnit === "years") return `${t} year${t !== 1 ? "s" : ""}`;
    return `${t} month${t !== 1 ? "s" : ""}`;
  })();

  const interestPct = result
    ? Math.round((result.totalInterest / result.totalPayment) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Static input fields (Principal & Rate) */}
      <div className="flex flex-col gap-3">
        {STATIC_FIELDS.map(({ label, id, placeholder, icon: Icon, suffix }) => (
          <div key={id} className="flex flex-col gap-1.5">
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5"
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Label>
            <div className="relative">
              <Input
                id={id}
                type="number"
                value={values[id]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [id]: e.target.value }))
                }
                placeholder={placeholder}
                className="bg-background/60 border-border/40 focus:border-primary/50 transition-all pr-10 text-foreground"
                data-ocid={id}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground pointer-events-none">
                {suffix}
              </span>
            </div>
          </div>
        ))}

        {/* Loan Tenure with Years/Months toggle */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="emi-tenure"
            className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            Loan Tenure
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="emi-tenure"
                type="number"
                value={values["emi-tenure"]}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    "emi-tenure": e.target.value,
                  }))
                }
                placeholder={tenureUnit === "years" ? "5" : "60"}
                className="bg-background/60 border-border/40 focus:border-primary/50 transition-all text-foreground"
                data-ocid="emi-tenure"
              />
            </div>
            {/* Years / Months toggle */}
            <div className="flex rounded-lg border border-border/40 overflow-hidden h-9 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (tenureUnit !== "years") {
                    // convert months → years
                    const months = Number.parseFloat(values["emi-tenure"]);
                    if (!Number.isNaN(months)) {
                      setValues((prev) => ({
                        ...prev,
                        "emi-tenure": String(Math.round(months / 12)),
                      }));
                    }
                    setTenureUnit("years");
                    setResult(null);
                  }
                }}
                className={`px-3 text-xs font-semibold transition-all ${
                  tenureUnit === "years"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                data-ocid="emi-tenure-years"
              >
                Yrs
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tenureUnit !== "months") {
                    // convert years → months
                    const years = Number.parseFloat(values["emi-tenure"]);
                    if (!Number.isNaN(years)) {
                      setValues((prev) => ({
                        ...prev,
                        "emi-tenure": String(Math.round(years * 12)),
                      }));
                    }
                    setTenureUnit("months");
                    setResult(null);
                  }
                }}
                className={`px-3 text-xs font-semibold transition-all border-l border-border/40 ${
                  tenureUnit === "months"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                data-ocid="emi-tenure-months"
              >
                Mos
              </button>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={calculate}
        className="w-full h-10 font-bold text-white bg-gradient-to-r from-primary via-[oklch(0.7_0.24_310)] to-accent hover:shadow-glow-primary transition-all duration-300 border-0"
        data-ocid="emi-calculate"
      >
        <Calculator className="w-4 h-4 mr-2" />
        Calculate EMI
      </Button>

      {result && (
        <div className="flex flex-col gap-3 animate-scale-in">
          {/* Main EMI highlight */}
          <div className="glass rounded-2xl p-4 border border-primary/25 shadow-glass text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
              Monthly EMI
            </p>
            <p className="font-display text-4xl font-extrabold gradient-text leading-none">
              {fmt(result.emi)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              per month for {tenureDisplay}
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: "Total Payment",
                value: fmt(result.totalPayment),
                color: "text-foreground",
                icon: IndianRupee,
              },
              {
                label: "Total Interest",
                value: fmt(result.totalInterest),
                color: "text-destructive",
                icon: TrendingUp,
              },
            ].map(({ label, value, color, icon: Icon }) => (
              <div
                key={label}
                className="glass rounded-xl p-3 border border-border/20"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
                <p className={`text-sm font-bold font-mono ${color}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Interest vs Principal visual bar */}
          <div className="glass rounded-xl p-3 border border-border/20">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Principal ({100 - interestPct}%)</span>
              <span>Interest ({interestPct}%)</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex gap-0.5">
              <div
                className="h-full rounded-l-full bg-gradient-to-r from-primary to-[oklch(0.7_0.24_310)] transition-all duration-700"
                style={{ width: `${100 - interestPct}%` }}
              />
              <div
                className="h-full rounded-r-full bg-gradient-to-r from-destructive/70 to-destructive transition-all duration-700"
                style={{ width: `${interestPct}%` }}
              />
            </div>
          </div>

          {/* Schedule table */}
          <div className="glass rounded-xl overflow-hidden border border-border/20">
            <div className="px-3 py-2 border-b border-border/20 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                First {Math.min(result.totalMonths, 12)} Months
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/15">
                    {["Mo.", "Principal", "Interest", "Balance"].map((h) => (
                      <th
                        key={h}
                        className={`px-2 py-1.5 font-semibold text-muted-foreground ${h !== "Mo." ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((r) => (
                    <tr
                      key={r.month}
                      className="border-b border-border/10 hover:bg-muted/15 transition-colors"
                    >
                      <td className="px-2 py-1.5 font-mono text-muted-foreground">
                        {r.month}
                      </td>
                      <td className="px-2 py-1.5 text-right text-emerald-400 font-mono">
                        {fmt(r.principal)}
                      </td>
                      <td className="px-2 py-1.5 text-right text-destructive/80 font-mono">
                        {fmt(r.interest)}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-foreground/80">
                        {fmt(r.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
