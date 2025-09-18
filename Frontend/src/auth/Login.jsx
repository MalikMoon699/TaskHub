import React, { useEffect, useState } from "react";
import "../assets/styles/Auth.css";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    document.title = "TaskHub | Login";
  }, []);

  const validations = () => {
    if (!email) return setEmailError("email is required!");
    if (!password) return setPasswordError("password is required!");
    if (password.length < 8)
      return setPasswordError(
        "password must be at least 8 characters required!"
      );
    return true;
  };

  const handleLogin = async () => {
    const isValid = validations();
    if (!isValid) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: credentialResponse.credential,
            type: "ride",
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
        toast.success("Google login successful!");
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (err) {
      toast.error("Google login error: " + err.message);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In failed");
  };


  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">Welcome back</h1>
        <p className="signup-subtitle">
          Enter your credentials to sign in to your account
        </p>

        <div className="signup-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              style={{ borderColor: emailError ? "red" : "" }}
              placeholder="email@example.com"
              className="form-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              style={{ borderColor: passwordError ? "red" : "" }}
              placeholder="Enter your password"
              className="form-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
        </div>

        <button onClick={handleLogin} className="signup-button">
          Sign In
        </button>

        <div>
          <span></span>
          <span>OR</span>
        </div>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
        <p className="signup-footer">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="signup-link">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
