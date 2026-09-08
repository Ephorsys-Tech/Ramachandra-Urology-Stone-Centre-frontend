import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById as fetchDoctorThunk, fetchAllDoctorsPublic } from '../redux/features/doctor/doctorThunk';
import { getDoctorSlug } from '../Helper/slugify';
import { submitAppointmentRequest } from '../redux/features/appointmentRequest/appointmentRequestThunk';
import { sendMessage } from '../redux/features/message/messageThunk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Phone,
  Share2,
  Globe,
  X,
  Calendar,
  User,
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

// Helper function to parse doctor's availability timing
const parseAvailabilityTiming = (timingStr) => {
  if (!timingStr) return { days: [], timeRange: null };
  
  // Example: "10:00 - 13:00 • Mon, Wed & Fri" or "14:00 - 16:00 • Mon, Fri & Sat"
  const parts = timingStr.split("•").map(p => p.trim());
  const timeRange = parts[0]; // "10:00 - 13:00" or "14:00 - 16:00"
  const dayPart = parts[1] || ""; // "Mon, Fri & Sat"
  
  // Parse days
  const dayMap = { "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6, "Sun": 0 };
  const availableDays = [];
  const dayStrings = dayPart.replace(/&/g, ",").split(",").map(d => d.trim());
  
  dayStrings.forEach(dayStr => {
    if (Object.prototype.hasOwnProperty.call(dayMap, dayStr)) {
      availableDays.push(dayMap[dayStr]);
    }
  });
  
  return { 
    days: availableDays.length > 0 ? availableDays : [0, 1, 2, 3, 4, 5, 6], // Default to all days
    timeRange: timeRange || "09:00 - 18:00"
  };
};

// Helper function to generate time slots from a time range
const generateTimeSlots = (timeRange) => {
  if (!timeRange) return TIME_SLOTS;
  
  // Parse "10:00 - 13:00" format
  const [startStr, endStr] = timeRange.split("-").map(t => t.trim());
  
  try {
    const [startHour, startMin] = startStr.split(":").map(Number);
    const [endHour, endMin] = endStr.split(":").map(Number);
    
    const slots = [];
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const nextHour = currentHour + 2; // 2-hour slots
      const nextMin = currentMin;
      
      if (nextHour > endHour || (nextHour === endHour && nextMin > endMin)) break;
      
      
      // Format to 12-hour format
      const startFormatted = formatTo12Hour(currentHour, currentMin);
      const endFormatted = formatTo12Hour(nextHour, nextMin);
      
      slots.push(`${startFormatted} - ${endFormatted}`);
      
      currentHour = nextHour;
      currentMin = nextMin;
    }
    
    return slots.length > 0 ? slots : TIME_SLOTS;
  } catch {
    return TIME_SLOTS;
  }
};

