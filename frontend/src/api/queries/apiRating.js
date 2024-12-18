import { api } from "../client";

export const createDestributeMatchRating = async (match_type, id) => {
  try {
    return (await api.post(`rating/${match_type}/${id}/`)).data;
  } catch (error) {
    console.log(error);
  }
};
