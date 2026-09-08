let inMemoryToken = null;
let onTokenRefreshCallbacks = [];
let onLogoutCallback = null;

export const setAuthToken = (token) => {
  inMemoryToken = token;
  onTokenRefreshCallbacks.forEach((cb) => {
    try {
      cb(token);
    } catch {
      // ignore
    }
  });
};

export const getAuthToken = () => {
  return inMemoryToken;
};

export const clearAuthToken = () => {
  inMemoryToken = null;
  if (onLogoutCallback) {
    try {
      onLogoutCallback();
    } catch {
      // ignore
    }
  }
};

export const subscribeTokenRefresh = (cb) => {
  onTokenRefreshCallbacks.push(cb);
  return () => {
    onTokenRefreshCallbacks = onTokenRefreshCallbacks.filter((c) => c !== cb);
  };
};

export const setOnLogoutCallback = (cb) => {
  onLogoutCallback = cb;
};
