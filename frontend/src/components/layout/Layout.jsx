import React, { useState } from "react";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { CssBaseline, Stack, Container } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material";
import getLPTheme from './getLPTheme'
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [mode, setMode] = useState("dark");
  const LPtheme = createTheme(getLPTheme(mode));
  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <ResponsiveAppBar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          useFlexGap
          sx={{ width: { xs: "100%", sm: "70%" } }}
        >
          <Outlet />
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
