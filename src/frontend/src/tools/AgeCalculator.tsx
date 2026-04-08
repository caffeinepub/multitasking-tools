import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Gift, Star } from "lucide-react";
import { useState } from "react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  nextBirthday: string;
  dayOfWeek: string;
  daysToNext: number;
}

function calculateAge(dob: string): AgeResult {
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
  const next = new Date(birth);
  next.setFullYear(now.getFullYear());
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  const daysToNext = Math.ceil((next.getTime() - now.getTime()) / 86400000);
  return {
    years,
    months,
    days,
    totalDays,
    totalHours: totalDays * 24,
    nextBirthday: daysToNext === 0 ? "🎉 Today!" : `${daysToNext} days`,
    dayOfWeek: birth.toLocaleDateString("en-US", { weekday: "long" }),
    daysToNext,
  };
}

export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculate = () => {
    if (!dob) return;
    setResult(calculateAge(dob));
  };

  const primaryStats = result
    ? [
        {
          label: "Years",
          value: result.years,
          icon: Calendar,
          color: "text-primary",
        },
        {
          label: "Months",
          value: result.months,
          icon: Calendar,
          color: "text-primary",
        },
        {
          label: "Days",
          value: result.days,
          icon: Calendar,
          color: "text-primary",
        },
      ]
    : [];

  const secondaryStats = result
    ? [
        {
          label: "Total Days Lived",
          value: result.totalDays.toLocaleString(),
          icon: Star,
          color: "text-accent",
        },
        {
          label: "Total Hours Lived",
          value: result.totalHours.toLocaleString(),
          icon: Clock,
          color: "text-accent",
        },
        {
          label: "Next Birthday",
          value: result.nextBirthday,
          icon: Gift,
          color: result.daysToNext === 0 ? "text-emerald-400" : "text-primary",
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Date input */}
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="age-dob"
          className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          Date of Birth
        </Label>
        <Input
          id="age-dob"
          type="date"
          value={dob}
          onChange={(e) => {
            setDob(e.target.value);
            setResult(null);
          }}
          max={new Date().toISOString().split("T")[0]}
          className="bg-background/60 border-border/40 focus:border-primary/50 transition-all"
          data-ocid="age-dob"
        />
      </div>

      {dob && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/6 border border-primary/15 text-xs">
          <Star className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-foreground/80">
            You were born on a{" "}
            <span className="font-bold text-primary">
              {new Date(dob).toLocaleDateString("en-US", { weekday: "long" })}
            </span>
          </span>
        </div>
      )}

      <Button
        type="button"
        onClick={calculate}
        disabled={!dob}
        className="w-full h-10 font-bold text-white bg-gradient-to-r from-primary via-[oklch(0.7_0.24_310)] to-accent hover:shadow-glow-primary transition-all duration-300 border-0 disabled:opacity-50"
        data-ocid="age-calculate"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Calculate Age
      </Button>

      {result && (
        <div className="flex flex-col gap-3 animate-scale-in">
          {/* Primary age display */}
          <div className="glass rounded-2xl p-4 border border-primary/20 shadow-glass text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">
              Your Age
            </p>
            <p className="font-display text-4xl font-extrabold gradient-text leading-none mb-1">
              {result.years}
            </p>
            <p className="text-sm text-muted-foreground">
              years,{" "}
              <span className="text-foreground font-semibold">
                {result.months}
              </span>{" "}
              months &{" "}
              <span className="text-foreground font-semibold">
                {result.days}
              </span>{" "}
              days
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-2">
            {primaryStats.map(({ label, value, color }) => (
              <div
                key={label}
                className="glass rounded-xl p-3 text-center border border-border/20"
              >
                <p
                  className={`text-xl font-display font-bold tabular-nums ${color}`}
                >
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {secondaryStats.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="glass rounded-xl p-3 flex items-center gap-3 border border-border/20"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className={`text-sm font-bold font-mono ${color}`}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
