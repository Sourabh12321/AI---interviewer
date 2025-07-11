import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../css/InterviewSession.css'; // You can style as needed

const InterviewSession = () => {
  const { interview } = useSelector((state) => state);
  const questions = interview?.questions || [];
  const total = questions.length;

  const [qaHistory, setQaHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/ask-question', {
        question: questions[currentIndex],
        answer: userAnswer,
        sessionId: "1"
      });

      const aiReply = res.data.reply;

      const questionMatch = aiReply.match(/Question:(.*)/);
      const feedbackMatch = aiReply.match(/Feedback:(.*)/);
      const scoreMatch = aiReply.match(/Score:(.*)/);

      const qa = {
        question: questions[currentIndex],
        answer: userAnswer,
        feedback: feedbackMatch?.[1]?.trim() || "No feedback",
        score: scoreMatch?.[1]?.trim() || "N/A"
      };

      setQaHistory([...qaHistory, qa]);
      setFeedback(qa.feedback);
      setScore(qa.score);
    } catch (err) {
      console.error("AI Error:", err);
      alert("❌ Something went wrong with AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setUserAnswer('');
    setFeedback('');
    setScore('');
    const nextIndex = currentIndex + 1;

    if (nextIndex >= total) {
      submitFinalInterview();
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const submitFinalInterview = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/interview-feedback', {
        sessionId: "1",
        interviewData: qaHistory
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submit Error:", err);
      alert("❌ Error while submitting final feedback.");
    } finally {
      setLoading(false);
    }
  };

  if (!questions.length) {
    return <p>⚠️ No questions found. Please go back and upload your resume.</p>;
  }

  if (submitted) {
    return (
      <div className="thank-you-screen">
        <h2>🎉 Interview Completed</h2>
        <p>Thanks for completing the mock interview. Here's a summary:</p>
        {qaHistory.map((qa, i) => (

          <div key={i} className="qa-summary">

            <p><strong>Q{i + 1}:</strong> {qa.question}</p>
            {/* <p><strong>Your Answer:</strong> {qa.answer}</p> */}
            {/* <p><strong>Feedback:</strong> {qa.feedback}</p> */}
            {/* <p><strong>Score:</strong> {qa.score}/5</p> */}
            <hr />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="interview-session-wrapper">
      <h2>🧠 AI Interview Tool</h2>
      <div className="question-box">
        <p><strong>Question {currentIndex + 1} of {total}:</strong></p>
        <p>{questions[currentIndex]?.Question}</p>
      </div>

      <textarea
        placeholder="Type your answer here..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        rows={5}
        className="answer-input"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || feedback}
        className="submit-btn"
      >
        {loading ? "Evaluating..." : "Submit Answer"}
      </button>

      {feedback && (
        <div className="feedback-box">
          <p><strong>🗣️ Feedback:</strong> {feedback}</p>
          <p><strong>📊 Score:</strong> {score}/5</p>
          <button onClick={handleNext} className="next-btn">Next Question</button>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;
