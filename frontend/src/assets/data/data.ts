import {
  Navigation2,
  Satellite,
  Package,
  ChartBarBig,
  ShieldCheck,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

interface FeaturesType {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface PlansDataType {
  planCategory: string;
  idealFor: string;
  planPrice: number;
  featuresPack: string[];
}

interface QueriesType {
  query: string;
  answer: string;
}

export const featuresData: FeaturesType[] = [
  {
    title: "Smart Routing",
    description:
      "Automatically assigns optimal delivery routes to reduce transit time, minimize fuel usage, and improve overall logistics efficiency.",
    icon: Navigation2,
  },
  {
    title: "Real-Time Tracking",
    description:
      "Monitor shipments live with instant location updates, ensuring transparency and timely delivery for every client.",
    icon: Satellite,
  },
  {
    title: "Inventory Control",
    description:
      "Track stock levels, movements, and reorder points to maintain accuracy and prevent storage shortages or overflows.",
    icon: Package,
  },
  {
    title: "Shipment Analytics",
    description:
      "Access detailed reports on delivery performance, costs, and operational patterns to improve decision-making.",
    icon: ChartBarBig,
  },
  {
    title: "Secure Storage",
    description:
      "Protect goods with monitored, temperature-controlled, and access-restricted storage environments.",
    icon: ShieldCheck,
  },
  {
    title: "Client Dashboard",
    description:
      "Give clients a clean interface to view shipment status, invoices, analytics, and documents instantly.",
    icon: LayoutDashboard,
  },
];

export const plansData: PlansDataType[] = [
  {
    planCategory: "Starter",
    idealFor: "Ideal for startups",
    planPrice: 0,
    featuresPack: [
      "Basic AI insights",
      "Basic CO₂ impact analytics",
      "Essential supplier scoring",
      "Monthly sustainability reports",
      "Email support",
    ],
  },
  {
    planCategory: "Growth",
    idealFor: "Companies scaling procurement analytics",
    planPrice: 129,
    featuresPack: [
      "Automated data imports",
      "Real-time dashboard metrics",
      "Supplier diversity insights",
      "AI suggestions for greener vendors",
      "Branded report exports",
    ],
  },
  {
    planCategory: "Pro",
    idealFor: "Procurement teams needing deeper intelligence",
    planPrice: 299,
    featuresPack: [
      "Full CO₂ and waste analytics",
      "Advanced risk scoring models",
      "AI recommendations for alternatives",
      "Workflow automation alerts",
      "API access and integrations",
    ],
  },
  {
    planCategory: "Enterprise",
    idealFor: "For large companies with complex procurement chains",
    planPrice: 899,
    featuresPack: [
      "Custom sustainability model setup",
      "End-to-end procurement intelligence",
      "Unlimited data imports and users",
      "Dedicated AI optimization engine",
      "White-label reporting suite",
    ],
  },
];

export const queriesData: QueriesType[] = [
  {
    query: "What does ProQure analyze?",
    answer:
      "ProQure analyzes procurement data to measure sustainability, CO₂ impact, supplier diversity, and risk indicators.",
  },
  {
    query: "Can I import my existing procurement data?",
    answer:
      "Not. In future, ProQure plans to allow CSV, Excel, and automated data imports from your internal systems.",
  },
  {
    query: "How does the AI generate recommendations?",
    answer:
      "Our AI engine compares your suppliers against sustainability benchmarks to suggest greener and cost-efficient alternatives.",
  },
  {
    query: "Can we export sustainability reports?",
    answer: "Absolutely. You can export reports in JSON.",
  },
  {
    query: "Is ProQure suitable for small teams?",
    answer:
      "Yes, ProQure is designed for teams of all sizes, from startups to enterprise procurement departments.",
  },
];
