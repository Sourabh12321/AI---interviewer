import React, { useState } from 'react';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSession from './pages/InterviewSession';
import LoginSignupToggle from './pages/LoginSignup';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  const [resumeText, setResumeText] = useState('');

  
  return (
    <Provider  store={store}>
      <LoginSignupToggle/>
      {/* <h1>💬 Agent Interviewer AI</h1> */}
      {/* {resumeText ? (
        <InterviewSession resumeText={resumeText} />
      ) : (
        <ResumeUpload onResumeParsed={setResumeText} />
      )} */}
    </Provider>
  );
}

export default App;
