import React from "react";
import "../assets/styles/LandingPage.css";
import { useAuth } from "../contexts/AuthContext";
import { landingPageButton } from "../services/LandingHelper";
import { useNavigate } from "react-router";
import LandingHero from "../components/LandingHero";

const LandingPage = () => {
  const { authAllow } = useAuth();
  const navigate = useNavigate();

  const buttonData = landingPageButton(authAllow);

  return (
    <div id="hero" className="landing-page-wrapper">
      <header className="landing-page-header">
        <nav className="landing-page-nav">
          <div className="landing-page-logo">
            <a href="#hero">TaskHub</a>
          </div>
          <ul className="landing-page-nav-links">
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#workspaces">Workspaces</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#tasks">Tasks</a>
            </li>
            <li>
              <a href="#invite">Invite</a>
            </li>
          </ul>
          <button
            onClick={() => navigate(buttonData.nav)}
            style={{ padding: buttonData.padding }}
            className="landing-page-btn-primary"
          >
            {buttonData.title}
          </button>
        </nav>
      </header>
      <section className="landing-page-hero">
        <LandingHero />
      </section>
      <section id="features" className="landing-page-section">
        <h2 className="landing-page-section-title">Why Choose Our TaskHub?</h2>
        <div className="landing-page-features-grid">
          <div className="landing-page-feature-card">
            <h3>Multiple Workspaces</h3>
            <p>Create private workspaces for each team or project group.</p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Projects & Milestones</h3>
            <p>Organize workflows and track project progress easily.</p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Task Assignments</h3>
            <p>Assign tasks to specific users with deadlines and statuses.</p>
          </div>
        </div>
      </section>
      <section id="workspaces" className="landing-page-section">
        <h2 className="landing-page-section-title">Workspaces</h2>
        <p className="landing-page-section-subtitle">
          Create and manage multiple workspaces for your teams and projects.
        </p>
        <div className="landing-page-features-grid">
          <div className="landing-page-feature-card">
            <h3>Private & Secure</h3>
            <p>
              Keep your team's workspaces private and accessible only to
              members.
            </p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Customizable Colors</h3>
            <p>Assign colors to workspaces for better visual organization.</p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Invite Members</h3>
            <p>
              Send email invites to team members and manage permissions easily.
            </p>
          </div>
        </div>
      </section>
      <section id="projects" className="landing-page-section">
        <h2 className="landing-page-section-title">Projects</h2>
        <p className="landing-page-section-subtitle">
          Track all your projects and milestones in one place.
        </p>
        <div className="landing-page-features-grid">
          <div className="landing-page-feature-card">
            <h3>Organize Tasks</h3>
            <p>
              Assign tasks to team members and monitor progress efficiently.
            </p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Progress Tracking</h3>
            <p>
              Visualize project progress with clear milestones and status
              updates.
            </p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Collaborative Work</h3>
            <p>
              Add multiple members to projects and manage collaboration
              effectively.
            </p>
          </div>
        </div>
      </section>
      <section id="tasks" className="landing-page-section">
        <h2 className="landing-page-section-title">Tasks</h2>
        <p className="landing-page-section-subtitle">
          Manage, assign, and track tasks across your projects.
        </p>
        <div className="landing-page-features-grid">
          <div className="landing-page-feature-card">
            <h3>Task Assignments</h3>
            <p>Assign tasks to users and set deadlines with statuses.</p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Deadlines & Reminders</h3>
            <p>Never miss a task with due dates and automated reminders.</p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Organize by Priority</h3>
            <p>
              Sort tasks by priority or status for efficient workflow
              management.
            </p>
          </div>
        </div>
      </section>
      <section id="invite" className="landing-page-section">
        <h2 className="landing-page-section-title">Invite & Collaborate</h2>
        <p className="landing-page-section-subtitle">
          Invite team members to your workspaces and manage roles easily.
        </p>
        <div className="landing-page-features-grid">
          <div className="landing-page-feature-card">
            <h3>Email Invitations</h3>
            <p>Send invites directly to users’ emails with a secure token.</p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Role Management</h3>
            <p>
              Assign workspace ownership or member roles to control permissions.
            </p>
          </div>
          <div className="landing-page-feature-card">
            <h3>Accept/Decline Invites</h3>
            <p>Users can accept or decline workspace invites seamlessly.</p>
          </div>
        </div>
      </section>
      <footer className="landing-page-footer">
        &copy; {new Date().getFullYear()} TaskHub. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
