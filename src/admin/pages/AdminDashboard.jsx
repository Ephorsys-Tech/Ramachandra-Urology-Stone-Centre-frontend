import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Users, UserCheck, Activity, ArrowUpRight, TrendingUp, TrendingDown, Clock, Bell, Building, Image, Trash2, Check } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import toast from "react-hot-toast";

import { fetchAllPatients, updatePatientById, deletePatientById } from "../../redux/features/patient/patientThunk";
import { fetchAllDoctors } from "../../redux/features/doctor/doctorThunk";
import { fetchAllDepartments } from "../../redux/features/department/departmentThunk";
import { fetchAllGalleries } from "../../redux/features/gallery/galleryThunk";
import { fetchAllAppointmentRequests } from "../../redux/features/appointmentRequest/appointmentRequestThunk";

// Baseline Mock chart data (merged with real data if present)
const DEFAULT_MONTHLY_VISITS = [
  { name: "Jan", Admissions: 45, Outpatients: 120 },
  { name: "Feb", Admissions: 52, Outpatients: 135 },
  { name: "Mar", Admissions: 49, Outpatients: 140 },
  { name: "Apr", Admissions: 63, Outpatients: 165 },
  { name: "May", Admissions: 58, Outpatients: 180 },
  { name: "Jun", Admissions: 75, Outpatients: 210 },
  { name: "Jul", Admissions: 80, Outpatients: 220 },
];

