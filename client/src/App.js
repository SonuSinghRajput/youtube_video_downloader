import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("video1080");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    toast.info("Downloading started...", { position: "top-right", autoClose: 3000 });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/download",
        { url, format },
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `download.${format.includes("audio") ? "mp3" : "mp4"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Download completed!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      toast.error("Download failed. Try again!", { position: "top-right", autoClose: 3000 });
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <ToastContainer />

      {/* Fixed Header */}
      <header className="header">
        <h2>YouTube Downloader</h2>
        <button onClick={toggleTheme} className="theme-toggle">
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* Centered Content */}
      <div className="center-content">
        <form onSubmit={handleDownload} className="download-form">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            required
            className="input-field"
          />
          <br />
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="dropdown">
            <option value="video2160">Video - 2160p</option>
            <option value="video1440">Video - 1440p</option>
            <option value="video1080">Video - 1080p</option>
            <option value="video720">Video - 720p</option>
            <option value="video420">Video - 420p</option>
            <option value="video360">Video - 360p</option>
            <option value="video240">Video - 240p</option>
            <option value="video144">Video - 144p</option>
            <option value="audio">Audio - MP3</option>
          </select>
          <br />
          <button type="submit" className="download-button">
            {loading ? "Downloading..." : "Start Download"}
          </button>
        </form>

        {/* Centered Progress Bar */}
        {loading && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
