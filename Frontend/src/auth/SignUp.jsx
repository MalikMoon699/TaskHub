import React, { useEffect, useState } from "react";
import "../assets/styles/Auth.css";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import Loader from "../components/Loader";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "TaskHub | Sign Up";
  }, []);

  const validations = () => {
    if (!name) return setNameError("full name is required!");
    if (!email) return setEmailError("email is required!");
    if (!password) return setPasswordError("password is required!");
    if (password.length < 8)
      return setPasswordError(
        "password must be at least 8 characters required!"
      );
    if (!confirmPassword)
      return setConfirmPasswordError("confirm password is required!");
    if (confirmPassword !== password)
      return setConfirmPasswordError("confirm password not equal to password!");
    return true;
  };

  const handleSignUp = async () => {
    const isValid = validations();
    if (!isValid) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        localStorage.setItem("token", data.token);
        toast.error(data.message || "Error signing up");
        return;
      }

      toast.success("Account created! Please login.");
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Google login failed");
      }

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Use window.location.href for better redirect
        window.location.href = "/";
        toast.success("Google login successful!");
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err.message || "Google login failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-Up failed");
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">Create an account</h1>
        <p className="signup-subtitle">
          Enter your information to create an account
        </p>

        <div className="signup-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              style={{ borderColor: nameError ? "red" : "" }}
              placeholder="Jhon Doe"
              className="form-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
            />
            {nameError && <p className="error-message">{nameError}</p>}
          </div>

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

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              style={{ borderColor: confirmPasswordError ? "red" : "" }}
              placeholder="Confirm your password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError("");
              }}
            />
            {confirmPasswordError && (
              <p className="error-message">{confirmPasswordError}</p>
            )}
          </div>
        </div>

        <button
          disabled={loading}
          onClick={handleSignUp}
          className="signup-button"
        >
          {loading ? (
            <Loader
              loading={true}
              color="white"
              size="20"
              style={{ height: "20px", width: "23px" }}
            />
          ) : (
            "Create account"
          )}
        </button>

        <div className="or-container">
          <p>OR</p>
        </div>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />

        <p className="signup-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="signup-link">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
