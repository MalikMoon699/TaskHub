import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [authAllow, setAuthAllow] = useState(false); // authenticated or not
  const [loading, setLoading] = useState(true); // loading state for auth check
  const [isDetail, setIsDetail] = useState(true); // profile completeness check

  const navigate = useNavigate();

  // Fetch user info with token
  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserData(null);
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
        setUserData(data.user);
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
    setUserData(null);
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
        userData,
        setUserData,
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

// Hook for consuming auth state anywhere
export const useAuth = () => useContext(AuthCtx);
