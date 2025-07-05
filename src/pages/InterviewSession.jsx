import React, { useState } from 'react';
import axios from 'axios';

const InterviewSession = ({ resumeText }) => {
    const [qaHistory, setQaHistory] = useState([]);
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    const askNext = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/ask-question', {
                resumeText,

                previousQA: qaHistory.map(q => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n"),
                sessionId: "1"
            });

            const aiReply = res.data.reply;

            // Parse response
            const questionMatch = aiReply.match(/Question:(.*)/);
            const feedbackMatch = aiReply.match(/Feedback:(.*)/);
            const scoreMatch = aiReply.match(/Score:(.*)/);

            const last = {
                question: questionMatch?.[1]?.trim() || "No question",
                answer: userAnswer,
                feedback: feedbackMatch?.[1]?.trim() || "No feedback",
                score: scoreMatch?.[1]?.trim() || "N/A"
            };

            setQaHistory([...qaHistory, last]);
            setUserAnswer('');
        } catch (err) {
            alert("Something went wrong with AI");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>🎤 Interview Panel</h2>

            {qaHistory.map((qa, i) => (
                <div key={i} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
                    <p><strong>Q:</strong> {qa.question}</p>
                    <p><strong>You:</strong> {qa.answer}</p>
                    <p><strong>Feedback:</strong> {qa.feedback}</p>
                    <p><strong>Score:</strong> {qa.score}/5</p>
                </div>
            ))}

            <textarea
                rows={4}
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
            />

            <button onClick={askNext} disabled={loading}>
                {loading ? "Thinking..." : qaHistory.length === 0 ? "Get First Question" : "Next Question"}
            </button>
        </div>
    );
};

export default InterviewSession;
