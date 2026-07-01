type RefreshAccessToken = () => Promise<string | null>;

export const decodeJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const isTokenExpiring = (token: string, leewaySeconds = 30) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  return payload.exp * 1000 <= Date.now() + leewaySeconds * 1000;
};

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

export const getUsableAccessToken = async (
  currentToken: string | null,
  refreshAccessToken: RefreshAccessToken
) => {
  const token = currentToken || getStoredAccessToken();

  if (!token || isTokenExpiring(token)) {
    return refreshAccessToken();
  }

  return token;
};

export const fetchWithAuthRetry = async (
  input: RequestInfo | URL,
  init: RequestInit,
  token: string,
  refreshAccessToken: RefreshAccessToken
) => {
  const buildInit = (accessToken: string): RequestInit => ({
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  let response = await fetch(input, buildInit(token));

  if (response.status === 401) {
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      response = await fetch(input, buildInit(refreshedToken));
    }
  }

  return response;
};
