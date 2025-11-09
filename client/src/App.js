// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateForm from "./pages/CandidateForm.js";
import VideoRecorder from "./pages/VideoRecorder.js";
import ReviewPage from "./pages/ReviewPage.js";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    positionApplied: "",
    currentPosition: "",
    experience: "",
    resume: null,
  });
  const [videoBlob, setVideoBlob] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<CandidateForm formData={formData} setFormData={setFormData} />}
        />
        <Route
          path="/record"
          element={<VideoRecorder videoBlob={videoBlob} setVideoBlob={setVideoBlob} />}
        />
        <Route
          path="/review"
          element={<ReviewPage formData={formData} videoBlob={videoBlob} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
