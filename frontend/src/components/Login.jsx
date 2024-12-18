import { TextField, Button, Box, Paper, Container } from "@mui/material";
import { useState, useContext } from "react";
// import { useAuth } from "../hooks/queries/useAuth";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const authMutation = useAuth();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   authMutation.mutate({ username, password });
  // };
  return (
    <Box component={Paper}>
      <Box
        component="form"
        onSubmit={loginUser}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "300px",
          margin: "0 auto",
          p: 2,
        }}
      >
        <TextField
          type="text"
          name="username"
          label="Логин"
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
        />
        <TextField
          type="password"
          name="password"
          label="Пароль"
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Войти
        </Button>
      </Box>
    </Box>
  );
};
export default Login;
