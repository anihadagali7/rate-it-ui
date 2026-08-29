export const getHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");

  return {
    headers: accessToken ? { Authorization: accessToken } : {},
  };
};
