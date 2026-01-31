import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Zap, Shield, Code, Rocket, ChevronRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const siteData = {
    description: 'Empowering the next generation of software engineers through targeted coding trials and real-time sprints.',
    features: ['Real-time Challenges', 'Role-based Dashboards', 'Admin Controls', 'Submission History'],
    slogan: 'Master Your Craft at Light Speed'
  };

  return (
    <div className="home-container fade-in">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={14} />
            <span>Now in Beta - SkillSprint v1.0</span>
          </div>
          <h1>{siteData.slogan}</h1>
          <p className="hero-description">{siteData.description}</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              <span>Get Started</span>
              <Rocket size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-large">
              <span>Member Login</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="code-card glass-panel">
            <div className="card-top">
              <div className="dots"><span></span><span></span><span></span></div>
              <span className="file-name">SkillSprint.java</span>
            </div>
            <pre className="code-snippet">
              {`public class Sprint {
  public static void main(String[] args) {
    Developer dev = new Developer("You");
    dev.startSprint();
    System.out.println("Success!");
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="features-grid-section">
        <div className="section-header">
          <h2>Why Choose SkillSprint?</h2>
          <p>Engineered for high-performance learning and challenge management.</p>
        </div>
        <div className="features-grid">
          {siteData.features.map((feature, index) => (
            <div key={index} className="feature-card glass-panel">
              <div className="feature-icon">
                {index === 0 && <Code size={24} />}
                {index === 1 && <Terminal size={24} />}
                {index === 2 && <Shield size={24} />}
                {index === 3 && <Zap size={24} />}
                {index > 3 && <Rocket size={24} />}
              </div>
              <h3>{feature}</h3>
              <p>Tailored functionality designed to streamline your development journey.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
