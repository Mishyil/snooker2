import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import { Container, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
// import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import AuthContext from "../../context/AuthContext";


export default function ResponsiveAppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // const isAuthenticated = useIsAuthenticated();
  // const auth = useAuthUser();
	const { user } = useContext(AuthContext);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // const canAccessManagement = auth?.group === "Админ";

  const navItems = [
    { text: "Главная", path: "/" },
    ...(user ? [{ text: "Управление", path: "/content" }] : []), // Условно добавляем элемент
  ];

  const renderNavLinks = () =>
    navItems.map(({ text, path }) => (
      <Button
        key={text}
        color="inherit"
        component={NavLink}
        to={path}
        sx={{
          "&.active": {
            color: "primary.main",
          },
        }}
      >
        {text}
      </Button>
    ));

  const renderDrawerItems = () =>
    navItems.map(({ text, path }) => (
      <ListItem
        button
        key={text}
        component={NavLink}
        to={path}
        sx={{
          borderRadius: 1,
          textDecoration: "none",
          color: "inherit",
          "&.active": {
            backgroundColor: "primary.main",
          },
        }}
      >
        <Typography variant="body1">{text}</Typography>
      </ListItem>
    ));

  return (
    <div>
      <Container>
        <AppBar
          position="static"
          sx={{
            // boxShadow: 0,
            // bgcolor: "transparent",
            backgroundImage: "none",
            mt: 2,
            borderRadius: "999px",
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? "hsla(220, 60%, 99%, 0.6)"
                : "hsla(220, 0%, 0%, 0.7)",
            backdropFilter: "blur(24px)",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: (theme) => {
              return theme.palette.mode === "light"
                ? "0 1px 2px hsla(210, 0%, 0%, 0.05), 0 2px 12px hsla(210, 100%, 80%, 0.5)"
                : "0 1px 2px hsla(210, 0%, 0%, 0.1), 0 2px 12px hsla(210, 100%, 50%, 0.5)";
            },
          }}
        >
          <Toolbar>
            {/* Навигация для десктопа */}
            <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
              {renderNavLinks()}
            </Box>

            {/* Если пользователь авторизован, отображаем иконку профиля */}
            {user ? (
              <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
                <IconButton color="inherit" component={NavLink} to="/profile">
                  <AccountCircleIcon fontSize="large" />
                </IconButton>
              </Box>
            ) : (
              // Если пользователь не авторизован, отображаем кнопки "Sign In" и "Log In"
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <Button color="inherit" component={NavLink} to="/login">
                  Войти
                </Button>
              </Box>
            )}

            {/* Бургер-меню для мобильных устройств */}
            <Box
              sx={{ display: { xs: "flex", md: "none" }, ml: "auto", mr: 1 }}
            >
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="top"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "background.default",
                  }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>
                  <List>{renderDrawerItems()}</List>
                  <Divider />
                  {user ? (
                    <ListItem>
                      <IconButton
                        color="inherit"
                        component={NavLink}
                        to="/profile"
                      >
                        <AccountCircleIcon fontSize="large" />
                      </IconButton>
                    </ListItem>
                  ) : (
                    <Box sx={{ p: 2 }}>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        component={NavLink}
                        to="/login"
                      >
                        Войти
                      </Button>
                    </Box>
                  )}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </AppBar>
      </Container>
    </div>
  );
}
