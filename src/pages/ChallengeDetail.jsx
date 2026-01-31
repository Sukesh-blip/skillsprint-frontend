import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, History, Send, Code, Award, Terminal, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../api/api';
import toast from 'react-hot-toast';
import './ChallengeDetail.css';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchChallenge = useCallback(async () => {
    try {
      const response = await api.get(`/api/challenges`);
      const data = response.data;
      const challengesList = Array.isArray(data) ? data : (data?.challenges || data?.content || data?.data || []);

      // Match against challengeId primarily
      const found = challengesList.find(c => (c.challengeId || c.id)?.toString() === id);

      if (found) {
        setChallenge(found);
      } else {
        toast.error('Challenge not found.');
        navigate('/challenges');
      }
    } catch (err) {
      toast.error('Failed to load challenge details.');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!solution.trim()) {
      toast.error('Solution cannot be empty!');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(`/api/challenges/${id}/submit`, { solutionText: solution });
      toast.success('Your solution has been submitted!');
      // Re-fetch to update the 'solved' status on this page
      fetchChallenge();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyClass = (difficulty) => {
    const diff = difficulty?.toLowerCase();
    if (diff === 'easy') return 'badge-easy';
    if (diff === 'medium' || diff === 'intermediate') return 'badge-medium';
    if (diff === 'hard') return 'badge-hard';
    return 'badge-medium';
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Architecting the challenge...</p>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="container py-10 fade-in">
      <div className="detail-top-bar">
        <Link to="/challenges" className="back-link">
          <ChevronLeft size={18} />
          <span>Back to Grid</span>
        </Link>
        <Link to={`/challenges/${id}/submissions`} className="btn btn-outline btn-sm">
          <History size={16} />
          <span>My History</span>
        </Link>
      </div>

      <div className="detail-layout">
        <div className="challenge-info glass-panel">
          <div className="detail-header">
            <div className={`card-badge ${getDifficultyClass(challenge.difficulty)}`}>
              <Award size={14} />
              <span>{challenge.difficulty || 'Medium'}</span>
            </div>

            {challenge.solved && (
              <div className="solved-banner">
                <CheckCircle2 size={16} />
                <span>You have successfully solved this challenge!</span>
              </div>
            )}

            <h1>{challenge.title}</h1>
          </div>

          <div className="markdown-content">
            <ReactMarkdown>{challenge.description}</ReactMarkdown>
          </div>
        </div>

        <div className="solution-editor glass-panel">
          <div className="editor-header">
            <div className="header-title">
              <Terminal size={18} />
              <span>Solution Editor</span>
            </div>
            <div className="editor-dots">
              <span></span><span></span><span></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="editor-form">
            <div className="textarea-wrapper">
              <div className="line-numbers">
                {Array.from({ length: 20 }).map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea
                className="code-textarea"
                placeholder="// Type your solution here..."
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="editor-footer">
              <div className="hint-text">
                <Code size={14} />
                <span>Ensure your code is clean and efficient.</span>
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                <Send size={18} />
                <span>{isSubmitting ? 'Transmitting...' : 'Submit Sprint'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
