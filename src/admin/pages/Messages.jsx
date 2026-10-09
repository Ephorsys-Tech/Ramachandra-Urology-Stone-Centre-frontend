import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Mail, Phone, Calendar, MessageSquare, AlertCircle, RefreshCw, Eye, X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchAllMessages, deleteMessageById } from "../../redux/features/message/messageThunk";
import { markMessageAsRead } from "../../redux/features/message/messageSlice";
import toast from "react-hot-toast";

const Messages = () => {
  const dispatch = useDispatch();
  const { messages = [], readIds = [], loading, error } = useSelector((state) => state.message || { messages: [], readIds: [] });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all"); // "all", "starred", "unread"
  const messagesPerPage = 5;

  const [starredIds, setStarredIds] = useState(() => {
    try {
      const saved = localStorage.getItem("starred_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("starred_messages", JSON.stringify(starredIds));
  }, [starredIds]);

  // Fetch messages on mount
  useEffect(() => {
    dispatch(fetchAllMessages());
  }, [dispatch]);

  // Filter messages based on search and active tab
  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    return messages.filter((msg) => {
      // Tab filter
      if (activeTab === "starred" && !starredIds.includes(msg._id)) return false;
      if (activeTab === "unread" && (readIds || []).includes(msg._id)) return false;

      // Search filter
      const search = searchTerm.toLowerCase();
      return (
        msg.name?.toLowerCase().includes(search) ||
        msg.email?.toLowerCase().includes(search) ||
        msg.phone?.includes(search) ||
        msg.subject?.toLowerCase().includes(search) ||
        msg.message?.toLowerCase().includes(search)
      );
    });
  }, [messages, searchTerm, activeTab, starredIds, readIds]);



  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * messagesPerPage;
    return filteredMessages.slice(start, start + messagesPerPage);
  }, [filteredMessages, currentPage, messagesPerPage]);

  // Sync selection when paginated messages change
  const isAllSelected = useMemo(() => {
    return (
      paginatedMessages.length > 0 &&
      paginatedMessages.every((msg) => selectedIds.includes(msg._id))
    );
  }, [paginatedMessages, selectedIds]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedMessages.some((msg) => msg._id === id))
      );
    } else {
      setSelectedIds((prev) => {
        const newIds = paginatedMessages.map((msg) => msg._id);
        return Array.from(new Set([...prev, ...newIds]));
      });
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleStar = (id) => {
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Auto-mark selected message as read
  useEffect(() => {
    if (selectedMessage && !(readIds || []).includes(selectedMessage._id)) {
      dispatch(markMessageAsRead(selectedMessage._id));
    }
  }, [selectedMessage, readIds, dispatch]);

  // Synthesized message deleted sound effect
  const playDeleteSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (error) {
      console.error("Failed to play sound:", error);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      if (deleteId === "bulk") {
        const deletePromises = selectedIds.map((id) =>
          dispatch(deleteMessageById(id)).unwrap()
        );
        await Promise.all(deletePromises);
        playDeleteSound();
        toast.success(`${selectedIds.length} messages deleted successfully`);
        setSelectedIds([]);
      } else {
        await dispatch(deleteMessageById(deleteId)).unwrap();
        setSelectedIds((prev) => prev.filter((id) => id !== deleteId));
        setStarredIds((prev) => prev.filter((id) => id !== deleteId));
        playDeleteSound();
        toast.success("Message deleted successfully");
      }
    } catch (err) {
      toast.error(err || "Failed to delete message(s)");
    } finally {
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Helper to format date (Gmail short-style)
  const formatShortDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
    if (d.getFullYear() === now.getFullYear()) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Color schemes for contact initials
  const avatarColors = [
    "bg-blue-500/10 text-blue-500",
    "bg-purple-500/10 text-purple-500",
    "bg-emerald-500/10 text-emerald-500",
    "bg-pink-500/10 text-pink-500",
    "bg-indigo-500/10 text-indigo-500",
    "bg-amber-500/10 text-amber-500",
  ];

  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % avatarColors.length;
    return avatarColors[index];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Mail className="h-8 w-8 text-blue-600 animate-pulse" />
            Contact Messages
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor, view, and manage real-time queries sent from the website contact forms.
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchAllMessages())}
          className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl shadow-sm transition text-sm font-medium"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{messages?.length || 0}</p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Received</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {messages?.filter(m => m.subject?.toLowerCase().includes("urgent") || m.message?.toLowerCase().includes("urgent")).length || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Urgent Queries</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {filteredMessages.length}
            </p>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Matched Results</p>
          </div>
        </div>
      </div>

      {/* Control Panel: Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, email, subject, phone or content..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium shrink-0">
          Showing {filteredMessages.length} of {messages?.length || 0} messages
        </p>
      </div>

      {/* Messages Grid */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Tab Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center">
        <button
          onClick={() => {
            setActiveTab("all");
            setCurrentPage(1);
          }}
          className={`flex-1 py-3.5 px-6 text-center text-sm font-semibold border-b-2 md:border-b-0 md:border-r border-slate-100 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "all"
              ? "border-b-blue-600 md:border-r-slate-100 bg-blue-50/10 text-blue-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40"
          }`}
        >
          <Mail className="h-4 w-4" />
          All Messages
        </button>
        <button
          onClick={() => {
            setActiveTab("starred");
            setCurrentPage(1);
          }}
          className={`flex-1 py-3.5 px-6 text-center text-sm font-semibold border-b-2 md:border-b-0 md:border-r border-slate-100 transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "starred"
              ? "border-b-amber-500 md:border-r-slate-100 bg-amber-50/10 text-amber-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40"
          }`}
        >
          <Star className={`h-4 w-4 ${activeTab === "starred" ? "fill-amber-500 text-amber-500" : ""}`} />
          Bookmarked ({messages.filter(m => starredIds.includes(m._id)).length})
        </button>
        <button
          onClick={() => {
            setActiveTab("unread");
            setCurrentPage(1);
          }}
          className={`flex-1 py-3.5 px-6 text-center text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === "unread"
              ? "border-b-red-500 bg-red-50/10 text-red-600 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-50/40"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Unread ({messages.filter(m => !(readIds || []).includes(m._id)).length})
        </button>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="bg-white py-16 px-4 rounded-2xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Mail className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No messages found</h3>
          <p className="text-slate-500 text-sm max-w-sm mt-1">
            {searchTerm
              ? "We couldn't find any message matching your search terms. Try modifying your filters."
              : activeTab === "starred"
              ? "You haven't bookmarked (starred) any messages yet. Click the star icon on any message to keep track of it."
              : activeTab === "unread"
              ? "Hooray! You've read all messages in your inbox."
              : "There are currently no contact submissions stored in the system database."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer h-4 w-4 transition-all duration-150"
              />
              {selectedIds.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {selectedIds.length} Selected
                  </span>
                  <button
                    onClick={() => setDeleteId("bulk")}
                    className="p-1 hover:bg-red-50 text-red-600 hover:text-red-700 rounded transition cursor-pointer"
                    title="Delete Selected"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Messages List
                </span>
              )}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 font-semibold">
                {`${(currentPage - 1) * messagesPerPage + 1}-${Math.min(
                  currentPage * messagesPerPage,
                  filteredMessages.length
                )} of ${filteredMessages.length}`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition cursor-pointer"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition cursor-pointer"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* List Table */}
          <motion.div layout className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {paginatedMessages.map((msg) => {
                const isUnread = !(readIds || []).includes(msg._id);
                return (
                  <motion.div
                    layout
                    key={msg._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -12 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedMessage(msg)}
                    className={`flex items-center gap-3 sm:gap-4 px-4 py-3 hover:bg-slate-50/70 transition-colors duration-150 relative group cursor-pointer ${
                      selectedIds.includes(msg._id)
                        ? "bg-blue-50/30 hover:bg-blue-50/50"
                        : isUnread
                        ? "bg-white"
                        : "bg-slate-50/20"
                    }`}
                  >
                    {/* Selection & Star Toggle */}
                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(msg._id)}
                        onChange={() => handleSelectRow(msg._id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer h-4 w-4"
                      />
                      <button
                        onClick={() => handleToggleStar(msg._id)}
                        className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer hidden sm:block p-0.5"
                      >
                        <Star
                          className={`h-4.5 w-4.5 transition-colors ${
                            starredIds.includes(msg._id) ? "fill-amber-400 text-amber-400" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Sender Avatar & Name */}
                    <div className="w-24 sm:w-44 flex items-center gap-2.5 shrink-0 min-w-0">
                      <div
                        className={`w-7.5 h-7.5 rounded-full font-bold flex items-center justify-center text-xs shrink-0  shadow-sm ${getAvatarColor(
                          msg.name
                        )}`}
                      >
                        {getInitials(msg.name)}
                      </div>
                      <span className={`text-sm truncate ${isUnread ? "font-bold text-slate-950" : "font-semibold text-slate-700"}`}>
                        {msg.name}
                      </span>
                    </div>

                    {/* Subject and Message Snippet */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center pr-2">
                      <span className={`text-sm truncate shrink-0 max-w-[120px] sm:max-w-[200px] ${isUnread ? "font-bold text-slate-950" : "font-semibold text-slate-700"}`}>
                        {msg.subject || "General Inquiry"}
                      </span>
                      <span className="text-slate-400 text-sm hidden sm:inline mx-1.5">-</span>
                      <span className={`text-sm truncate ${isUnread ? "font-semibold text-slate-800" : "font-normal text-slate-500"}`}>
                        {msg.message}
                      </span>
                    </div>

                    {/* Date & Action Buttons (Hover triggers actions) */}
                    <div
                      className="w-20 sm:w-28 text-right shrink-0 flex justify-end items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Default Date View */}
                      <span className={`text-xs group-hover:hidden transition-opacity ${isUnread ? "font-bold text-slate-950" : "font-semibold text-slate-400"}`}>
                        {formatShortDate(msg.createdAt)}
                      </span>

                      {/* Hover Actions View */}
                      <div className="hidden group-hover:flex items-center justify-end gap-1.5 transition-all">
                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-all cursor-pointer"
                          title="Read Message"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(msg._id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg transition-all cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Message Viewer Modal */}
     <AnimatePresence>
  {selectedMessage && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0f0c29]/80 backdrop-blur-md"
        onClick={() => setSelectedMessage(null)}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.08)" }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)" }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ boxShadow: ["0 0 0 0px rgba(139,92,246,0.4)", "0 0 0 8px rgba(139,92,246,0)", "0 0 0 0px rgba(139,92,246,0.4)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className={`w-11 h-11 rounded-xl font-bold flex items-center justify-center shrink-0 text-white ${getAvatarColor(selectedMessage.name)}`}
              style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}
            >
              {getInitials(selectedMessage.name)}
            </motion.div>
            <div>
              <h3 className="font-bold text-white text-[15px]">{selectedMessage.name}</h3>
              <p className="text-xs text-indigo-200/80">{selectedMessage.email}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSelectedMessage(null)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white/70 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Body */}
        <div className="p-5 bg-white space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Meta cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="bg-[#f8f7ff] border border-[#e0deff] rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mb-1.5 flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone
              </p>
              <p className="text-sm font-semibold text-indigo-950">{selectedMessage.phone}</p>
            </div>
            <div className="bg-[#f8f7ff] border border-[#e0deff] rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mb-1.5 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Date sent
              </p>
              <p className="text-sm font-semibold text-indigo-950">{formatDate(selectedMessage.createdAt)}</p>
            </div>
          </motion.div>

          {/* Subject */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Subject</p>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.24, type: "spring", stiffness: 300, damping: 18 }}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-lg px-3 py-1.5 text-sm font-bold text-violet-900"
            >
              <MessageSquare className="h-4 w-4 text-violet-600" />
              {selectedMessage.subject || "General Inquiry"}
            </motion.span>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Message content</p>
            <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-sm leading-relaxed font-medium border-l-[3px] border-violet-500 border border-slate-200/70">
              {selectedMessage.message}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-50 px-5 py-3.5 border-t border-slate-100 flex items-center justify-between"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setDeleteId(selectedMessage._id); setSelectedMessage(null); }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl text-sm font-semibold transition border border-transparent cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete message
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, opacity: 0.9 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedMessage(null)}
            className="px-5 py-2 text-white text-sm font-semibold rounded-xl cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #4338ca, #7c3aed)",
              boxShadow: "0 4px 14px rgba(109,40,217,0.35)"
            }}
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative z-10 border border-slate-150 p-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">
                  {deleteId === "bulk" ? `Delete ${selectedIds.length} messages?` : "Delete message?"}
                </h3>
              </div>
              <p className="text-slate-500 text-sm">
                {deleteId === "bulk"
                  ? `Are you sure you want to permanently delete these ${selectedIds.length} selected messages? This action is irreversible.`
                  : "Are you sure you want to permanently delete this message? This action is irreversible."}
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => !isDeleting && setDeleteId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold transition border border-slate-200 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages;
