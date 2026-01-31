import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

const AdminUpdateChallenge = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', difficulty: 'MEDIUM' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await api.get(`/api/challenges`);
        const data = response.data;
        const challengesList = Array.isArray(data) ? data : (data?.challenges || data?.content || data?.data || []);

        // Match against challengeId primarily
        const found = challengesList.find(c => (c.challengeId || c.id)?.toString() === id);

        if (found) {
          setFormData({
            title: found.title,
            description: found.description,
            difficulty: found.difficulty || 'MEDIUM'
          });
        }
      } catch (err) {
        toast.error('Failed to load challenge data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.put(`/api/challenges/update/${id}`, formData);
      toast.success('Challenge updated successfully!');
      navigate('/challenges');
    } catch (err) {
      console.error('Update Error:', err);
      // Detailed error messages handled by interceptor, but we can add specific ones here if needed
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to update challenge.';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Server error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Recalibrating the sprint...</p>
      </div>
    );
  }

  return (
    <div className="container py-10 fade-in">
      <Link to="/challenges" className="back-link">
        <ChevronLeft size={18} />
        <span>Back to Challenges</span>
      </Link>

      <div className="auth-card glass-panel mx-auto" style={{ maxWidth: '600px' }}>
        <h2>Update Challenge</h2>
        <p className="auth-subtitle">Modify the existing trial parameters</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              className="form-control"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              style={{ minHeight: '200px' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            <Save size={18} />
            <span>{isSubmitting ? 'Updating...' : 'Update Challenge'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateChallenge;
