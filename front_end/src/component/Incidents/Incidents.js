"use client"
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import dayjs from "dayjs"
import toast from "react-hot-toast"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import {
  AlertCircle,
  Calendar,
  FileText,
  Plus,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  Search,
  X,
  Shield,
  TrendingUp,
  BarChart3,
  Activity,
  Download,
} from "lucide-react"
import Layout from "../app/Layout"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default:
      "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-600 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    destructive:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  }
  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }
  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({ className = "", type = "text", id, ...props }) => (
  <input
    type={type}
    id={id}
    className={`flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
)

const Textarea = ({ className = "", id, ...props }) => (
  <textarea
    id={id}
    className={`flex min-h-[80px] w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 ${className}`}
    {...props}
  />
)

const Checkbox = ({ className = "", id, checked, onCheckedChange, ...props }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    className={`h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 ${className}`}
    {...props}
  />
)

const Label = ({ children, className = "", htmlFor, ...props }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 ${className}`} {...props}>
    {children}
  </label>
)

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-emerald-100 text-emerald-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 ${className}`}
    {...props}
  >
    {children}
  </div>
)

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>
    {children}
  </h3>
)

const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-label="Close dialog"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

const DialogHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
)

const DialogTitle = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-bold text-emerald-800 ${className}`} {...props}>
    {children}
  </h2>
)

const DialogDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
)

const DialogContent = ({ children, className = "", ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
)

const Select = ({ children, value, onValueChange, placeholder = "Select...", ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        {...props}
      >
        <span>{value || placeholder}</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value)
                setIsOpen(false)
              },
            }),
          )}
        </div>
      )}
    </div>
  )
}

const SelectItem = ({ children, value, onClick }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-emerald-50 cursor-pointer first:rounded-t-xl last:rounded-b-xl"
    onClick={onClick}
    role="option"
    aria-selected={false}
  >
    {children}
  </div>
)

const DropdownMenu = ({ children, open, onOpenChange }) => <div className="relative">{children}</div>

const DropdownMenuTrigger = ({ children, onClick }) => (
  <button onClick={onClick} aria-haspopup="true">
    {children}
  </button>
)

const DropdownMenuContent = ({ children, isOpen, className = "" }) => {
  if (!isOpen) return null
  return (
    <div
      className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10 ${className}`}
      role="menu"
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, onClick, className = "" }) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${className}`}
    onClick={onClick}
    role="menuitem"
  >
    {children}
  </button>
)

// Authentication Hook
const useAuth = () => {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "viewer")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast.error("Please log in to continue.")
          navigate("/login")
          return
        }
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserRole(response.data.data.role || "viewer")
        localStorage.setItem("userRole", response.data.data.role)
      } catch (error) {
        toast.error("Session expired. Please log in again.")
        localStorage.clear()
        navigate("/login")
      }
    }
    fetchUser()
  }, [navigate])

  const canPerform = (roles) => roles.includes(userRole)

  return { userRole, canPerform }
}

