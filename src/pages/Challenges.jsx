import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Award, Code2, Plus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/api';
import toast from 'react-hot-toast';
import './Challenges.css';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/challenges');
      const data = response.data;
      const challengesList = Array.isArray(data) ? data : (data?.challenges || data?.content || data?.data || []);
      setChallenges(challengesList);
    } catch (err) {
      toast.error('Failed to load challenges.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleDelete = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await api.delete(`/api/challenges/delete/${challengeId}`);
        toast.success('Challenge deleted successfully');
        fetchChallenges();
      } catch (err) {
        toast.error('Failed to delete challenge.');
      }
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
        <p>Igniting your sprint...</p>
      </div>
    );
  }

  const unsolvedChallenges = challenges.filter(c => !c.solved);
  const solvedChallenges = challenges.filter(c => c.solved);

  const ChallengeCard = ({ challenge }) => {
    const cid = challenge.challengeId || challenge.id;
    return (
      <div key={cid} className={`challenge-card glass-panel ${challenge.solved ? 'solved-card' : ''}`}>
        <div className={`card-badge ${getDifficultyClass(challenge.difficulty)}`}>
          <Award size={14} />
          <span>{challenge.difficulty || 'Medium'}</span>
        </div>

        {challenge.solved && (
          <div className="solved-indicator">
            <CheckCircle2 size={16} />
            <span>Solved</span>
          </div>
        )}

        <h3>{challenge.title}</h3>
        <p className="challenge-desc">{challenge.description}</p>

        <div className="card-footer">
          <div className="actions">
            <Link to={`/challenges/${cid}`} className={`btn ${challenge.solved ? 'btn-outline' : 'btn-primary'} btn-solve`}>
              <Code2 size={18} />
              {challenge.solved ? 'Review' : 'Solve Now'}
            </Link>
            {isAdmin && (
              <div className="admin-actions">
                <Link to={`/admin/update-challenge/${cid}`} className="admin-btn" title="Edit">
                  <Edit2 size={16} />
                </Link>
                <button onClick={() => handleDelete(cid)} className="admin-btn delete" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-10 fade-in">
      <div className="header-row">
        <div>
          <h1>Coding Challenges</h1>
          <p className="subtitle">Hone your skills with these curated problems</p>
        </div>
        {isAdmin && (
          <Link to="/admin/create-challenge" className="btn btn-primary">
            <Plus size={18} />
            <span>Create Challenge</span>
          </Link>
        )}
      </div>

      <div className="challenge-sections">
        {/* Unsolved Section */}
        <div className="section-container">
          <h2 className="section-title">Unsolved Challenges</h2>
          <div className="challenges-grid">
            {unsolvedChallenges.length > 0 ? (
              unsolvedChallenges.map((challenge) => (
                <ChallengeCard key={challenge.challengeId || challenge.id} challenge={challenge} />
              ))
            ) : (
              <div className="empty-state glass-panel">
                <p>You've cleared all unsolved trials! Great job.</p>
              </div>
            )}
          </div>
        </div>

        {/* Solved Section */}
        {solvedChallenges.length > 0 && (
          <div className="section-container mt-12">
            <h2 className="section-title solved-title">Solved Challenges</h2>
            <div className="challenges-grid">
              {solvedChallenges.map((challenge) => (
                <ChallengeCard key={challenge.challengeId || challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>
        )}

        {challenges.length === 0 && (
          <div className="empty-state glass-panel">
            <p>No challenges available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;
