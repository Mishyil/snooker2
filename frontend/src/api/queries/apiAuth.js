import React from "react";
import { api } from "../client";
import { jwtDecode } from "jwt-decode";

export const getToken = async (username, password) => {
  try {
    const response = await api.post("auth/token/", { username, password });
    const { access, refresh } = response.data;
    const decodedToken = jwtDecode(access);
    return { access, refresh, decodedToken };
  } catch (error) {
    console.log(error);
  }
};
