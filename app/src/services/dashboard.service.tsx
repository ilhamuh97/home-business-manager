import { BASE_URL } from "@/constants/sidebarItems";
import { getToken } from "@/utils/auth";

export const getOrders = async (): Promise<Response> => {
  return fetch(`${BASE_URL}/orders`, {
    headers: {
      Authorization: getToken(),
    },
  });
};

export const getCustomers = async (): Promise<Response> => {
  return fetch(`${BASE_URL}/customers`, {
    headers: {
      Authorization: getToken(),
    },
  });
};

export const getMenu = async (): Promise<Response> => {
  return fetch(`${BASE_URL}/menu`, {
    headers: {
      Authorization: getToken(),
    },
  });
};
