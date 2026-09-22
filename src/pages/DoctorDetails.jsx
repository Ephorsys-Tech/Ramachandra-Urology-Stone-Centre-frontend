import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById as fetchDoctorThunk, fetchAllDoctorsPublic } from '../redux/features/doctor/doctorThunk';
import { getDoctorSlug } from '../Helper/slugify';
import { submitAppointmentRequest } from '../redux/features/appointmentRequest/appointmentRequestThunk';
import { sendMessage } from '../redux/features/message/messageThunk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Calendar,
  User,
  Mail,
  Phone,
  X,
  GraduationCap,
  Clock,
  MapPin,
  Award,
  BookOpen,
  Stethoscope,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'about',          label: 'About',                       shortLabel: 'About' },
  { id: 'expertise',      label: 'Field Of Expertise',          shortLabel: 'Expertise' },
  { id: 'research',       label: 'Research & Publications',     shortLabel: 'Research' },
  { id: 'certifications', label: 'Certification & Memberships', shortLabel: 'Certify' },
];

const DoctorDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors = [], selectedDoctor = null, loading = false, error = null } = useSelector((state) => state.doctor || {});
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [quickFormOpen, setQuickFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quickFormData, setQuickFormData] = useState({
    name: '', age: '', gender: 'Male', phone: '', email: '', message: ''
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (doctors.length === 0) dispatch(fetchAllDoctorsPublic());
  }, [dispatch, doctors.length]);

  useEffect(() => {
    if (doctors.length > 0) {
      const match = doctors.find(doc => getDoctorSlug(doc.name) === slug);
      if (match) {
        setNotFound(false);
        dispatch(fetchDoctorThunk(match._id));
      } else {
        setNotFound(true);
      }
    }
  }, [dispatch, doctors, slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile link copied!');
  };

  const handleQuickBookSubmit = async (e) => {
    e.preventDefault();
    const { name, age, phone, email, gender, message } = quickFormData;
    if (!name || !age || !phone) { toast.error('Please fill required fields.'); return; }
    if (name.trim().length < 3) { toast.error('Name must be at least 3 characters.'); return; }
    if (!/^[0-9]{10}$/.test(phone)) { toast.error('Phone must be 10 digits.'); return; }

    setSubmitting(true);
    const payload = {
      name: name.trim(), age: parseInt(age), gender,
      phone: phone.trim(), email: email?.trim() || undefined,
      department: doctor?.department?.name || docSpec,
      message: message?.trim() || `Appointment request for Dr. ${doctor.name}`
    };
    try {
      const result = await dispatch(submitAppointmentRequest(payload));
      await dispatch(sendMessage({
        name: name.trim(),
        email: email?.trim() || 'contact@ramachandraurology.com',
        phone: phone.trim(),
        subject: `Appointment with Dr. ${doctor.name}`,
        message: message?.trim() || `Appointment request`
      }));
      if (submitAppointmentRequest.fulfilled.match(result)) {
        toast.success('Appointment requested successfully!');
        setQuickFormOpen(false);
        setQuickFormData({ name: '', age: '', gender: 'Male', phone: '', email: '', message: '' });
      } else {
        toast.error(result.payload || 'Booking failed.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (notFound || (error && !selectedDoctor)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] text-center px-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Doctor Not Found</h2>
        <p className="text-slate-600 mb-8">We couldn't find this doctor's profile.</p>
        <button onClick={() => navigate(-1)} className="bg-[#0FA8D6] text-white px-6 py-3 rounded-full font-semibold cursor-pointer border-none">
          Go Back
        </button>
      </div>
    );
  }

  if (loading || !selectedDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#0FA8D6] border-t-transparent animate-spin" />
          <span className="text-sm text-slate-500 font-medium">Loading profile…</span>
        </div>
      </div>
    );
  }

  const doctor = selectedDoctor;
  const docImage = doctor?.photo || doctor?.image;
  const hasValidImage = docImage && !docImage.includes('👨‍⚕️') && !docImage.includes('👩‍⚕️');
  const docSpec = doctor?.specialization || doctor?.specialty || doctor?.department?.name || 'Specialist';
  const doctorDisplayName = doctor.name.startsWith('Dr') ? doctor.name : `Dr. ${doctor.name}`;
  const bioText = doctor.about || doctor.description || doctor.bio || '';

  const expertiseItems = Array.isArray(doctor.expertise)
    ? doctor.expertise.filter(Boolean)
    : [];

  const publications = Array.isArray(doctor.publications)
    ? doctor.publications.filter(Boolean)
    : [];

  const certifications = Array.isArray(doctor.certifications)
    ? doctor.certifications.filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 ">

      {/* ── HEADER CARD ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4 sm:gap-6 p-5 sm:p-8">

            {/* Doctor Photo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-sm">
              {hasValidImage ? (
                <img src={docImage} alt={doctorDisplayName} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Stethoscope size={36} />
                </div>
              )}
            </div>

            {/* Name + Breadcrumb + Info */}
            <div className="flex-1 min-w-0 w-full">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1e293b] tracking-tight leading-tight">
                {doctorDisplayName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{docSpec}</p>

              {/* Breadcrumb */}
              <nav className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 mt-2 flex-wrap justify-center sm:justify-start">
                <Link to="/" className="hover:text-[#0FA8D6] transition-colors no-underline text-slate-400">Home</Link>
                <ChevronRight size={11} />
                <Link to="/doctors" className="hover:text-[#0FA8D6] transition-colors no-underline text-slate-400">Doctors</Link>
                <ChevronRight size={11} />
                <span className="text-[#0FA8D6] font-medium truncate max-w-[160px] sm:max-w-none">{doctorDisplayName}</span>
              </nav>

              {/* Quick info pills */}
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
                {doctor.qualifications && (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-600 px-2 sm:px-2.5 py-1 rounded-full">
                    <GraduationCap size={10} className="text-[#0FA8D6]" />
                    <span className="truncate max-w-[140px] sm:max-w-none">{doctor.qualifications}</span>
                  </span>
                )}
                {doctor.timing && (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-600 px-2 sm:px-2.5 py-1 rounded-full">
                    <Clock size={10} className="text-[#0FA8D6]" />
                    <span className="truncate max-w-[140px] sm:max-w-none">{doctor.timing}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-600 px-2 sm:px-2.5 py-1 rounded-full">
                  <MapPin size={10} className="text-[#0FA8D6]" />
                  Ramachandra Centre, Sambalpur
                </span>
              </div>

              {/* Book button — visible inline on sm+ only */}
              <div className="hidden sm:flex items-center gap-2 mt-4">
                <button
                  onClick={() => setQuickFormOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0FA8D6] hover:bg-[#00b4ea] text-white text-xs font-bold rounded-xl transition-all cursor-pointer border-none uppercase tracking-wide shadow-sm"
                >
                  <Calendar size={13} />
                  Book Appointment
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all cursor-pointer bg-white"
                  title="Share Profile"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">

          {/* Tab Bar — all 4 equal-width, matching reference UI */}
          <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50/50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full py-3.5 text-[10px] xs:text-[11px] sm:text-sm font-bold transition-all cursor-pointer border-none text-center leading-tight px-1.5 ${
                  activeTab === tab.id
                    ? 'text-white bg-[#00B4EA] shadow-xs'
                    : 'text-slate-600 bg-transparent hover:text-[#00B4EA] hover:bg-slate-100/60'
                }`}
              >
                <span className="sm:hidden block">{tab.shortLabel}</span>
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-6 sm:p-8 min-h-[220px]"
            >
              {/* ABOUT */}
              {activeTab === 'about' && (
                <div className="space-y-4 w-full">
                  <h3 className="text-base font-bold text-[#1e293b]">About {doctorDisplayName}</h3>
                  <div className="text-slate-700 text-xs sm:text-[14px] leading-relaxed sm:leading-loose space-y-3 w-full">
                    {bioText ? (
                      bioText
                        .split(/\n\s*\n/)
                        .map((p) => p.replace(/\r?\n/g, ' ').trim())
                        .filter(Boolean)
                        .map((para, i) => (
                          <p key={i} className="w-full text-slate-650">
                            {para}
                          </p>
                        ))
                    ) : (
                      <p className="text-slate-400 italic text-xs">No biography details listed yet.</p>
                    )}
                  </div>
                  <div className="mt-6 pt-2 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 w-full">
                    {[
                      { icon: Award, label: 'Experience', value: `${doctor.experience || '10'}+ Years` },
                     
                      { icon: MapPin, label: 'Location', value: 'Burla, Sambalpur' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3 bg-slate-50 hover:bg-sky-50/40 rounded-xl p-3.5 border border-slate-200/70 hover:border-sky-200 transition-all shadow-2xs">
                        <div className="w-9 h-9 rounded-lg bg-[#00B4EA]/10 text-[#00B4EA] flex items-center justify-center shrink-0">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide truncate">{label}</div>
                          <div className="text-xs sm:text-sm font-bold text-[#012442] truncate">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FIELD OF EXPERTISE */}
              {activeTab === 'expertise' && (
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#1e293b]">Field Of Expertise</h3>
                    {expertiseItems.length > 0 && (
                      <span className="text-[11px] font-semibold text-[#00B4EA] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                        {expertiseItems.length} Specializations
                      </span>
                    )}
                  </div>
                  {expertiseItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {expertiseItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-sky-50/50 border border-slate-200/70 hover:border-sky-200 transition-all group"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#00B4EA]/10 text-[#00B4EA] flex items-center justify-center shrink-0 group-hover:bg-[#00B4EA] group-hover:text-white transition-colors">
                            <CheckCircle2 size={13} />
                          </div>
                          <span className="text-xs sm:text-[13.5px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-xs">No expertise details listed yet.</p>
                  )}
                </div>
              )}

              {/* RESEARCH & PUBLICATIONS */}
              {activeTab === 'research' && (
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#1e293b]">Research & Publications</h3>
                    {publications.length > 0 && (
                      <span className="text-[11px] font-semibold text-[#00B4EA] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                        {publications.length} Papers & Studies
                      </span>
                    )}
                  </div>
                  {publications.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                      {publications.map((pub, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 hover:bg-sky-50/50 border border-slate-200/70 hover:border-sky-200 transition-all group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#00B4EA]/10 text-[#00B4EA] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#00B4EA] group-hover:text-white transition-colors">
                            <BookOpen size={14} />
                          </div>
                          <span className="text-xs sm:text-[13px] font-medium text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                            {pub}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-xs">No publications listed yet.</p>
                  )}
                </div>
              )}

              {/* CERTIFICATIONS & MEMBERSHIPS */}
              {activeTab === 'certifications' && (
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-[#1e293b]">Certification & Memberships</h3>
                    {certifications.length > 0 && (
                      <span className="text-[11px] font-semibold text-[#00B4EA] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                        {certifications.length} Accreditations
                      </span>
                    )}
                  </div>
                  {certifications.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {certifications.map((cert, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-sky-50/50 border border-slate-200/70 hover:border-sky-200 transition-all group"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#00B4EA]/10 text-[#00B4EA] flex items-center justify-center shrink-0 group-hover:bg-[#00B4EA] group-hover:text-white transition-colors">
                            <Award size={13} />
                          </div>
                          <span className="text-xs sm:text-[13.5px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                            {cert}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic text-xs">No certifications listed yet.</p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── STICKY MOBILE BOOK BUTTON ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-3 flex gap-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => setQuickFormOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0FA8D6] hover:bg-[#00b4ea] text-white text-sm font-bold rounded-xl transition-all cursor-pointer border-none uppercase tracking-wide shadow-sm"
        >
          <Calendar size={15} />
          Book Appointment
        </button>
        <button
          onClick={handleShare}
          className="w-12 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 cursor-pointer"
          title="Share"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* ── BOOKING MODAL ── */}
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
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="text-[#0FA8D6] w-5 h-5" /> Book Appointment
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">with {doctorDisplayName}</p>
                </div>
                <button onClick={() => setQuickFormOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 border-none bg-transparent">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleQuickBookSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" required placeholder="Your Name" value={quickFormData.name}
                        onChange={(e) => setQuickFormData({ ...quickFormData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0FA8D6] rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Age *</label>
                    <input type="number" required min="1" max="120" placeholder="28" value={quickFormData.age}
                      onChange={(e) => setQuickFormData({ ...quickFormData, age: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0FA8D6] rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Gender</label>
                    <select value={quickFormData.gender}
                      onChange={(e) => setQuickFormData({ ...quickFormData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0FA8D6] rounded-xl text-sm outline-none transition text-slate-700 cursor-pointer">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" required placeholder="10-digit number" value={quickFormData.phone}
                        onChange={(e) => setQuickFormData({ ...quickFormData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0FA8D6] rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" placeholder="your@email.com" value={quickFormData.email}
                        onChange={(e) => setQuickFormData({ ...quickFormData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0FA8D6] rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800" />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Message (Optional)</label>
                    <textarea rows="2" placeholder="Any specific symptoms or requests..."
                      value={quickFormData.message}
                      onChange={(e) => setQuickFormData({ ...quickFormData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0FA8D6] rounded-xl text-sm outline-none transition placeholder:text-slate-400 text-slate-800 resize-none" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                  <button type="button" onClick={() => setQuickFormOpen(false)}
                    className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-600 transition cursor-pointer bg-transparent">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="px-6 py-2.5 bg-[#0FA8D6] hover:bg-[#00b4ea] text-white rounded-xl text-sm font-bold shadow-sm transition cursor-pointer border-none disabled:opacity-70">
                    {submitting ? 'Booking…' : 'Confirm Booking'}
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
