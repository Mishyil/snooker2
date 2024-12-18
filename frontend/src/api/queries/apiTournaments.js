import { api } from "../client";

export const getTournamentsBySeriesId = async (id) => {
  try {
    return (await api.get(`tournaments/series/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const getTournamentsBySeriesIdDash = async (id) => {
  try {
    return (await api.get(`tournaments/series/${id}/dash/`)).data;
  } catch (error) {
    console.log(error);
  }
};

export const createTournamentsBySeriesId = async (id, data) => {
  try {
    return (await api.post(`tournaments/series/${id}/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};

export const getTournamentsById = async (id) => {
  try {
    return (await api.get(`tournaments/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const changeTournamentsById = async (id, data) => {
  try {
    return (await api.put(`tournaments/${id}/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteTournamentsById = async (id) => {
  try {
    return (await api.delete(`tournaments/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const getPlayersByTournamernt = async (id) => {
  try {
    return (await api.get(`tournaments/${id}/players/rating/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const deletePlayerByTournamernt = async (id, playerId) => {
  try {
    return (await api.delete(`tournaments/${id}/players/${playerId}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const addPlayersByTournamernt = async (id, data) => {
  console.log(data);
  try {
    return (await api.put(`tournaments/${id}/players/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};
