import { createContext, useState, useEffect } from "react";
import { api } from "../api/client";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? localStorage.getItem("authTokens")
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authToken")
      ? jwtDecode(localStorage.getItem("authToken"))
      : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("auth/token/", {
        username: e.target.username.value,
        password: e.target.password.value,
      });
      const data = response.data;
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      navigate("/");
    } catch (error) {
      console.error("Login error", error.response?.data || error.message);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const updateToken = async () => {
    try {
      const response = await api.post("auth/token/refresh/", {
        refresh: localStorage.getItem("refreshToken"),
      });
      const data = response.data;
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authToken", data.access);
    } catch (error) {
      logoutUser();
      console.log(error);
    }
    if (loading) {
      setLoading(false);
    }
  };
  const contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, 1000 * 60 * 4);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
