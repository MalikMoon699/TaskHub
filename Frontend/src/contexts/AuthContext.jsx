import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authAllow, setAuthAllow] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [isDetail, setIsDetail] = useState(true);

  const navigate = useNavigate();

  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      setAuthAllow(false);
      setIsDetail(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setCurrentUser(data.user);
        setAuthAllow(true);

        if (
          !data.user.firstName ||
          !data.user.lastName ||
          !data.user.phoneNumber ||
          !data.user.gender
        ) {
          setIsDetail(false);
          navigate("/signup-details");
        } else {
          setIsDetail(true);
        }
      } else {
        logout(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setAuthAllow(false);
    setIsDetail(false);
    if (redirect) navigate("/login");
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        currentUser,
        setCurrentUser,
        authAllow,
        setAuthAllow,
        loading,
        refresh: fetchMe,
        isDetail,
        setIsDetail,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
