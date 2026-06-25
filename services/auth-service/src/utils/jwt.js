export const getTokenFromAuthorizationHeader = (authHeader) => {
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() === "bearer" && token) {
    return token;
  }

  return authHeader;
};
