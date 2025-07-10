import React, { useState } from 'react';
import LoginSignupToggle from './pages/LoginSignup';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSession from './pages/InterviewSession';
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginSignupToggle />} />
          <Route path="/resume" element={<PrivateRoute>
            <ResumeUpload />
          </PrivateRoute>} />
          <Route path="/interview" element={<PrivateRoute>
            <InterviewSession />
          </PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
