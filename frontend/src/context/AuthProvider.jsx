// context/AuthProvider.jsx
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import { api } from "../api/client";
import createRefresh from "react-auth-kit/createRefresh";

const refresh = createRefresh({
  interval: 10,
  refreshApiCallback: async (param) => {
    try {
      const response = await api.post(
        "auth/token/refresh/",
        { refresh: param.refreshToken },
        {
          headers: { Authorization: `Bearer ${param.authToken}` },
        }
      );
      return {
        isSuccess: true,
        newAuthToken: response.data.access,
        newRefreshToken: response.data.refresh,
        newAuthTokenExpireIn: 10,
        newRefreshTokenExpiresIn: 60,
      };
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
      };
    }
  },
});

const store = createStore({
  authName: "_auth",
  authType: "localStorage",
  cookieDomain: window.location.hostname,
  cookieSecure: false,
  refresh: refresh,
});

const AuthContextProvider = ({ children }) => (
  <AuthProvider store={store}>{children}</AuthProvider>
);

export default AuthContextProvider;
