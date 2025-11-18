/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type JSX, useState, useEffect } from "react";
import Banner from "../components/Banner";
import api from "../services/api";
import {
  Leaf,
  Factory,
  AlertTriangle,
  Users,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: JSX.Element;
  gradient: string;
  description: string;
}

interface SupplierData {
  name: string;
  industry: string;
  riskScore: number;
  sustainabilityScore: number;
  greenScore: number;
  riskLevel: "High" | "Medium" | "Low";
  lastUpdated: string;
}

function Dashboard(): JSX.Element {
  const [dateFilter, setDateFilter] = useState("30d");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(loading);

  const mockSuppliers: SupplierData[] = [
    {
      name: "EcoMaterials Inc.",
      industry: "Manufacturing",
      riskScore: 25,
      sustainabilityScore: 92,
      greenScore: 88,
      riskLevel: "Low",
      lastUpdated: "2 days ago",
    },
    {
      name: "GreenLogistics Co.",
      industry: "Logistics",
      riskScore: 55,
      sustainabilityScore: 78,
      greenScore: 72,
      riskLevel: "Medium",
      lastUpdated: "1 week ago",
    },
    {
      name: "SustainSupply Ltd.",
      industry: "Retail",
      riskScore: 30,
      sustainabilityScore: 88,
      greenScore: 85,
      riskLevel: "Low",
      lastUpdated: "3 days ago",
    },
    {
      name: "GlobalParts Corp.",
      industry: "Manufacturing",
      riskScore: 72,
      sustainabilityScore: 65,
      greenScore: 60,
      riskLevel: "High",
      lastUpdated: "5 days ago",
    },
    {
      name: "LocalServices Pro",
      industry: "Services",
      riskScore: 20,
      sustainabilityScore: 95,
      greenScore: 93,
      riskLevel: "Low",
      lastUpdated: "1 day ago",
    },
  ];

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get("/api/reports");

        if (response.data && response.data.success) {
          const reports = response.data.reports;

          const mappedData: SupplierData[] = reports.map((report: any) => {
            const ai = report.aiOutput || {};
            const esg = ai.esg || {};
            const risk = ai.risk || {};

            // Convert AI risk score (1-10) to percentage (0-100)
            const calculatedRiskScore = (risk.riskScore || 0) * 10;

            // Determine Risk Level based on score
            let calculatedRiskLevel: "High" | "Medium" | "Low" = "Low";
            if (calculatedRiskScore >= 70) calculatedRiskLevel = "High";
            else if (calculatedRiskScore >= 40) calculatedRiskLevel = "Medium";

            // Calculate days since update
            const date = new Date(report.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const timeString =
              diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;

            // Calculate average ESG for "Sustainability Score"
            const avgEsg = Math.round(
              ((esg.environmental || 0) +
                (esg.social || 0) +
                (esg.governance || 0)) /
                3
            );

            return {
              name: report.supplierName || "Unknown Supplier",
              industry: report.industry || "General",
              riskScore: calculatedRiskScore,
              sustainabilityScore: avgEsg,
              greenScore: esg.environmental || 0,
              riskLevel: calculatedRiskLevel,
              lastUpdated: timeString,
            };
          });

          setSuppliers(mappedData.length > 0 ? mappedData : mockSuppliers);
        } else {
          setSuppliers(mockSuppliers);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setSuppliers(mockSuppliers);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [dateFilter, categoryFilter, mockSuppliers]);

  // Calculate aggregate metrics
  const calculateMetrics = () => {
    const totalSuppliers =
      suppliers.length > 0 ? suppliers.length : mockSuppliers.length;
    const data = suppliers.length > 0 ? suppliers : mockSuppliers;

    const avgSustainability =
      Math.round(
        data.reduce((sum, s) => sum + s.sustainabilityScore, 0) / totalSuppliers
      ) || 0;

    const avgGreenScore =
      Math.round(
        data.reduce((sum, s) => sum + s.greenScore, 0) / totalSuppliers
      ) || 0;

    const lowRiskCount = data.filter((s) => s.riskLevel === "Low").length;
    const highRiskCount = data.filter((s) => s.riskLevel === "High").length;

    const avgRiskScore =
      Math.round(
        data.reduce((sum, s) => sum + s.riskScore, 0) / totalSuppliers
      ) || 0;

    return {
      avgSustainability,
      avgGreenScore,
      lowRiskCount,
      highRiskCount,
      totalSuppliers,
      avgRiskScore,
    };
  };

  const stats = calculateMetrics();

  // Metrics Cards Data
  const metrics: MetricCard[] = [
    {
      title: "Avg Sustainability",
      value: `${stats.avgSustainability}/100`,
      change: "+5.2%",
      trend: "up",
      icon: <Leaf className="w-6 h-6" />,
      gradient: "from-emerald-500 to-teal-600",
      description: "vs last quarter",
    },
    {
      title: "Low Risk Suppliers",
      value: `${stats.lowRiskCount}/${stats.totalSuppliers}`,
      change: "+2",
      trend: "up",
      icon: <Shield className="w-6 h-6" />,
      gradient: "from-blue-500 to-cyan-600",
      description: `${Math.round(
        (stats.lowRiskCount / (stats.totalSuppliers || 1)) * 100
      )}% safe`,
    },
    {
      title: "Total Evaluations",
      value: stats.totalSuppliers.toString(),
      change: "+18.2%",
      trend: "up",
      icon: <Factory className="w-6 h-6" />,
      gradient: "from-purple-500 to-pink-600",
      description: "suppliers analyzed",
    },
    {
      title: "Avg Green Score",
      value: `${stats.avgGreenScore}/100`,
      change: "+7.5",
      trend: "up",
      icon: <Target className="w-6 h-6" />,
      gradient: "from-green-500 to-emerald-600",
      description: "environmental",
    },
    {
      title: "High Risk Alerts",
      value: stats.highRiskCount.toString(),
      change: "-2",
      trend: "down",
      icon: <AlertTriangle className="w-6 h-6" />,
      gradient: "from-red-500 to-rose-600",
      description: "active warnings",
    },
    {
      title: "Avg Risk Score",
      value: `${stats.avgRiskScore}/100`,
      change: "-8.3%",
      trend: "down",
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: "from-amber-500 to-orange-600",
      description: "lower is better",
    },
  ];

  // Sustainability Trend Data (mock trend over 6 months)
  const sustainabilityTrendData = [
    { month: "Jan", score: 72, target: 75 },
    { month: "Feb", score: 75, target: 77 },
    { month: "Mar", score: 78, target: 79 },
    { month: "Apr", score: 80, target: 81 },
    { month: "May", score: 83, target: 83 },
    { month: "Jun", score: stats.avgSustainability, target: 85 },
  ];

  // Industry Distribution Data
  const industryData = (() => {
    const data = suppliers.length > 0 ? suppliers : mockSuppliers;
    const industries = data.reduce((acc, supplier) => {
      acc[supplier.industry] = (acc[supplier.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];
    return Object.entries(industries).map(([industry, count], index) => ({
      category: industry,
      count,
      color: colors[index % colors.length],
    }));
  })();

  // ESG Scores (Average across all suppliers)
  const esgData = (() => {
    const data = suppliers.length > 0 ? suppliers : mockSuppliers;
    const len = data.length || 1;

    const avgEnvironment = Math.round(
      data.reduce((sum, s) => sum + s.greenScore, 0) / len
    );
    const avgSocial = Math.round(
      data.reduce((sum, s) => sum + s.sustainabilityScore * 0.85, 0) / len
    );
    const avgGovernance = Math.round(
      data.reduce((sum, s) => sum + s.sustainabilityScore * 0.95, 0) / len
    );

    return [
      { category: "Environmental", score: avgEnvironment },
      { category: "Social", score: avgSocial },
      { category: "Governance", score: avgGovernance },
      {
        category: "Risk Management",
        score: Math.round(100 - stats.avgRiskScore),
      },
      { category: "Compliance", score: 88 },
      { category: "Innovation", score: 75 },
    ];
  })();

  // Risk Distribution Data
  const riskDistributionData = (() => {
    const data = suppliers.length > 0 ? suppliers : mockSuppliers;
    const industries = [...new Set(data.map((s) => s.industry))];

    return industries.map((industry) => {
      const industrySuppliers = data.filter((s) => s.industry === industry);
      return {
        category: industry,
        high: industrySuppliers.filter((s) => s.riskLevel === "High").length,
        medium: industrySuppliers.filter((s) => s.riskLevel === "Medium")
          .length,
        low: industrySuppliers.filter((s) => s.riskLevel === "Low").length,
      };
    });
  })();

  // Score Distribution (Pie Chart)
  const scoreDistributionData = (() => {
    const data = suppliers.length > 0 ? suppliers : mockSuppliers;
    const excellent = data.filter((s) => s.sustainabilityScore >= 90).length;
    const good = data.filter(
      (s) => s.sustainabilityScore >= 75 && s.sustainabilityScore < 90
    ).length;
    const fair = data.filter(
      (s) => s.sustainabilityScore >= 60 && s.sustainabilityScore < 75
    ).length;
    const poor = data.filter((s) => s.sustainabilityScore < 60).length;

    return [
      { name: "Excellent (90+)", value: excellent, color: "#10b981" },
      { name: "Good (75-89)", value: good, color: "#3b82f6" },
      { name: "Fair (60-74)", value: fair, color: "#f59e0b" },
      { name: "Poor (<60)", value: poor, color: "#ef4444" },
    ].filter((item) => item.value > 0);
  })();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "Low":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  const displaySuppliers = suppliers.length > 0 ? suppliers : mockSuppliers;

  return (
    <>
      <title>Dashboard</title>
      <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-black min-h-screen w-full">
        <Banner
          title="Dashboard"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
          backgroundImage="/dashboard.webp"
          height="h-96"
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header with Filters */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-3">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">
                  Live Analytics
                </span>
              </div>
              <p className="text-gray-300 text-lg">
                Real-time supplier evaluation insights powered by AI
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Date Filter */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Industries</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="logistics">Logistics</option>
                  <option value="services">Services</option>
                  <option value="retail">Retail</option>
                </select>
              </div>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="group relative bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-5 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${metric.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="relative flex items-start justify-between mb-3">
                  <div
                    className={`p-2.5 bg-linear-to-br ${metric.gradient} rounded-xl shadow-lg`}
                  >
                    {metric.icon}
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700/50`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    <span
                      className={`text-xs font-bold ${
                        metric.trend === "up"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-xs font-medium text-gray-400 mb-1">
                    {metric.title}
                  </h3>
                  <p className="text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* Sustainability Score Trend */}
            <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-400" />
                    Sustainability Trend
                  </h3>
                  <p className="text-sm text-gray-400">
                    Average score over time
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sustainabilityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Actual Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#6366f1"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#6366f1", r: 4 }}
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Industry Distribution */}
            <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    <Factory className="w-5 h-5 text-blue-400" />
                    Suppliers by Industry
                  </h3>
                  <p className="text-sm text-gray-400">
                    Total: {stats.totalSuppliers} suppliers
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={industryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="category"
                    stroke="#9ca3af"
                    style={{ fontSize: "11px" }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Suppliers">
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {/* ESG Performance */}
            <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  ESG Performance
                </h3>
                <p className="text-sm text-gray-400">
                  Average supplier ratings
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={esgData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis
                    dataKey="category"
                    stroke="#9ca3af"
                    style={{ fontSize: "11px" }}
                  />
                  <PolarRadiusAxis stroke="#9ca3af" domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Score Distribution */}
            <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-400" />
                  Score Distribution
                </h3>
                <p className="text-sm text-gray-400">Sustainability ratings</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name = "", percent = 0 }) =>
                      `${name.split(" ")[0] ?? "N/A"} ${(percent * 100).toFixed(
                        0
                      )}%`
                    }
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Analysis by Industry */}
            <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Risk Analysis
                </h3>
                <p className="text-sm text-gray-400">By industry</p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={riskDistributionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    type="number"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    stroke="#9ca3af"
                    style={{ fontSize: "11px" }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="high"
                    stackId="a"
                    fill="#ef4444"
                    name="High"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="medium"
                    stackId="a"
                    fill="#f59e0b"
                    name="Medium"
                  />
                  <Bar dataKey="low" stackId="a" fill="#10b981" name="Low" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Supplier Data Table */}
          {/* Supplier Data Table */}
          <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Supplier Evaluations
                </h3>
                <p className="text-sm text-gray-400">
                  Recent assessments and scores
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                      Supplier
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                      Industry
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                      Risk Level
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                      Sustainability
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                      Green Score
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displaySuppliers.map((supplier, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                    >
                      {/* Supplier Name */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-white">
                          {supplier.name}
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="py-4 px-4 text-sm text-gray-300">
                        {supplier.industry}
                      </td>

                      {/* Risk Level Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getRiskColor(
                            supplier.riskLevel
                          )}`}
                        >
                          {supplier.riskLevel}
                        </span>
                      </td>

                      {/* Sustainability Score + Progress Bar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-700 rounded-full h-2 w-20">
                            <div
                              className="bg-linear-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${supplier.sustainabilityScore}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white min-w-10">
                            {supplier.sustainabilityScore}
                          </span>
                        </div>
                      </td>

                      {/* Green Score + Progress Bar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-700 rounded-full h-2 w-20">
                            <div
                              className="bg-linear-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${supplier.greenScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white min-w-10">
                            {supplier.greenScore}
                          </span>
                        </div>
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-400">
                          {supplier.lastUpdated}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