// Helper to convert to 12-hour format
const formatTo12Hour = (hour, min = 0) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${String(displayHour).padStart(2, "0")}:${String(min).padStart(2, "0")} ${period}`;
};

const DoctorDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors, selectedDoctor, loading, error } = useSelector((state) => state.doctor);
  const [notFound, setNotFound] = useState(false);

  // 1. Fetch public doctors list if empty to resolve the slug -> ID
  useEffect(() => {
    window.scrollTo(0, 0);
    if (doctors.length === 0) {
      dispatch(fetchAllDoctorsPublic());
    }
  }, [dispatch, doctors.length]);

  // 2. Once doctors are loaded, find the matching one and fetch by ID
  useEffect(() => {
    if (doctors.length > 0) {
      const match = doctors.find(doc => getDoctorSlug(doc.name) === slug);
      if (match) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNotFound(false);
        dispatch(fetchDoctorThunk(match._id));
      } else {
        setNotFound(true);
      }
    }
  }, [dispatch, doctors, slug]);

  const dates = useMemo(() => {
    const list = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get available days from doctor's timing
    const { days: availableDays } = parseAvailabilityTiming(selectedDoctor?.timing || "");
    
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();
      
      // Only include days when doctor is available
      if (availableDays.includes(dayOfWeek)) {
        list.push({
          day: days[dayOfWeek],
          date: d.getDate(),
          iso: d.toISOString().split('T')[0]
        });
      }
    }
    return list;
  }, [selectedDoctor?.timing]);

  // Generate available time slots based on doctor's timing
  const availableTimeSlots = useMemo(() => {
    const { timeRange } = parseAvailabilityTiming(selectedDoctor?.timing || "");
    return generateTimeSlots(timeRange);
  }, [selectedDoctor?.timing]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [quickFormOpen, setQuickFormOpen] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // Initialize selected date and slot
  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDate(dates[0].iso);
    }
  }, [dates, selectedDate]);

  useEffect(() => {
    if (availableTimeSlots.length > 0 && !selectedSlot) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSlot(availableTimeSlots[0]);
    }
  }, [availableTimeSlots, selectedSlot]);

  const [quickFormData, setQuickFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  if (notFound || (error && !selectedDoctor)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Doctor Not Found</h2>
        <p className="text-slate-600 mb-8">We couldn't find the requested doctor's profile.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold transition hover:bg-primary/90"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (loading || !selectedDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary" />
      </div>
    );
  }

  const doctor = selectedDoctor;
  const docImage = doctor?.photo || doctor?.image;
  const docSpec = doctor?.specialization || doctor?.specialty || "Specialist";
  const docDeptName = doctor?.department?.name || doctor?.department || docSpec;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard!");
  };

  const handleQuickBookSubmit = async (e) => {
    e.preventDefault();
    const { name, age, gender, phone, email, message } = quickFormData;

    if (!name || !age || !phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      age: parseInt(age),
      gender,
      phone: phone.trim(),
      email: email?.trim() || undefined,
      department: docDeptName,
      preferredDate: selectedDate,
      preferredTimeSlot: selectedSlot,
      message: message?.trim() || `Booked profile appointment with Dr. ${doctor.name}`
    };

    try {
      const result = await dispatch(submitAppointmentRequest(payload));

      const messagePayload = {
        name: name.trim(),
        email: email?.trim() || "no-email@usthihospital.com",
        phone: phone.trim(),
        subject: `Appointment with Dr. ${doctor.name}`,
        message: `Appointment booked for ${selectedDate} at ${selectedSlot}`
      };
      await dispatch(sendMessage(messagePayload));

      if (submitAppointmentRequest.fulfilled.match(result)) {
        toast.success("Appointment successfully requested!");
        setQuickFormOpen(false);
        setQuickFormData({ name: "", age: "", gender: "Male", phone: "", email: "", message: "" });
      } else {
        toast.error(result.payload || "Booking failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const bioText = doctor.description || doctor.bio || `Dr. ${doctor.name} is a highly accomplished specialist with over ${doctor.experience || "10"} years of extensive clinical experience. Renowned for a compassionate approach and a commitment to excellence in patient care, they have successfully treated numerous complex cases and are highly regarded by peers and patients alike.`;
  const shouldTruncate = bioText.length > 400;
  const displayedBio = shouldTruncate && !isBioExpanded ? `${bioText.slice(0, 400)}...` : bioText;

  return (
    <div className="min-h-screen bg-background font-sans pb-20">
      {/* Top Banner (Wave and Info) */}
      <div className="bg-gradient-to-br from-primary to-[#005031] relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-emerald-500/10">
        {/* Background wave pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,117.3C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Breadcrumb / Back Link */}
          <div className="flex items-center gap-2 text-white/70 text-sm mb-8 relative z-10">
            <button onClick={() => navigate(-1)} className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer border-none bg-transparent font-medium text-white/70">
              <ArrowLeft size={16} /> Back
            </button>
            <span>/</span>
            <span>Doctors</span>
            <span>/</span>
            <span className="text-white font-semibold">{doctor.name}</span>
          </div>

          {/* Banner Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              {/* Doctor Image */}
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl border-4 border-white/15 overflow-hidden bg-slate-150 flex-shrink-0 shadow-lg relative group">
                {docImage && !docImage.includes('👨‍⚕️') && !docImage.includes('👩‍⚕️') ? (
                  <img src={docImage} alt={doctor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl bg-emerald-50 text-emerald-800">
                    {docImage || '👨‍⚕️'}
                  </div>
                )}
              </div>

              {/* Text details */}
              <div className="flex-grow text-white space-y-4">
                <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {doctor.name.startsWith("Dr") ? doctor.name : `Dr ${doctor.name}`}
                  </h1>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer flex items-center justify-center"
                    title="Share Profile"
                  >
                    <Share2 size={16} />
                  </button>
                </div>

                <div className="space-y-2.5 text-white/90 text-center md:text-left">
                  <p className="text-base md:text-lg font-semibold text-emerald-300">
                    {docSpec}
                  </p>
                  <div className="w-full h-[1px] bg-white/10 my-2" />
                  <p className="text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                    <span className="font-semibold text-white/60">Experience:</span> {doctor.experience || 10}+ Years
                  </p>
                  <p className="text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                    <span className="font-semibold text-white/60">Education:</span> {doctor.qualifications || "MBBS"}
                  </p>
                  <div className="w-full h-[1px] bg-white/10 my-2" />
                  <div className="flex items-center justify-center md:justify-start gap-2.5 text-sm md:text-base text-white/95">
                    <Globe size={16} className="text-emerald-300 flex-shrink-0" />
                    <span>{doctor.languages || "English • Hindi • Odia"}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2.5 text-sm md:text-base text-white/95">
                    <Clock size={16} className="text-emerald-300 flex-shrink-0" />
                    <span>{doctor.timing || "14:00 - 16:00 • Mon, Fri & Sat"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer to align Booking Card on desktop */}
            <div className="hidden lg:block lg:col-span-4 h-10" />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: About & Expertise */}
          <div className="lg:col-span-8 space-y-8 text-left">
            {/* About Card */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
              <h2 className="text-2xl font-bold text-slate-800 mb-5 font-sans flex items-center gap-2">
                About <span className="italic font-extrabold text-primary">Dr. {doctor.name.replace(/^Dr\.?\s+/i, "")}</span>
              </h2>
              <div className="text-slate-600 leading-relaxed text-[15px] space-y-4">
                <p>{displayedBio}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                {shouldTruncate && (
                  <button
                    onClick={() => setIsBioExpanded(!isBioExpanded)}
                    className="text-[#007a87] hover:text-[#005f6a] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-none bg-transparent text-sm"
                  >
                    {isBioExpanded ? (
                      <>Read Less <ChevronUp size={16} /></>
                    ) : (
                      <>Read More <ChevronDown size={16} /></>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setQuickFormOpen(true)}
                  className="px-6 py-3 bg-[#007a87] hover:bg-[#005f6a] text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer border-none text-sm ml-auto sm:ml-0"
                >
                  Ask your query <span>↗</span>
                </button>
              </div>
            </div>

            {/* Areas of Expertise */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
              <h2 className="text-xl font-bold text-slate-800 mb-6 font-sans">Areas of Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Advanced Patient Diagnostics",
                  "Minimally Invasive Procedures",
                  "Comprehensive Clinical Care",
                  "Chronic Disease Management",
                  "Preventative Health Consultation",
                  "Emergency Patient Evaluation"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700 font-semibold text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Floating Booking Card */}
          <div className="lg:col-span-4 lg:-mt-48 relative z-20 text-left">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-[0_15px_45px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-100">
                <h3 className="text-base sm:text-lg font-bold text-slate-800">Book Appointment</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Available: <span className="font-semibold text-slate-700">{doctor.timing || "Check availability"}</span>
                </p>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Hospital selection */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Hospital</label>
                  <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl text-emerald-950 font-semibold text-sm">
                    <input
                      type="radio"
                      checked
                      readOnly
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                    <span>Usthi Hospitals, Bhubaneswar</span>
                  </div>
                </div>

                {/* Select Date */}
                <div className="space-y-2">
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Select Date</label>
                  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {dates.map((d) => (
                      <button
                        key={d.iso}
                        onClick={() => setSelectedDate(d.iso)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center min-w-[72px] transition-all cursor-pointer ${selectedDate === d.iso
                          ? 'border-emerald-600 bg-emerald-50/40 text-emerald-800 font-bold'
                          : 'border-slate-100 hover:border-slate-350 bg-white text-slate-700'
                          }`}
                      >
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400">{d.day}</span>
                        <span className="text-sm sm:text-base font-extrabold mt-0.5">{d.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Slots */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Available Slots</label>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {availableTimeSlots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSlot(s)}
                        className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${selectedSlot === s
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm font-bold'
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 text-slate-650'
                          }`}
                      >
                        {s.split(" - ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row border-t border-slate-150">
                <button
                  onClick={() => setQuickFormOpen(true)}
                  className="flex-1 py-3 sm:py-4 bg-[#f1b53e] hover:bg-[#db9f2e] active:scale-95 text-white font-extrabold text-xs sm:text-[15px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-none sm:rounded-bl-2xl shadow-inner"
                >
                  Book Appointment <span>↗</span>
                </button>
                <a
                  href="tel:9090963722"
                  className="flex-1 py-3 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs sm:text-[15px] flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer border-t sm:border-t-0 sm:border-l border-slate-200 sm:rounded-br-2xl rounded-b-2xl sm:rounded-bl-none no-underline"
                >
                  <Phone size={14} className="sm:size-[15px]" /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal Overlay */}
      <AnimatePresence>
        {quickFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-y-auto max-h-[90vh] z-10 p-6 md:p-8 text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="text-primary w-5 h-5" />
                    <span>Confirm Booking</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Booking with Dr. {doctor.name.replace(/^Dr\.?\s+/i, "")} for {selectedDate} at {selectedSlot.split(" - ")[0]}
                  </p>
                </div>
                <button
                  onClick={() => setQuickFormOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600 border-none bg-transparent"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleQuickBookSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="YourName"
                        value={quickFormData.name}
                        onChange={(e) => setQuickFormData({ ...quickFormData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Age *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="120"
                      placeholder="28"
                      value={quickFormData.age}
                      onChange={(e) => setQuickFormData({ ...quickFormData, age: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Gender</label>
                    <select
                      value={quickFormData.gender}
                      onChange={(e) => setQuickFormData({ ...quickFormData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm outline-none transition text-slate-700 cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="90XXXXXXXX"
                        value={quickFormData.phone}
                        onChange={(e) => setQuickFormData({ ...quickFormData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="YourEmail@example.com"
                        value={quickFormData.email}
                        onChange={(e) => setQuickFormData({ ...quickFormData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Message (Optional)</label>
                    <textarea
                      rows="2"
                      placeholder="Any specific symptoms or requests..."
                      value={quickFormData.message}
                      onChange={(e) => setQuickFormData({ ...quickFormData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-primary rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800 resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setQuickFormOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-600 transition cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-sm font-bold shadow-md shadow-primary/10 transition cursor-pointer border-none disabled:opacity-70"
                  >
                    {submitting ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDetails;
