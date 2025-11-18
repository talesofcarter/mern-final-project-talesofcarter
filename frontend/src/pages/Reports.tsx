/* eslint-disable @typescript-eslint/no-explicit-any */
import { type JSX, useState, useEffect } from "react";
import { Link } from "react-router";
import Banner from "../components/Banner";
import api from "../services/api";
import {
  FileText,
  Leaf,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Plus,
  Search,
  FileDown,
  FileSpreadsheet,
  X,
  Sparkles,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  FileJson,
} from "lucide-react";

interface ChartData {
  risk: number;
  environment: number;
  social: number;
  governance: number;
}

export interface SupplierEvaluationResult {
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

interface Report {
  id: string;
  title: string;
  type:
    | "CO₂ Impact"
    | "Spend Analysis"
    | "Supplier ESG"
    | "Scorecard"
    | "Monthly Summary";
  date: string;
  supplierData: SupplierEvaluationResult;
  status: "completed" | "processing" | "draft";
}

function Reports(): JSX.Element {
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);

  // State for reports data
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from Backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/api/reports");

        if (response.data && response.data.success) {
          const dbReports = response.data.reports;

          const mappedReports: Report[] = dbReports.map((item: any) => {
            const ai = item.aiOutput || {};
            const esg = ai.esg || {};

            const displayTitle = `${item.supplierName} - ESG Evaluation`;

            const reportType = "Supplier ESG";

            const riskScore = (ai.risk?.riskScore || 0) * 10;
            const greenScore = ai.environment?.carbonIntensityScore || 0;

            const sustainabilityScore = Math.round(
              ((esg.environmental || 0) +
                (esg.social || 0) +
                (esg.governance || 0)) /
                3
            );

            return {
              id: item._id,
              title: displayTitle,
              type: reportType,
              date: item.createdAt,
              status: "completed", // Assuming if it's in DB, analysis is done
              supplierData: {
                supplierName: item.supplierName,
                industry: item.industry,
                riskScore,
                sustainabilityScore,
                greenScore,
                insights: ai.spendInsights?.improvementSuggestions || [],
                recommendations: ai.diversity?.recommendations || [],
                alternativeSuggestions: ai.alternativeSuggestions || [],
                chartData: {
                  risk: riskScore,
                  environment: esg.environmental || 0,
                  social: esg.social || 0,
                  governance: esg.governance || 0,
                },
              },
            };
          });

          setReports(mappedReports);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        // Optionally handle error state here
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "7d" &&
        new Date(report.date) >=
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "30d" &&
        new Date(report.date) >=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    const matchesType = typeFilter === "all" || report.type === typeFilter;

    const matchesSearch =
      searchQuery === "" ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.supplierData.supplierName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.supplierData.industry
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesDate && matchesType && matchesSearch;
  });

  const handlePreview = (report: Report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const exportAsJSON = () => {
    if (!selectedReport) return;
    const dataStr = JSON.stringify(selectedReport.supplierData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedReport.supplierData.supplierName.replace(
      / /g,
      "_"
    )}_Evaluation.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/30">
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "CO₂ Impact":
        return <Leaf className="w-6 h-6" />;
      case "Supplier ESG":
      case "Scorecard":
        return <Target className="w-6 h-6" />;
      case "Monthly Summary":
      case "Spend Analysis":
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case "CO₂ Impact":
        return "from-emerald-500 to-teal-600";
      case "Supplier ESG":
      case "Scorecard":
        return "from-purple-500 to-pink-600";
      case "Spend Analysis":
      case "Monthly Summary":
        return "from-blue-500 to-cyan-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <>
      <title>Reports</title>
      <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-black min-h-screen w-full">
        <Banner
          title="Reports"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports" }]}
          backgroundImage="/aerial-view.webp"
          height="h-96"
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">
                AI-Powered Reports
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Reports & Insights
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl">
              Download, review, and share AI-generated sustainability reports
            </p>
          </div>

          {/* Filters and Actions Bar */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl flex-1 lg:flex-initial lg:min-w-[300px]">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none flex-1"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-gray-700/50 rounded p-1 transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm Bridge border-gray-700/50 rounded-xl">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="CO₂ Impact">CO₂ Impact</option>
                  <option value="Spend Analysis">Spend Analysis</option>
                  <option value="Supplier ESG">Supplier ESG</option>
                  <option value="Scorecard">Scorecard</option>
                  <option value="Monthly Summary">Monthly Summary</option>
                </select>
              </div>
            </div>
            <Link to="/ai">
              <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer">
                <Plus className="w-5 h-5" />
                Generate New Report
              </button>
            </Link>
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-sm">
              Showing{" "}
              <span className="text-white font-semibold">
                {filteredReports.length}
              </span>{" "}
              of{" "}
              <span className="text-white font-semibold">{reports.length}</span>{" "}
              reports
            </p>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-banner grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading state placeholder
              <div className="col-span-full text-center py-10">
                <p className="text-gray-400">Loading reports...</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="group relative bg-linear-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${getTypeGradient(
                      report.type
                    )} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <div className="relative flex items-start justify-between mb-4">
                    <div
                      className={`p-3 bg-linear-to-br ${getTypeGradient(
                        report.type
                      )} rounded-2xl shadow-lg`}
                    >
                      {getTypeIcon(report.type)}
                    </div>
                    <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="relative mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(report.status)}
                      <span className="text-xs text-gray-500">
                        {report.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                      {report.supplierData.supplierName} ·{" "}
                      {report.supplierData.industry}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="relative flex items-center gap-2 pt-4 border-t border-gray-700/50">
                    <button
                      onClick={() => handlePreview(report)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button className="p-2.5 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all duration-300 group/btn">
                      <FileDown className="w-4 h-4 text-gray-300 group-hover/btn:text-green-400 transition-colors" />
                    </button>
                    <button className="p-2.5 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all duration-300 group/btn">
                      <FileSpreadsheet className="w-4 h-4 text-gray-300 group-hover/btn:text-blue-400 transition-colors" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Empty State */}
          {!loading && filteredReports.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-4">
                <FileText className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No reports found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or generate a new report
              </p>
              <button className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-300">
                Generate New Report
              </button>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative bg-linear-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 bg-linear-to-br ${getTypeGradient(
                      selectedReport.type
                    )} rounded-2xl shadow-lg`}
                  >
                    {getTypeIcon(selectedReport.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {selectedReport.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(selectedReport.status)}
                      <span className="text-sm text-gray-400">
                        {selectedReport.type}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    Supplier
                  </h3>
                  <p className="text-xl font-medium text-white">
                    {selectedReport.supplierData.supplierName}
                  </p>
                  <p className="text-gray-400">
                    {selectedReport.supplierData.industry}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                    <p className="text-sm text-gray-400">Risk Score</p>
                    <p className="text-2xl font-bold text-red-400">
                      {selectedReport.supplierData.riskScore}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                    <p className="text-sm text-gray-400">Sustainability</p>
                    <p className="text-2xl font-bold text-green-400">
                      {selectedReport.supplierData.sustainabilityScore}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                    <p className="text-sm text-gray-400">Green Score</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      {selectedReport.supplierData.greenScore}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                    <p className="text-sm text-gray-400">Overall ESG</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {Math.round(
                        (selectedReport.supplierData.chartData.environment +
                          selectedReport.supplierData.chartData.social +
                          selectedReport.supplierData.chartData.governance) /
                          3
                      )}
                    </p>
                  </div>
                </div>

                {selectedReport.supplierData.insights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Key Insights
                    </h3>
                    <ul className="space-y-2">
                      {selectedReport.supplierData.insights.map(
                        (insight, i) => (
                          <li
                            key={i}
                            className="text-gray-300 text-sm flex items-start gap-2"
                          >
                            <span className="text-green-400 mt-1">•</span>
                            {insight}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {selectedReport.supplierData.recommendations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {selectedReport.supplierData.recommendations.map(
                        (rec, i) => (
                          <li
                            key={i}
                            className="text-gray-300 text-sm flex items-start gap-2"
                          >
                            <span className="text-blue-400 mt-1">→</span>
                            {rec}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {selectedReport.supplierData.alternativeSuggestions.length >
                  0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Alternative Suppliers
                    </h3>
                    <ul className="space-y-2">
                      {selectedReport.supplierData.alternativeSuggestions.map(
                        (alt, i) => (
                          <li
                            key={i}
                            className="text-gray-300 text-sm flex items-start gap-2"
                          >
                            <span className="text-amber-400 mt-1">↳</span>
                            {alt}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-6 border-t border-gray-700/50 bg-gray-800/50">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Generated on{" "}
                  {new Date(selectedReport.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportAsJSON}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 text-sm font-medium rounded-xl transition-all duration-300"
                  >
                    <FileJson className="w-4 h-4" />
                    Export JSON
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-all duration-300">
                    <FileSpreadsheet className="w-4 h-4" />
                    Export CSV
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                    <Download className="w-4 h-4" />
                    Download PDF
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

export default Reports;
