export const setToken = (data: any) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("access_token", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving token to localStorage:", error);
    }
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    try {
      const storedData = localStorage.getItem("access_token");
      return storedData ? JSON.parse(storedData).accessToken : null;
    } catch (error) {
      console.error("Error retrieving token from localStorage:", error);
    }
  }
  return null;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    // Perform localStorage action
    localStorage.removeItem("access_token");
  }
};
