import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Feedback = () => {
    const [email, setEmail] = useState('')
    const [feedback, setFeedback] = useState('')
    const [message, setMessage] = useState('')
    const history = useHistory()

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://127.0.0.1:5000/send-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, feedback }),
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => setMessage(data.message))
        .catch(err => console.error('Error:', err));
    };

    return (
        <div className="feedback-form">
            <button onClick={()=>history.push('/userprofile')}>Profile</button>
            <h2>Send Us Your Feedback</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Your Feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Send Feedback</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Feedback;
