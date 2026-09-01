export const isValidPassword = (password) => {
  const validPassword = new RegExp(
    "^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6,}$"
  );
  return validPassword.test(password);
};
