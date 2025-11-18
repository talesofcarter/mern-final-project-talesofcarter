/* eslint-disable @typescript-eslint/no-explicit-any */
import { type JSX, useState, useMemo, useEffect } from "react";
import Banner from "../components/Banner";
import api from "../services/api";
import {
  Factory,
  Leaf,
  TrendingUp,
  AlertTriangle,
  Globe,
  BarChart,
  Search,
  ChevronRight,
  X,
  ArrowUpDown,
  Building2,
} from "lucide-react";

// Shared backend schema
interface ChartData {
  risk: number;
  environment: number;
  social: number;
  governance: number;
}

export interface SupplierEvaluationResult {
  id: string; // Changed from number to string to match MongoDB _id
  supplierName: string;
  industry: string;
  riskScore: number;
  sustainabilityScore: number;
  greenScore: number;
  insights: string[];
  recommendations: string[];
  alternativeSuggestions: string[];
  chartData: ChartData;
}

function Suppliers(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [esgFilter, setEsgFilter] = useState("All");
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierEvaluationResult | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [suppliersData, setSuppliersData] = useState<
    SupplierEvaluationResult[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get("/api/reports");

        if (response.data && response.data.success) {
          const reports = response.data.reports;

          const mappedSuppliers: SupplierEvaluationResult[] = reports.map(
            (report: any) => {
              const ai = report.aiOutput || {};
              const esg = ai.esg || {};
              const risk = ai.risk || {};

              const riskScore = (risk.riskScore || 0) * 10;
              const greenScore = ai.environment?.carbonIntensityScore || 0;

              const sustainabilityScore = Math.round(
                ((esg.environmental || 0) +
                  (esg.social || 0) +
                  (esg.governance || 0)) /
                  3
              );

              return {
                id: report._id,
                supplierName: report.supplierName || "Unknown Supplier",
                industry: report.industry || "General",
                riskScore,
                sustainabilityScore,
                greenScore,
                insights: ai.spendInsights?.improvementSuggestions || [
                  "No specific insights generated for this supplier.",
                ],
                recommendations: ai.diversity?.recommendations || [],
                alternativeSuggestions: ai.alternativeSuggestions || [],
                chartData: {
                  risk: riskScore,
                  environment: esg.environmental || 0,
                  social: esg.social || 0,
                  governance: esg.governance || 0,
                },
              };
            }
          );

          setSuppliersData(mappedSuppliers);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(suppliersData.map((s) => s.industry))),
  ];
  const risks = ["All", "Low", "Medium", "High"];
  const esgGrades = ["All", "A+", "A", "B", "C"];

  const getRiskLevel = (score: number): "Low" | "Medium" | "High" => {
    if (score <= 40) return "Low";
    if (score <= 70) return "Medium";
    return "High";
  };

  const getESGGrade = (avg: number): string => {
    if (avg >= 90) return "A+";
    if (avg >= 80) return "A";
    if (avg >= 65) return "B";
    return "C";
  };

  const filteredSuppliers = useMemo(() => {
    const filtered = suppliersData.filter((supplier) => {
      const matchesSearch = supplier.supplierName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || supplier.industry === categoryFilter;
      const riskLevel = getRiskLevel(supplier.riskScore);
      const matchesRisk = riskFilter === "All" || riskLevel === riskFilter;
      const avgESG = Math.round(
        (supplier.chartData.environment +
          supplier.chartData.social +
          supplier.chartData.governance) /
          3
      );
      const esgGrade = getESGGrade(avgESG);
      const matchesESG = esgFilter === "All" || esgGrade === esgFilter;

      return matchesSearch && matchesCategory && matchesRisk && matchesESG;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof typeof a];
        let bValue: any = b[sortConfig.key as keyof typeof b];

        if (sortConfig.key === "esgScore") {
          aValue = Math.round(
            (a.chartData.environment +
              a.chartData.social +
              a.chartData.governance) /
              3
          );
          bValue = Math.round(
            (b.chartData.environment +
              b.chartData.social +
              b.chartData.governance) /
              3
          );
        } else if (sortConfig.key === "risk") {
          aValue = a.riskScore;
          bValue = b.riskScore;
        } else if (sortConfig.key === "co2Impact") {
          aValue = a.greenScore; // inverted proxy
          bValue = b.greenScore;
        } else if (sortConfig.key === "sustainability") {
          aValue = a.sustainabilityScore;
          bValue = b.sustainabilityScore;
        } else if (sortConfig.key === "spend") {
          // Random spend logic from original UI preserved for sorting stability
          aValue = 0;
          bValue = 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [
    searchTerm,
    categoryFilter,
    riskFilter,
    esgFilter,
    sortConfig,
    suppliersData,
  ]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  const getESGColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "A":
        return "bg-green-100 text-green-800 border-green-300";
      case "B":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "C":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <title>Suppliers Intelligence</title>
      <div className="relative min-h-screen w-full bg-slate-50">
        <Banner
          title="Suppliers"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Suppliers" }]}
          backgroundImage="/ship.webp"
          height="h-96"
        />

        <div className="max-w-7xl mx-auto px-6 py-8 -mt-20 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Suppliers Intelligence
                </h1>
                <p className="text-slate-600 text-lg">
                  Analyze sustainability, performance, and risk across your
                  entire supply network.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-accent text-slate-900 px-4 py-2 rounded-lg font-semibold">
                  {filteredSuppliers.length} Suppliers
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
              >
                {risks.map((risk) => (
                  <option key={risk} value={risk}>
                    {risk === "All" ? "All Risks" : risk}
                  </option>
                ))}
              </select>

              <select
                value={esgFilter}
                onChange={(e) => setEsgFilter(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
              >
                {esgGrades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade === "All" ? "All ESG Grades" : grade}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <button
                        onClick={() => handleSort("supplierName")}
                        className="flex items-center gap-2 hover:text-slate-900"
                      >
                        Supplier <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <button
                        onClick={() => handleSort("esgScore")}
                        className="flex items-center gap-2 hover:text-slate-900"
                      >
                        ESG Score <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <button
                        onClick={() => handleSort("co2Impact")}
                        className="flex items-center gap-2 hover:text-slate-900"
                      >
                        CO₂ Impact <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Risk Level
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <button
                        onClick={() => handleSort("sustainability")}
                        className="flex items-center gap-2 hover:text-slate-900"
                      >
                        Sustainability <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <button
                        onClick={() => handleSort("spend")}
                        className="flex items-center gap-2 hover:text-slate-900"
                      >
                        Annual Spend <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      AI Recommendation
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-8 text-slate-500"
                      >
                        Loading suppliers...
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((supplier) => {
                      const riskLevel = getRiskLevel(supplier.riskScore);
                      const avgESG = Math.round(
                        (supplier.chartData.environment +
                          supplier.chartData.social +
                          supplier.chartData.governance) /
                          3
                      );
                      const esgGrade = getESGGrade(avgESG);

                      return (
                        <tr
                          key={supplier.id}
                          className="hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedSupplier(supplier)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-accent bg-opacity-20 flex items-center justify-center">
                                <Factory className="w-5 h-5 text-slate-700" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {supplier.supplierName}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Modified Category Cell for Truncation */}
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm max-w-[140px] md:max-w-[180px]"
                              title={supplier.industry}
                            >
                              <span className="truncate">
                                {supplier.industry}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-semibold text-sm ${getESGColor(
                                esgGrade
                              )}`}
                            >
                              <Leaf className="w-4 h-4" />
                              {esgGrade}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">
                              {100 - supplier.greenScore}%
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(
                                riskLevel
                              )}`}
                            >
                              {riskLevel === "High" && (
                                <AlertTriangle className="w-4 h-4" />
                              )}
                              {riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent rounded-full"
                                  style={{
                                    width: `${supplier.sustainabilityScore}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-slate-700 min-w-12">
                                {supplier.sustainabilityScore}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">
                              $
                              {(Math.random() * 500000 + 100000)
                                .toFixed(0)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-600 max-w-xs truncate">
                              {supplier.insights[0]}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSupplier(supplier);
                              }}
                              className="inline-flex items-center gap-1 text-accent hover:text-green-700 font-medium text-sm"
                            >
                              View <ChevronRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {!loading && filteredSuppliers.length === 0 && (
              <div className="text-center py-12">
                <Factory className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">
                  No suppliers found matching your filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Supplier Detail Drawer */}
        {selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-white shadow-2xl overflow-y-auto animate-slide-in">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-start justify-between z-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent bg-opacity-20 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-slate-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {selectedSupplier.supplierName}
                    </h2>
                    <p className="text-slate-600 mt-1">
                      {selectedSupplier.industry}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="px-8 py-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-linear-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-900">
                        ESG Score
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-emerald-900">
                      {getESGGrade(
                        Math.round(
                          (selectedSupplier.chartData.environment +
                            selectedSupplier.chartData.social +
                            selectedSupplier.chartData.governance) /
                            3
                        )
                      )}
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">
                        Green Score
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                      {selectedSupplier.greenScore}
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Sustainability
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-blue-900">
                      {selectedSupplier.sustainabilityScore}%
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-900">
                        Risk Score
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-amber-900">
                      {selectedSupplier.riskScore}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Risk Assessment
                    </h3>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getRiskColor(
                        getRiskLevel(selectedSupplier.riskScore)
                      )}`}
                    >
                      {getRiskLevel(selectedSupplier.riskScore)} Risk
                    </span>
                  </div>
                  <p className="text-slate-700">
                    {selectedSupplier.insights[0]}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-accent" />
                    AI-Generated Insights
                  </h3>
                  <div className="space-y-3">
                    {selectedSupplier.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 p-4 bg-white rounded-lg border border-slate-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                        <p className="text-slate-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    ESG Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Environmental
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {selectedSupplier.chartData.environment}%
                        </span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${selectedSupplier.chartData.environment}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Social
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {selectedSupplier.chartData.social}%
                        </span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${selectedSupplier.chartData.social}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Governance
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {selectedSupplier.chartData.governance}%
                        </span>
                      </div>
                      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{
                            width: `${selectedSupplier.chartData.governance}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex-1 bg-accent text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#88e25b] transition-colors">
                    View Full Report
                  </button>
                  <button className="flex-1 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                    Find Alternatives
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Suppliers;
