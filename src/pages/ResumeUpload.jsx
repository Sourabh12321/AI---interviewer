import React, { useState } from 'react';
import axios from 'axios';
import '../css/ResumeUpload.css';
import { useNavigate } from 'react-router-dom';
import { resumeData } from '../redux/slice/interviewSlice';
import { useDispatch, useSelector } from 'react-redux';

const ResumeUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state)=>state);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showModal, setShowModal] = useState(false);

  console.log(data)

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }
    setFile(selected);
    setFileName(selected.name);
    setError(null);
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }
    setShowModal(true);
  };

  const handleProceed = async () => {
    const formData = new FormData();
    formData.append("file", file);
    setParsing(true);
    setShowModal(false);

    try {
      dispatch(resumeData(formData))
      // Navigate to interview page after successful parsing
      navigate('/interview');
    } catch (err) {
      console.error("Parsing error:", err);
      setError("❌ Resume parsing failed. Please try again.");
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="resume-upload-wrapper">
      <div className="resume-upload-container">
        <h2 className="title">📄 Upload Your Resume</h2>
        <p className="description">
          Let our AI read and understand your resume to generate intelligent interview questions
          based on your experience and skills.
        </p>

        <label className="file-drop-zone">
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <span>{fileName || "Drag & drop or click to select your resume (PDF)"}</span>
        </label>

        <button className="upload-button" onClick={handleUpload} disabled={parsing}>
          {parsing ? "⏳ Parsing..." : "🚀 Start Interview"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            <h3 className="modal-title">🧠 Interview Rules</h3>
            <ul className="rules-list">
              <li>✅ You will get 10 AI-generated questions.</li>
              <li>💬 Each question will be followed by instant feedback.</li>
              <li>⏱️ Be honest and thoughtful in your answers.</li>
              <li>🔄 Do not refresh the page once started.</li>
              <li>📝 Resume is used to personalize the interview.</li>
              <li>📶 Stable internet is recommended.</li>
              <li>🎯 Questions will target your skills and experience.</li>
              <li>🚫 No going back once a question is answered.</li>
              <li>💡 Take your time to understand the question.</li>
              <li>🔒 Your data is secure and not stored.</li>
            </ul>
            <button className="proceed-button" onClick={handleProceed}>Proceed</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
