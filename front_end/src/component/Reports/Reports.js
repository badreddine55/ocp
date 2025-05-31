"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../app/Layout";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FileText,
  Download,
  Calendar,
  Archive,
  BarChart3,
  FileSpreadsheet,
  File as PdfFile,
  Search,
  Plus,
  Eye,
  Trash2,
  AlertCircle,
  Check,
  Clock,
  Database,
  Shield,
  Settings,
} from "lucide-react";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

// Custom UI Components (unchanged)
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled,
  type = "button",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default:
      "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    destructive:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };
  const sizes = { sm: "px-3 py-2 text-sm", default: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", type = "text", ...props }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
);

const Label = ({ children, className = "", ...props }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-emerald-100 text-emerald-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>
    {children}
  </h2>
);

const DialogDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const DialogContent = ({ children, className = "", ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        <span>{value || "Sélectionner..."}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value);
                setIsOpen(false);
              },
            })
          )}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onClick, ...props }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
    onClick={onClick}
    value={value}
    {...props}
  >
    {children}
  </div>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
);

const DropdownMenu = ({ children, open, onOpenChange }) => <div className="relative">{children}</div>;

const DropdownMenuTrigger = ({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props}>
    {children}
  </button>
);

const DropdownMenuContent = ({ children, isOpen, className = "", ...props }) => {
  if (!isOpen) return null;
  return (
    <div
      className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className = "", ...props }) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

