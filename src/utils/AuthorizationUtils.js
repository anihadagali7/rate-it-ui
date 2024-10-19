const ACCESS_TOKEN = localStorage.getItem("accessToken");

export const getHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  };
};
