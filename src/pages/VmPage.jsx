import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../utils/api";
import { toast } from "react-toastify";

const VmPage = () => {
  const [running, setRunning] = useState(false);
  const [novncUrl, setNovncUrl] = useState("");
  const [webviewRef, setWebviewRef] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    api.get
  },[])

  const toggleVm = () => {
    if (!running) {
      startVm();
    } else {
      stopVm();
    }
  };

  const startVm = async () => {
    try {
      setLoading(true);
      setRunning(true);
      await fetchVnc(); // try to get the VNC URL
    } catch (err) {
      console.error("Failed to start VM:", err);
      toast.error("Failed to start VM. Please try again.");
      setRunning(false); // revert UI to initial state
    } finally {
      setLoading(false);
    }
  };

  const stopVm = () => {
    setRunning(false);
    setNovncUrl("");
    toast.info("VM stopped.");
  };

  async function fetchVnc() {
    try {
      const res = await api.get(`/api/v1/no-vnc`);
      setNovncUrl(res.data);
      console.log("Proxied URL:", res.data);
    } catch (error) {
      console.error("API error:", error);
      toast.error("Could not connect to VM. Please check your connection.");
      throw error; // rethrow to be handled by startVm()
    }
  }

  return (
    <div className="min-h-screen h-screen w-full flex flex-col bg-white dark:bg-black">
      <NavBar />

      <main className="flex flex-1 h-full w-full relative">
        <div className="w-full relative flex items-center justify-center">
          {!running && (
            <div className="w-full h-full relative">
              <button
                onClick={toggleVm}
                disabled={loading}
                className={`absolute border-white border-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-12 py-3 rounded font-semibold ${
                  loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-green-800"
                } text-white shadow-lg transition-colors`}
              >
                {loading ? "Starting..." : "Start VM"}
              </button>
            </div>
          )}

          {running && novncUrl && (
            <webview
              allowFullScreen={true}
              ref={(el) => setWebviewRef(el)}
              src={novncUrl}
              style={{ width: "100%", height: "100%" }}
              disablewebsecurity="true"
              allowpopups="true"
              webpreferences="contextIsolation=0, nodeIntegration=0"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default VmPage;