// Main Reports Component
const Reports = () => {
  const [reports, setReports] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [operations, setOperations] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "incidents",
    dateRange: "monthly",
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    format: "pdf",
    includeCharts: true,
    includeDetails: true,
    description: "",
    filters: {
      severity: "",
      zone: "",
      machine: "",
      status: "",
    },
  });
  const [formError, setFormError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const reportTypes = [
    { value: "incidents", label: "Rapports d'Incidents" },
    { value: "operations", label: "Rapports d'Opérations" },
    { value: "performances", label: "Rapports de Performance" },
    { value: "machines", label: "Rapports de Machines" },
    { value: "combined", label: "Rapport Combiné" },
  ];

  const dateRanges = [
    { value: "daily", label: "Quotidien" },
    { value: "weekly", label: "Hebdomadaire" },
    { value: "monthly", label: "Mensuel" },
    { value: "quarterly", label: "Trimestriel" },
    { value: "yearly", label: "Annuel" },
    { value: "custom", label: "Personnalisé" },
  ];

  const formats = [
    { value: "pdf", label: "PDF", icon: PdfFile },
    { value: "excel", label: "Excel", icon: FileSpreadsheet },
    { value: "csv", label: "CSV", icon: FileText },
  ];

  const statuses = ["Généré", "En cours", "Archivé", "Erreur"];

  // Validate date field to ensure it's a valid date string
  const isValidDate = (date) => {
    return date && dayjs(date).isValid();
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Aucun jeton d'authentification trouvé. Veuillez vous connecter.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const endpoints = [
        { url: `${process.env.REACT_APP_API_URL}/api/incidents`, setter: setIncidents, name: "incidents" },
        { url: `${process.env.REACT_APP_API_URL}/api/operations`, setter: setOperations, name: "operations" },
        { url: `${process.env.REACT_APP_API_URL}/api/performances`, setter: setPerformances, name: "performances" },
        { url: `${process.env.REACT_APP_API_URL}/api/machines`, setter: setMachines, name: "machines" },
        { url: `${process.env.REACT_APP_API_URL}/api/reports`, setter: setReports, name: "reports" },
      ];

      const fetchPromises = endpoints.map(async ({ url, setter, name }) => {
        try {
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(10000), // 10-second timeout
          });

          if (response.status === 401) {
            throw new Error("Session expirée. Veuillez vous reconnecter.");
          }

          if (!response.ok) {
            throw new Error(`Échec de la récupération des ${name}`);
          }

          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || `Échec de la récupération des ${name}`);
          }

          // Validate data
          let validatedData = Array.isArray(data.data) ? data.data : [];
          if (name === "reports") {
            validatedData = validatedData.filter(
              (item) => item && item._id && item.title && item.type
            );
          }
          setter(validatedData);
        } catch (err) {
          console.warn(`Erreur lors de la récupération des ${name}:`, err.message);
          if (name === "reports") {
            // Fallback data for reports
            setter([
              {
                _id: "1",
                title: "Rapport Mensuel des Incidents - Novembre 2024",
                type: "incidents",
                format: "pdf",
                status: "Généré",
                createdAt: new Date(),
                size: "2.3 MB",
                downloadCount: 5,
              },
              {
                _id: "2",
                title: "Analyse des Performances Q4 2024",
                type: "performances",
                format: "excel",
                status: "Archivé",
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                size: "1.8 MB",
                downloadCount: 12,
              },
            ]);
          } else {
            setter([]);
          }
        }
      });

      await Promise.allSettled(fetchPromises);

      // Check for 401 errors
      if (localStorage.getItem("token") === null) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Erreur globale lors de la récupération des données:", err);
      setError("Échec du chargement des données. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Reports state:", reports);
  }, [reports]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("filters.")) {
      const filterName = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          [filterName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "dateRange") {
      const now = dayjs();
      let startDate, endDate;

      switch (value) {
        case "daily":
          startDate = now.startOf("day");
          endDate = now.endOf("day");
          break;
        case "weekly":
          startDate = now.startOf("week");
          endDate = now.endOf("week");
          break;
        case "monthly":
          startDate = now.startOf("month");
          endDate = now.endOf("month");
          break;
        case "quarterly":
          startDate = now.startOf("quarter");
          endDate = now.endOf("quarter");
          break;
        case "yearly":
          startDate = now.startOf("year");
          endDate = now.endOf("year");
          break;
        default:
          return;
      }

      setFormData((prev) => ({
        ...prev,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError("Le titre du rapport est requis.");
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      setFormError("Les dates de début et de fin sont requises.");
      return false;
    }
    if (!isValidDate(formData.startDate) || !isValidDate(formData.endDate)) {
      setFormError("Les dates fournies ne sont pas valides.");
      return false;
    }
    if (dayjs(formData.startDate).isAfter(dayjs(formData.endDate))) {
      setFormError("La date de début doit être antérieure à la date de fin.");
      return false;
    }
    setFormError("");
    return true;
  };

  // Updated filterByDate to accept startDate and endDate as parameters
  const filterByDate = (items, dateField, startDate, endDate) =>
    items.filter((item) => {
      if (!item || !isValidDate(item[dateField])) {
        console.warn(`Invalid or missing date for ${dateField} in item:`, item);
        return false;
      }
      const itemDate = dayjs(item[dateField]);
      return itemDate.isBetween(dayjs(startDate), dayjs(endDate), null, "[]");
    });

  const generateReport = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsGenerating(true);
    try {
      const startDate = dayjs(formData.startDate);
      const endDate = dayjs(formData.endDate);
      let filteredData = [];

      switch (formData.type) {
        case "incidents":
          filteredData = filterByDate(incidents, "createdAt", startDate, endDate);
          break;
        case "operations":
          filteredData = filterByDate(operations, "interventionDateTime", startDate, endDate);
          break;
        case "performances":
          filteredData = filterByDate(performances, "date", startDate, endDate);
          break;
        case "machines":
          filteredData = machines.filter((item) => item && item._id);
          break;
        case "combined":
          filteredData = {
            incidents: filterByDate(incidents, "createdAt", startDate, endDate),
            operations: filterByDate(operations, "interventionDateTime", startDate, endDate),
            performances: filterByDate(performances, "date", startDate, endDate),
            machines: machines.filter((item) => item && item._id),
          };
          break;
        default:
          throw new Error("Type de rapport invalide.");
      }

      let newReport;
      if (formData.format === "pdf") {
        await generatePDFReport(filteredData);
        newReport = createNewReport();
        setReports((prev) => [newReport, ...prev]);
      } else if (formData.format === "excel") {
        await generateExcelReport(filteredData);
        newReport = createNewReport();
        setReports((prev) => [newReport, ...prev]);
      } else if (formData.format === "csv") { // Fixed typo: "csv"
        await generateCSVReport(filteredData);
        newReport = createNewReport();
        setReports((prev) => [newReport, ...prev]);
      }

      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Erreur lors de la génération du rapport:", err);
      setFormError(`Échec de la génération du rapport: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const createNewReport = () => ({
    _id: Date.now().toString(),
    title: formData.title,
    type: formData.type,
    format: formData.format,
    status: "Généré",
    createdAt: new Date(),
    size: "1.2 MB",
    downloadCount: 0,
    dateRange: `${formData.startDate} - ${formData.endDate}`,
    description: formData.description,
  });

  const generatePDFReport = async (data) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(16, 185, 129);
        doc.text(doc.formData.title, 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Période: ${doc.formData.startDate} - ${doc.formData.endDate}`, 20, 30);
        doc.text(`Généré le: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 20, 40);

        if (doc.formData.description) {
          doc.text(`Description: ${doc.formData.description}`, 20, 50);
        }

        let yPosition = 60;

        if (formData.type === "incidents") {
          doc.setFontSize(16);
          doc.text("Rapport des Incidents", 20, yPosition);
          yPosition += 10;

          if (data.length > 0) {
            const tableData = data.map((incident) => [
              isValidDate(incident.createdAt) ? dayjs(incident.createdAt).format("DD/MM/YYYY") : "N/A",
              incident.description?.substring(0, 30) + "..." || "N/A",
              incident.severityLevel || "N/A",
              incident.status || "N/A",
              incident.zone || "N/A",
            ]);

            doc.autoTable({
              startY: yPosition,
              head: [["Date", "Description", "Gravité", "Statut", "Zone"]],
              body: tableData,
              theme: "striped",
              headStyles: { fillColor: [16, 185, 129] },
            });
          } else {
            doc.text("Aucun incident trouvé pour cette période.", 20, yPosition);
          }
        } else if (formData.type === "operations") {
          doc.setFontSize(16);
          doc.text("Rapport des Opérations", 20, yPosition);
          yPosition += 10;

          if (data.length > 0) {
            const tableData = data.map((operation) => [
              operation.ficheId || "N/A",
              isValidDate(operation.interventionDateTime)
                ? dayjs(operation.interventionDateTime).format("DD/MM/YYYY") : "N/A",
              operation.decapingMethod || "N/A",
              operation.machine?.name || "N/A",
              operation.operatingHours || "0",
              operation.metrics?.metrage || "0",
            ]);

            doc.autoTable({
              startY: yPosition,
              head: [["Fiche ID", "Date", "Méthode", "Machine", "Heures", "Métrage"]],
              body: tableData,
              theme: "striped",
              headStyles: { fillColor: [16, 185, 129] },
            });
          } else {
            doc.text("Aucune opération trouvée pour cette période.", 20, yPosition);
          }
        } else if (formData.type === "performances") {
          doc.setFontSize(16);
          doc.text("Rapport des Performances", 20, yPosition);
          yPosition += 10;

          if (data.length > 0) {
            const tableData = data.map((perf) => [
              isValidDate(perf.date) ? dayjs(perf.date).format("DD/MM/YYYY") : "N/A",
              perf.machine?.name || "N/A",
              perf.availability || "0",
              perf.rendement || "0",
              perf.mtbf || "0",
              perf.zone || "N/A",
            ]);

            doc.autoTable({
              startY: yPosition,
              head: [["Date", "Machine", "Disponibilité (%)", "Rendement (%)", "MTBF (h)", "Zone"]],
              body: tableData,
              theme: "striped",
              headStyles: { fillColor: [16, 185, 129] },
            });
          } else {
            doc.text("Aucune donnée de performance trouvée pour cette période.", 20, yPosition);
          }
        } else if (formData.type === "combined") {
          doc.setFontSize(16);
          doc.text("Rapport Combiné", 20, yPosition);
          yPosition += 10;

          if (data.incidents.length > 0) {
            doc.text("Incidents", 20, yPosition);
            yPosition += 10;
            const incidentTable = data.incidents.map((incident) => [
              isValidDate(incident.createdAt) ? dayjs(incident.createdAt).format("DD/MM/YYYY") : "N/A",
              incident.description?.substring(0, 30) + "..." || "N/A",
              incident.severityLevel || "N/A",
            ]);

            doc.autoTable({
              startY: yPosition,
              head: [["Date", "Description", "Gravité"]],
              body: incidentTable,
              theme: "striped",
              headStyles: { fillColor: [16, 185, 129] },
            });
            yPosition = doc.lastAutoTable.finalY + 10;
          }

          if (data.operations.length > 0) {
            doc.text("Operations", 20, yPosition);
            yPosition += 10;
            const operationTable = data.operations.map((operation) => [
              operation.ficheId || "N/A",
              isValidDate(operation.interventionDateTime)
                ? dayjs(operation.interventionDateTime).format("DD/MM/YYYY") : "N/A",
              operation.decapingMethod || "N/A",
            ]);

            doc.autoTable({
              startY: yPosition,
              head: [["Fiche ID", "Date", "Méthode"]],
              body: operationTable,
              theme: "striped",
              headStyles: { fillColor: [16, 185, 129] },
            });
            yPosition = doc.lastAutoTable.finalY + 10;
          }
        }

        doc.save(`${formData.title.replace(/\s+/g, "_")}.pdf`);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  const generateExcelReport = async (data) => {
    return new Promise((resolve, reject) => {
      try {
        const wb = XLSX.utils.book_new();

        if (formData.type === "incidents") {
          const wsData = [
            ["Date", "Description", "Gravité", "Statut", "Zone", "Déclarant"],
            ...data.map((incident) => [
              isValidDate(incident.createdAt) ? dayjs(incident.createdAt).format("YYYY-MM-DD") : "N/A",
              incident.description || "N/A",
              incident.severityLevel || "N/A",
              incident.status || "N/A",
              incident.zone || "N/A",
              incident.declarant?.name || "N/A",
            ]),
          ];
          const ws = XLSX.utils.sheet_to_array(wsData);
          XLSX.utils.book_append_sheet(wb, ws, "Incidents");
        } else if (formData.type === "operations") {
          const wsData = [
            ["Fiche ID", "Date", "Méthode", "Machine", "Heures Fonctionnement", "Arrêt", "Métrage"],
            ...data.map((operation) => [
              operation.ficheId || "N/A",
              isValidDate(operation.interventionDateTime)
                ? dayjs(operation.interventionDateTime).format("YYYY-MM-DD") : "N/A",
              operation.decapingMethod || "N/A",
              operation.operation?.machine?.name || "N/A",
              operation.operatingHours || 0,
              operation.downtime || 0,
              operation.metrics?.metrage || 0,
            ]),
          ];
          const ws = XLSX.utils.sheet_to_array(wsData);
          XLSX.utils.book_append_sheet(wb, ws, "Opérations");
        } else if (formData.type === "performances") {
          const wsData = [
            ["Date", "Machine", "Disponibilité (%)", "Performance (%)", "MTBF (h)", "Opérateur", "Zone"],
            ...data.map((perf) => [
              isValidDate(perf.date) ? dayjs(perf.date).format("YYYY-MM-DD") : "N/A",
              perf.performance?.machine?.name || "N/A",
              perf.availability || 0,
              perf.performance || 0,
              perf.mtbf || 0,
              perf.operator?.name || "N/A",
              perf.zone || "N/A",
            ]),
          ];
          const ws = XLSX.utils.sheet_to_array(wsData);
          XLSX.utils.book_append_sheet(wb, ws, "Performances");
        } else if (formData.type === "combined") {
          // Incidents sheet
          const incidentsWsData = [
            ["Date", "Description", "Incident", "Statut", "Zone"],
            ...data.incidents.map((incident) => [
              isValidDate(incident.createdAt) ? dayjs(incident.createdAt).format("YYYY-MM-DD") : "N/A",
              incident.description || "N/A",
              incident.severityLevel || "N/A",
              incident.status || "N/A",
              incident.zone || "N/A",
            ]),
          ];
          const incidentsWs = XLSX.utils.sheet_to_array(incidentsWsData);
          XLSX.utils.book_append_sheet(wb, incidentsWs, "Incidents");

          // Operations sheet
          const operationsWsData = [
            ["Fiche ID", "Date", "Operation", "Machine", "Heures"],
            ...data.operations.map((operation) => [
              operation.ficheId || "N/A",
              isValidDate(operation.interventionDateTime)
                ? dayjs(operation.interventionDateTime).format("YYYY-MM-DD") : "N/A",
              operation.decapingMethod || "N/A",
              operation.operation?.machine?.name || "N/A",
              operation.operatingHours || 0,
            ]),
          ];
          const operationsWs = XLSX.utils.sheet_to_array(operationsWsData);
          XLSX.utils.book_append_sheet(wb, operationsWs, "Operations");
        }

        XLSX.writeFile(wb, `${formData.title.replaceAll(/\s+/g, "_")}.xlsx`);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  const generateCSVReport = async (data) => {
    return new Promise((resolve, reject) => {
      try {
        let csvContent = "";

        if (formData.type === "incidents") {
          csvData = "Date,Description,Operation,Statut,Machine,Heures\n";
          csvContent += data.map((incident) => [
            isValidDate(incident.createdAt) ? dayjs(incident.createdAt).format("DD/MM/YYYY") : "N/A",
            `"${incident.description || "N/A"}"`,
            incident.severityLevel || "N/A",
            incident.status || "N/A",
            incident.zone || "N/A",
            incident.declarant?.name || "N/A",
          ].join(",")).join("\n");
        } else if (formData.type === "operations") {
          csvData = "Fiche ID,Date,Méthode,Machine,Heures Fonctionnement,Arrêt,Heures\n";
          csvContent += data.map((operation) => [
            operation.ficheId || "N/A",
            isValidDate(operation.interventionDateTime)
              ? dayjs(operation.interventionDateTime).format("DD/MM/YYYY") : "N/A",
            operation.decapingMethod || "N/A",
            operation.operation?.machine?.name || "N/A",
            operation.operatingHours || 0,
            operation.downtime || 0,
            operation.metrics?.metrage || 0,
          ].join(",")).join("\n");
        } else if (formData.type === "performances") {
          csvData = "Date,Machine,Disponibilité (%),Performance (%),MTBF (h),Opérateur,Zone\n";
          csvContent += data.map((perf) => [
            isValidDate(perf.date) ? dayjs(perf.date).format("DD/MM/YYYY") : "N/A",
            perf.performance?.machine?.name || "N/A",
            perf.availability || 0,
            perf.performance || 0,
            perf.mtbf || 0,
            perf.operator?.name || "N/A",
            perf.zone || "N/A",
          ].join(",")).join("\n");
        } else if (formData.type === "combined") {
          csvData = "Type,Date,Description,Details\n";
          csvContent += data.incidents.map((item) => [
            "Incident",
            isValidDate(item.createdAt) ? dayjs(item.createdAt).format("DD/MM/YYYY") : "N/A",
            `"${item.description || "N/A"}"`,
            item.severityLevel || "N/A",
          ].join(",")).join("\n");
          csvContent += "\n";
          csvContent += data.operations.map((item) => [
            "Operation",
            isValidDate(item.interventionDateTime)
              ? dayjs(item.interventionDateTime).format("DD/MM/YYYY") : "N/A",
            item.ficheId || "N/A",
            item.decapingMethod || "N/A",
          ].join(",")).join("\n");
        }

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${formData.title.replace(/\s+/g, "_")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "incidents",
      dateRange: "monthly",
      startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
      format: "pdf",
      includeCharts: true,
      includeDetails: true,
      description: "",
      filters: {
        severity: "",
        zone: "",
        machine: "",
        status: "",
      },
    });
    setFormError("");
    setSelectedReport(null);
  };

  const openViewModal = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
    setDropdownOpen(null);
  };

  const openDeleteModal = (report) => {
    setSelectedReport(report);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const openArchiveModal = (report) => {
    setSelectedReport(report);
    setIsArchiveModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDeleteReport = () => {
    setReports((prev) => prev.filter((r) => r._id !== selectedReport._id));
    setIsDeleteModalOpen(false);
    setSelectedReport(null);
  };

  const handleArchiveReport = () => {
    setReports((prev) =>
      prev.map((r) => (r._id === selectedReport._id ? { ...r, status: "Archivé" } : r))
    );
    setIsArchiveModalOpen(false);
    setSelectedReport(null);
  };

  const filteredReports = () => {
    return reports.filter((report) => {
      if (!report || !report.title || !report.type) {
        console.warn("Invalid report data:", report);
        return false;
      }

      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || report.type === filterType;
      const matchesStatus = !filterStatus || report.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Généré":
        return "success";
      case "En cours":
        return "warning";
      case "Archivé":
        return "secondary";
      case "Erreur":
        return "destructive";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "incidents":
        return "⚠️";
      case "operations":
        return "🔧";
      case "performances":
        return "📊";
      case "machines":
        return "🏭";
      case "combined":
        return "📋";
      default:
        return "📄";
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
          <div className="flex items-center justify-center h-screen">
            <Card className="p-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="h-6 w-6" />
                <p className="text-lg font-semibold">{error}</p>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-8 w-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">Rapports et Exportation</h1>
                </div>
                <p className="text-emerald-100 text-lg">Générer, exporter et archiver les rapports du système</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{reports.length}</div>
                  <div className="text-sm text-emerald-100">Total Rapports</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{reports.filter((r) => r.status === "Archivé").length}</div>
                  <div className="text-sm text-emerald-100">Archivés</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Incidents</CardTitle>
                    <p className="text-2xl font-bold text-red-600">{incidents.length}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Opérations</CardTitle>
                    <p className="text-2xl font-bold text-blue-600">{operations.length}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Performances</CardTitle>
                    <p className="text-2xl font-bold text-emerald-600">{performances.length}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Machines</CardTitle>
                    <p className="text-2xl font-bold text-purple-600">{machines.length}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des rapports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectItem value="">Tous les types</SelectItem>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectItem value="">Tous les statuts</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Nouveau Rapport
            </Button>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))
            ) : filteredReports().length === 0 ? (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun rapport trouvé</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterType || filterStatus
                      ? "Essayez d’ajuster vos critères de recherche ou de filtre."
                      : "Commencez par générer votre premier rapport."
                    }
                  </p>
                  {!searchTerm && !filterType && !filterStatus && (
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" /> Générer le premier rapport
                    </Button>
                  )}
                </Card>
              </div>
            ) : (
              filteredReports().map((report) => (
                <Card
                  key={report._id}
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{report.title}</CardTitle>
                          <p className="text-sm text-gray-600">
                            {reportTypes.find((t) => t.value === report.type)?.label}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu
                        open={dropdownOpen === report._id}
                        onOpenChange={(open) => setDropdownOpen(open ? report._id : null)}
                      >
                        <DropdownMenuTrigger
                          onClick={() => setDropdownOpen(dropdownOpen === report._id ? null : report._id)}
                        >
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span>⋮</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent isOpen={dropdownOpen === report._id}>
                          <DropdownMenuItem onClick={() => openViewModal(report)} className="gap-2">
                            <Eye className="h-4 w-4" /> Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              /* Download logic */
                            }}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" /> Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openArchiveModal(report)} className="gap-2">
                            <Archive className="h-4 w-4" /> Archiver
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            on={() => openDeleteModal(report)}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={getStatusBadgeVariant(report.status)}>{report.status}</Badge>
                      <div className="flex items-center gap-1">
                        {formats.find((f) => f.value === report.format)?.icon &&
                          React.createElement(formats.find((f) => f.value === report.format).icon, {
                            className: "h-4 w-4 text-gray-600",
                          })}
                        <span className="text-sm text-gray-600">{report.format.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Créé: {dayjs(report.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Taille : {report.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span>Téléchargements : {report.downloadCount}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewModal(report)}
                        className="flex-1 gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          /* Download logic */
                        }}
                        className="flex-1 gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Create Report Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Générer un nouveau rapport
                </DialogTitle>
                <DialogDescription>Créer un rapport personnalisé avec les données sélectionnées.</DialogDescription>
              </DialogHeader>
              <form onSubmit={generateReport} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-100 border border-red-400 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="title">Titre du rapport *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ex: Rapport Mensuel des Incidents - Décembre 2023"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de Rapport *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format d’exportation *</Label>
                    <Select value={formData.format} onValueChange={(value) => handleSelectChange("format", value)}>
                      {formats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Période *</Label>
                    <Select
                      value={formData.dateRange}
                      onValueChange={(value) => handleSelectChange("dateRange", value)}
                    >
                      {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Description du rapport et objectifs..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Options d’inclusion</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="includeCharts"
                          checked={formData.includeCharts}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <span className="text-sm">Inclure les graphiques</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="includeDetails"
                          checked={formData.includeDetails}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <span className="text-sm">Inclure les détails</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1"
                    disabled={isGenerating}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 gap-2" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Générer le rapport
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Report Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" /> Détails du rapport
                </DialogTitle>
                <DialogDescription>Informations complètes du rapport sélectionné.</DialogDescription>
              </DialogHeader>
              {selectedReport && (
                <div className="space-y-4 p-6 pt-0">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      {getTypeIcon(selectedReport.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">{selectedReport.title}</h3>
                      <p className="text-emerald-600">
                        {reportTypes.find((t) => t.value === selectedReport.type)?.label}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={getStatusBadgeVariant(selectedReport.status)}>{selectedReport.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Date de création</p>
                        <p className="font-medium">{dayjs(selectedReport.createdAt).format("DD/MM/YYYY HH:mm")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Database className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Taille du fichier</p>
                        <p className="font-medium">{selectedReport.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Download className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Téléchargements</p>
                        <p className="font-medium">{selectedReport.downloadCount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Format</p>
                        <p className="font-medium">{selectedReport.format.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                  {selectedReport.dateRange && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Période couverte</p>
                      <p className="font-medium">{selectedReport.dateRange}</p>
                    </div>
                  )}
                  {selectedReport.description && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="font-medium">{selectedReport.description}</p>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <Button variant="secondary" onClick={() => setIsViewModalOpen(false)} className="flex-1">
                      Fermer
                    </Button>
                    <Button
                      onClick={() => {
                        /* Download logic */
                      }}
                      className="flex-1 gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Confirmer la suppression
                </DialogTitle>
                <DialogDescription>
                  Cette action ne peut pas être annulée. Le rapport sera définitivement supprimé.
                </DialogDescription>
              </DialogHeader>
              {selectedReport && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800">
                      Êtes-vous sûr de vouloir supprimer{" "}
                      <span className="font-semibold">{selectedReport.title}</span> ?
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      Type: {reportTypes.find((t) => t.value === selectedReport.type)?.label}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteReport} className="flex-1 gap-2">
                      <Trash2 className="h-4 w-4" />
                      Supprimer le rapport
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Archive Confirmation Modal */}
          <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-emerald-600">
                  <Archive className="h-5 w-5" />
                  Archiver le rapport
                </DialogTitle>
                <DialogDescription>Le rapport sera déplacé vers les archives sécurisées.</DialogDescription>
              </DialogHeader>
              {selectedReport && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-800">Archivage sécurisé</span>
                    </div>
                    <p className="text-sm text-emerald-800">
                      Le rapport <span className="font-semibold">{selectedReport.title}</span> sera archivé de manière
                      sécurisée.
                    </p>
                    <p className="text-sm text-emerald-600 mt-1">
                      Les rapports archivés restent accessibles mais sont marqués comme historiques.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setIsArchiveModalOpen(false)} className="flex-1">
                      Annuler
                    </Button>
                    <Button onClick={handleArchiveReport} className="flex-1 gap-2">
                      <Archive className="h-4 w-4" /> Archiver
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;