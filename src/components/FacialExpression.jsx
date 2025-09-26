import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./facialExpression.css";
import axios from "axios";

// Pick backend URL: use localhost in dev, Render in production
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://moodify-backend-1m01.onrender.com/api";

function FacialExpression({ darkMode, setDarkMode, setSongs }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // put models in public/models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(console.error);
    };

    loadModels().then(startVideo);
  }, []);

  const detectMood = async () => {
    if (!videoRef.current) return;

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length > 0) {
      const moodDetected = detections[0].expressions.asSortedArray()[0];
      console.log(
        "Detected mood:",
        moodDetected.expression,
        "Confidence:",
        moodDetected.probability
      );
      try {
        const response = await axios.get(
          `${API_BASE}/songs?mood=${encodeURIComponent(moodDetected.expression)}`
        );
        setSongs(Array.isArray(response.data?.songs) ? response.data.songs : []);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    } else {
      console.log("No face detected 😅");
      setSongs([]);
    }
  };

  return (
    <div className={`mood-container ${darkMode ? "dark" : "light"}`}>
      <header className="mood-header">
        <div className="logo-wrap">
          <img src="/logo.png" alt="Moody Player Logo" className="logo" />
          <div className="brand">
            <h1 className="brand-title">Moody Player</h1>
            <div className="brand-sub">Music that matches your mood</div>
          </div>
        </div>

        {typeof setDarkMode === "function" ? (
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="toggle-btn"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        ) : null}
      </header>

      <main className="mood-main">
        <h2 className="main-heading">Live Mood Detection</h2>

        <div className="mood-section">
          <div className="mood-video">
            <video ref={videoRef} autoPlay muted playsInline />
          </div>

          <div className="mood-info">
            <p className="info-text">
              Your current mood will be analyzed when you click the button. Songs will be fetched automatically.
            </p>
            <button onClick={detectMood} className="detect-btn">
              Detect Mood
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FacialExpression;
