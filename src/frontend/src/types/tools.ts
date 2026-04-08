export type ToolId =
  | "currency-converter"
  | "password-generator"
  | "qr-generator"
  | "barcode-generator"
  | "image-compressor"
  | "image-resizer"
  | "pdf-toolkit"
  | "text-style"
  | "age-calculator"
  | "loan-emi"
  | "bmi-calculator"
  | "ai-humanizer";

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  iconColor: string;
}

export const TOOLS: Tool[] = [
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "Live exchange rates from 170+ currencies worldwide.",
    icon: "DollarSign",
    gradient: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-400",
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Strong, secure passwords with customizable rules.",
    icon: "Lock",
    gradient: "from-violet-500 to-purple-700",
    iconColor: "text-violet-400",
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Instant QR codes for URLs, text, and contact info.",
    icon: "QrCode",
    gradient: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-400",
  },
  {
    id: "barcode-generator",
    name: "Barcode Generator",
    description: "Generate barcodes in EAN, UPC, Code128 formats.",
    icon: "Barcode",
    gradient: "from-orange-500 to-amber-600",
    iconColor: "text-orange-400",
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress images up to 90% without visible quality loss.",
    icon: "ImageDown",
    gradient: "from-pink-500 to-rose-600",
    iconColor: "text-pink-400",
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to exact dimensions in seconds.",
    icon: "Scaling",
    gradient: "from-cyan-500 to-sky-600",
    iconColor: "text-cyan-400",
  },
  {
    id: "pdf-toolkit",
    name: "PDF Toolkit",
    description: "Merge, split, compress PDFs or convert images to PDF.",
    icon: "FileText",
    gradient: "from-red-500 to-orange-600",
    iconColor: "text-red-400",
  },
  {
    id: "text-style",
    name: "Text Style Generator",
    description:
      "Transform text into bold, italic, cursive, and Unicode styles.",
    icon: "Type",
    gradient: "from-yellow-500 to-lime-600",
    iconColor: "text-yellow-400",
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age in years, months, days, and hours.",
    icon: "Calendar",
    gradient: "from-teal-500 to-green-600",
    iconColor: "text-teal-400",
  },
  {
    id: "loan-emi",
    name: "Loan EMI Calculator",
    description: "Calculate EMI, total interest, and amortization in INR.",
    icon: "IndianRupee",
    gradient: "from-purple-500 to-fuchsia-600",
    iconColor: "text-purple-400",
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description: "Check your Body Mass Index and get health insights.",
    icon: "Activity",
    gradient: "from-sky-500 to-blue-600",
    iconColor: "text-sky-400",
  },
  {
    id: "ai-humanizer",
    name: "AI Text Humanizer",
    description: "Transform AI-generated text into natural human writing.",
    icon: "Bot",
    gradient: "from-fuchsia-500 to-pink-600",
    iconColor: "text-fuchsia-400",
  },
];
