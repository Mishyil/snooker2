import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);




// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("_auth");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     console.log(error);
//     return Promise.reject(error);
//   }
// );
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem("_auth_refresh");
//         if (!refreshToken) throw new Error("No refresh token available");

//         const res = await api.post("auth/token/refresh/", {
//           refresh: refreshToken,
//         });

//         if (res.status === 200) {
//           localStorage.setItem("_auth", res.data.access);
//           originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         localStorage.removeItem("_auth");
//         localStorage.removeItem("_auth_refresh");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
