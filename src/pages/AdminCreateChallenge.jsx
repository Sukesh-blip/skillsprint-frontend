import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

const AdminCreateChallenge = () => {
  const [formData, setFormData] = useState({ title: '', description: '', difficulty: 'MEDIUM' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData
    };

    try {
      await api.post('/api/challenges/create', payload);
      toast.success('Challenge created successfully!');
      navigate('/challenges');
    } catch (err) {
      console.error('Creation Error:', err);
      // Detailed status handling (401/403) is in the interceptor.
      // We only catch specific field errors here if the API provides them.
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to create challenge.';
      if (typeof errorMessage === 'string') {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10 fade-in">
      <Link to="/challenges" className="back-link">
        <ChevronLeft size={18} />
        <span>Back to Challenges</span>
      </Link>

      <div className="auth-card glass-panel mx-auto" style={{ maxWidth: '600px' }}>
        <h2>Create Challenge</h2>
        <p className="auth-subtitle">Define a new coding trial</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Challenge Title"
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
            <label>Description (Markdown supported)</label>
            <textarea
              className="form-control"
              style={{ minHeight: '200px' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Use markdown to describe the problem..."
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            <Save size={18} />
            <span>{isSubmitting ? 'Architecting...' : 'Create Challenge'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateChallenge;
