import { BASE_URL } from "@/constants/sidebarItems";

export const login = async (token: string = ""): Promise<Response> => {
  return fetch(`${BASE_URL}/login`, {
    headers: {
      Authorization: token,
    },
  });
};
