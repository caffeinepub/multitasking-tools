import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft, Clock, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

const CURRENCIES: { code: string; name: string; flag: string }[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
];

interface RateMap {
  [key: string]: number;
}

interface HistoryEntry {
  id: string;
  amount: string;
  from: string;
  to: string;
  result: number;
  rate: number;
  time: string;
}

async function fetchRates(
  base: string,
): Promise<{ rates: RateMap; time_last_update_utc: string }> {
  const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as Promise<{
    rates: RateMap;
    time_last_update_utc: string;
  }>;
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const convert = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRates(from);
      const r = data.rates[to];
      const converted = Number.parseFloat(amount) * r;
      setRate(r);
      setResult(converted);
      setUpdatedAt(data.time_last_update_utc);
      const entry: HistoryEntry = {
        id: `${Date.now()}`,
        amount,
        from,
        to,
        result: converted,
        rate: r,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setHistory((prev) => [entry, ...prev].slice(0, 5));
    } catch {
      setError("Could not fetch live rates. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [from, to, amount]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setRate(null);
  };

  const fromInfo = CURRENCIES.find((c) => c.code === from);
  const toInfo = CURRENCIES.find((c) => c.code === to);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Select
            value={from}
            onValueChange={(v) => {
              setFrom(v);
              setResult(null);
            }}
          >
            <SelectTrigger
              className="bg-background/50"
              data-ocid="currency-from"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-56">
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                    <span className="text-muted-foreground text-xs hidden sm:inline">
                      {c.name}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Select
            value={to}
            onValueChange={(v) => {
              setTo(v);
              setResult(null);
            }}
          >
            <SelectTrigger className="bg-background/50" data-ocid="currency-to">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-56">
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                    <span className="text-muted-foreground text-xs hidden sm:inline">
                      {c.name}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="currency-amount"
          className="text-xs text-muted-foreground"
        >
          Amount
        </Label>
        <Input
          id="currency-amount"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setResult(null);
          }}
          className="bg-background/50"
          placeholder="Enter amount"
          data-ocid="currency-amount"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={convert}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-primary to-accent"
          data-ocid="currency-convert"
        >
          {loading && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
          {loading ? "Fetching live rates…" : "Convert"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={swap}
          aria-label="Swap currencies"
          data-ocid="currency-swap"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {result !== null && (
        <div className="glass rounded-xl p-4 text-center animate-slide-up">
          <p className="text-xs text-muted-foreground mb-0.5">
            {fromInfo?.flag} {amount} {from} =
          </p>
          <p className="text-2xl font-display font-bold gradient-text">
            {toInfo?.flag}{" "}
            {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}{" "}
            {to}
          </p>
          {rate !== null && (
            <p className="text-xs text-muted-foreground mt-1.5">
              1 {from} = {rate.toFixed(6)} {to}
            </p>
          )}
          {updatedAt && (
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <RefreshCw className="w-3 h-3 text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground/60">
                Updated: {new Date(updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Recent conversions
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground"
              onClick={() => setHistory([])}
              data-ocid="currency-clear-history"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            {history.map((h) => {
              const hFrom = CURRENCIES.find((c) => c.code === h.from);
              const hTo = CURRENCIES.find((c) => c.code === h.to);
              return (
                <div
                  key={h.id}
                  className="glass rounded-lg px-3 py-2 flex items-center justify-between gap-2"
                >
                  <span className="text-xs text-muted-foreground">
                    {hFrom?.flag} {h.amount} {h.from} → {hTo?.flag} {h.to}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {h.result.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </Badge>
                    <span className="text-xs text-muted-foreground/60">
                      {h.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
