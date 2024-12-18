import { api } from "../client";

export const getSeries = async () => {
  try {
    return (await api.get("series/")).data;
  } catch (error) {
    console.log(error);
  }
};

export const getSeriesByUser = async () => {
  try {
    return (await api.get("series/dash/")).data;
  } catch (error) {
    console.log(error);
  }
};

export const getSeriesById = async (id) => {
  try {
    return (await api.get(`series/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
export const createNewSeries = async (data) => {
  try {
    console.log(data);
    return (await api.post(`series/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};
export const changeSeriesById = async (id, data) => {
  try {
    return (await api.put(`series/${id}/`, data)).data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteSeriesById = async (id) => {
  try {
    return await api.delete(`series/${id}/`);
  } catch (error) {
    console.log(error);
  }
};