const DEFAULT_WEEKLY_APPOINTMENTS = [
  { day: "Mon", Scheduled: 25, Attended: 22 },
  { day: "Tue", Scheduled: 34, Attended: 30 },
  { day: "Wed", Scheduled: 40, Attended: 38 },
  { day: "Thu", Scheduled: 28, Attended: 25 },
  { day: "Fri", Scheduled: 45, Attended: 42 },
  { day: "Sat", Scheduled: 18, Attended: 15 },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const isToday = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const today = new Date();
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
  };

  const handleCheckIn = async (patient) => {
    try {
      const result = await dispatch(updatePatientById({
        id: patient._id,
        patientData: {
          appointmentDate: null,
          appointmentTime: null,
          status: "In Treatment"
        }
      }));
      if (updatePatientById.fulfilled.match(result)) {
        toast.success("Patient checked in successfully!");
      } else {
        toast.error(result.payload || "Failed to check in");
      }
    } catch (error) {
      toast.error(error || "An error occurred");
    }
  };

  const handleRescheduleTomorrow = async (patient) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    try {
      const result = await dispatch(updatePatientById({
        id: patient._id,
        patientData: {
          appointmentDate: dateStr
        }
      }));
      if (updatePatientById.fulfilled.match(result)) {
        toast.success(`Rescheduled to tomorrow (${tomorrow.toLocaleDateString()})`);
      } else {
        toast.error(result.payload || "Failed to reschedule");
      }
    } catch (error) {
      toast.error(error || "An error occurred");
    }
  };

  const handleDeletePatient = async (patient) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.name}'s records?`)) {
      try {
        const result = await dispatch(deletePatientById(patient._id));
        if (deletePatientById.fulfilled.match(result)) {
          toast.success("Patient records deleted");
        } else {
          toast.error(result.payload || "Failed to delete patient");
        }
      } catch (error) {
        toast.error(error || "An error occurred");
      }
    }
  };

  const { patients, totalPatients } = useSelector((state) => state.patient);
  const { doctors, pagination } = useSelector((state) => state.doctor);
  const { departments } = useSelector((state) => state.department);
  const { galleries, total: galleryTotal } = useSelector((state) => state.gallery);
  const { requests } = useSelector((state) => state.appointmentRequest);

  useEffect(() => {
    if (patients.length === 0) {
      dispatch(fetchAllPatients());
    }
    if (doctors.length === 0) {
      dispatch(fetchAllDoctors());
    }
    if (departments.length === 0) {
      dispatch(fetchAllDepartments());
    }
    if (galleries.length === 0) {
      dispatch(fetchAllGalleries());
    }
    if (requests.length === 0) {
      dispatch(fetchAllAppointmentRequests());
    }
  }, [dispatch, patients.length, doctors.length, departments.length, galleries.length, requests.length]);

  // ----------------------------------------------------
  // Dynamic Chart 1: Monthly Admissions vs Outpatients
  // ----------------------------------------------------
  let displayMonthlyVisits = DEFAULT_MONTHLY_VISITS;
  if (patients && patients.length > 0) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyDataMap = {};
    const currentMonthIdx = new Date().getMonth();
    // last 6 months
    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      monthlyDataMap[months[idx]] = { Admissions: 0, Outpatients: 0 };
    }

    patients.forEach(p => {
      const pDate = new Date(p.createdAt);
      const pMonth = months[pDate.getMonth()];
      if (monthlyDataMap[pMonth]) {
        if (p.status === "Admitted") {
          monthlyDataMap[pMonth].Admissions += 1;
        } else {
          monthlyDataMap[pMonth].Outpatients += 1;
        }
      }
    });

    displayMonthlyVisits = Object.keys(monthlyDataMap).map(name => ({
      name,
      Admissions: monthlyDataMap[name].Admissions,
      Outpatients: monthlyDataMap[name].Outpatients
    }));
  }

  // ----------------------------------------------------
  // Dynamic Chart 2: Weekly Scheduled vs Attended Requests
  // ----------------------------------------------------
  let displayWeeklyAppointments = DEFAULT_WEEKLY_APPOINTMENTS;
  if (requests && requests.length > 0) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyDataMap = {
      "Mon": { Scheduled: 0, Attended: 0 },
      "Tue": { Scheduled: 0, Attended: 0 },
      "Wed": { Scheduled: 0, Attended: 0 },
      "Thu": { Scheduled: 0, Attended: 0 },
      "Fri": { Scheduled: 0, Attended: 0 },
      "Sat": { Scheduled: 0, Attended: 0 },
    };

    requests.forEach(r => {
      const dateStr = r.preferredDate || r.createdAt;
      if (dateStr) {
        const rDate = new Date(dateStr);
        const rDay = days[rDate.getDay()];
        if (weeklyDataMap[rDay]) {
          weeklyDataMap[rDay].Scheduled += 1;
          if (r.status === "Accepted") {
            weeklyDataMap[rDay].Attended += 1;
          }
        }
      }
    });

    displayWeeklyAppointments = Object.keys(weeklyDataMap).map(day => ({
      day,
      Scheduled: weeklyDataMap[day].Scheduled,
      Attended: weeklyDataMap[day].Attended
    }));
  }

  // ----------------------------------------------------
  // Dynamic Activities Feed
  // ----------------------------------------------------
  let displayActivities = [];
  const computedActivities = [];

  patients.forEach(p => {
    computedActivities.push({
      id: `p-${p._id}`,
      text: `Patient ${p.name} registered (${p.source || 'Organic'})`,
      time: new Date(p.createdAt),
      type: "patient"
    });
  });

  requests.forEach(r => {
    computedActivities.push({
      id: `r-${r._id}`,
      text: `Appointment request from ${r.name} is ${r.status}`,
      time: new Date(r.createdAt),
      type: "request"
    });
  });

  doctors.forEach(d => {
    computedActivities.push({
      id: `d-${d._id}`,
      text: `Dr. ${d.name} registered in ${d.specialization}`,
      time: new Date(d.createdAt),
      type: "doctor"
    });
  });

  departments.forEach(dept => {
    computedActivities.push({
      id: `dept-${dept._id}`,
      text: `Department ${dept.name} initialized`,
      time: new Date(dept.createdAt),
      type: "department"
    });
  });

  if (computedActivities.length > 0) {
    displayActivities = computedActivities
      .sort((a, b) => b.time - a.time)
      .slice(0, 5)
      .map(act => {
        const diffMs = new Date() - act.time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        let timeStr = "Just now";
        if (diffMins > 0 && diffMins < 60) {
          timeStr = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0 && diffHours < 24) {
          timeStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays > 0) {
          timeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }

        return {
          id: act.id,
          text: act.text,
          time: timeStr,
          type: act.type
        };
      });
  }

  // ----------------------------------------------------
  // Dynamic Reminders & Alerts
  // ----------------------------------------------------
  const pendingRequests = (requests || []).filter(r => r.status === "Pending");
  const emergencyDepts = (departments || []).filter(d => d.emergencyAvailable);

  const displayAlerts = [];
  if (pendingRequests.length > 0) {
    displayAlerts.push({
      id: "alert-req",
      text: `You have ${pendingRequests.length} pending appointment requests awaiting review.`,
      color: "bg-amber-500/10 border-amber-500/20 text-amber-800",
      boldText: "Pending Requests:"
    });
  } else {
    displayAlerts.push({
      id: "alert-req-none",
      text: "All appointment requests have been processed.",
      color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-800",
      boldText: "Appointments:"
    });
  }

  if (emergencyDepts.length > 0) {
    displayAlerts.push({
      id: "alert-emerg",
      text: `Emergency services are available in ${emergencyDepts.length} departments.`,
      color: "bg-blue-500/10 border-blue-500/20 text-blue-800",
      boldText: "Emergency:"
    });
  } else {
    displayAlerts.push({
      id: "alert-emerg-none",
      text: "No active emergency departments at the moment.",
      color: "bg-slate-500/10 border-slate-500/20 text-slate-800",
      boldText: "Emergency:"
    });
  }

  const STATS = [
    { label: "Total Patients", value: totalPatients || patients?.length || 0, icon: Users, change: "+12.5%", isPositive: true, color: "bg-blue-500/10 text-blue-500" },
    { label: "Active Doctors", value: pagination?.total || doctors?.length || 0, icon: UserCheck, change: "+3.2%", isPositive: true, color: "bg-teal-500/10 text-teal-500" },
    { label: "Departments", value: departments?.length || 0, icon: Building, change: "Stable", isPositive: true, color: "bg-indigo-500/10 text-indigo-500" },
    { label: "Gallery Photos", value: galleryTotal || galleries?.length || 0, icon: Image, change: "Stable", isPositive: true, color: "bg-pink-500/10 text-pink-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-gray-50"
    >
      {/* Header */}  
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
          <p className="text-sm text-slate-500">Real-time monitoring and hospital operations performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 font-medium">
          <Clock size={16} className="text-slate-400" />
          <span>Last Sync: Just now</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                <div className="flex items-center gap-1">
                  {stat.isPositive ? (
                    <TrendingUp size={14} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={14} className="text-rose-500" />
                  )}
                  <span className={`text-xs font-semibold ${stat.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                    {stat.change}
                  </span>
                  <span className="text-[10px] text-slate-400">vs last month</span>
                </div>
              </div>
              <div className={`p-3.5 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Flow Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-96"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-800">Monthly Patient Analytics</h4>
              <p className="text-xs text-slate-400">Comparison of Admissions and Outpatients visits.</p>
            </div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-0.5">
              Full Report <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayMonthlyVisits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutpatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="Admissions" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAdmissions)" />
                <Area type="monotone" dataKey="Outpatients" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorOutpatients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Appointments Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-96"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-800">Weekly Appointments</h4>
              <p className="text-xs text-slate-400">Weekly appointments scheduled vs attended.</p>
            </div>
          </div>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayWeeklyAppointments} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend iconSize={10} verticalAlign="top" height={36} />
                <Bar dataKey="Scheduled" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Attended" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
       </div>

      {/* Today's Appointments Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-blue-500" size={18} />
              Today's Scheduled Appointments
            </h4>
            <p className="text-xs text-slate-400">Patients scheduled to visit today with their respective doctors.</p>
          </div>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100/60">
            {patients.filter(p => isToday(p.appointmentDate)).length} Appointments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/85 text-xs font-bold text-slate-450 uppercase tracking-wider">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Scheduled Time</th>
                <th className="px-5 py-3">Doctor & Department</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-650">
              {patients.filter(p => isToday(p.appointmentDate)).length > 0 ? (
                patients.filter(p => isToday(p.appointmentDate)).map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50/70 transition-all">
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      <div>{patient.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{patient.age} Yrs / {patient.gender}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-500 font-mono">{patient.phone}</td>
                    <td className="px-5 py-3 font-semibold text-blue-600">
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={12} className="text-blue-500" />
                        {patient.appointmentTime || "Not Specified"}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-700">Dr. {patient.doctor?.name || "Unassigned"}</div>
                      <div className="text-[10px] text-slate-400">{patient.department?.name || "No Dept"}</div>
                    </td>
                    <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCheckIn(patient)}
                          className="px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 rounded text-[10px] font-semibold cursor-pointer transition flex items-center gap-0.5"
                          title="Mark Checked-in"
                        >
                          <Check size={11} /> Check-in
                        </button>
                        <button
                          onClick={() => handleRescheduleTomorrow(patient)}
                          className="px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 rounded text-[10px] font-semibold cursor-pointer transition"
                          title="Reschedule to Tomorrow"
                        >
                          Tomorrow
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient)}
                          className="p-1 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded transition cursor-pointer"
                          title="Delete Patient"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-slate-400 font-medium bg-slate-50/30">
                    No appointments scheduled for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bottom Section: Recent Activity & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" />
              Recent Activity Log
            </h4>
            <span className="px-2.5 py-1 bg-slate-100 rounded-full text-slate-500 font-semibold text-[11px]">Real-time</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {displayActivities.length > 0 ? (
              displayActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p className="text-slate-600 leading-tight">{act.text}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">{act.time}</span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400">
                No recent activity recorded.
              </div>
            )}
          </div>
        </motion.div>

        {/* Reminders/Alerts card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Bell size={18} className="text-amber-500" />
              Urgent Notifications
            </h4>
            <div className="space-y-3.5">
              {displayAlerts.map((alert) => (
                <div key={alert.id} className={`p-3.5 rounded-xl border ${alert.color} text-xs leading-relaxed`}>
                  <span className="font-bold">{alert.boldText}</span> {alert.text}
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-medium text-xs rounded-xl transition-all text-center cursor-pointer">
            Manage Alerts
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
