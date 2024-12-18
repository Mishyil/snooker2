import React from "react";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SeriesPage from "../pages/SeriesPage";
import TournamentsPage from "../pages/TournamentsPage";

import LoginPage from "../pages/LoginPage";
import SelectedTournament from "../pages/SelectedTournament";
import SignInPage from "../pages/SignInPage";
import DashPage from "../pages/DashPage";
import SelectedTournamentDashPage from "../pages/SelectedTournamentDashPage";
import SelectedSeries from "../pages/SelectedSeries";
import SeriesByIdPage from "../pages/SeriesByIdPage";
import { AuthProvider } from "../context/AuthContext";
import Layout from "../components/layout/Layout";

const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SeriesPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signin" element={<SignInPage />} />
            <Route path="series/:seriesId" element={<SelectedSeries />} />
            <Route
              path="series/:seriesId/tournaments/:tournamentId"
              element={<SelectedTournament />}
            />
            <Route path="content" element={<DashPage />} />
            <Route
              path="content/series/:seriesId"
              element={<SeriesByIdPage />}
            />
            <Route
              path="content/series/:seriesId/tournaments/:tournamentId"
              element={<SelectedTournamentDashPage />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routing;
