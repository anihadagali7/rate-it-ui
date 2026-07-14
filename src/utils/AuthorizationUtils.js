export const getHeaders = () => {
  return {
    headers: {
      Authorization: localStorage.getItem("accessToken"),
    },
  };
};
