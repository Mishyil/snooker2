import { api } from "../client";

export const getGroupsByTournamentId = async (id) => {
  try {
    return (await api.get(`groups/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const getGroupsDashByTournamentId = async (id) => {
  try {
    return (await api.get(`groups/${id}/dashview/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const createGroupByTournamentId = async (id, data) => {
  try {
    return (await api.post(`groups/${id}/`, { name: data })).data;
  } catch (error) {
    console.log(error);
  }
};
export const getGroupMatchByGroupId = async (id) => {
  try {
    return (await api.get(`groups/matches/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const changeGroupMatchByMatchId = async (id, data) => {
  try {
    return (await api.put(`groups/matches/${id}/change/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteGroupById = async (groupId) => {
  try {
    return (await api.delete(`groups/${groupId}/change/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const changeGroupByGroupId = async (id, data) => {
  try {
    return (await api.put(`groups/${id}/change/`, { player_ids: data })).data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteGroupByGroupId = async (id) => {
  try {
    return (await api.delete(`groups/${id}/change/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const deletePlayerByGroupId = async (id, playerId) => {
  try {
    return (await api.delete(`groups/${id}/delete_player/${playerId}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const createMatchesByTournamentId = async (id) => {
  try {
    return (await api.post(`groups/create/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
