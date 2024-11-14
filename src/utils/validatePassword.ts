function validatePassword(password: string) {
  const passwordRegex = /^(?=.*[0-9])(?=.*[^A-Za-z0-9])[A-Za-z0-9\S]{8,}$/;
  return passwordRegex.test(password);
}

export { validatePassword };
