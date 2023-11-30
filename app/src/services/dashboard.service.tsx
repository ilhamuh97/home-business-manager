import { BASE_URL } from "@/constants/sidebarItems";

export const getOrders = async (): Promise<Response> => {
  return fetch(`${BASE_URL}/orders`);
};