// Main Incidents Component
const Incidents = () => {
  const navigate = useNavigate()
  const { userRole, canPerform } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [filteredIncidents, setFilteredIncidents] = useState([])
  const [machines, setMachines] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterZone, setFilterZone] = useState("")
  const [filterNiveau, setFilterNiveau] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [formData, setFormData] = useState({
    incidentDateTime: "",
    zone: "",
    niveau: "",
    machineId: "",
    severityLevel: "",
    description: "",
    declarantId: localStorage.getItem("userId") || "",
    operationStopped: false,
    zoneSecured: false,
    injuries: false,
    injuryDetails: [],
    status: "Ouvert",
    attachments: null,
    correctiveActions: "",
  })
  const [formError, setFormError] = useState("")
  const [dashboardData, setDashboardData] = useState({
    daysWithoutIncident: 0,
    safetyRate: 0,
    hseCompliance: 0,
    mttr: 0,
  })

  const severityLevels = ["low", "medium", "high", "critical"]
  const severityDisplayMap = {
    low: "Faible",
    medium: "Moyen",
    high: "Élevé",
    critical: "Critique",
  }
  const statuses = ["Ouvert", "En cours", "Résolu", "Fermé"]
  const statusMap = {
    Ouvert: "open",
    "En cours": "in_progress",
    Résolu: "resolved",
    Fermé: "closed",
  }

  // Fetch data on mount
  useEffect(() => {
    fetchIncidents()
    fetchMachines()
    fetchUsers()
    fetchDashboardData()
  }, [])

  const fetchIncidents = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found. Please log in.")
      }
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/incidents`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch incidents")
      }
      setIncidents(response.data.data)
      setFilteredIncidents(response.data.data)
    } catch (error) {
      console.error("Error fetching incidents:", error)
      setError(error.message || "Failed to load incidents.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMachines = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/machines`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch machines")
      }
      setMachines(response.data.data)
    } catch (error) {
      console.error("Error fetching machines:", error)
      setError(error.message || "Failed to load machines.")
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch users")
      }
      setUsers(response.data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.message || "Failed to load users.")
    }
  }

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const [countResponse, incidentsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/incidents/count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/incidents`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const totalIncidents = countResponse.data.data.count
      const incidents = incidentsResponse.data.data

      const lastIncident = incidents
        .filter((i) => i.severityLevel !== "low")
        .sort((a, b) => new Date(b.incidentDateTime) - new Date(a.incidentDateTime))[0]
      const daysWithoutIncident = lastIncident
        ? dayjs().diff(dayjs(lastIncident.incidentDateTime), "day")
        : totalIncidents === 0
          ? 365
          : 0

      const resolvedIncidents = incidents.filter((i) => i.status === "Résolu")
      const mttr =
        resolvedIncidents.length > 0
          ? resolvedIncidents.reduce((sum, i) => sum + dayjs(i.updatedAt).diff(dayjs(i.createdAt), "hour", true), 0) /
            resolvedIncidents.length
          : 0

      const safetyRate = totalIncidents === 0 ? 100 : 100 - (totalIncidents / 100) * 10
      const hseCompliance = 95 // Static for demo

      setDashboardData({
        daysWithoutIncident,
        safetyRate: Math.max(0, safetyRate).toFixed(1),
        hseCompliance,
        mttr: mttr.toFixed(1),
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError(error.message || "Failed to load dashboard data.")
    }
  }

  // Filter incidents
  useEffect(() => {
    let filtered = incidents
    if (searchTerm) {
      filtered = filtered.filter(
        (incident) =>
          incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.niveau?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (filterSeverity) {
      filtered = filtered.filter((incident) => incident.severityLevel === filterSeverity)
    }
    if (filterStatus) {
      filtered = filtered.filter((incident) => incident.status === filterStatus)
    }
    if (filterZone) {
      filtered = filtered.filter((incident) => incident.zone === filterZone)
    }
    if (filterNiveau) {
      filtered = filtered.filter((incident) => incident.niveau === filterNiveau)
    }
    if (filterDate) {
      filtered = filtered.filter((incident) => dayjs(incident.incidentDateTime).isSame(dayjs(filterDate), "day"))
    }
    setFilteredIncidents(filtered)
  }, [searchTerm, filterSeverity, filterStatus, filterZone, filterNiveau, filterDate, incidents])

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }, [])

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      setFormError("Maximum 5 attachments allowed.")
      return
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setFormError("Each file must be under 5MB.")
      return
    }
    if (files.some((file) => !["image/jpeg", "image/png", "application/pdf"].includes(file.type))) {
      setFormError("Only JPEG, PNG, or PDF files are allowed.")
      return
    }
    setFormData((prev) => ({ ...prev, attachments: files }))
    setFormError("")
  }, [])

  const handleInjuryChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedInjuries = [...prev.injuryDetails]
      updatedInjuries[index] = { ...updatedInjuries[index], [field]: value }
      return { ...prev, injuryDetails: updatedInjuries }
    })
  }, [])

  const addInjuryField = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      injuryDetails: [...prev.injuryDetails, { name: "", type: "", time: "" }],
    }))
  }, [])

  const removeInjuryField = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      injuryDetails: prev.injuryDetails.filter((_, i) => i !== index),
    }))
  }, [])

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const resetForm = useCallback(() => {
    const userId = localStorage.getItem("userId")
    setFormData({
      incidentDateTime: "",
      zone: "",
      niveau: "",
      machineId: "",
      severityLevel: "",
      description: "",
      declarantId: userId || "",
      operationStopped: false,
      zoneSecured: false,
      injuries: false,
      injuryDetails: [],
      status: "Ouvert",
      attachments: null,
      correctiveActions: "",
    })
    setFormError("")
    setSelectedIncident(null)
  }, [])

  const validateForm = useCallback(() => {
    if (!formData.incidentDateTime || !dayjs(formData.incidentDateTime).isValid()) {
      setFormError("Valid incident date and time are required.")
      return false
    }
    if (!formData.severityLevel || !severityLevels.includes(formData.severityLevel)) {
      setFormError("Please select a valid severity level.")
      return false
    }
    if (!formData.status || !statuses.includes(formData.status)) {
      setFormError("Please select a valid status.")
      return false
    }
    if (!formData.description.trim()) {
      setFormError("Description is required.")
      return false
    }
    if (formData.injuries && formData.injuryDetails.length === 0) {
      setFormError("At least one injury detail is required if injuries are reported.")
      return false
    }
    if (
      formData.injuries &&
      formData.injuryDetails.some((injury) => !injury.name.trim() || !injury.type.trim() || !injury.time)
    ) {
      setFormError("All injury details must be complete.")
      return false
    }
    setFormError("")
    return true
  }, [formData])

  const handleCreateIncident = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!canPerform(["superadmin", "admin", "manager", "operator"])) {
      toast.error("You do not have permission to create incidents.")
      return
    }

    setFormLoading(true)
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")
      if (!token || !userId) {
        throw new Error("Authentication required. Please log in again.")
      }

      const formPayload = new FormData()
      formPayload.append("incidentDateTime", formData.incidentDateTime)
      formPayload.append("zone", formData.zone || "")
      formPayload.append("niveau", formData.niveau || "")
      formPayload.append("machine", formData.machineId || "")
      formPayload.append("severityLevel", formData.severityLevel)
      formPayload.append("description", formData.description)
      formPayload.append("declarant", userId)
      formPayload.append("operationStopped", formData.operationStopped)
      formPayload.append("zoneSecured", formData.zoneSecured)
      formPayload.append("injuries", formData.injuries)
      formPayload.append("status", statusMap[formData.status])
      formPayload.append("correctiveActions", formData.correctiveActions || "")
      formData.injuryDetails.forEach((injury, index) => {
        formPayload.append(`injuredNames[${index}]`, injury.name)
        formPayload.append(`injuryTypes[${index}]`, injury.type)
        formPayload.append(`injuryTimes[${index}]`, injury.time)
      })
      if (formData.attachments) {
        formData.attachments.forEach((file) => formPayload.append("attachments", file))
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/incidents`, formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create incident.")
      }

      setIncidents((prev) => [...prev, response.data.data])
      setIsCreateModalOpen(false)
      resetForm()
      toast.success("Incident reported successfully!")
    } catch (error) {
      console.error("Error creating incident:", error)
      setFormError(error.message || "Failed to create incident.")
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.")
        localStorage.clear()
        navigate("/login")
      }
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditIncident = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!canPerform(["superadmin", "admin", "manager", "operator"])) {
      toast.error("You do not have permission to edit incidents.")
      return
    }

    setFormLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required. Please log in again.")
      }

      const formPayload = new FormData()
      formPayload.append("incidentDateTime", formData.incidentDateTime)
      formPayload.append("zone", formData.zone || "")
      formPayload.append("niveau", formData.niveau || "")
      formPayload.append("machine", formData.machineId || "")
      formPayload.append("severityLevel", formData.severityLevel)
      formPayload.append("description", formData.description)
      formPayload.append("declarant", formData.declarantId)
      formPayload.append("operationStopped", formData.operationStopped)
      formPayload.append("zoneSecured", formData.zoneSecured)
      formPayload.append("injuries", formData.injuries)
      formPayload.append("status", statusMap[formData.status])
      formPayload.append("correctiveActions", formData.correctiveActions || "")
      formData.injuryDetails.forEach((injury, index) => {
        formPayload.append(`injuredNames[${index}]`, injury.name)
        formPayload.append(`injuryTypes[${index}]`, injury.type)
        formPayload.append(`injuryTimes[${index}]`, injury.time)
      })
      if (formData.attachments) {
        formData.attachments.forEach((file) => formPayload.append("attachments", file))
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/incidents/${selectedIncident._id}`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update incident.")
      }

      setIncidents((prev) =>
        prev.map((incident) => (incident._id === response.data.data._id ? response.data.data : incident)),
      )
      setIsEditModalOpen(false)
      resetForm()
      toast.success("Incident updated successfully!")
    } catch (error) {
      console.error("Error updating incident:", error)
      setFormError(error.message || "Failed to update incident.")
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.")
        localStorage.clear()
        navigate("/login")
      }
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteIncident = async () => {
    if (!canPerform(["superadmin", "admin", "manager"])) {
      toast.error("You do not have permission to delete incidents.")
      return
    }

    setFormLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required. Please log in again.")
      }

      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/incidents/${selectedIncident._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete incident.")
      }

      setIncidents((prev) => prev.filter((incident) => incident._id !== selectedIncident._id))
      setIsDeleteModalOpen(false)
      setSelectedIncident(null)
      toast.success("Incident deleted successfully!")
    } catch (error) {
      console.error("Error deleting incident:", error)
      setFormError(error.message || "Failed to delete incident.")
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.")
        localStorage.clear()
        navigate("/login")
      }
    } finally {
      setFormLoading(false)
    }
  }

  const openViewModal = useCallback((incident) => {
    setSelectedIncident(incident)
    setIsViewModalOpen(true)
    setDropdownOpen(null)
  }, [])

  const openEditModal = useCallback((incident) => {
    setSelectedIncident(incident)
    setFormData({
      incidentDateTime: dayjs(incident.incidentDateTime).format("YYYY-MM-DDTHH:mm"),
      zone: incident.zone || "",
      niveau: incident.niveau || "",
      machineId: incident.machine?._id || "",
      severityLevel: incident.severityLevel || "",
      description: incident.description || "",
      declarantId: incident.declarant?._id || localStorage.getItem("userId"),
      operationStopped: incident.operationStopped,
      zoneSecured: incident.zoneSecured,
      injuries: incident.injuries,
      injuryDetails:
        incident.injuredNames?.map((name, index) => ({
          name,
          type: incident.injuryTypes?.[index] || "",
          time: incident.injuryTimes?.[index] ? dayjs(incident.injuryTimes[index]).format("YYYY-MM-DDTHH:mm") : "",
        })) || [],
      status: incident.status || "",
      attachments: null,
      correctiveActions: incident.correctiveActions || "",
    })
    setIsEditModalOpen(true)
    setDropdownOpen(null)
  }, [])

  const openDeleteModal = useCallback((incident) => {
    setSelectedIncident(incident)
    setIsDeleteModalOpen(true)
    setDropdownOpen(null)
  }, [])

  const getSeverityBadgeVariant = (severity) => {
    switch (severity) {
      case "low":
        return "success"
      case "medium":
        return "warning"
      case "high":
      case "critical":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Export to PDF function
  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Title
      doc.setFontSize(20)
      doc.text("Rapport des Incidents", 20, 20)

      // Date
      doc.setFontSize(12)
      doc.text(`Généré le: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 20, 30)

      // Summary
      doc.text(`Total des incidents: ${incidents.length}`, 20, 45)
      doc.text(`Incidents critiques: ${incidents.filter((i) => i.severityLevel === "critical").length}`, 20, 55)
      doc.text(`Incidents résolus: ${incidents.filter((i) => i.status === "Résolu").length}`, 20, 65)

      // Table headers
      const headers = ["Date", "Zone", "Sévérité", "Statut", "Description"]
      let yPosition = 85

      doc.setFontSize(10)
      headers.forEach((header, index) => {
        doc.text(header, 20 + index * 35, yPosition)
      })

      yPosition += 10

      // Table data
      filteredIncidents.forEach((incident, index) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }

        const row = [
          dayjs(incident.incidentDateTime).format("DD/MM/YY"),
          incident.zone || "N/A",
          severityDisplayMap[incident.severityLevel] || incident.severityLevel,
          incident.status,
          incident.description?.substring(0, 30) + "..." || "N/A",
        ]

        row.forEach((cell, cellIndex) => {
          doc.text(cell, 20 + cellIndex * 35, yPosition)
        })

        yPosition += 8
      })

      doc.save("rapport-incidents.pdf")
      toast.success("Rapport exporté avec succès!")
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast.error("Erreur lors de l'export PDF")
    }
  }

  // Severity Chart Data
  const severityCounts = useMemo(
    () =>
      severityLevels.reduce((acc, level) => {
        acc[level] = incidents.filter((i) => i.severityLevel === level).length
        return acc
      }, {}),
    [incidents],
  )

  const severityChart = {
    labels: severityLevels.map((level) => severityDisplayMap[level]),
    datasets: [
      {
        label: "Incidents par Sévérité",
        data: severityLevels.map((level) => severityCounts[level] || 0),
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)", // Green for Faible
          "rgba(245, 158, 11, 0.8)", // Yellow for Moyen
          "rgba(239, 68, 68, 0.8)", // Red for Élevé
          "rgba(185, 28, 28, 0.8)", // Dark Red for Critique
        ],
        borderColor: ["rgba(16, 185, 129, 1)", "rgba(245, 158, 11, 1)", "rgba(239, 68, 68, 1)", "rgba(185, 28, 28, 1)"],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      title: {
        display: true,
        text: "Distribution des Incidents par Niveau de Sévérité",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
        color: "#1f2937",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y} incidents`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#6b7280",
        },
        title: {
          display: true,
          text: "Niveau de Sévérité",
          font: {
            size: 14,
            weight: "600",
          },
          color: "#374151",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#6b7280",
          callback: (value) => value + " incidents",
        },
        title: {
          display: true,
          text: "Nombre d'Incidents",
          font: {
            size: 14,
            weight: "600",
          },
          color: "#374151",
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const,
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  }

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
    )
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
                  <Shield className="h-8 w-8" />
                  <h1 className="text-3xl sm:text-4xl font-bold">Gestion des Incidents</h1>
                </div>
                <p className="text-emerald-100 text-lg">Signaler et suivre les incidents de sécurité</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{incidents.length}</div>
                  <div className="text-sm text-emerald-100">Total Incidents</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{dashboardData.daysWithoutIncident}</div>
                  <div className="text-sm text-emerald-100">Jours sans incident</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Chart Section */}
          <Card className="shadow-xl border-0">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl">Tableau de Bord des Incidents</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportToPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter PDF
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Activity className="h-4 w-4" />
                    <span>Données en temps réel</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="w-full">
                <div className="h-80 sm:h-96 lg:h-[28rem] mb-8">
                  <Bar data={severityChart} options={chartOptions} />
                </div>

                {/* Enhanced Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
                      <div className="text-2xl font-bold text-emerald-600">{incidents.length}</div>
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Total Incidents</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                    <div className="flex items-center justify-center mb-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      <div className="text-2xl font-bold text-yellow-600">
                        {(severityCounts.high || 0) + (severityCounts.critical || 0)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Haute Sévérité</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-center mb-2">
                      <div className="h-5 w-5 bg-green-500 rounded-full mr-2"></div>
                      <div className="text-2xl font-bold text-green-600">
                        {incidents.filter((i) => i.status === "Résolu").length}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Résolus</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-center mb-2">
                      <div className="h-5 w-5 bg-blue-500 rounded-full mr-2"></div>
                      <div className="text-2xl font-bold text-blue-600">
                        {incidents.filter((i) => i.status === "Ouvert").length}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">Ouverts</div>
                  </div>
                </div>

                {/* Chart Data Summary Table */}
                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Répartition par Sévérité</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {severityLevels.map((level, index) => (
                      <div key={level} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{severityDisplayMap[level]}</p>
                            <p className="text-xl font-bold text-gray-900">{severityCounts[level] || 0}</p>
                          </div>
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: severityChart.datasets[0].backgroundColor[index],
                            }}
                          ></div>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-gray-500">
                            {incidents.length > 0
                              ? `${(((severityCounts[level] || 0) / incidents.length) * 100).toFixed(1)}%`
                              : "0%"}{" "}
                            du total
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Rapports d'Incidents</CardTitle>
                {canPerform(["superadmin", "admin", "manager", "operator"]) && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Signaler un Incident
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher des incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity} placeholder="Sévérité">
                  <SelectItem value="">Toutes Sévérités</SelectItem>
                  {severityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {severityDisplayMap[level]}
                    </SelectItem>
                  ))}
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus} placeholder="Statut">
                  <SelectItem value="">Tous Statuts</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  type="text"
                  placeholder="Zone"
                  value={filterZone}
                  onChange={(e) => setFilterZone(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Niveau"
                  value={filterNiveau}
                  onChange={(e) => setFilterNiveau(e.target.value)}
                />
                <Input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>

              {/* Incidents Table */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Chargement des incidents...</div>
                </div>
              ) : filteredIncidents.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Aucun incident trouvé</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date/Heure</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Zone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Sévérité</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncidents.map((incident) => (
                        <tr key={incident._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {dayjs(incident.incidentDateTime).format("MMM DD, YYYY HH:mm")}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm">{incident.zone || "N/A"}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getSeverityBadgeVariant(incident.severityLevel)}>
                              {severityDisplayMap[incident.severityLevel] || incident.severityLevel}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={incident.status === "Résolu" ? "success" : "secondary"}>
                              {incident.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm line-clamp-2">
                              {incident.description?.substring(0, 100)}
                              {incident.description?.length > 100 && "..."}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                onClick={() => setDropdownOpen(dropdownOpen === incident._id ? null : incident._id)}
                              >
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent isOpen={dropdownOpen === incident._id}>
                                <DropdownMenuItem onClick={() => openViewModal(incident)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </DropdownMenuItem>
                                {canPerform(["superadmin", "admin", "manager", "operator"]) && (
                                  <DropdownMenuItem onClick={() => openEditModal(incident)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                  </DropdownMenuItem>
                                )}
                                {canPerform(["superadmin", "admin", "manager"]) && (
                                  <DropdownMenuItem onClick={() => openDeleteModal(incident)} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Incident Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Signaler un Nouvel Incident</DialogTitle>
              <DialogDescription>
                Remplissez le formulaire ci-dessous pour signaler un nouvel incident de sécurité.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateIncident} className="space-y-4 p-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm">{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incidentDateTime">Date & Heure de l'Incident *</Label>
                  <Input
                    type="datetime-local"
                    id="incidentDateTime"
                    name="incidentDateTime"
                    value={formData.incidentDateTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="severityLevel">Niveau de Sévérité *</Label>
                  <Select
                    value={formData.severityLevel}
                    onValueChange={(value) => handleSelectChange("severityLevel", value)}
                  >
                    <SelectItem value="default">Sélectionner Sévérité</SelectItem>
                    {severityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {severityDisplayMap[level]}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    placeholder="Entrer la zone"
                  />
                </div>
                <div>
                  <Label htmlFor="niveau">Niveau</Label>
                  <Input
                    id="niveau"
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleInputChange}
                    placeholder="Entrer le niveau"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="machineId">Machine</Label>
                  <Select value={formData.machineId} onValueChange={(value) => handleSelectChange("machineId", value)}>
                    <SelectItem value="default">Sélectionner Machine</SelectItem>
                    {machines.map((machine) => (
                      <SelectItem key={machine._id} value={machine._id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Statut *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectItem value="default">Sélectionner Statut</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrire l'incident en détail..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="operationStopped"
                    checked={formData.operationStopped}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, operationStopped: checked }))}
                  />
                  <Label htmlFor="operationStopped">Opération Arrêtée</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="zoneSecured"
                    checked={formData.zoneSecured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, zoneSecured: checked }))}
                  />
                  <Label htmlFor="zoneSecured">Zone Sécurisée</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="injuries"
                    checked={formData.injuries}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, injuries: checked }))}
                  />
                  <Label htmlFor="injuries">Blessures Signalées</Label>
                </div>
              </div>

              {formData.injuries && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Détails des Blessures</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addInjuryField}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter Blessure
                    </Button>
                  </div>
                  {formData.injuryDetails.map((injury, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
                      <Input
                        placeholder="Nom"
                        value={injury.name}
                        onChange={(e) => handleInjuryChange(index, "name", e.target.value)}
                      />
                      <Input
                        placeholder="Type de Blessure"
                        value={injury.type}
                        onChange={(e) => handleInjuryChange(index, "type", e.target.value)}
                      />
                      <Input
                        type="datetime-local"
                        value={injury.time}
                        onChange={(e) => handleInjuryChange(index, "time", e.target.value)}
                      />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeInjuryField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label htmlFor="correctiveActions">Actions Correctives</Label>
                <Textarea
                  id="correctiveActions"
                  name="correctiveActions"
                  value={formData.correctiveActions}
                  onChange={handleInputChange}
                  placeholder="Décrire les actions correctives prises..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="attachments">Pièces Jointes (Max 5 fichiers, 5MB chacun)</Label>
                <Input
                  type="file"
                  id="attachments"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Signalement..." : "Signaler l'Incident"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Incident Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'Incident</DialogTitle>
              <DialogDescription>Mettre à jour les détails de l'incident ci-dessous.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditIncident} className="space-y-4 p-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm">{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="incidentDateTime">Date & Heure de l'Incident *</Label>
                  <Input
                    type="datetime-local"
                    id="incidentDateTime"
                    name="incidentDateTime"
                    value={formData.incidentDateTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="severityLevel">Niveau de Sévérité *</Label>
                  <Select
                    value={formData.severityLevel}
                    onValueChange={(value) => handleSelectChange("severityLevel", value)}
                  >
                    <SelectItem value="default">Sélectionner Sévérité</SelectItem>
                    {severityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {severityDisplayMap[level]}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    placeholder="Entrer la zone"
                  />
                </div>
                <div>
                  <Label htmlFor="niveau">Niveau</Label>
                  <Input
                    id="niveau"
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleInputChange}
                    placeholder="Entrer le niveau"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="machineId">Machine</Label>
                  <Select value={formData.machineId} onValueChange={(value) => handleSelectChange("machineId", value)}>
                    <SelectItem value="default">Sélectionner Machine</SelectItem>
                    {machines.map((machine) => (
                      <SelectItem key={machine._id} value={machine._id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Statut *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectItem value="default">Sélectionner Statut</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrire l'incident en détail..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="operationStopped"
                    checked={formData.operationStopped}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, operationStopped: checked }))}
                  />
                  <Label htmlFor="operationStopped">Opération Arrêtée</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="zoneSecured"
                    checked={formData.zoneSecured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, zoneSecured: checked }))}
                  />
                  <Label htmlFor="zoneSecured">Zone Sécurisée</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="injuries"
                    checked={formData.injuries}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, injuries: checked }))}
                  />
                  <Label htmlFor="injuries">Blessures Signalées</Label>
                </div>
              </div>

              {formData.injuries && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Détails des Blessures</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addInjuryField}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter Blessure
                    </Button>
                  </div>
                  {formData.injuryDetails.map((injury, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
                      <Input
                        placeholder="Nom"
                        value={injury.name}
                        onChange={(e) => handleInjuryChange(index, "name", e.target.value)}
                      />
                      <Input
                        placeholder="Type de Blessure"
                        value={injury.type}
                        onChange={(e) => handleInjuryChange(index, "type", e.target.value)}
                      />
                      <Input
                        type="datetime-local"
                        value={injury.time}
                        onChange={(e) => handleInjuryChange(index, "time", e.target.value)}
                      />
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeInjuryField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label htmlFor="correctiveActions">Actions Correctives</Label>
                <Textarea
                  id="correctiveActions"
                  name="correctiveActions"
                  value={formData.correctiveActions}
                  onChange={handleInputChange}
                  placeholder="Décrire les actions correctives prises..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="attachments">Pièces Jointes Supplémentaires (Max 5 fichiers, 5MB chacun)</Label>
                <Input
                  type="file"
                  id="attachments"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Mise à jour..." : "Mettre à jour l'Incident"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Incident Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Détails de l'Incident</DialogTitle>
              <DialogDescription>Voir les informations complètes de l'incident.</DialogDescription>
            </DialogHeader>
            {selectedIncident && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Date & Heure</Label>
                    <p className="text-sm text-gray-600">
                      {dayjs(selectedIncident.incidentDateTime).format("MMMM DD, YYYY HH:mm")}
                    </p>
                  </div>
                  <div>
                    <Label>Niveau de Sévérité</Label>
                    <div className="mt-1">
                      <Badge variant={getSeverityBadgeVariant(selectedIncident.severityLevel)}>
                        {severityDisplayMap[selectedIncident.severityLevel] || selectedIncident.severityLevel}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Zone</Label>
                    <p className="text-sm text-gray-600">{selectedIncident.zone || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Niveau</Label>
                    <p className="text-sm text-gray-600">{selectedIncident.niveau || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Machine</Label>
                    <p className="text-sm text-gray-600">{selectedIncident.machine?.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Statut</Label>
                    <div className="mt-1">
                      <Badge variant={selectedIncident.status === "Résolu" ? "success" : "secondary"}>
                        {selectedIncident.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedIncident.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Opération Arrêtée</Label>
                    <p className="text-sm text-gray-600">{selectedIncident.operationStopped ? "Oui" : "Non"}</p>
                  </div>
                  <div>
                    <Label>Zone Sécurisée</Label>
                    <p className="text-sm text-gray-600">{selectedIncident.zoneSecured ? "Oui" : "Non"}</p>
                  </div>
                  <div>
                    <Label>Blessures Signalées</Label>
                    <p className="text-sm text-gray-600">{selectedIncident.injuries ? "Oui" : "Non"}</p>
                  </div>
                </div>

                {selectedIncident.injuries && selectedIncident.injuredNames?.length > 0 && (
                  <div>
                    <Label>Détails des Blessures</Label>
                    <div className="mt-2 space-y-2">
                      {selectedIncident.injuredNames.map((name, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-sm text-gray-600">
                            Type: {selectedIncident.injuryTypes?.[index] || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Heure:{" "}
                            {selectedIncident.injuryTimes?.[index]
                              ? dayjs(selectedIncident.injuryTimes[index]).format("MMMM DD, YYYY HH:mm")
                              : "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedIncident.correctiveActions && (
                  <div>
                    <Label>Actions Correctives</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedIncident.correctiveActions}</p>
                  </div>
                )}

                <div>
                  <Label>Signalé Par</Label>
                  <p className="text-sm text-gray-600">{selectedIncident.declarant?.name || "Inconnu"}</p>
                </div>

                <div>
                  <Label>Créé</Label>
                  <p className="text-sm text-gray-600">
                    {dayjs(selectedIncident.createdAt).format("MMMM DD, YYYY HH:mm")}
                  </p>
                </div>

                {selectedIncident.attachments?.length > 0 && (
                  <div>
                    <Label>Pièces Jointes</Label>
                    <div className="mt-2 space-y-2">
                      {selectedIncident.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <a
                            href={`${process.env.REACT_APP_API_URL}${attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-600 hover:underline"
                          >
                            {attachment.split("/").pop()}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setIsViewModalOpen(false)}>Fermer</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer l'Incident</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cet incident ? Cette action ne peut pas être annulée.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              {selectedIncident && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium">
                    {dayjs(selectedIncident.incidentDateTime).format("MMMM DD, YYYY HH:mm")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedIncident.description?.substring(0, 100)}
                    {selectedIncident.description?.length > 100 && "..."}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDeleteIncident} disabled={formLoading}>
                  {formLoading ? "Suppression..." : "Supprimer l'Incident"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

export default Incidents
