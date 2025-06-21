import { useState, useRef, useEffect } from "react";
import { MdUpload } from "react-icons/md";
import GaugeChart from "react-gauge-chart"; // Import the gauge chart
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import "./style.css";
import image1 from "../../image1.jpeg"; // Custom fallback image for .mp4 files
import image2 from "../image2.jpg"
import axios from "axios";
import Navbar from "./Navbar"; // Import the Navbar

export default function Home() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [result, setResult] = useState(null);
  const [realProbability, setRealProbability] = useState(null);
  const [deepfakeProbability, setDeepfakeProbability] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  const [detectionHistory, setDetectionHistory] = useState(
    JSON.parse(localStorage.getItem("detectionHistory")) || []
  ); // Store detection history

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoURL(""); // Clear URL if a file is selected
      setResult(null); // Clear previous results
    }
  };

  const handleURLChange = (event) => {
    const value = event.target.value;
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

    if (youtubeRegex.test(value)) {
      setVideoURL(value);
      setVideoFile(null); // Clear file if a URL is entered
      setResult(null); // Clear previous results
    } else {
      setVideoURL(""); // Clear URL if input is invalid
      setResult("Please enter a valid YouTube link.");
    }
  };

  const handleDetectClick = async () => {
    if (!videoFile && !videoURL) {
      setResult("Please upload a video or provide a link first.");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      const formData = new FormData();
      if (videoFile) {
        formData.append("file", videoFile);
      } else if (videoURL) {
        formData.append("url", videoURL);
      }

      response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.data) {
        const { real_probability, deepfake_probability } = response.data;
        setRealProbability(real_probability);
        setDeepfakeProbability(deepfake_probability);

        const newHistory = {
          video: videoFile ? videoFile.name : videoURL,
          realProbability: real_probability,
          deepfakeProbability: deepfake_probability,
          thumbnail: videoFile
            ? image2 // Use image1 for local video uploads (e.g., .mp4 files)
            : `https://img.youtube.com/vi/${
                videoURL.split("v=")[1]
              }/hqdefault.jpg`,
        };

        const updatedHistory = [...detectionHistory, newHistory];

        setDetectionHistory(updatedHistory);
        localStorage.setItem("detectionHistory", JSON.stringify(updatedHistory));

        setResult(null); // Clear any previous result message
      }
    } catch (error) {
      console.error("Error during detection:", error);
      setResult("An error occurred during detection. Please try again.");
    }
    setIsLoading(false);
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoURL("");
    setResult(null);
    setRealProbability(null);
    setDeepfakeProbability(null);
    fileInputRef.current.value = null;
  };

  const renderGaugeChart = () => {
    if (deepfakeProbability !== null) {
      const value = deepfakeProbability * 100; // Convert to a percentage

      return (
        <div style={{ width: "50%", margin: "0 auto" }}>
          <GaugeChart
            className="gauge-chart"
            id="gauge-chart"
            nrOfLevels={8}
            percent={value / 100}
            colors={value > 50 ? ["#00FF00", "#FF0000"] : ["#00FF00","grey"]} // Green if <= 50, Red if > 50
            arcWidth={0.4}
            textColor="transparent"
          />
          <p className="percentage-text">{value.toFixed(2)}%</p>
          <p
            className="deepfake-status"
            style={{
              color:
                value >= 0 && value < 30
                  ? "green"
                  : value >= 30 && value < 50
                  ? "yellow"
                  : value >= 50 && value < 75
                  ? "#FFA500" // Yellowish red (using orange here)
                  : "red",
            }}
          >
            {value >= 0 && value < 30 && "Not a deepfake video"}
            {value >= 30 && value < 50 && "Likely to be not a deepfake video"}
            {value >= 50 && value < 75 && "Likely to be a deepfake video"}
            {value >= 75 && "It is a deepfake video"}
          </p>
        </div>
      );
    }
    return null;
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <Navbar isSticky={isSticky} handleLogout={handleLogout} />

      <main className="main-content">
        <div className="awareness-section">
          <img
            src={image1}
            alt="Deepfake Awareness"
            className="awareness-image"
          />
        </div>
        <div className="sub-content">
          <div className="upload-section">
            <label className="upload-label">
              <MdUpload className="upload-icon" />
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <input
                type="text"
                placeholder="Upload Video/Enter YouTube link"
                onChange={handleURLChange}
                value={videoURL}
              />
            </label>
          </div>

          {videoFile && (
            <div className="video-preview-container">
              <div className="video-wrapper">
                <video controls>
                  <source
                    src={URL.createObjectURL(videoFile)}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <button
                  className="remove-video-button"
                  onClick={handleRemoveVideo}
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {videoURL && !videoFile && (
            <div className="video-preview-container">
              <div className="video-wrapper">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${
                    videoURL.split("v=")[1]
                  }`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <button
                  className="remove-video-button"
                  onClick={handleRemoveVideo}
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          <button
            className="detect-button"
            onClick={handleDetectClick}
            disabled={isLoading || (!videoFile && !videoURL)}
          >
            {isLoading ? "Detecting..." : "Detect Deepfake"}
          </button>

          {result && <p className="result">{result}</p>}

          {realProbability !== null && deepfakeProbability !== null && (
            <div className="meter-container">
              {renderGaugeChart()}
            </div>
          )}
        </div>
        
        <div className="instructions-section">
          <h3>How to Use:</h3>
          <ol>
            <li>Upload your video file or enter a YouTube link.</li>
            <li>Click on "Detect Deepfake" to start the analysis.</li>
            <li>
              Wait for the result to know if the video contains deepfake
              content.
            </li>
          </ol>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 DeepMind. All rights reserved.</p>
        <nav className="footer-nav">
          <a href="#">Home</a>
          <a href="#">Pricing</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </nav>
      </footer>
    </div>
  );
}
