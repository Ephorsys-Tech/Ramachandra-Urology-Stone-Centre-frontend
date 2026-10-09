import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "../admin/components/Sidebar";
import TopBar from "../admin/components/TopBar";
import SEO from "../components/common/SEO";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { addMessageLocally, deleteMessageLocally } from "../redux/features/message/messageSlice";
import { fetchAllMessages } from "../redux/features/message/messageThunk";
import { fetchAllAppointmentRequests } from "../redux/features/appointmentRequest/appointmentRequestThunk";
import {
  addRequestLocally,
  updateRequestLocally,
  deleteRequestLocally,
  bulkDeleteRequestsLocally,
} from "../redux/features/appointmentRequest/appointmentRequestSlice";

// Pleasant synthesized double-beep notification sound
const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // First tone (A5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, audioCtx.currentTime); 
    gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.12);

    // Second higher tone (C6) slightly delayed
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.08); 
    gain2.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.22);
    osc2.start(audioCtx.currentTime + 0.08);
    osc2.stop(audioCtx.currentTime + 0.22);
  } catch (error) {
    console.error("Failed to play notification audio:", error);
  }
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllMessages());
    dispatch(fetchAllAppointmentRequests());

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8800", {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });

    socket.on("messageAdded", (msg) => {
      dispatch(addMessageLocally(msg));
      playNotificationSound();
      toast.success(`New message received from ${msg.name}!`, {
        icon: "✉️",
        duration: 4000
      });
    });

    socket.on("messageDeleted", (id) => {
      dispatch(deleteMessageLocally(id));
    });

    socket.on("appointmentRequestAdded", (req) => {
      dispatch(addRequestLocally(req));
      playNotificationSound();
      toast.success(`New appointment request from ${req.name}!`, {
        icon: "📅",
        duration: 4000
      });
    });

    socket.on("appointmentRequestUpdated", (req) => {
      dispatch(updateRequestLocally(req));
    });

    socket.on("appointmentRequestDeleted", (id) => {
      dispatch(deleteRequestLocally(id));
    });

    socket.on("appointmentRequestsBulkDeleted", (data) => {
      dispatch(bulkDeleteRequestsLocally(data));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <SEO title="Hospital Management Console" noindex={true} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto" data-lenis-prevent>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;