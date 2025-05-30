"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import Layout from "../app/Layout";
import {
  Calendar,
  FileText,
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  AlertCircle,
  Download,
  Search,
  Check,
  X,
} from "lucide-react";

// Custom UI Components
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    default:
      "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-600 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    destructive:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${
        sizes[size]
      } ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
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
  <label
    className={`text-sm font-medium text-gray-700 ${className}`}
    {...props}
  >
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

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
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
        <span>{value || "Select..."}</span>
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg">
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

const SelectItem = ({ children, value, onClick }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
    onClick={onClick}
  >
    {children}
  </div>
);

const DropdownMenu = ({ children, open, onOpenChange }) => {
  return <div className="relative">{children}</div>;
};

const DropdownMenuTrigger = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
);

const DropdownMenuContent = ({ children, isOpen, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10 ${className}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className = "" }) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Main Reports Component
const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    filters: {},
    filePath: "",
    pdfFile: null,
  });
  const [formError, setFormError] = useState("");
  const [filterFields, setFilterFields] = useState([]);
  const reportTypes = ["Daily", "Weekly", "Monthly", "Custom"];

  // Fetch reports and machines on mount
  useEffect(() => {
    fetchReports();
    fetchMachines();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        localStorage.clear();
        navigate("/login");
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 401) {
        localStorage.clear();
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch reports");
      }
      setReports(response.data.data);
      setFilteredReports(response.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError(error.message || "Failed to load reports. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMachines = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/machines`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch machines");
      }
      setMachines(response.data.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
      setError(error.message || "Failed to load machines.");
    }
  };

  // Handle search and filters
  useEffect(() => {
    let filtered = reports;
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.generatedBy?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          report.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType) {
      filtered = filtered.filter((report) => report.type === filterType);
    }
    if (filterDate) {
      filtered = filtered.filter(
        (report) =>
          dayjs(report.period.startDate).isSame(dayjs(filterDate), "day") ||
          dayjs(report.period.endDate).isSame(dayjs(filterDate), "day")
      );
    }
    setFilteredReports(filtered);
  }, [searchTerm, filterType, filterDate, reports]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && value === "Monthly"
        ? {
            startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
            endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
          }
        : {}),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("File size exceeds 5MB limit.");
        return;
      }
      setFormData((prev) => ({ ...prev, pdfFile: file }));
      setFormError("");
    } else {
      setFormError("Please upload a valid PDF file.");
    }
  };

  const handleFilterChange = (index, field, value) => {
    const updatedFilters = [...filterFields];
    updatedFilters[index][field] = value;
    setFilterFields(updatedFilters);
    const filtersObj = updatedFilters.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {});
    setFormData((prev) => ({ ...prev, filters: filtersObj }));
  };

  const addFilterField = () => {
    setFilterFields([...filterFields, { key: "", value: "" }]);
  };

  const removeFilterField = (index) => {
    const updatedFilters = filterFields.filter((_, i) => i !== index);
    setFilterFields(updatedFilters);
    const filtersObj = updatedFilters.reduce((acc, { key, value }) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {});
    setFormData((prev) => ({ ...prev, filters: filtersObj }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      type: "",
      startDate: "",
      endDate: "",
      filters: {},
      filePath: "",
      pdfFile: null,
    });
    setFilterFields([]);
    setFormError("");
    setSelectedReport(null);
  };

  const validateForm = () => {
    if (!formData.type) {
      setFormError("Report type is required.");
      return false;
    }
    if (!reportTypes.includes(formData.type)) {
      setFormError("Invalid report type.");
      return false;
    }
    if (!formData.startDate || !formData.endDate) {
      setFormError("Start and end dates are required.");
      return false;
    }
    if (dayjs(formData.endDate).isBefore(dayjs(formData.startDate))) {
      setFormError("End date cannot be before start date.");
      return false;
    }
    if (isCreateModalOpen && !formData.pdfFile) {
      setFormError("PDF file is required for new reports.");
      return false;
    }
    setFormError("");
    return true;
  };

  const uploadFile = async (file) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token missing. Please log in again.");
    }
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reports/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to upload file");
      }
      return response.data.data.filePath;
    } catch (error) {
      console.error("Upload error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload file. Please check the file and try again.";
      throw new Error(errorMessage);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      setFormError("Authentication required. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      let filePath = formData.filePath;
      if (formData.pdfFile) {
        filePath = await uploadFile(formData.pdfFile);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reports`,
        {
          type: formData.type,
          period: { startDate: formData.startDate, endDate: formData.endDate },
          userId,
          filters: formData.filters,
          filePath,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create report.");
      }

      setReports((prev) => [...prev, response.data.data]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating report:", error);
      setFormError(error.message || "Failed to create report.");
    }
  };

  const handleEditReport = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setFormError("Authentication required. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      let filePath = formData.filePath;
      if (formData.pdfFile) {
        filePath = await uploadFile(formData.pdfFile);
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/reports/${selectedReport._id}`,
        {
          type: formData.type,
          period: { startDate: formData.startDate, endDate: formData.endDate },
          filters: formData.filters,
          filePath,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update report.");
      }

      setReports((prev) =>
        prev.map((report) =>
          report._id === response.data.data._id ? response.data.data : report
        )
      );
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error updating report:", error);
      setFormError(error.message || "Failed to update report.");
    }
  };

  const handleDeleteReport = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFormError("Authentication required. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/reports/${selectedReport._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete report.");
      }

      setReports((prev) =>
        prev.filter((report) => report._id !== selectedReport._id)
      );
      setIsDeleteModalOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error("Error deleting report:", error);
      setFormError(error.message || "Failed to delete report.");
    }
  };

  const openViewModal = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
    setDropdownOpen(null);
  };

  const openEditModal = (report) => {
    setSelectedReport(report);
    const filterArray = Object.entries(report.filters).map(([key, value]) => ({
      key,
      value,
    }));
    setFilterFields(filterArray);
    setFormData({
      type: report.type,
      startDate: dayjs(report.period.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(report.period.endDate).format("YYYY-MM-DD"),
      filters: report.filters,
      filePath: report.filePath,
      pdfFile: null,
    });
    setIsEditModalOpen(true);
    setDropdownOpen(null);
  };

  const openDeleteModal = (report) => {
    setSelectedReport(report);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const handleExport = async (report, format) => {
    try {
      const token = localStorage.getItem("token");
      const filename = report.filePath.split("/").pop();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/reports/files/${filename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${report._id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Error exporting report as ${format}:`, error);
      setError(`Failed to export report as ${format}.`);
    }
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case "Daily":
        return "success";
      case "Weekly":
        return "warning";
      case "Monthly":
        return "default";
      case "Custom":
        return "secondary";
      default:
        return "secondary";
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
                  <h1 className="text-3xl sm:text-4xl font-bold">
                    Reports Management
                  </h1>
                </div>
                <p className="text-emerald-100 text-lg">
                  Generate and manage system reports
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{reports.length}</div>
                  <div className="text-sm text-emerald-100">Total Reports</div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports by user or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectItem value="">All Types</SelectItem>
                {reportTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full sm:w-auto"
              />
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 sm:mt-0"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Report
            </Button>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))
            ) : filteredReports.length === 0 ? (
              <div className="col-span-full text-center">
                <Card className="p-6">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No reports found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterType || filterDate
                      ? "Try adjusting your search or filter criteria."
                      : "Get started by adding your first report."}
                  </p>
                  {!searchTerm && !filterType && !filterDate && (
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="inline-flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Report
                    </Button>
                  )}
                </Card>
              </div>
            ) : (
              filteredReports.map((report) => (
                <Card
                  key={report._id}
                  className="group hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {report.type.charAt(0)}
                        </div>
                        <div>
                          <CardTitle>{report.type} Report</CardTitle>
                          <p className="text-sm text-gray-500">
                            {report.generatedBy?.name || "Unknown User"}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu
                        open={dropdownOpen === report._id}
                        onOpenChange={(open) =>
                          setDropdownOpen(open ? report._id : null)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDropdownOpen(
                                dropdownOpen === report._id ? null : report._id
                              )
                            }
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          isOpen={dropdownOpen === report._id}
                        >
                          <DropdownMenuItem
                            onClick={() => openViewModal(report)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditModal(report)}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Report
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(report)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleExport(report, "pdf")}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Export PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleExport(report, "csv")}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Export CSV
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getTypeBadgeVariant(report.type)}>
                        {report.type}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm gap-2">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span className="text-gray-600">
                          {dayjs(report.period.startDate).format("DD/MM/YYYY")}{" "}
                          - {dayjs(report.period.endDate).format("DD/MM/YYYY")}
                        </span>
                      </div>
                      <div className="flex items-center text-sm gap-2">
                        <span className="text-gray-500">
                          User: {report.generatedBy?.name || "Unknown User"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewModal(report)}
                        className="flex-1 flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(report)}
                        className="flex-1 flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Create Report Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Report
                </DialogTitle>
                <DialogDescription>
                  Generate a new report with specified criteria.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleCreateReport}
                className="space-y-4 p-6 pt-0"
              >
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Report Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleSelectChange("type", value)
                      }
                    >
                      <SelectItem value="">Select Type</SelectItem>
                      {reportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
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
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pdfFile">Upload PDF *</Label>
                    <Input
                      id="pdfFile"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Filters (Optional)</Label>
                  {filterFields.length > 0 && (
                    <div className="space-y-2">
                      {filterFields.map((field, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          {field.key === "machine" ? (
                            <Select
                              value={field.value}
                              onValueChange={(value) =>
                                handleFilterChange(index, "value", value)
                              }
                            >
                              <SelectItem value="">Select Machine</SelectItem>
                              {machines.map((machine) => (
                                <SelectItem
                                  key={machine._id}
                                  value={machine.name}
                                >
                                  {machine.name}
                                </SelectItem>
                              ))}
                            </Select>
                          ) : (
                            <Input
                              placeholder="Filter Key"
                              value={field.key}
                              onChange={(e) =>
                                handleFilterChange(index, "key", e.target.value)
                              }
                              className="flex-1"
                            />
                          )}
                          {field.key !== "machine" && (
                            <Input
                              placeholder="Filter Value"
                              value={field.value}
                              onChange={(e) =>
                                handleFilterChange(
                                  index,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFilterField(index)}
                            className="p-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addFilterField}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Filter
                  </Button>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full">
                    <Check className="mr-2 h-4 w-4" /> Create Report
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Report Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Report
                </DialogTitle>
                <DialogDescription>
                  Update report details for {selectedReport?.type}.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditReport} className="space-y-4 p-6 pt-0">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Report Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleSelectChange("type", value)
                      }
                    >
                      <SelectItem value="">Select Type</SelectItem>
                      {reportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
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
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pdfFile">Upload New PDF (Optional)</Label>
                    <Input
                      id="pdfFile"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Filters (Optional)</Label>
                  {filterFields.length > 0 && (
                    <div className="space-y-2">
                      {filterFields.map((field, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          {field.key === "machine" ? (
                            <Select
                              value={field.value}
                              onValueChange={(value) =>
                                handleFilterChange(index, "value", value)
                              }
                            >
                              <SelectItem value="">Select Machine</SelectItem>
                              {machines.map((machine) => (
                                <SelectItem
                                  key={machine._id}
                                  value={machine.name}
                                >
                                  {machine.name}
                                </SelectItem>
                              ))}
                            </Select>
                          ) : (
                            <Input
                              placeholder="Filter Key"
                              value={field.key}
                              onChange={(e) =>
                                handleFilterChange(index, "key", e.target.value)
                              }
                              className="flex-1"
                            />
                          )}
                          {field.key !== "machine" && (
                            <Input
                              placeholder="Filter Value"
                              value={field.value}
                              onChange={(e) =>
                                handleFilterChange(
                                  index,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFilterField(index)}
                            className="p-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addFilterField}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Filter
                  </Button>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full">
                    <Check className="mr-2 h-4 w-4" /> Update Report
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
                  <Eye className="h-5 w-5" />
                  Report Details
                </DialogTitle>
                <DialogDescription>
                  Complete information for {selectedReport?.type} Report
                </DialogDescription>
              </DialogHeader>
              {selectedReport && (
                <div className="p-6 pt-0 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      {selectedReport.type.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800">
                        {selectedReport.type} Report
                      </h3>
                      <p className="text-emerald-600">
                        {selectedReport.generatedBy?.name || "Unknown User"}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge
                          variant={getTypeBadgeVariant(selectedReport.type)}
                        >
                          {selectedReport.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Period</p>
                        <p className="font-medium">
                          {dayjs(selectedReport.period.startDate).format(
                            "DD/MM/YYYY"
                          )}{" "}
                          -{" "}
                          {dayjs(selectedReport.period.endDate).format(
                            "DD/MM/YYYY"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">File</p>
                        <p className="font-medium">
                          <a
                            href={`${process.env.REACT_APP_API_URL}${selectedReport.filePath}`}
                            className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Download ${selectedReport.name}`}
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-medium">
                          {dayjs(selectedReport.createdAt).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {Object.keys(selectedReport.filters).length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">
                        Filters Applied
                      </p>
                      <ul className="list-disc pl-4 text-sm font-medium">
                        {Object.entries(selectedReport.filters).map(
                          ([key, value]) => (
                            <li key={key}>{`${key}: ${value}`}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setIsViewModalOpen(false)}
                      className="w-full"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        openEditModal(selectedReport);
                      }}
                      className="w-full"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit Report
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
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  report.
                </DialogDescription>
              </DialogHeader>
              {selectedReport && (
                <div className="p-6 pt-0 space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800">
                      Are you sure you want to delete{" "}
                      <strong>{selectedReport.type} Report</strong>?
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      Period:{" "}
                      {dayjs(selectedReport.period.startDate).format(
                        "DD/MM/YYYY"
                      )}{" "}
                      -{" "}
                      {dayjs(selectedReport.period.endDate).format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteReport}
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Report
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
