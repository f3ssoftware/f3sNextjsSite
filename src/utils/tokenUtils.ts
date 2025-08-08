interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;
  
  // Consider token expired if it expires within the next 30 seconds
  return currentTime >= (expirationTime - 30);
};

export const getTokenExpirationTime = (token: string): number | null => {
  const payload = decodeJWT(token);
  return payload ? payload.exp : null;
};

export const getTokenTimeUntilExpiry = (token: string): number => {
  const payload = decodeJWT(token);
  if (!payload) return 0;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
};
