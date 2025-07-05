import React, { useState } from 'react';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSession from './pages/InterviewSession';

function App() {
  const [resumeText, setResumeText] = useState('');

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>💬 Agent Interviewer AI</h1>
      {resumeText ? (
        <InterviewSession resumeText={resumeText} />
      ) : (
        <ResumeUpload onResumeParsed={setResumeText} />
      )}
    </div>
  );
}

export default App;
