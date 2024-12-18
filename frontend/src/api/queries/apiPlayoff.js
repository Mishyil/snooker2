import { api } from "../client";

export const getPlayoffByTournamentId = async (id) => {
  try {
    return (await api.get(`playoff/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const createPlayoffByTournamentId = async (id, data) => {
  try {
    return (await api.post(`playoff/${id}/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};
export const deletePlayoffByTournamentId = async (id) => {
  try {
    return (await api.delete(`playoff/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const updateMatchDataByMatchId = async (id, data) => {
  try {
    return (await api.put(`playoff/matches/${id}/change/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};
export const updateStatusMatchByMatchId = async (id, stageId, data) => {
  try {
    return (await api.put(`playoff/matches/${id}/status/${stageId}/`, data))
      .data;
  } catch (error) {
    console.log(error);
  }
};
export const drawMatchesByStageId = async (id) => {
  try {
    return (await api.post(`playoff/stages/${id}/draw/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const getPlayoffPatricipantsByStageId = async (id) => {
  try {
    return (await api.get(`playoff/stages/${id}/participants/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const updatePlayoffPatricipantsByStageId = async (id, data) => {
  try {
    return (await api.put(`playoff/stages/${id}/participants/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};
export const deletePlayoffPatricipantsByStageId = async (id, playerId) => {
  try {
    return (await api.delete(`playoff/stages/${id}/participants/${playerId}/`))
      .data;
  } catch (error) {
    console.log(error);
  }
};
