import React from "react";
import { api } from "../client";

export const getPlayersBySeries = async (id) => {
  try {
    return (await api.get(`players/series/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};

export const createPlayersBySeriesId = async (id, data) => {
  try {
    return (await api.post(`players/series/${id}/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};
export const getPlayerById = async (id) => {
  try {
    return (await api.get(`players/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const changePlayerById = async (id, data) => {
  try {
    return (await api.put(`players/${id}/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePlayerById = async (id) => {
  try {
    return (await api.delete(`players/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
