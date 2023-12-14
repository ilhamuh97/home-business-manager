import { message } from "antd";
import { logout } from "./auth";

export const handleApiErrors = (responses: Response[]) => {
  return Promise.all(
    responses.map(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        switch (response.status) {
          case 401:
            message.error(error.message);
            logout();
            break;

          default:
            throw new Error(error.message);
        }
      }
      return response.json();
    }),
  );
};

export const handleApiError = (response: Response) => {
  if (!response.ok) {
    return response.json().then((error) => {
      switch (response.status) {
        case 401:
          message.error(error.message);
          logout();
          break;

        default:
          throw new Error(error.message);
      }
    });
  }
  return response.json();
};
