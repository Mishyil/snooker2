import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace/>;
};

export default PrivateRoute;
