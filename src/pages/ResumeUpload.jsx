import React, { useState } from 'react';
import axios from 'axios';

const ResumeUpload = ({ onResumeParsed }) => {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setParsing(true);

    try {
      const res = await axios.post('http://localhost:8000/upload-resume', formData);
      onResumeParsed(res.data.text);
    } catch (err) {
      setError("Resume parsing failed");
    } finally {
      setParsing(false);
    }
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>📄 Upload Your Resume (PDF)</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} style={{ marginTop: '10px' }}>
        {parsing ? "Parsing..." : "Start Interview"}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResumeUpload;
