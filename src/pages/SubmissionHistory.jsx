import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Trash2, Clock, FileCode, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/api';
import toast from 'react-hot-toast';
import './Submissions.css';

const SubmissionHistory = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/challenges/${id}/submissions`);
      const data = response.data;
      const history = Array.isArray(data) ? data : (data?.submissions || data?.content || data?.data || []);
      setSubmissions(history);
    } catch (err) {
      toast.error('Failed to load submission history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [id]);

  const handleDeleteSub = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await api.delete(`/api/submissions/${submissionId}`);
        toast.success('Submission deleted');
        fetchSubmissions();
      } catch (err) {
        toast.error('Failed to delete submission.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Retrieving your legacy...</p>
      </div>
    );
  }

  return (
    <div className="container py-10 fade-in">
      <Link to={`/challenges/${id}`} className="back-link">
        <ChevronLeft size={18} />
        <span>Back to Editor</span>
      </Link>

      <div className="history-header">
        <h1>Sprint History</h1>
        <p className="subtitle">Chronicles of your journey through this challenge</p>
      </div>

      <div className="submissions-list">
        {submissions.length > 0 ? (
          submissions.map((sub) => {
            const sid = sub.submissionId || sub.id;
            return (
              <div key={sid} className="submission-item glass-panel">
                <div className="sub-header">
                  <div className="sub-info">
                    <div className="status-badge-compact">
                      <CheckCircle size={14} className="text-success" />
                      <span className="capitalize">{sub.status || 'SUBMITTED'}</span>
                    </div>
                    <div className="sub-date">
                      <Clock size={14} />
                      <span>{new Date(sub.submittedAt || Date.now()).toLocaleString()}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDeleteSub(sid)} className="delete-sub-btn" title="Delete Submission">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="sub-code-preview">
                  <div className="preview-label">
                    <FileCode size={14} />
                    <span>Submission Context</span>
                  </div>
                  <pre>{sub.solutionText}</pre>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-history glass-panel">
            <p>Your journey here is just beginning. No submissions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionHistory;
