import React, { useState, useEffect } from "react";
import Navbar from "./Navbar"; // Import the Navbar
import "./Dashboard.css";
import image1 from '../../image1.jpeg'; // Ensure this is the correct path to image1

const Dashboard = () => {
  const [isSticky, setIsSticky] = useState(false);
  const detectionHistory = JSON.parse(localStorage.getItem("detectionHistory")) || [];

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleRemoveItem = (index) => {
    const updatedHistory = detectionHistory.filter((_, i) => i !== index);
    localStorage.setItem("detectionHistory", JSON.stringify(updatedHistory));
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  };

  // Check if the URL is a YouTube video
  const isYouTubeLink = (url) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // Check if the URL is an .mp4 file
  const isMP4File = (url) => {
    return url.endsWith(".mp4");
  };

  return (
    <div>
      <Navbar isSticky={isSticky} handleLogout={handleLogout} />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Detection History</h2>
        {detectionHistory.length > 0 ? (
          <div className="history-grid">
            {detectionHistory.map((item, index) => (
              <div key={index} className="history-card">
                <div className="video-thumbnail">
                  {/* Check if the thumbnail is a YouTube link, if not check for .mp4 */}
                  <img
                    src={
                      isYouTubeLink(item.thumbnail)
                        ? item.thumbnail // If it's a YouTube link, use the thumbnail URL
                        : isMP4File(item.thumbnail)
                        ? image1 // If it's an MP4 file, use the default image1
                        : item.thumbnail // Otherwise, use whatever thumbnail is provided
                    }
                    alt={`Thumbnail for ${item.video}`}
                  />
                </div>
                <div className="history-info">
                  <h3>{item.video}</h3>
                  <p>Real Probability: <span className="probability real">{(item.realProbability * 100).toFixed(2)}%</span></p>
                  <p>Deepfake Probability: <span className="probability deepfake">{(item.deepfakeProbability * 100).toFixed(2)}%</span></p>
                  <button className="btn-remove" onClick={() => handleRemoveItem(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-history">No detection history available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
