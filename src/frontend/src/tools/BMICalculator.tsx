import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Activity, Scale } from "lucide-react";
import { useState } from "react";

interface BMIResult {
  bmi: number;
  category: string;
  badgeClass: string;
  dotClass: string;
  advice: string;
  barColor: string;
}

function calcBMI(weight: number, height: number): BMIResult {
  const bmi = weight / (height / 100) ** 2;
  if (bmi < 18.5)
    return {
      bmi,
      category: "Underweight",
      badgeClass: "bg-secondary text-secondary-foreground",
      dotClass: "bg-secondary",
      barColor: "from-secondary to-secondary",
      advice: "Consider a balanced diet with more calories and nutrients.",
    };
  if (bmi < 25)
    return {
      bmi,
      category: "Normal Weight",
      badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      dotClass: "bg-emerald-400",
      barColor: "from-emerald-400 to-emerald-500",
      advice: "Great! Maintain your healthy lifestyle with regular exercise.",
    };
  if (bmi < 30)
    return {
      bmi,
      category: "Overweight",
      badgeClass: "bg-accent/20 text-accent border-accent/30",
      dotClass: "bg-accent",
      barColor: "from-accent to-accent",
      advice:
        "Regular exercise and a balanced diet can help you reach a healthy weight.",
    };
  return {
    bmi,
    category: "Obese",
    badgeClass: "bg-destructive/20 text-destructive border-destructive/30",
    dotClass: "bg-destructive",
    barColor: "from-destructive to-destructive",
    advice:
      "Please consult a healthcare professional for personalized guidance.",
  };
}

const BMI_RANGES = [
  { label: "Under", range: "< 18.5", color: "bg-secondary" },
  { label: "Normal", range: "18.5–24.9", color: "bg-emerald-400" },
  { label: "Over", range: "25–29.9", color: "bg-accent" },
  { label: "Obese", range: "≥ 30", color: "bg-destructive" },
];

export function BMICalculator() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculate = () => {
    let w = Number.parseFloat(weight);
    let h = Number.parseFloat(height);
    if (unit === "imperial") {
      w = w * 0.453592;
      h = h * 2.54;
    }
    if (w > 0 && h > 0) setResult(calcBMI(w, h));
  };

  const pct = result
    ? Math.min(Math.max(((result.bmi - 10) / 30) * 100, 0), 100)
    : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Unit selector */}
      <div>
        <span className="text-xs font-semibold text-foreground/80 block mb-2">
          Measurement System
        </span>
        <RadioGroup
          value={unit}
          onValueChange={(v) => {
            setUnit(v);
            setResult(null);
          }}
          className="grid grid-cols-2 gap-2"
        >
          {[
            { value: "metric", label: "Metric", sub: "kg / cm" },
            { value: "imperial", label: "Imperial", sub: "lbs / in" },
          ].map(({ value, label, sub }) => (
            <label
              key={value}
              htmlFor={`bmi-unit-${value}`}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-smooth border ${
                unit === value
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-muted/30 border-border/30 text-muted-foreground hover:border-border/60"
              }`}
            >
              <RadioGroupItem
                value={value}
                id={`bmi-unit-${value}`}
                data-ocid={`bmi-unit-${value}`}
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-xs opacity-60">{sub}</span>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="bmi-weight"
            className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" />
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </Label>
          <Input
            id="bmi-weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="bg-background/60 border-border/40 focus:border-primary/50 transition-all font-mono text-sm"
            data-ocid="bmi-weight"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="bmi-height"
            className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            Height ({unit === "metric" ? "cm" : "in"})
          </Label>
          <Input
            id="bmi-height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="bg-background/60 border-border/40 focus:border-primary/50 transition-all font-mono text-sm"
            data-ocid="bmi-height"
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={calculate}
        className="w-full h-10 font-bold text-white bg-gradient-to-r from-primary via-[oklch(0.7_0.24_310)] to-accent hover:shadow-glow-primary transition-all duration-300 border-0"
        data-ocid="bmi-calculate"
      >
        <Activity className="w-4 h-4 mr-2" />
        Calculate BMI
      </Button>

      {result && (
        <div className="flex flex-col gap-3 animate-scale-in">
          {/* BMI score card */}
          <div className="glass rounded-2xl p-5 flex flex-col items-center gap-2 border border-border/20 shadow-glass">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              Your BMI Score
            </p>
            <p className="font-display text-5xl font-extrabold gradient-text leading-none">
              {result.bmi.toFixed(1)}
            </p>
            <Badge
              className={`px-3 py-1 text-xs font-bold border ${result.badgeClass}`}
            >
              {result.category}
            </Badge>
            <p className="text-xs text-muted-foreground text-center max-w-[240px] leading-relaxed mt-1">
              {result.advice}
            </p>
          </div>

          {/* Visual scale */}
          <div className="glass rounded-xl p-4 flex flex-col gap-3 border border-border/20">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              BMI Scale
            </p>
            {/* Color gradient bar */}
            <div className="relative">
              <div className="h-3 w-full rounded-full overflow-hidden flex">
                {BMI_RANGES.map(({ color }) => (
                  <div key={color} className={`flex-1 ${color}`} />
                ))}
              </div>
              {/* Needle */}
              <div
                className="absolute -top-0.5 -translate-x-1/2 transition-all duration-700"
                style={{ left: `${pct}%` }}
              >
                <div className="w-4 h-4 rounded-full bg-card border-2 border-foreground shadow-md" />
              </div>
            </div>
            {/* Labels */}
            <div className="grid grid-cols-4 gap-1">
              {BMI_RANGES.map(({ label, range, color }) => (
                <div
                  key={label}
                  className="text-center flex flex-col items-center gap-1"
                >
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <p className="text-xs font-semibold text-foreground/70">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none">
                    {range}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
