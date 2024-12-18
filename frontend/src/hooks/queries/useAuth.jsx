import React from "react";
import { useMutation } from "@tanstack/react-query";
import { getToken } from "../../api/queries/apiAuth";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ username, password }) => getToken(username, password),
    onSuccess: ({ access, refresh, decodedToken }) => {
      signIn({
        auth: { token: access, type: "Bearer" },
        refresh: refresh,
        userState: {
          name: "React User",
          group: decodedToken.group,
        },
      });
      window.location.assign("/content");
    },
    onError: (error) => {
      console.error(
        "Ошибка при запросе авторизации:",
        error.response?.data || error
      );
    },
  });
};